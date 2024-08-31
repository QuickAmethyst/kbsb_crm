package http

import (
	"github.com/rs/cors"
)

type CorsOptions = cors.Options

type Options struct {
	LogRequest  LogRequestOptions
	LogResponse LogResponseOptions
	Cors        CorsOptions
}

type LogRequestOptions struct {
	Enabled bool
}

type LogResponseOptions struct {
	Enabled bool
}
