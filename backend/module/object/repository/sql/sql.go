package sql

import "github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"

type SQL interface {
	Reader
	Writer
}

type Options struct {
	MasterDB sql.DB
	SlaveDB  sql.DB
}

func New(opt *Options) SQL {
	return &struct {
		Reader
		Writer
	}{
		Reader: NewReader(opt.SlaveDB),
		Writer: NewWriter(opt.MasterDB),
	}
}
