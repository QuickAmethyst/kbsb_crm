package usecase

import (
	"context"
	"github.com/QuickAmethyst/kbsb_crm/module/object/domain"
	"github.com/QuickAmethyst/kbsb_crm/module/object/repository/sql"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/appcontext"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	sql2 "github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"github.com/google/uuid"
	"math/big"
	"strconv"
	"time"
)

type Writer interface {
	StoreObject(ctx context.Context, target *domain.Object) error
	StoreField(ctx context.Context, target *StoreFieldInput) error
	StoreRecord(ctx context.Context, target *domain.Record) error
}

func NewWriter(domain sql.SQL) Writer {
	return &writer{domain: domain}
}

type writer struct {
	domain sql.SQL
}

func (w *writer) StoreRecord(ctx context.Context, target *domain.Record) error {
	var (
		err           error
		indexes       []*domain.Index
		indexedFields map[string]bool
	)

	target.OrganizationID = appcontext.GetOrganizationID(ctx)
	target.ID, err = uuid.NewV7()
	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "generate uuid v7 failed")
	}

	objectList, _, err := w.domain.GetObjectList(ctx, sql.ObjectStatement{
		ID:             target.ObjectID,
		OrganizationID: target.OrganizationID,
	}, qb.Paging{
		PageSize: 1,
	})

	if err != nil {
		return errors.Propagate(err, "Error on check object exist")
	}

	if len(objectList) != 1 {
		return errors.NewErrorWithCode(EcodeObjectNotFound, "Object %s with organization id %s not found", target.ObjectID.String(), target.OrganizationID)
	}

	fields, err := w.domain.GetAllFields(ctx, sql.FieldStatement{ObjectID: target.ObjectID})
	if err != nil {
		return errors.Propagate(err, "Error on get all fields")
	}

	fieldsMap := make(map[string]domain.Field)
	var requiredFields []string
	for _, field := range fields {
		fieldsMap[field.Label] = field

		if field.IsRequired {
			requiredFields = append(requiredFields, field.Label)
		}

		if field.IsIndexed {
			indexedFields[field.Label] = true
		}
	}

	validData := make(map[string]interface{})
	for k, val := range target.Data {
		if field, ok := fieldsMap[k]; ok {
			validData[field.Label] = val
		}
	}

	for _, k := range requiredFields {
		_, requiredFieldExist := validData[k]
		if requiredFieldExist {
			continue
		}

		if !fieldsMap[k].DefaultValue.Valid {
			return errors.NewErrorWithCode(EcodeInvalidFieldValue, "missing required fields. Field: %s, ObjectID: %s", k, target.ObjectID.String())
		}

		if fieldsMap[k].DataType == domain.NumberDataType {
			validData[k], err = strconv.ParseFloat(fieldsMap[k].DefaultValue.String, 64)
			if err != nil {
				return errors.Propagate(err, "Error on convert string to int. Field: %s, ObjectID: %s", k, target.ObjectID.String())
			}
		} else {
			validData[k] = fieldsMap[k].DefaultValue.String
		}
	}

	for k := range indexedFields {
		val, ok := validData[k]
		if !ok {
			continue
		}

		index := &domain.Index{
			RecordID: target.ID,
			FieldID:  fieldsMap[k].ID,
		}

		switch fieldsMap[k].DataType {
		case domain.NumberDataType:
			float := big.NewFloat(val.(float64))
			index.NumberValue = *float
		case domain.DateDataType:
			index.DateValue, err = time.Parse(time.RFC3339, val.(string))
			if err != nil {
				return errors.Propagate(err, "Error on parse date value")
			}
		case domain.PicklistDataType, domain.StringDataType:
			index.StringValue = val.(string)
		default:
			return errors.NewErrorWithCode(EcodeDataTypeNotSupported, "data type not supported")
		}

		indexes = append(indexes, index)
	}

	err = w.domain.Transaction(ctx, nil, func(tx sql2.Tx) error {
		err = w.domain.StoreRecordTx(tx, ctx, target)
		if err != nil {
			return errors.Propagate(err, "Error on store record")
		}

		err = w.domain.BulkStoreIndexTx(tx, ctx, indexes)
		if err != nil {
			return errors.Propagate(err, "Error on store indexes")
		}

		return nil
	})

	if err != nil {
		return errors.Propagate(err, "Error on store")
	}

	return nil
}

func (w *writer) StoreField(ctx context.Context, target *StoreFieldInput) error {
	var err error

	target.Field.OrganizationID = appcontext.GetOrganizationID(ctx)
	target.Field.ID, err = uuid.NewV7()
	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "generate uuid v7 failed")
	}

	target.Field.DefaultValue.Valid = len(target.Field.DefaultValue.String) > 0

	err = w.domain.Transaction(ctx, nil, func(tx sql2.Tx) error {
		if target.Field.DataType == domain.PicklistDataType {
			if len(target.PicklistValues) == 0 {
				return errors.NewErrorWithCode(EcodePicklistValuesEmpty, "picklist values required for `picklist` data type")
			}

			picklistValues := make([]*domain.PicklistValues, 0)
			for _, v := range target.PicklistValues {
				picklistValues = append(picklistValues, &domain.PicklistValues{
					FieldID: target.Field.ID,
					Value:   v,
				})
			}

			err := w.domain.StorePicklistValuesTx(tx, ctx, picklistValues)
			if err != nil {
				return errors.Propagate(err, "Error on store picklist values")
			}
		}

		return w.domain.StoreFieldTx(tx, ctx, target.Field)
	})

	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "Error on store")
	}

	return nil
}

func (w *writer) StoreObject(ctx context.Context, target *domain.Object) error {
	return w.domain.StoreObject(ctx, target)
}
