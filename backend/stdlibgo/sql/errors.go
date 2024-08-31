package sql

import (
	"database/sql"
	"fmt"
)

var (
	ErrWhereStructNil        = fmt.Errorf("where struct cannot be nil")
	ErrNoRows                = sql.ErrNoRows
	ErrInvalidTypeUpdateDest = fmt.Errorf("dest must be type of struct or map")
	ErrInvalidTypeCreateDest = fmt.Errorf("dest must be type of struct or map")
)
