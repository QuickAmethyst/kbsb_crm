package domain

import (
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"github.com/google/uuid"
)

type Object struct {
	ID             uuid.UUID      `db:"id"`
	OrganizationID int            `db:"organization_id"`
	Name           string         `db:"name"`
	Description    sql.NullString `db:"description"`
}
