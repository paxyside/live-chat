package app

import (
	"chat_backend/config"
	"chat_backend/infra/log"
	"chat_backend/infra/pg"
	"chat_backend/internal/domain/infrastructure/postgres"
	"chat_backend/internal/repository"
	"github.com/gin-contrib/cors"

	"emperror.dev/errors"

	"chat_backend/internal/delivery"
	"chat_backend/internal/delivery/http_server"
	"chat_backend/internal/delivery/ws_server"
	"chat_backend/internal/domain/infrastructure/logger"
	"chat_backend/internal/service"
	"context"

	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type App struct {
	l logger.Loggerer

	db postgres.DBExecutor

	httpServer *http.Server
	wsServer   *http.Server
}

func NewApp(l logger.Loggerer) (*App, error) {
	db, err := pg.Init(context.Background(), viper.GetString("app.db.uri"), l)
	if err != nil {
		return nil, errors.Wrap(err, "postgres.Init")
	}

	repo := repository.NewRepo(db)
	svc := service.NewService(repo)

	httpController := http_server.NewHttpController(svc)
	httpRouter := gin.New()
	httpRouter.Use(cors.New(cors.Config{
		AllowOrigins:     viper.GetStringSlice("app.server.http.allow_origins"),
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	httpRouter.Use(gin.Recovery())
	httpRouter.Use(delivery.LoggerMiddleware(l))

	httpRouter.PATCH("/api/set-operator", httpController.SetOperator)
	httpRouter.POST("/api/upload-file", httpController.UploadFile)
	httpRouter.Static("/uploads", "./uploads")

	httpAddr := fmt.Sprintf("%s:%s", viper.GetString("app.server.http.host"), viper.GetString("app.server.http.port"))
	httpServer := &http.Server{
		Addr:         httpAddr,
		ReadTimeout:  viper.GetDuration("app.server.http.read_timeout"),
		WriteTimeout: viper.GetDuration("app.server.http.write_timeout"),
		Handler:      httpRouter,
	}

	wsManager := ws_server.NewWsManager(l)
	wsController := ws_server.NewWsController(l, wsManager, svc)
	wsRouter := gin.New()
	wsRouter.Use(gin.Recovery())
	wsRouter.Use(delivery.LoggerMiddleware(l))

	wsRouter.GET("/ws", wsController.Entrypoint)

	wsAddr := fmt.Sprintf("%s:%s", viper.GetString("app.server.ws.host"), viper.GetString("app.server.ws.port"))
	wsServer := &http.Server{
		Addr:         wsAddr,
		ReadTimeout:  viper.GetDuration("app.server.ws.read_timeout"),
		WriteTimeout: viper.GetDuration("app.server.ws.write_timeout"),
		Handler:      wsRouter,
	}

	return &App{
		l:          l,
		db:         db,
		httpServer: httpServer,
		wsServer:   wsServer,
	}, nil
}

func (a *App) Run(ctx context.Context) {
	go func() {
		if err := a.httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			a.l.Error("Failed to start http server", "error", err)
			os.Exit(1)
		}
	}()

	go func() {
		if err := a.wsServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			a.l.Error("Failed to start ws server", "error", err)
			os.Exit(1)
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
	select {
	case <-sigChan:
	case <-ctx.Done():
	}

	a.Shutdown()
}

func (a *App) Shutdown() {
	shutdownCtx, shutdownCancel := context.WithTimeout(
		context.Background(),
		viper.GetDuration("app.server.shutdown_timeout"),
	)
	defer shutdownCancel()

	if err := a.httpServer.Shutdown(shutdownCtx); err != nil {
		a.l.Error("Failed to shutdown http server", "error", err)
	}
	if err := a.wsServer.Shutdown(shutdownCtx); err != nil {
		a.l.Error("Failed to shutdown ws server", "error", err)
	}

	a.db.Close()

	a.l.Info("App stopped")
}

func StartApp() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	l := log.Init(
		log.Options{
			Level:   slog.LevelInfo,
			AppName: "livechat-backend",
		},
	)

	if err := config.LoadConfig(); err != nil {
		l.Error("failed to load config", slog.Any("error", err))
	}

	app, err := NewApp(l)
	if err != nil {
		l.Error("failed to initialize app", slog.Any("error", err))
	}

	app.Run(ctx)
}
