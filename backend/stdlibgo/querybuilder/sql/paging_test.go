package sql

import (
	"fmt"
	"testing"

	"github.com/bsm/gomega"
)

func TestPaging(t *testing.T) {
	g := gomega.NewWithT(t)

	type expected struct {
		args     []interface{}
		lastPage uint
	}

	tests := []struct {
		input Paging
		exp   expected
	}{
		{
			input: Paging{1, 10, 100},
			exp:   expected{[]interface{}{uint(10), uint(0)}, 10},
		},
		{
			input: Paging{3, 10, 100},
			exp:   expected{[]interface{}{uint(10), uint(20)}, 10},
		},
		{
			input: Paging{1, 3, 100},
			exp:   expected{[]interface{}{uint(3), uint(0)}, 34},
		},
		{
			input: Paging{6, 3, 100},
			exp:   expected{[]interface{}{uint(3), uint(15)}, 34},
		},
	}

	t.Run("Test NewPaging", func(t *testing.T) {
		p := NewPaging(10)
		g.Expect(p).To(gomega.Equal(&Paging{1, 12, 10}))
	})

	t.Run("Test Normalize", func(t *testing.T) {
		p := Paging{}
		p.Normalize()
		g.Expect(p).To(gomega.Equal(Paging{1, 12, 0}))
	})

	for _, tt := range tests {
		testname := fmt.Sprintf("%+v", tt.input)
		t.Run(testname, func(t *testing.T) {
			limitClause, limitClauseArgs := tt.input.BuildQuery()
			g.Expect(limitClause).To(gomega.Equal("LIMIT ? OFFSET ?"))
			g.Expect(expected{limitClauseArgs, tt.input.LastPage()}).To(gomega.Equal(tt.exp))
		})
	}
}
