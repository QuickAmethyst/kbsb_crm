package sql

func NewWhereClause(stmt interface{}, options ...Option) (whereClause string, args []interface{}, err error) {
	condition := Condition{stmt, newConfig(options...)}
	whereClause, args, err = condition.BuildQuery()
	return
}
