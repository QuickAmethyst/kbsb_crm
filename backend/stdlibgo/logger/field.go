package logger

import (
	"context"

	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/appcontext"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type (
	Field    = zap.Field
	FieldKey string
)

const (
	RequestKey   FieldKey = "request"
	SchedulerKey FieldKey = "scheduler"
	UserIDKey    FieldKey = "user_id"
	SpanIDKey    FieldKey = "span_id"
	TraceIDKey   FieldKey = "trace_id"
)

type requestField struct {
	ID           string
	Path         string
	Method       string
	Scheme       appcontext.Scheme
	ForwardedFor string
}

func (r *requestField) MarshalLogObject(encoder zapcore.ObjectEncoder) error {
	encoder.AddString("id", r.ID)
	encoder.AddString("path", r.Path)
	encoder.AddString("method", r.Method)
	encoder.AddString("scheme", string(r.Scheme))
	encoder.AddString("forwardedFor", r.ForwardedFor)
	return nil
}

type schedulerField struct {
	ID string
}

func (r *schedulerField) MarshalLogObject(encoder zapcore.ObjectEncoder) error {
	encoder.AddString("id", r.ID)
	return nil
}

func parseContextToFields(ctx context.Context) []Field {
	var fields []Field

	reqVal, reqValOk := appcontext.GetRequest(ctx)
	schedulerVal := appcontext.GetScheduler(ctx)

	if reqValOk {
		fields = append(fields, zap.Object(string(RequestKey), &requestField{
			ID:     reqVal.ID,
			Path:   reqVal.Path,
			Method: reqVal.Method,
			Scheme: reqVal.Scheme,
		}))
	}

	fields = append(fields,
		zap.String(string(UserIDKey), appcontext.GetUserID(ctx).String()),
	)

	if schedulerVal.ID != "" {
		fields = append(fields, zap.Object(string(SchedulerKey), &schedulerField{ID: schedulerVal.ID}))
	}

	return fields
}
