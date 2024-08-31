package model

import "github.com/google/uuid"

type Object struct {
	ID             uuid.UUID `json:"id"`
	OrganizationID int       `json:"organizationID"`
	Name           string    `json:"name"`
	Description    *string   `json:"description,omitempty"`
}

type WriteObjectInput struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
}
