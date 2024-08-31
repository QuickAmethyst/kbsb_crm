package http

import (
	netHttp "net/http"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/http/middleware"
	"github.com/bmizerany/pat"
)

type Route interface {
	Use(middlewares ...middleware.Func)
	Handle(method Method, route string, handler netHttp.HandlerFunc)
	GET(route string, handler netHttp.HandlerFunc)
	POST(route string, handler netHttp.HandlerFunc)
	PUT(route string, handler netHttp.HandlerFunc)
	DELETE(route string, handler netHttp.HandlerFunc)
	PATCH(route string, handler netHttp.HandlerFunc)
	OPTIONS(route string, handler netHttp.HandlerFunc)
	HEAD(route string, handler netHttp.HandlerFunc)
}

func NewRoute(mux *pat.PatternServeMux) Route {
	return &route{mux, make([]middleware.Func, 0)}
}

type route struct {
	mux         *pat.PatternServeMux
	middlewares []middleware.Func
}

func (r *route) PATCH(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodPatch, route, handler)
}

func (r *route) HEAD(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodHead, route, handler)
}

func (r *route) GET(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodGet, route, handler)
}

func (r *route) POST(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodPost, route, handler)
}

func (r *route) PUT(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodPut, route, handler)
}

func (r *route) DELETE(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodDelete, route, handler)
}

func (r *route) OPTIONS(route string, handler netHttp.HandlerFunc) {
	r.Handle(MethodOptions, route, handler)
}

func (r *route) Use(middlewares ...middleware.Func) {
	r.middlewares = append(r.middlewares, middlewares...)
}

func (r *route) Handle(method Method, route string, hf netHttp.HandlerFunc) {
	n := len(r.middlewares)

	for i := n - 1; i >= 0; i-- {
		hf = r.middlewares[i](hf)
	}

	r.mux.Add(string(method), route, hf)
}
