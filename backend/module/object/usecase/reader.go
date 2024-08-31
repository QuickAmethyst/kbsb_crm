package usecase

import (
	"context"
	"github.com/QuickAmethyst/kbsb_crm/module/object/domain"
	"github.com/QuickAmethyst/kbsb_crm/module/object/repository/sql"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/appcontext"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"github.com/google/uuid"
)

type Reader interface {
	GetObjectList(ctx context.Context, stmt sql.ObjectStatement, p qb.Paging) ([]domain.Object, qb.Paging, error)
	GetAllFields(ctx context.Context, stmt sql.FieldStatement) ([]domain.Field, error)
	GetAllPicklistValuesByFieldID(ctx context.Context, fieldID uuid.UUID) ([]domain.PicklistValues, error)
	GetRecordListByObjectID(ctx context.Context, objectID uuid.UUID, filters []sql.FilterRecordField, p qb.Paging) ([]domain.Record, qb.Paging, error)
	GetIndexByFieldID(ctx context.Context, fieldID uuid.UUID) (domain.Index, error)
}

func NewReader(domain sql.SQL) Reader {
	return &reader{domain: domain}
}

type reader struct {
	domain sql.SQL
}

func (r *reader) GetObjectList(ctx context.Context, stmt sql.ObjectStatement, p qb.Paging) ([]domain.Object, qb.Paging, error) {
	return r.domain.GetObjectList(ctx, stmt, p)
}

func (r *reader) GetAllFields(ctx context.Context, stmt sql.FieldStatement) ([]domain.Field, error) {
	return r.domain.GetAllFields(ctx, stmt)
}

func (r *reader) GetAllPicklistValuesByFieldID(ctx context.Context, fieldID uuid.UUID) ([]domain.PicklistValues, error) {
	return r.domain.GetAllPicklistValuesByFieldID(ctx, fieldID)
}

func (r *reader) GetRecordListByObjectID(ctx context.Context, objectID uuid.UUID, filters []sql.FilterRecordField, p qb.Paging) ([]domain.Record, qb.Paging, error) {
	objects, _, err := r.GetObjectList(ctx, sql.ObjectStatement{
		ID:             objectID,
		OrganizationID: appcontext.GetOrganizationID(ctx),
	}, qb.Paging{})

	if err != nil {
		return nil, qb.Paging{}, errors.Propagate(err, "Error on get object")
	}

	if len(objects) != 1 {
		return nil, qb.Paging{}, errors.NewErrorWithCode(EcodeObjectNotFound, "Object ID `%s` not found", objectID.String())
	}

	return r.domain.GetRecordListByObjectID(ctx, objectID, filters, p)
}

func (r *reader) GetIndexByFieldID(ctx context.Context, fieldID uuid.UUID) (domain.Index, error) {
	return r.domain.GetIndexByFieldID(ctx, fieldID)
}
