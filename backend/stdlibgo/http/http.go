package http

import (
	netHttp "net/http"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/http/middleware"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"
	"github.com/bmizerany/pat"
	"github.com/rs/cors"
)

type (
	HandlerFunc    = netHttp.HandlerFunc
	Request        = netHttp.Request
	ResponseWriter = netHttp.ResponseWriter
)

type HTTP interface {
	Route
	Handler() netHttp.Handler
	UseDefaultMiddleware()
}

func New(opt Options, logger logger.Logger) HTTP {
	corsClient := cors.New(opt.Cors)
	mux := pat.New()
	m := middleware.New(logger)

	result := http{
		NewRoute(mux),
		mux,
		m,
		corsClient,
		logger,
		opt,
	}

	return &result
}

type http struct {
	Route
	mux        *pat.PatternServeMux
	middleware middleware.Middleware
	cors       *cors.Cors
	logger     logger.Logger
	opt        Options
}

func (h *http) Handler() netHttp.Handler {
	var handler netHttp.Handler
	if h.cors != nil {
		handler = h.cors.Handler(h.mux)
	}

	netHttp.Handle("/", handler)

	return handler
}

func (h *http) UseDefaultMiddleware() {
	h.Use(h.middleware.Recover, h.middleware.AppendHeaderToContext)
	if h.opt.LogRequest.Enabled {
		h.Use(h.middleware.LogRequest)
	}

	if h.opt.LogResponse.Enabled {
		h.Use(h.middleware.LogResponse)
	}
}
