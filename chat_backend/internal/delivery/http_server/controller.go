package http_server

import (
	"chat_backend/internal/domain"
	"fmt"
	"github.com/spf13/viper"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type HttpController struct {
	service domain.Service
}

func NewHttpController(service domain.Service) *HttpController {
	return &HttpController{service: service}
}

func (h *HttpController) SetOperator(ctx *gin.Context) {
	var request struct {
		ChatID int64 `json:"chat_id"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"invalid request": err.Error()})
		return
	}

	err := h.service.SetOperator(ctx, request.ChatID)
	if err != nil {
		ctx.JSON(500, gin.H{"internal error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (h *HttpController) UploadFile(ctx *gin.Context) {
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to retrieve file from form",
			"error":   err.Error(),
		})
		return
	}

	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create upload directory",
			"error":   err.Error(),
		})
		return
	}

	safeFilename := sanitizeFilename(file.Filename)

	timestamp := time.Now().UTC().Format("20060102T150405Z")
	filenameWithTs := fmt.Sprintf("%s_%s", timestamp, safeFilename)

	filePath := filepath.Join(uploadDir, filenameWithTs)

	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to save file",
			"error":   err.Error(),
		})
		return
	}

	fileURL := fmt.Sprintf("%s/uploads/%s", viper.GetString("app.server.http.origin"), filenameWithTs)

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "File uploaded successfully",
		"filename": filenameWithTs,
		"url":      fileURL,
	})
}

func sanitizeFilename(name string) string {
	name = filepath.Base(name)
	name = strings.ReplaceAll(name, " ", "_")
	name = regexp.MustCompile(`[^a-zA-Z0-9._-]`).ReplaceAllString(name, "")
	return name
}
