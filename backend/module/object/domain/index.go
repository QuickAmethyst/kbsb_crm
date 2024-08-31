package domain

import (
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type Index struct {
	RecordID    uuid.UUID       `db:"record_id"`
	FieldID     uuid.UUID       `db:"field_id"`
	CreatedByID int             `db:"created_by_id"`
	CreatedAt   time.Time       `db:"created_at"`
	StringValue sql.NullString  `db:"string_value"`
	NumberValue sql.NullFloat64 `db:"number_value"`
	DateValue   sql.NullTime    `db:"date_value"`
}
