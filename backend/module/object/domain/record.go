package domain

import (
	"database/sql"
	libSQL "github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"github.com/google/uuid"
	"time"
)

type Record struct {
	ID             uuid.UUID       `db:"id"`
	ObjectID       uuid.UUID       `db:"object_id"`
	OrganizationID int             `db:"organization_id"`
	CreatedByID    int             `db:"created_by_id"`
	UpdatedByID    sql.NullInt64   `db:"updated_by_id"`
	CreatedAt      time.Time       `db:"created_at"`
	UpdatedAt      sql.NullTime    `db:"updated_at"`
	Data           libSQL.JSONBMap `db:"data"`
}
