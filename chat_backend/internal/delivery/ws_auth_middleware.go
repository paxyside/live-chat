package delivery

import (
	"chat_backend/internal/domain/infrastructure/logger"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"log/slog"
	"net/http"
)

func WsAuthMiddleware(l logger.Loggerer) gin.HandlerFunc {
	validToken := viper.GetString("app.auth.ws_token")

	return func(c *gin.Context) {
		queryToken := c.Query("auth_token")

		if queryToken == validToken {
			c.Next()
			return
		}

		l.Error("invalid auth token in query params", slog.Any("queryToken", queryToken))
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
