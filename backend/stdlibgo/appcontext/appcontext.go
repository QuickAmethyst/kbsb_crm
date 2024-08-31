package appcontext

import (
	"context"
	"time"

	"github.com/google/uuid"
)

func GetRequest(ctx context.Context) (RequestValue, bool) {
	val, ok := ctx.Value(RequestKey).(RequestValue)
	return val, ok
}

func SetRequest(ctx context.Context, val RequestValue) context.Context {
	return context.WithValue(ctx, RequestKey, val)
}

func GetBearerToken(ctx context.Context) string {
	v, ok := ctx.Value(BearerTokenKey).(string)
	if !ok {
		return ""
	}

	return v
}

func SetBearerToken(ctx context.Context, val string) context.Context {
	return context.WithValue(ctx, BearerTokenKey, val)
}

func GetOrganizationID(ctx context.Context) int {
	v, ok := ctx.Value(OrganizationID).(int)
	if !ok {
		return -1
	}

	return v
}

func SetOrganizationID(ctx context.Context, orgID int) context.Context {
	return context.WithValue(ctx, OrganizationID, orgID)
}

func GetUserID(ctx context.Context) uuid.UUID {
	v, ok := ctx.Value(UserIDKey).(uuid.UUID)
	if !ok {
		return uuid.Nil
	}

	return v
}

func SetUserID(ctx context.Context, val uuid.UUID) context.Context {
	return context.WithValue(ctx, UserIDKey, val)
}

func GetTimezone(ctx context.Context) (*time.Location, error) {
	v, ok := ctx.Value(TimezoneKey).(string)
	if !ok {
		return time.UTC, nil
	}

	return time.LoadLocation(v)
}

func SetTimezone(ctx context.Context, val string) context.Context {
	return context.WithValue(ctx, TimezoneKey, val)
}

func GetApp(ctx context.Context) AppValue {
	return ctx.Value(AppKey).(AppValue)
}

func SetApp(ctx context.Context, val AppValue) context.Context {
	return context.WithValue(ctx, AppKey, val)
}

func GetScheduler(ctx context.Context) SchedulerValue {
	val, ok := ctx.Value(SchedulerKey).(SchedulerValue)
	if !ok {
		return SchedulerValue{}
	}

	return val
}

func SetScheduler(ctx context.Context, val SchedulerValue) context.Context {
	return context.WithValue(ctx, SchedulerKey, val)
}
