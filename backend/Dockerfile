FROM golang:1.23-alpine as builder
WORKDIR /usr/src/app
COPY ./go.mod ./go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./build/app ./cli

FROM alpine:3.17
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build/app app

CMD ["./app"]