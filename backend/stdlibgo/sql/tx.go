package sql

import (
	"context"
	"database/sql"

	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"github.com/jmoiron/sqlx"
)

type Tx interface {
	Common
	Commit() error
	Rollback() error
}

func NewTx(i *sqlx.Tx) Tx {
	return &tx{i}
}

type tx struct {
	tx *sqlx.Tx
}

func (t *tx) GetAll(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error {
	return GetAll(ctx, t, tableName, dest, whereStruct)
}

func (t *tx) PrepareContext(ctx context.Context, query string) (*sqlx.Stmt, error) {
	return t.tx.PreparexContext(ctx, query)
}

func (t *tx) SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return t.tx.SelectContext(ctx, dest, query, args...)
}

func (t *tx) QueryContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
	return t.tx.QueryxContext(ctx, query, args...)
}

func (t *tx) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	return t.tx.QueryRowxContext(ctx, query, args...)
}

func (t *tx) GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return t.tx.GetContext(ctx, dest, query, args...)
}

//nolint:revive // expected
func (t *tx) GetList(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, p *qb.Paging) error {
	return GetList(ctx, t, tableName, dest, whereStruct, p)
}

func (t *tx) First(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error {
	return First(ctx, t, tableName, dest, whereStruct)
}

func (t *tx) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return t.tx.ExecContext(ctx, query, args...)
}

func (t *tx) BulkCreate(ctx context.Context, tableName string, dests interface{}) (sql.Result, error) {
	return Insert(ctx, t, tableName, dests)
}

func (t *tx) Create(ctx context.Context, tableName string, dest interface{}) (sql.Result, error) {
	return Create(ctx, t, tableName, dest)
}

//nolint:revive // expected
func (t *tx) Update(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, options ...UpdateOption) (sql.Result, error) {
	return Update(ctx, t, tableName, dest, whereStruct, options...)
}

func (t *tx) Delete(ctx context.Context, tableName string, whereStruct interface{}) (sql.Result, error) {
	return Delete(ctx, t, tableName, whereStruct)
}

func (t *tx) Commit() error {
	return t.tx.Commit()
}

func (t *tx) Rollback() error {
	return t.tx.Rollback()
}

func (t *tx) Rebind(query string) string {
	return t.tx.Rebind(query)
}
