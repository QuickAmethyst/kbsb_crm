package sql

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/utils"
	"github.com/jmoiron/sqlx"
	"reflect"
	"strings"
	"time"
)

type Common interface {
	SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	QueryContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row
	GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	GetList(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, p *qb.Paging) error
	GetAll(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error
	First(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}) error
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	BulkCreate(ctx context.Context, tableName string, dests interface{}) (sql.Result, error)
	Create(ctx context.Context, tableName string, dest interface{}) (sql.Result, error)
	Update(ctx context.Context, tableName string, dest interface{}, whereStruct interface{}, options ...UpdateOption) (sql.Result, error)
	Delete(ctx context.Context, tableName string, whereStruct interface{}) (sql.Result, error)
	Rebind(query string) string
	PrepareContext(ctx context.Context, query string) (*sqlx.Stmt, error)
}

//nolint:revive // expected
func GetList(ctx context.Context, db Common, tableName string, dest interface{}, whereStruct interface{}, p *qb.Paging) error {
	destType := reflect.Indirect(reflect.ValueOf(dest)).Kind()
	if destType != reflect.Slice {
		return fmt.Errorf("parameter `dest` should be a slice. Received %s", destType)
	}

	p.Normalize()

	q, args, countQ, countArgs, err := buildListQuery(tableName, dest, whereStruct, p)
	if err != nil {
		return err
	}

	q, args, err = sqlx.In(q, args...)
	if err != nil {
		return err
	}

	countQ, countArgs, err = sqlx.In(countQ, countArgs...)
	if err != nil {
		return err
	}

	if err = db.SelectContext(ctx, dest, db.Rebind(q), args...); err != nil {
		return err
	}

	if err = db.GetContext(ctx, &p.Total, db.Rebind(countQ), countArgs...); err != nil {
		return err
	}

	return nil
}

func GetAll(ctx context.Context, db Common, tableName string, dest interface{}, whereStruct interface{}) error {
	destType := reflect.Indirect(reflect.ValueOf(dest)).Kind()
	if destType != reflect.Slice {
		return fmt.Errorf("parameter `dest` should be a slice. Received %s", destType)
	}

	selectClause, fromClause, whereClause, args, err := buildSelectQuery(tableName, dest, whereStruct)
	if err != nil {
		return err
	}

	q := fmt.Sprintf("%s %s %s", selectClause, fromClause, whereClause)

	q, args, err = sqlx.In(q, args...)
	if err != nil {
		return err
	}

	if err = db.SelectContext(ctx, dest, db.Rebind(q), args...); err != nil {
		return err
	}

	return nil
}

func First(ctx context.Context, db Common, tableName string, dest interface{}, whereStruct interface{}) error {
	q, args, err := buildFirstQuery(tableName, dest, whereStruct)
	if err != nil {
		return err
	}

	q, args, err = sqlx.In(q, args...)
	if err != nil {
		return err
	}

	if err = db.GetContext(ctx, dest, db.Rebind(q), args...); err != nil {
		return err
	}

	return nil
}

func Insert(ctx context.Context, db Common, tableName string, target interface{}) (result sql.Result, err error) {
	columnNames, columnValues := make([]string, 0), make([][]interface{}, 0)

	process := func(dest interface{}) error {
		elemKind := reflect.Indirect(reflect.ValueOf(dest)).Kind()
		tmpColumnNames := make([]string, 0)
		tmpColumnValues := make([]interface{}, 0)

		var structIteratee func(key string, value interface{}, tag reflect.StructTag) error
		structIteratee = func(key string, value interface{}, tag reflect.StructTag) error {
			columnName, columnValue := tag.Get("db"), value
			isModel := key == reflect.TypeOf(Model{}).Name()
			if columnName == "" {
				columnName = qb.ColumnName(key)
			}

			if isModel && reflect.TypeOf(value).Kind() == reflect.Struct {
				return utils.ForInStruct(columnValue, structIteratee)
			}

			tmpColumnNames, tmpColumnValues = append(tmpColumnNames, columnName), append(tmpColumnValues, columnValue)

			return nil
		}

		switch elemKind {
		case reflect.Struct:
			err = utils.ForInStruct(dest, structIteratee)
		case reflect.Map:
			err = utils.ForIn(dest, func(key interface{}, value interface{}) error {
				columnName, columnValue := qb.ColumnName(key.(string)), value
				tmpColumnNames, tmpColumnValues = append(tmpColumnNames, columnName), append(tmpColumnValues, columnValue)
				return nil
			})
		default:
			err = ErrInvalidTypeCreateDest
		}

		if err != nil {
			return err
		}

		columnNames = tmpColumnNames
		columnValues = append(columnValues, tmpColumnValues)

		return nil
	}

	value := reflect.Indirect(reflect.ValueOf(target))
	valueKind := value.Kind()
	if valueKind == reflect.Slice {
		for i := 0; i < value.Len(); i++ {
			err = process(value.Index(i).Interface())
			if err != nil {
				return result, err
			}
		}
	} else {
		err = process(target)
		if err != nil {
			return result, err
		}
	}

	query, args := buildInsertQuery(tableName, columnNames, columnValues)
	query, args, err = sqlx.In(query, args...)
	if err != nil {
		return result, err
	}

	return db.ExecContext(ctx, db.Rebind(query), args...)
}

