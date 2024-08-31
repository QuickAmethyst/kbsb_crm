package domain

import (
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type FieldDataType string

const (
	StringDataType   FieldDataType = "string"
	NumberDataType   FieldDataType = "number"
	DateDataType     FieldDataType = "date"
	PicklistDataType FieldDataType = "picklist"
)

type Field struct {
	ID             uuid.UUID      `db:"id"`
	ObjectID       uuid.UUID      `db:"object_id"`
	OrganizationID int            `db:"organization_id"`
	CreatedByID    int            `db:"created_by_id"`
	UpdatedByID    sql.NullInt64  `db:"updated_by_id"`
	CreatedAt      time.Time      `db:"created_at"`
	UpdatedAt      sql.NullTime   `db:"updated_at"`
	Label          string         `db:"label"`
	DataType       FieldDataType  `db:"data_type"`
	DefaultValue   sql.NullString `db:"default_value"`
	IsIndexed      bool           `db:"is_indexed"`
	IsRequired     bool           `db:"is_required"`
}
