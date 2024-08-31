package appcontext

type AppValue struct {
	Name    string
	Version string
}

type RequestValue struct {
	ID           string
	Method       string
	Path         string
	Scheme       Scheme
	ForwardedFor string
}

type SchedulerValue struct {
	ID         string
	Name       string
	Partitions []int
}
