package config

import (
	"emperror.dev/errors"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func LoadConfig() error {
	if err := godotenv.Load(); err != nil {
		return errors.Wrap(err, "godotenv.Load")
	}

	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	viper.SetEnvPrefix("")

	_ = viper.BindEnv("app.db.uri", "DB_URI")
	_ = viper.BindEnv("app.telegram.bot_token", "TELEGRAM_BOT_TOKEN")

	if err := viper.ReadInConfig(); err != nil {
		return errors.Wrap(err, "viper.ReadInConfig")
	}

	return nil
}
