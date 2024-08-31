package sql

import (
	"fmt"
	qb "github.com/QuickAmethyst/kbsb_crm/stdlibgo/querybuilder/sql"
	"reflect"
)

func buildFirstQuery(tableName string, dest interface{}, whereStruct interface{}) (query string, args []interface{}, err error) {
	selectClause, fromClause, whereClause, args, err := buildSelectQuery(tableName, dest, whereStruct)
	if err != nil {
		return "", nil, err
	}

	return fmt.Sprintf("%s %s %s LIMIT 1", selectClause, fromClause, whereClause), args, nil
}

func buildListQuery(tableName string, dest interface{}, whereStruct interface{}, p *qb.Paging) (query string, args []interface{}, countQuery string, countArgs []interface{}, err error) {
	selectClause, fromClause, whereClause, args, err := buildSelectQuery(tableName, dest, whereStruct)
	if err != nil {
		return "", nil, "", nil, err
	}

	countQuery = fmt.Sprintf("SELECT COUNT(*) %s %s", fromClause, whereClause)
	limitClause, limitClauseArgs := p.BuildQuery()
	q := fmt.Sprintf("%s %s %s %s", selectClause, fromClause, whereClause, limitClause)

	return q, append(args, limitClauseArgs...), countQuery, args, nil
}

func buildSelectQuery(tableName string, dest interface{}, whereStruct interface{}) (selectClause string, fromClause string, whereClause string, args []interface{}, err error) {
	var (
		modelName    = reflect.TypeOf(Model{}).Name()
		destElemType = reflect.TypeOf(dest).Elem()
	)

	if destElemType.Kind() == reflect.Slice {
		destElemType = destElemType.Elem()
	}

	selectClause = "SELECT "

	var buildSelectClause func(t reflect.Type)
	buildSelectClause = func(t reflect.Type) {
		n := t.NumField()
		for i := 0; i < n; i++ {
			field := t.Field(i)
			k, b := field.Name, field.Type.Kind()
			if k == modelName && b == reflect.Struct {
				buildSelectClause(field.Type)
				continue
			}

			columnName := t.Field(i).Tag.Get("db")
			if columnName == "" {
				columnName = qb.ColumnName(k)
			}

			selectClause += columnName + ", "
		}
	}

	buildSelectClause(destElemType)

	selectClause = selectClause[:len(selectClause)-2]

	fromClause = "FROM " + tableName

	whereClause, whereClauseArgs, err := qb.NewWhereClause(whereStruct)
	if err != nil {
		return selectClause, fromClause, whereClause, whereClauseArgs, err
	}

	return selectClause, fromClause, whereClause, whereClauseArgs, nil
}
