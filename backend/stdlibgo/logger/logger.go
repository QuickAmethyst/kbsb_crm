package logger

import (
	"context"

	"go.uber.org/zap"
)

type Logger interface {
	Client() *zap.Logger
	Named(s string) Logger
	DebugWithContext(ctx context.Context, msg string, fields ...Field)
	Debug(msg string, fields ...Field)
	InfoWithContext(ctx context.Context, msg string, fields ...Field)
	Info(msg string, fields ...Field)
	WarnWithContext(ctx context.Context, msg string, fields ...Field)
	Warn(msg string, fields ...Field)
	ErrorWithContext(ctx context.Context, msg string, fields ...Field)
	Error(msg string, fields ...Field)
	DPanicWithContext(ctx context.Context, msg string, fields ...Field)
	DPanic(msg string, fields ...Field)
	PanicWithContext(ctx context.Context, msg string, fields ...Field)
	Panic(msg string, fields ...Field)
	FatalWithContext(ctx context.Context, msg string, fields ...Field)
	Fatal(msg string, fields ...Field)
	Sync() error
}

func New(option Option) (Logger, error) {
	var (
		zapLogger *zap.Logger
		err       error
	)

	if option.NoOp {
		zapLogger = zap.NewNop()
	} else {
		if option.Development {
			if zapLogger, err = zap.NewDevelopment(); err != nil {
				return nil, err
			}
		} else {
			if zapLogger, err = zap.NewProduction(); err != nil {
				return nil, err
			}
		}
	}

	zapLogger = zapLogger.WithOptions(zap.AddCallerSkip(1))

	return &logger{zapLogger}, nil
}

func clone(l *zap.Logger) Logger {
	return &logger{l}
}

type logger struct {
	zapLogger *zap.Logger
}

func (l *logger) Client() *zap.Logger {
	return l.zapLogger
}

func (l *logger) Named(s string) Logger {
	log := l.zapLogger.Named(s)
	return clone(log)
}

func (l *logger) DebugWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Debug(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Debug(msg string, fields ...Field) {
	l.zapLogger.Debug(msg, fields...)
}

func (l *logger) InfoWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Info(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Info(msg string, fields ...Field) {
	l.zapLogger.Info(msg, fields...)
}

func (l *logger) WarnWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Warn(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Warn(msg string, fields ...Field) {
	l.zapLogger.Warn(msg, fields...)
}

func (l *logger) ErrorWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Error(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Error(msg string, fields ...Field) {
	l.zapLogger.Error(msg, fields...)
}

func (l *logger) DPanicWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.DPanic(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) DPanic(msg string, fields ...Field) {
	l.zapLogger.DPanic(msg, fields...)
}

func (l *logger) PanicWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Panic(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Panic(msg string, fields ...Field) {
	l.zapLogger.Panic(msg, fields...)
}

func (l *logger) FatalWithContext(ctx context.Context, msg string, fields ...Field) {
	l.zapLogger.Fatal(msg, append(parseContextToFields(ctx), fields...)...)
}

func (l *logger) Fatal(msg string, fields ...Field) {
	l.zapLogger.Fatal(msg, fields...)
}

func (l *logger) Sync() error {
	return l.zapLogger.Sync()
}
