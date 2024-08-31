package sql

import (
	"errors"
	"fmt"
	"testing"

	"github.com/bsm/gomega"
)

func TestCondition(t *testing.T) {
	g := gomega.NewWithT(t)

	type returnVal struct {
		whereClause string
		args        []interface{}
		err         error
	}

	tests := []struct {
		input interface{}
		exp   returnVal
	}{
		{
			input: struct{}{},
			exp:   returnVal{"", nil, nil},
		},
		{
			input: struct{ Foo int }{1},
			exp:   returnVal{"WHERE foo = ?", []interface{}{1}, nil},
		},
		{
			input: struct{ Foo string }{"Bar"},
			exp:   returnVal{"WHERE foo = ?", []interface{}{"Bar"}, nil},
		},
		{
			input: struct{ FooLike string }{"Bar"},
			exp:   returnVal{"WHERE foo ILIKE ?", []interface{}{"Bar"}, nil},
		},
		{
			input: struct{ FooGTE string }{"Bar"},
			exp:   returnVal{"", nil, errors.New("statement FooGTE value must be a number or date")},
		},
		{
			input: struct{ FooGTE int }{1},
			exp:   returnVal{"WHERE foo >= ?", []interface{}{1}, nil},
		},
		{
			input: struct{ FooLTE string }{"Bar"},
			exp:   returnVal{"", nil, errors.New("statement FooLTE value must be a number or date")},
		},
		{
			input: struct{ FooLTE int }{1},
			exp:   returnVal{"WHERE foo <= ?", []interface{}{1}, nil},
		},
		{
			input: struct{ FooNotIN int }{1},
			exp:   returnVal{"WHERE foo NOT IN (?)", []interface{}{1}, nil},
		},
		{
			input: struct{ FooNotIN []string }{[]string{"foo", "bar"}},
			exp:   returnVal{"WHERE foo NOT IN (?)", []interface{}{[]string{"foo", "bar"}}, nil},
		},
		{
			input: struct{ FooIN []string }{[]string{"foo", "bar"}},
			exp:   returnVal{"WHERE foo IN (?)", []interface{}{[]string{"foo", "bar"}}, nil},
		},
		{
			input: struct{ FooIN []string }{nil},
			exp:   returnVal{"", nil, nil},
		},
		{
			input: struct {
				Foo    string
				BarGTE int
			}{"foo", 1},
			exp: returnVal{"WHERE foo = ? AND bar >= ?", []interface{}{"foo", 1}, nil},
		},
		{
			input: struct {
				FooIsNULL bool
			}{true},
			exp: returnVal{"WHERE foo IS NULL", nil, nil},
		},
		{
			input: struct {
				FooIsNULL bool
			}{false},
			exp: returnVal{"", nil, nil},
		},
		{
			input: struct {
				IncludeDeleted bool
			}{false},
			exp: returnVal{"WHERE deleted_at IS NULL", nil, nil},
		},
		{
			input: struct {
				Foo            string
				IncludeDeleted bool
			}{"", true},
			exp: returnVal{"", nil, nil},
		},
	}

	for _, tt := range tests {
		testname := fmt.Sprintf("%+v", tt.input)
		t.Run(testname, func(t *testing.T) {
			a, b, err := NewWhereClause(tt.input)
			g.Expect(returnVal{a, b, err}).To(gomega.Equal(tt.exp))
		})
	}
}
