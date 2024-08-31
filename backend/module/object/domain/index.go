package domain

import (
	"github.com/google/uuid"
	"math/big"
	"time"
)

type Index struct {
	RecordID    uuid.UUID `db:"record_id"`
	FieldID     uuid.UUID `db:"field_id"`
	CreatedByID int       `db:"created_by_id"`
	CreatedAt   time.Time `db:"created_at"`
	StringValue string    `db:"string_value"`
	NumberValue big.Float `db:"number_value"`
	DateValue   time.Time `db:"date_value"`
}
