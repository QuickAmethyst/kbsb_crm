package domain

import (
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type Record struct {
	ID             uuid.UUID              `db:"id"`
	ObjectID       uuid.UUID              `db:"object_id"`
	OrganizationID int                    `db:"organization_id"`
	CreatedByID    int                    `db:"created_by_id"`
	UpdatedByID    sql.NullInt64          `db:"updated_by_id"`
	CreatedAt      time.Time              `db:"created_at"`
	UpdatedAt      sql.NullTime           `db:"updated_at"`
	Data           map[string]interface{} `db:"data"`
}
