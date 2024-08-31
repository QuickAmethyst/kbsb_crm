package sql

import (
	"context"
	"github.com/QuickAmethyst/kbsb_crm/module/object/domain"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/sql"
	"github.com/google/uuid"
	"time"
)

type Writer interface {
	StoreObject(ctx context.Context, target *domain.Object) error
	StoreFieldTx(tx sql.Tx, ctx context.Context, target *domain.Field) error
	StorePicklistValuesTx(tx sql.Tx, ctx context.Context, target []*domain.PicklistValues) error
	StoreRecordTx(tx sql.Tx, ctx context.Context, target *domain.Record) error
	BulkStoreIndexTx(tx sql.Tx, ctx context.Context, target []*domain.Index) error
	Transaction(ctx context.Context, opts *sql.TxOptions, txFn func(sql.Tx) error) error
}

func NewWriter(db sql.DB) Writer {
	return &writer{db: db}
}

type writer struct {
	db sql.DB
}

func (w *writer) Transaction(ctx context.Context, opts *sql.TxOptions, txFn func(sql.Tx) error) error {
	return w.db.Transaction(ctx, opts, txFn)
}

func (w *writer) BulkStoreIndexTx(tx sql.Tx, ctx context.Context, target []*domain.Index) error {
	for i := range target {
		if target[i].CreatedAt.IsZero() {
			target[i].CreatedAt = time.Now()
		}
	}

	_, err := tx.BulkCreate(ctx, "indexes", target)
	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
	}

	return nil
}

func (w *writer) StoreRecordTx(tx sql.Tx, ctx context.Context, target *domain.Record) error {
	var err error

	if target.ID == uuid.Nil {
		target.ID, err = uuid.NewV7()
		if err != nil {
			return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
		}
	}

	if target.CreatedAt.IsZero() {
		target.CreatedAt = time.Now()
	}

	return store(ctx, tx, "records", target)
}

func (w *writer) StorePicklistValuesTx(tx sql.Tx, ctx context.Context, target []*domain.PicklistValues) error {
	var err error

	for i := range target {
		if target[i].ID == uuid.Nil {
			target[i].ID, err = uuid.NewV7()
			if err != nil {
				return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
			}
		}
	}

	_, err = tx.BulkCreate(ctx, "picklist_values", target)
	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
	}

	return nil
}

func (w *writer) StoreFieldTx(tx sql.Tx, ctx context.Context, target *domain.Field) error {
	var err error

	if target.ID == uuid.Nil {
		target.ID, err = uuid.NewV7()
		if err != nil {
			return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
		}
	}

	if target.CreatedAt.IsZero() {
		target.CreatedAt = time.Now()
	}

	return store(ctx, tx, "fields", target)
}

func (w *writer) StoreObject(ctx context.Context, target *domain.Object) error {
	return store(ctx, w.db, "objects", target)
}

func store(ctx context.Context, db sql.Common, tableName string, target interface{}) error {
	_, err := db.Create(ctx, tableName, target)
	if err != nil {
		return errors.PropagateWithCode(err, EcodeStoreFailed, "store failed")
	}

	return nil
}
