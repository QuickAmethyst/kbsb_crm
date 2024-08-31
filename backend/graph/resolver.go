package graph

import (
	"github.com/QuickAmethyst/kbsb_crm/module/object/usecase"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"
)

type Resolver struct {
	Logger        logger.Logger
	ObjectUsecase usecase.Usecase
}
