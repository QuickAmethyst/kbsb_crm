package domain

import "github.com/google/uuid"

type PicklistValues struct {
	ID      uuid.UUID `db:"id"`
	FieldID uuid.UUID `db:"field_id"`
	Value   string    `db:"value"`
}
