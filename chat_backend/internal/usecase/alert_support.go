package usecase

import (
	"bytes"
	"chat_backend/internal/domain"
	"emperror.dev/errors"
	"encoding/json"
	"fmt"
	"github.com/spf13/viper"
	"net/http"
	"strconv"
)

const TgApiUrl = "https://api.telegram.org/bot%s/sendMessage"
const AlertMessage = "От %d в чат пришло новое сообщение: %s"

func AlertSupport(user domain.User, newMessage string, fromUser int64) error {
	url := fmt.Sprintf(TgApiUrl, viper.GetString("app.telegram.bot_token"))

	message := fmt.Sprintf(AlertMessage, fromUser, newMessage)

	strID := strconv.FormatInt(user.TgID, 10)

	body, err := json.Marshal(map[string]interface{}{
		"chat_id": strID,
		"text":    message,
	})
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return errors.Wrap(err, "http.Post")
	}

	defer func() {
		err = resp.Body.Close()
		if err != nil {
			return
		}
	}()

	if resp.StatusCode != http.StatusOK {
		return errors.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}
