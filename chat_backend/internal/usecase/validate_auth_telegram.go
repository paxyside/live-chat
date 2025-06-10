package usecase

import (
	"encoding/json"
	"fmt"
	"net/url"

	"emperror.dev/errors"
	"github.com/spf13/viper"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func ValidateAuthTelegram(initData string) error {
	token := viper.GetString("app.telegram.bot_token")
	expIn := viper.GetDuration("app.telegram.exp_in")
	fmt.Println(initData)
	if err := initdata.Validate(initData, token, expIn); err != nil {
		return errors.Wrap(err, "initdata.Validate")
	}

	return nil
}

func ParseInitData(initData string) (*initdata.InitData, error) {
	parsedData, err := initdata.Parse(initData)
	if err != nil {
		return nil, errors.Wrap(err, "initdata.Parse")
	}

	return &parsedData, nil
}

func ParseMockInitData(initData string) (*initdata.InitData, error) {
	values, err := url.ParseQuery(initData)
	if err != nil {
		return nil, errors.Wrap(err, "url.ParseQuery")
	}

	userStr := values.Get("user")
	if userStr == "" {
		return nil, errors.New("missing user in mock initData")
	}

	var user initdata.User
	if err := json.Unmarshal([]byte(userStr), &user); err != nil {
		return nil, errors.Wrap(err, "unmarshal mock user")
	}

	return &initdata.InitData{
		User: user,
	}, nil
}
