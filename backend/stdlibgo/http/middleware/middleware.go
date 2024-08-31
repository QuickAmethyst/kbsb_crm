package middleware

import (
	"net/http"
	"net/http/httputil"
	"runtime/debug"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/appcontext"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/http/header"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"

	"github.com/google/uuid"
)

type Middleware interface {
	AppendHeaderToContext(handler http.HandlerFunc) http.HandlerFunc
	Recover(handler http.HandlerFunc) http.HandlerFunc
	LogRequest(handler http.HandlerFunc) http.HandlerFunc
	LogResponse(handler http.HandlerFunc) http.HandlerFunc
}

func New(logger logger.Logger) Middleware {
	return &middleware{
		logger: logger,
	}
}

type Func = func(http.HandlerFunc) http.HandlerFunc

type middleware struct {
	logger logger.Logger
}

func (m *middleware) LogResponse(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req, _ := appcontext.GetRequest(r.Context())
		handler(NewLogResponseWriter(req, w, m.logger), r)
	}
}

func (m *middleware) AppendHeaderToContext(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get(header.RequestID)
		if requestID == "" {
			requestID = uuid.New().String()
		}

		scheme := appcontext.HTTP
		if r.TLS != nil {
			scheme = appcontext.HTTPS
		}

		ctx := appcontext.SetRequest(r.Context(), appcontext.RequestValue{
			ID:           requestID,
			Method:       r.Method,
			Path:         r.URL.Path,
			Scheme:       scheme,
			ForwardedFor: r.Header.Get(header.ForwardedFor),
		})

		handler(w, r.WithContext(ctx))
	}
}

func (m *middleware) Recover(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recoverErr := recover(); recoverErr != nil {
				err := errors.NewError("Panicked\nError: %s\nStack trace: %s", recoverErr, debug.Stack())
				m.logger.ErrorWithContext(r.Context(), err.Error())
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		handler(w, r)
	}
}

func (m *middleware) LogRequest(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dump, err := httputil.DumpRequest(r, true)
		if err != nil {
			m.logger.ErrorWithContext(r.Context(), err.Error())
			http.Error(w, "", http.StatusBadRequest)
			return
		}

		m.logger.InfoWithContext(r.Context(), "HTTP Received Request: "+string(dump))
		handler(w, r)
	}
}
