package appcontext

type Key int

const (
	RequestKey Key = iota
	BearerTokenKey
	UserIDKey
	TimezoneKey
	AppKey
	SchedulerKey
	OrganizationID
)
