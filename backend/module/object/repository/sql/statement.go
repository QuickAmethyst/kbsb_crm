package sql

import "github.com/google/uuid"

type ObjectStatement struct {
	ID             uuid.UUID `db:"id"`
	NameLike       string    `db:"name"`
	OrganizationID int       `db:"organization_id"`
}

type FieldStatement struct {
	IDIN           []uuid.UUID `db:"id"`
	LabelLike      string      `db:"label"`
	ObjectID       uuid.UUID   `db:"object_id"`
	OrganizationID int         `db:"organization_id"`
}

type PicklistValuesStatement struct {
	FieldID uuid.UUID `db:"field_id"`
}

type FilterRecordField struct {
	FieldID uuid.UUID   `db:"field_id"`
	Value   interface{} `db:"value"`
}

type RecordStatement struct {
	ObjectID uuid.UUID `db:"object_id"`
}

type IndexStatement struct {
	FieldID uuid.UUID `db:"field_id"`
}
