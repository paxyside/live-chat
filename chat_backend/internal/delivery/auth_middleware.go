package delivery

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authToken := c.Request.Header.Get("X-Authorization")
		splitToken := strings.Split(authToken, "Bearer ")

		if len(splitToken) == 2 {
			token := splitToken[1]

			if token == "" {
				c.JSON(401, gin.H{"error": "unauthorized"})
				c.Abort()
				return
			}

			if token != viper.GetString("app.server.http.auth_token") {
				c.JSON(401, gin.H{"error": "unauthorized"})
				c.Abort()
				return
			}

			c.Next()
		} else {
			c.JSON(401, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
	}
}
