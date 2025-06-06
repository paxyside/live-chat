package http_server

import (
	"chat_backend/internal/domain"

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
