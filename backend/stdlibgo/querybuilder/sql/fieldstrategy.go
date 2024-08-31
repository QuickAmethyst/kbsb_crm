package sql

import (
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

var (
	// https://github.com/golang/lint/blob/master/lint.go#L770
	commonInitialisms         = []string{"API", "ASCII", "CPU", "CSS", "DNS", "EOF", "GUID", "HTML", "HTTP", "HTTPS", "ID", "IP", "JSON", "LHS", "QPS", "RAM", "RHS", "RPC", "SLA", "SMTP", "SSH", "TLS", "TTL", "UID", "UI", "UUID", "URI", "URL", "UTF8", "VM", "XML", "XSRF", "XSS"}
	commonInitialismsReplacer *strings.Replacer
	statementSuffixes         = []string{"_not_eq", "_like", "_gte", "_lte", "_not_in", "_in", "_is_null"}
)

func init() {
	commonInitialismsForReplacer := make([]string, 0, len(commonInitialisms))
	for _, initialism := range commonInitialisms {
		commonInitialismsForReplacer = append(
			commonInitialismsForReplacer,
			initialism,
			cases.Title(language.Und, cases.NoLower).String(initialism),
		)
	}

	commonInitialismsReplacer = strings.NewReplacer(commonInitialismsForReplacer...)
}

type FieldStrategy struct {
	fieldName, columnName string
}

func NewFieldStrategy(fieldName string, defaultColumnName string) FieldStrategy {
	return FieldStrategy{
		fieldName:  fieldName,
		columnName: defaultColumnName,
	}
}

func (f FieldStrategy) IsEqualStatement() bool {
	return !f.IsNotEqualStatement() &&
		!f.IsLikeStatement() &&
		!f.IsGreaterThanEqualStatement() &&
		!f.IsLessThanEqualStatement() &&
		!f.IsInStatement() &&
		!f.IsNotInStatement() &&
		!f.IsNull() &&
		!f.IsIncludeDeleted()
}

func (f FieldStrategy) IsNotEqualStatement() bool {
	return strings.HasSuffix(f.fieldName, "NotEQ")
}

func (f FieldStrategy) IsLikeStatement() bool {
	return strings.HasSuffix(f.fieldName, "Like")
}

func (f FieldStrategy) IsGreaterThanEqualStatement() bool {
	return strings.HasSuffix(f.fieldName, "GTE")
}

func (f FieldStrategy) IsLessThanEqualStatement() bool {
	return strings.HasSuffix(f.fieldName, "LTE")
}

func (f FieldStrategy) IsInStatement() bool {
	return strings.HasSuffix(f.fieldName, "IN") && !f.IsNotInStatement()
}

func (f FieldStrategy) IsNotInStatement() bool {
	return strings.HasSuffix(f.fieldName, "NotIN")
}

func (f FieldStrategy) IsNull() bool {
	return strings.HasSuffix(f.fieldName, "IsNULL")
}

func (f FieldStrategy) IsIncludeDeleted() bool {
	return f.fieldName == "IncludeDeleted"
}

func (f FieldStrategy) ColumnName() string {
	if f.columnName != "" {
		return f.columnName
	}

	ret := ColumnName(f.fieldName)
	for _, statementSuffix := range statementSuffixes {
		ret = strings.TrimSuffix(ret, statementSuffix)
	}

	f.columnName = ret

	return ret
}
