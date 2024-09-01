package sql

import (
	"context"
	goError "errors"
	"fmt"
	"github.com/QuickAmethyst/kbsb_crm/module/object/domain"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"github.com/google/uuid"
	"strings"
)

type Reader interface {
	GetObjectList(ctx context.Context, stmt ObjectStatement, p qb.Paging) ([]domain.Object, qb.Paging, error)
	GetAllFields(ctx context.Context, stmt FieldStatement) ([]domain.Field, error)
	GetAllPicklistValuesByFieldID(ctx context.Context, fieldID uuid.UUID) ([]domain.PicklistValues, error)
	GetRecordListByObjectID(ctx context.Context, objectID uuid.UUID, filters []FilterRecordField, p qb.Paging) ([]domain.Record, qb.Paging, error)
	GetIndexByFieldID(ctx context.Context, fieldID uuid.UUID) (domain.Index, error)
}

func NewReader(db sql.DB) Reader {
	return &reader{db: db}
}

type reader struct {
	db sql.DB
}

func (r *reader) GetAllFields(ctx context.Context, stmt FieldStatement) ([]domain.Field, error) {
	res := make([]domain.Field, 0)

	err := r.db.GetAll(ctx, "fields", &res, stmt)
	if err != nil {
		return res, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get list")
	}

	return res, nil
}

func (r *reader) GetIndexByFieldID(ctx context.Context, fieldID uuid.UUID) (domain.Index, error) {
	var res domain.Index
	err := r.db.First(ctx, "indexes", &res, IndexStatement{FieldID: fieldID})
	if err != nil {
		if goError.Is(err, sql.ErrNoRows) {
			return domain.Index{}, errors.PropagateWithCode(err, EcodeNotFound, "not found")
		}

		return domain.Index{}, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get list")
	}

	return res, nil
}

func (r *reader) GetRecordListByObjectID(ctx context.Context, objectID uuid.UUID, filters []FilterRecordField, p qb.Paging) ([]domain.Record, qb.Paging, error) {
	res := make([]domain.Record, 0)
	p.Normalize()

	indexJoinCounter := 0
	args := make([]interface{}, 0)
	baseQuery := "SELECT r.* FROM records r"
	countQuery := "SELECT COUNT(*) FROM records r"

	if len(filters) > 0 {
		filterIDs := make([]uuid.UUID, 0)
		for _, f := range filters {
			filterIDs = append(filterIDs, f.FieldID)
		}

		fields, err := r.GetAllFields(ctx, FieldStatement{
			ObjectID: objectID,
			IDIN:     filterIDs,
		})

		if err != nil {
			return res, p, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get fields")
		}

		mapFilters := make(map[uuid.UUID]domain.Field)
		for _, field := range fields {
			mapFilters[field.ID] = field
		}

		var (
			whereClauses    []string
			whereClauseArgs []interface{}
		)

		for _, filter := range filters {
			field, ok := mapFilters[filter.FieldID]
			if !ok {
				return res, p, errors.NewErrorWithCode(EcodeGetListFailed, "field id `%s` is not exist on object `%s`", filter.FieldID, objectID)
			}

			if field.IsIndexed {
				indexJoinCounter++
				q := fmt.Sprintf(" JOIN indexes ip%d ON r.id = ip%d.record_id AND ip%d.field_id = ? AND ", indexJoinCounter, indexJoinCounter, indexJoinCounter)
				args = append(args, filter.FieldID, filter.Value)

				switch field.DataType {
				case domain.StringDataType, domain.PicklistDataType:
					q += fmt.Sprintf("ip%d.string_value = ?", indexJoinCounter)
				case domain.NumberDataType:
					q += fmt.Sprintf("ip%d.number_value = ?", indexJoinCounter)
				case domain.DateDataType:
					q += fmt.Sprintf("ip%d.date_value = ?", indexJoinCounter)
				default:
					return res, p, fmt.Errorf("unsupported filter value type: %T", filter.Value)
				}

				baseQuery += q
				countQuery += q
			} else {
				whereClauses = append(whereClauses, "r.data->>? = ?")
				whereClauseArgs = append(whereClauseArgs, field.Label, filter.Value)
			}
		}

		baseQuery = strings.TrimSuffix(baseQuery, " AND ")
		countQuery = strings.TrimSuffix(countQuery, " AND ")

		if len(whereClauses) > 0 {
			q := " WHERE " + strings.Join(whereClauses, " AND ")
			baseQuery += q
			countQuery += q
			args = append(args, whereClauseArgs...)
		}
	}

	limitClause, limitClauseArgs := p.BuildQuery()

	err := r.db.SelectContext(ctx, &res, r.db.Rebind(baseQuery+" "+limitClause), append(args, limitClauseArgs...)...)
	if err != nil {
		return res, p, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get records")
	}

	err = r.db.GetContext(ctx, &p.Total, r.db.Rebind(countQuery), args...)
	if err != nil {
		return res, p, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get records")
	}

	return res, p, nil
}

func (r *reader) GetAllPicklistValuesByFieldID(ctx context.Context, fieldID uuid.UUID) ([]domain.PicklistValues, error) {
	res := make([]domain.PicklistValues, 0)
	err := r.db.GetAll(ctx, "picklist_values", &res, PicklistValuesStatement{FieldID: fieldID})
	if err != nil {
		return res, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get list")
	}

	return res, nil
}

func (r *reader) GetObjectList(ctx context.Context, stmt ObjectStatement, p qb.Paging) ([]domain.Object, qb.Paging, error) {
	res := make([]domain.Object, 0)
	err := r.db.GetList(ctx, "objects", &res, stmt, &p)
	if err != nil {
		return res, p, errors.PropagateWithCode(err, EcodeGetListFailed, "Error on get list")
	}

	return res, p, nil
}
