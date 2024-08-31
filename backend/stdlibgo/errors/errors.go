package errors

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/palantir/stacktrace"
)

type ErrorCode = stacktrace.ErrorCode

const (
	ErrReadConfig = stacktrace.ErrorCode(iota)
	ErrUnmarshal
	ErrCodeUpgradeFailed
	ErrCodeReadyStateFiled
	ErrHTTPServerListenerNil
)

var (
	PropagateWithCode = stacktrace.PropagateWithCode
	Propagate         = stacktrace.Propagate
	GetCode           = stacktrace.GetCode
	RootCause         = stacktrace.RootCause
	NewError          = stacktrace.NewError
	NewErrorWithCode  = stacktrace.NewErrorWithCode
)

type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func (f *FieldError) Error() string {
	return fmt.Sprintf("Field %s. Error: %s", f.Field, f.Message)
}

type ValidationErrors []FieldError

func (v ValidationErrors) Error() string {
	buff := bytes.NewBufferString("")

	for i := 0; i < len(v); i++ {
		fe := v[i]
		buff.WriteString(fe.Error())
		buff.WriteString("\n")
	}

	return strings.TrimSpace(buff.String())
}
