package sql

import (
	"context"
	"database/sql"
	"fmt"

	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"github.com/jmoiron/sqlx"
)

type (
	Result    = sql.Result
	TxOptions = sql.TxOptions
)

const (
	LevelDefault         = sql.LevelDefault
	LevelReadUncommitted = sql.LevelReadUncommitted
	LevelReadCommitted   = sql.LevelReadCommitted
	LevelWriteCommitted  = sql.LevelWriteCommitted
	LevelRepeatableRead  = sql.LevelRepeatableRead
	LevelSnapshot        = sql.LevelSnapshot
	LevelSerializable    = sql.LevelSerializable
	LevelLinearizable    = sql.LevelLinearizable
)

type DB interface {
	Common
	BeginTx(ctx context.Context, opts *TxOptions) (Tx, error)
	Transaction(ctx context.Context, opts *TxOptions, txFn func(Tx) error) (err error)
	PingContext(ctx context.Context) error
	Stats() sql.DBStats
	Close() error
}

func NewDB(i *sqlx.DB) DB {
	return &db{i}
}

type db struct {
	db *sqlx.DB
}

func (d *db) GetAll(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error {
	return GetAll(ctx, d, tableName, dest, whereStruct)
}

func (d *db) SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return d.db.SelectContext(ctx, dest, query, args...)
}

func (d *db) QueryContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
	return d.db.QueryxContext(ctx, query, args...)
}

func (d *db) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	return d.db.QueryRowxContext(ctx, query, args...)
}

func (d *db) GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return d.db.GetContext(ctx, dest, query, args...)
}

//nolint:revive // expected
func (d *db) GetList(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, p *qb.Paging) error {
	return GetList(ctx, d, tableName, dest, whereStruct, p)
}

func (d *db) First(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error {
	return First(ctx, d, tableName, dest, whereStruct)
}

func (d *db) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return d.db.ExecContext(ctx, query, args...)
}

func (d *db) BulkCreate(ctx context.Context, tableName string, dests interface{}) (sql.Result, error) {
	return Insert(ctx, d, tableName, dests)
}

func (d *db) Create(ctx context.Context, tableName string, dest interface{}) (sql.Result, error) {
	return Create(ctx, d, tableName, dest)
}

//nolint:revive // expected
func (d *db) Update(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, options ...UpdateOption) (sql.Result, error) {
	return Update(ctx, d, tableName, dest, whereStruct, options...)
}

func (d *db) Delete(ctx context.Context, tableName string, whereStruct interface{}) (sql.Result, error) {
	return Delete(ctx, d, tableName, whereStruct)
}

func (d *db) Rebind(query string) string {
	return d.db.Rebind(query)
}

func (d *db) PrepareContext(ctx context.Context, query string) (*sqlx.Stmt, error) {
	return d.db.PreparexContext(ctx, query)
}

func (d *db) PingContext(ctx context.Context) error {
	return d.db.PingContext(ctx)
}

func (d *db) Stats() sql.DBStats {
	return d.db.Stats()
}

func (d *db) Close() error {
	return d.db.Close()
}

func (d *db) BeginTx(ctx context.Context, opts *TxOptions) (Tx, error) {
	tx, err := d.db.BeginTxx(ctx, opts)
	if err != nil {
		return nil, err
	}

	return NewTx(tx), nil
}

func (d *db) Transaction(ctx context.Context, opts *TxOptions, txFn func(Tx) error) (err error) {
	tx, err := d.BeginTx(ctx, opts)
	if err != nil {
		return
	}

	err = txFn(tx)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}

		return
	}

	return tx.Commit()
}
