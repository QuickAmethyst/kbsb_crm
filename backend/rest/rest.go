package rest

import "github.com/QuickAmethyst/kbsb_crm/stdlibgo/http"

func New(rest http.HTTP, graphqlHandler http.HandlerFunc, playgroundHandler http.HandlerFunc) {
	rest.GET("/", playgroundHandler)
	rest.UseDefaultMiddleware()
	rest.POST("/query", graphqlHandler)
}
