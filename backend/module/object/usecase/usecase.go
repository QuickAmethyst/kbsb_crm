package usecase

import "github.com/QuickAmethyst/kbsb_crm/module/object/repository/sql"

type Usecase interface {
	Reader
	Writer
}

func New(object sql.SQL) Usecase {
	return &struct {
		Reader
		Writer
	}{
		Reader: NewReader(object),
		Writer: NewWriter(object),
	}
}