func Create(ctx context.Context, db Common, tableName string, dest interface{}) (result sql.Result, err error) {
	return Insert(ctx, db, tableName, dest)
}

//nolint:revive // expected
func Update(ctx context.Context, db Common, tableName string, dest interface{}, whereStruct interface{}, options ...UpdateOption) (result sql.Result, err error) {
	var (
		whereClause, setClause         string
		whereClauseArgs, setClauseArgs []interface{}
		cfg                            = newUpdateConfig(options...)
	)

	buildSetClause := func(columnName string, columnValue interface{}) {
		if setClause == "" {
			setClause += fmt.Sprintf("SET %s = ?", columnName)
		} else {
			setClause += fmt.Sprintf(", %s = ?", columnName)
		}

		setClauseArgs = append(setClauseArgs, columnValue)
	}

	var structIteratee func(key string, value interface{}, tag reflect.StructTag) error
	structIteratee = func(key string, value interface{}, tag reflect.StructTag) error {
		columnName, columnValue := tag.Get("db"), value
		isModel := key == reflect.TypeOf(Model{}).Name()
		if columnName == "" {
			columnName = qb.ColumnName(key)
		}

		if cfg.excludeColumns[columnName] {
			return nil
		}

		if isModel && reflect.TypeOf(value).Kind() == reflect.Struct {
			return utils.ForInStruct(columnValue, structIteratee)
		}

		buildSetClause(columnName, columnValue)

		return nil
	}

	elemKind := reflect.Indirect(reflect.ValueOf(dest)).Kind()
	switch elemKind {
	case reflect.Struct:
		err = utils.ForInStruct(dest, structIteratee)
	case reflect.Map:
		err = utils.ForIn(dest, func(key interface{}, value interface{}) error {
			columnName, columnValue := qb.ColumnName(key.(string)), value
			if cfg.excludeColumns[columnName] {
				return nil
			}
			buildSetClause(columnName, columnValue)
			return nil
		})
	default:
		err = ErrInvalidTypeUpdateDest
	}

	if err != nil {
		return result, err
	}

	whereClause, whereClauseArgs, err = qb.NewWhereClause(whereStruct)
	if err != nil {
		if errors.Is(err, qb.ErrStmtNil) {
			err = ErrWhereStructNil
		}

		return result, err
	}

	query := fmt.Sprintf("UPDATE %s %s %s", tableName, setClause, whereClause)
	args := append(setClauseArgs, whereClauseArgs...)
	query, args, err = sqlx.In(query, args...)
	if err != nil {
		return result, err
	}

	return db.ExecContext(ctx, db.Rebind(query), args...)
}

func Delete(ctx context.Context, db Common, tableName string, whereStruct interface{}) (sql.Result, error) {
	dest := struct {
		DeletedAt time.Time
	}{
		DeletedAt: time.Now(),
	}

	return Update(ctx, db, tableName, dest, whereStruct)
}

func HardDelete(ctx context.Context, db Common, tableName string, whereStruct interface{}) (result sql.Result, err error) {
	var (
		whereClause     string
		whereClauseArgs []interface{}
	)

	whereClause, whereClauseArgs, err = qb.NewWhereClause(whereStruct)
	if err != nil {
		if errors.Is(err, qb.ErrStmtNil) {
			err = ErrWhereStructNil
		}

		return
	}

	query := fmt.Sprintf("DELETE FROM %s %s", tableName, whereClause)

	query, whereClauseArgs, err = sqlx.In(query, whereClauseArgs...)
	if err != nil {
		return
	}

	return db.ExecContext(ctx, db.Rebind(query), whereClauseArgs...)
}

func buildInsertQuery(tableName string, columnNames []string, columnValues [][]interface{}) (string, []interface{}) {
	var insertClause, valueClause string

	for _, columnName := range columnNames {
		if insertClause == "" {
			insertClause += fmt.Sprintf("INSERT INTO %s (%s", tableName, columnName)
		} else {
			insertClause += fmt.Sprintf(",%s", columnName)
		}

		if valueClause == "" {
			valueClause += "(?"
		} else {
			valueClause += ",?"
		}
	}

	insertClause += ")"
	valueClause += ")"

	valueClauses := make([]string, 0)
	valueClauseArgs := make([]interface{}, 0)
	for _, columnValue := range columnValues {
		for _, v := range columnValue {
			valueClauseArgs = append(valueClauseArgs, v)
		}

		valueClauses = append(valueClauses, valueClause)
	}

	query := fmt.Sprintf("%s VALUES %s", insertClause, strings.Join(valueClauses, ","))

	return query, valueClauseArgs
}
