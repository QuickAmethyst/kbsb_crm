package usecase

import "github.com/QuickAmethyst/kbsb_crm/module/object/domain"

type StoreFieldInput struct {
	Field          *domain.Field
	PicklistValues []string
}
