package main

import (
	"errors"
	"github.com/QuickAmethyst/kbsb_crm/graph"
	"github.com/QuickAmethyst/kbsb_crm/graph/generated"
	"github.com/QuickAmethyst/kbsb_crm/rest"
	sdkGrace "github.com/QuickAmethyst/kbsb_crm/stdlibgo/grace"
	sdkGraphql "github.com/QuickAmethyst/kbsb_crm/stdlibgo/graphql"
	sdkHttp "github.com/QuickAmethyst/kbsb_crm/stdlibgo/http"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/httpserver"
	sdkLogger "github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"
	sdkRedis "github.com/QuickAmethyst/kbsb_crm/stdlibgo/redis"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"go.uber.org/zap"
	"log"
	"syscall"
	"time"
)

var (
	err                             error
	stdLog                          *log.Logger
	logger                          sdkLogger.Logger
	http                            sdkHttp.HTTP
	sqlClient                       sql.PostgresSQL
	graphHandler, playgroundHandler sdkHttp.HandlerFunc
	resolver                        graph.Resolver
	redisClient                     sdkRedis.UniversalClient
)

func initLogger() {
	if logger, err = sdkLogger.New(sdkLogger.Option{Development: true}); err != nil {
		log.Fatal("Failed to create logger", err)
	}

	stdLog = zap.NewStdLog(logger.Client())
}

func initGraph() {
	c := generated.Config{Resolvers: &resolver}

	graphES := generated.NewExecutableSchema(c)

	graphHandler, playgroundHandler = sdkGraphql.New(graphES, sdkGraphql.Options{
		Development: true,
		Logger:      logger,
	})
}

func initDB() {
	connectionOptions := sql.ConnectionOptions{
		Host:         "localhost",
		Port:         5432,
		User:         "postgres",
		Password:     "postgres",
		DatabaseName: "crm",
		SSL:          false,
		MaxLifeTime:  600,
		MaxIdle:      10,
		MaxOpen:      20,
	}

	if sqlClient, err = sql.NewPostgresSQL(sql.PostgresSQLOptions{
		Master: connectionOptions,
		Slave:  connectionOptions,
	}); err != nil {
		logger.Fatal(err.Error())
	}
}

func initRedis() {
	redisClient, err = sdkRedis.NewUniversalClient(&sdkRedis.UniversalOptions{
		MasterName:      "",
		Password:        "redis",
		Addrs:           []string{"localhost:6379"},
		DB:              0,
		MaxRetries:      2,
		MinRetryBackoff: 1 * time.Second,
		MaxRetryBackoff: 2 * time.Second,
		DialTimeout:     5 * time.Second,
		ReadTimeout:     2 * time.Second,
		WriteTimeout:    2 * time.Second,
		PoolSize:        50,
		MinIdleConns:    1,
		PoolTimeout:     60 * time.Second,
		MaxRedirects:    3,
		ReadOnly:        true,
		RouteByLatency:  true,
		RouteRandomly:   true,
		ConnMaxLifetime: 5 * time.Minute,
		ConnMaxIdleTime: 60 * time.Second,
	})

	if err != nil {
		logger.Fatal(err.Error())
	}
}

func initRest() {
	http = sdkHttp.New(sdkHttp.Options{
		LogRequest:  sdkHttp.LogRequestOptions{Enabled: true},
		LogResponse: sdkHttp.LogResponseOptions{Enabled: true},
		Cors: sdkHttp.CorsOptions{
			AllowedOrigins:   []string{"http://localhost:3000"},
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
			AllowedHeaders:   []string{"Authorization", "Content-Type"},
			MaxAge:           0,
			AllowCredentials: true,
			Debug:            true,
		},
	}, logger)

	rest.New(http, graphHandler, playgroundHandler)
}

func init() {
	initLogger()
	initRedis()
	initDB()
	initRest()
	initGraph()
}

func main() {
	server := httpserver.New(httpserver.Options{
		Name:              "kbsb_crm",
		Address:           ":8000",
		ReadHeaderTimeout: 5,
		ReadTimeout:       5,
		WriteTimeout:      5,
		IdleTimeout:       5,
	}, http.Handler(), stdLog.Writer())

	grace, err := sdkGrace.New(logger, sdkGrace.Options{
		UpgradeTimeout:  10,
		ShutdownTimeout: 10,
		Network:         "tcp",
	})

	if err != nil {
		logger.Fatal(err.Error())
	}

	defer func() {
		err = errors.Join(
			logger.Sync(),
			grace.Stop(),
			redisClient.Close(),
			sqlClient.Master().Close(),
		)
	}()

	go func() {
		grace.ListenForUpgrade(syscall.SIGHUP)
	}()

	grace.Serve(server)
}
