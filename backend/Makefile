NAMESPACE = `echo kbsb_crm`
BUILD_TIME = `date +%FT%T%z`
BUILD_VERSION = `git describe --tag`
COMMIT_HASH = `git rev-parse --short HEAD`
TEST_PATH = `go list ./... | grep -v github.com/QuickAmethyst/kbsb_crm/app`

start: build run

.PHONY: build
build:
	go build -ldflags "\
		-X main.Namespace=${NAMESPACE} \
		-X main.BuildTime=${BUILD_TIME} \
		-X main.BuildVersion=${BUILD_VERSION} \
		-X main.CommitHash=${COMMIT_HASH}" \
		-race -o ./build/app ./cli

test:
	go test ./src/handler/rest

coverage:
	go test ${TEST_PATH} -covermode=count -coverpkg=./... -coverprofile=coverage.out -failfast -timeout 900s

coverage-visual: coverage
	go tool cover -html=coverage.out

kill-process:
	lsof -i :8000 | awk '/app/ {print $$2}' | xargs kill

run: kill-process
	./build/app

.PHONY: graph-generate
graph-generate:
	go run github.com/99designs/gqlgen generate

migrate:
	docker run --rm --network host -v ${PWD}:/usr/src/app migrate/migrate -database "postgres://postgres:postgres@localhost:5432/crm?sslmode=disable" -path /usr/src/app/module/object/migration up