package sql

type UpdateOption interface {
	// Apply sets the Option value of a config.
	Apply(config *updateConfig)
}

var _ UpdateOption = UpdateOptionFunc(nil)

type UpdateOptionFunc func(config *updateConfig)

func (u UpdateOptionFunc) Apply(config *updateConfig) {
	u(config)
}

type updateConfig struct {
	excludeColumns map[string]bool
}

func newUpdateConfig(options ...UpdateOption) *updateConfig {
	cfg := &updateConfig{}

	for _, opt := range options {
		opt.Apply(cfg)
	}

	return cfg
}

func WithExcludeColumns(columns ...string) UpdateOption {
	return UpdateOptionFunc(func(config *updateConfig) {
		if config.excludeColumns == nil {
			config.excludeColumns = make(map[string]bool)
		}

		for _, c := range columns {
			config.excludeColumns[c] = true
		}
	})
}
