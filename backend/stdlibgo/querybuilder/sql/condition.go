package sql

import (
	"fmt"
	"reflect"
	"strings"
	"time"
)

type Condition struct {
	stmt interface{}
	cfg  *config
}

func (c *Condition) BuildQuery() (query string, args []interface{}, err error) {
	strct := reflect.ValueOf(c.stmt)
	if strct.Kind() == reflect.Pointer && strct.IsNil() {
		err = ErrStmtNil
		return query, args, err
	}

	typeOfT := reflect.Indirect(strct).Type()
	for i := 0; i < reflect.Indirect(strct).NumField(); i++ {
		var (
			scopeQuery string
			scopeArg   interface{}
			skipArg    bool
		)

		isIgnore := typeOfT.Field(i).Tag.Get("qb") == "-"
		if isIgnore {
			continue
		}

		fieldValue := reflect.Indirect(strct).Field(i).Interface()
		isValueEmpty := reflect.ValueOf(fieldValue).IsZero()
		fieldStrategy := NewFieldStrategy(typeOfT.Field(i).Name, typeOfT.Field(i).Tag.Get("db"))
		softDelete := !c.cfg.hardDelete

		if isValueEmpty &&
			!(softDelete && fieldStrategy.IsIncludeDeleted()) {
			continue
		}

		scopeQuery, scopeArg, skipArg, err = c.buildScope(fieldStrategy, fieldValue)
		if err != nil {
			return query, args, err
		}

		if query != "" {
			query += "AND "
		}

		query += scopeQuery + " "

		if !skipArg {
			args = append(args, scopeArg)
		}
	}

	query = strings.Trim(query, " ")
	if query != "" {
		query = "WHERE " + query
	}

	return query, args, err
}

//nolint:funlen, gocognit, revive // expected
func (c *Condition) buildScope(field FieldStrategy, value interface{}) (query string, arg interface{}, skipArg bool, err error) {
	arg = value

	if field.IsNotEqualStatement() {
		query += fmt.Sprintf("%s != ?", field.ColumnName())
		return query, arg, skipArg, err
	}

	if field.IsLikeStatement() {
		query += fmt.Sprintf("%s ILIKE ?", field.ColumnName())
		return query, arg, skipArg, err
	}

	if field.IsGreaterThanEqualStatement() || field.IsLessThanEqualStatement() {
		symbol := ">="
		if field.IsLessThanEqualStatement() {
			symbol = "<="
		}

		switch arg.(type) {
		default:
			err = fmt.Errorf("statement %s value must be a number or date", field)
			return query, arg, skipArg, err
		case int, int8, int32, int64, uint, uint8, uint32, uint64, float32, float64, time.Time:
			query += fmt.Sprintf("%s %s ?", field.ColumnName(), symbol)
			return query, arg, skipArg, err
		}
	}

	if field.IsInStatement() || field.IsNotInStatement() {
		if field.IsNotInStatement() {
			query += fmt.Sprintf("%s NOT IN (?)", field.ColumnName())
		} else if field.IsInStatement() {
			query += fmt.Sprintf("%s IN (?)", field.ColumnName())
		}

		return query, arg, skipArg, err
	}

	if field.IsNull() {
		switch value.(type) {
		default:
			err = fmt.Errorf("statement %s value must be a boolean", field)
			return query, arg, skipArg, err
		case bool:
			if value == true {
				skipArg = true
				query += fmt.Sprintf("%s IS NULL", field.ColumnName())
			}

			return query, arg, skipArg, err
		}
	}

	if field.IsIncludeDeleted() {
		switch value.(type) {
		default:
			err = fmt.Errorf("statement %s value must be a boolean", field)
			return query, arg, skipArg, err
		case bool:
			skipArg = true

			if value == false {
				query += "deleted_at IS NULL"
			}

			return query, arg, skipArg, err
		}
	}

	query += fmt.Sprintf("%s = ?", field.ColumnName())

	return query, arg, skipArg, err
}
