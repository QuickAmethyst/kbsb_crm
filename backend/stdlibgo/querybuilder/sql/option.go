package sql

type Option interface {
	Apply(c *config)
}

var _ Option = OptionFunc(nil)

type OptionFunc func(c *config)

func (u OptionFunc) Apply(c *config) {
	u(c)
}

type config struct {
	hardDelete bool
}

func newConfig(options ...Option) *config {
	cfg := &config{}

	for _, opt := range options {
		opt.Apply(cfg)
	}

	return cfg
}

func WithHardDelete(enabled bool) Option {
	return OptionFunc(func(c *config) {
		c.hardDelete = enabled
	})
}
