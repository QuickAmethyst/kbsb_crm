package httpserver

import (
	"context"
	"io"
	"log"
	"net"
	nativeHttp "net/http"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/http"
)

type HTTPServer interface {
	Name() string
	Addr() string
	Serve(ln net.Listener) error
	Shutdown() error
}

func New(opt Options, handler nativeHttp.Handler, errLogWriter io.Writer) HTTPServer {
	return &httpServer{
		opt: opt,
		server: &nativeHttp.Server{
			Addr:              opt.Address,
			Handler:           handler,
			ReadHeaderTimeout: opt.ReadHeaderTimeout,
			ReadTimeout:       opt.ReadTimeout,
			WriteTimeout:      opt.WriteTimeout,
			IdleTimeout:       opt.IdleTimeout,
			ErrorLog:          log.New(errLogWriter, "server", log.LstdFlags),
		},
	}
}

type httpServer struct {
	opt    Options
	server *nativeHttp.Server
}

func (h *httpServer) Name() string {
	return h.opt.Name
}

func (h *httpServer) Shutdown() error {
	return h.server.Shutdown(context.Background())
}

func (h *httpServer) Addr() string {
	return h.opt.Address
}

func (h *httpServer) Serve(l net.Listener) error {
	if l == nil {
		return errors.PropagateWithCode(http.ErrListenerNil, errors.ErrHTTPServerListenerNil, http.ErrListenerNil.Error())
	}

	return h.server.Serve(l)
}
