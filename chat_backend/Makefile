.PHONY: all, prepare, lint-fix, lint, pack, tests, local_run, clear, new_migration, docker_run

SHELL := /bin/bash
.SHELLFLAGS := -e -c

main_path = ./cmd/server/main.go
app_name = ./server
dc = docker compose

all: clear lint pack
prepare: lint-fix pack tests

lint:
	go tool golangci-lint run

lint-fix:
	go tool golangci-lint run --fix

pack:
	go build -o $(app_name) $(main_path)

tests:
	go test -v ./...

local_run:
	cd ..
	$(dc) up database -d
	cd chat_backend
	$(app_name)

clear:
	rm -f $(app_name)

new_migration:
	docker run --rm -v $(PWD)/migrations:/migrations migrate/migrate create -ext sql -dir /migrations -seq ${filename}

