FROM golang:1.24.2 AS build

LABEL builder="golangci-lint & go build"

WORKDIR /build

ENV GO111MODULE=on \
    GOOS=linux \
    GOARCH=amd64

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN CGO_ENABLED=0 go build -a -installsuffix cgo -ldflags="-s -w" -o /usr/bin/server ./cmd/server/main.go

FROM alpine:3.12

RUN apk update && \
    apk add --no-cache \
        ca-certificates \
        curl \
        tzdata \
    && rm -rf -- /var/cache/apk/*

ENV TZ="UTC"
WORKDIR /app
COPY --from=build /usr/bin/server .

CMD ["./server"]
