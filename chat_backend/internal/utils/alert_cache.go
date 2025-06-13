package utils

import (
	"fmt"
	"sync"
	"time"
)

var alertCache sync.Map

const alertCooldown = 10 * time.Minute

func ShouldAlert(operatorID, userID int64) bool {
	key := fmt.Sprintf("%d:%d", operatorID, userID)
	now := time.Now()
	if last, ok := alertCache.Load(key); ok {
		if now.Sub(last.(time.Time)) < alertCooldown {
			return false
		}
	}
	alertCache.Store(key, now)
	return true
}
