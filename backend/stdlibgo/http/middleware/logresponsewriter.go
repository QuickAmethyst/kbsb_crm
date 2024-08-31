package middleware

import (
	"fmt"
	"net/http"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/appcontext"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/http/header"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"
)

type LogResponseWriter interface {
	http.ResponseWriter
}

func NewLogResponseWriter(requestVal appcontext.RequestValue, writer http.ResponseWriter, logger logger.Logger) LogResponseWriter {
	return &logResponseWriter{
		writer,
		logger,
		200,
		requestVal,
	}
}

type logResponseWriter struct {
	writer       http.ResponseWriter
	logger       logger.Logger
	statusCode   int
	requestValue appcontext.RequestValue
}

func (l *logResponseWriter) Header() http.Header {
	return l.writer.Header()
}

func (l *logResponseWriter) Write(bytes []byte) (int, error) {
	n, err := l.writer.Write(bytes)
	if err != nil {
		return n, err
	}

	logMsg := fmt.Sprintf("HTTP Response Send:\nStatus=%d\nPayload=%s", l.statusCode, bytes)
	loggerFn := l.logger.Error
	if 0 <= l.statusCode && l.statusCode < 300 {
		loggerFn = l.logger.Info
	}

	loggerFn(logMsg)

	return n, err
}

func (l *logResponseWriter) WriteHeader(statusCode int) {
	l.statusCode = statusCode
	l.writer.Header().Add(header.RequestID, l.requestValue.ID)
	l.writer.WriteHeader(statusCode)
}
