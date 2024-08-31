package sql

import (
	"testing"

	"github.com/bsm/gomega"
)

func TestColumnName(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected string
	}{
		{"Foo", "foo"},
		{"FooBar", "foo_bar"},
		{"ID", "id"},
		{"FooID", "foo_id"},
		{"FooIDBar", "foo_id_bar"},
		{"IDFoo", "id_foo"},
		{"FooiD", "fooi_d"},
		{"FooNotEQ", "foo"},
		{"FooLike", "foo"},
		{"FooGTE", "foo"},
		{"FooLTE", "foo"},
		{"FooNotIN", "foo"},
		{"FooIN", "foo"},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.ColumnName()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsEqualStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", true},
		{"FooNotEQ", false},
		{"FooLike", false},
		{"FooGTE", false},
		{"FooLTE", false},
		{"FooNotIN", false},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsEqualStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsNotEqualStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", true},
		{"FooLike", false},
		{"FooGTE", false},
		{"FooLTE", false},
		{"FooNotIN", false},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsNotEqualStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsLikeStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", false},
		{"FooLike", true},
		{"FooGTE", false},
		{"FooLTE", false},
		{"FooNotIN", false},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsLikeStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsGreaterThanEqualStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", false},
		{"FooLike", false},
		{"FooGTE", true},
		{"FooLTE", false},
		{"FooNotIN", false},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsGreaterThanEqualStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsLessThanEqualStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", false},
		{"FooLike", false},
		{"FooGTE", false},
		{"FooLTE", true},
		{"FooNotIN", false},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsLessThanEqualStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsInStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", false},
		{"FooLike", false},
		{"FooGTE", false},
		{"FooLTE", false},
		{"FooNotIN", false},
		{"FooIN", true},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsInStatement()).To(gomega.Equal(tt.expected))
		})
	}
}

func TestIsNotInStatement(t *testing.T) {
	g := gomega.NewWithT(t)

	tests := []struct {
		input    string
		expected bool
	}{
		{"Foo", false},
		{"FooNotEQ", false},
		{"FooLike", false},
		{"FooGTE", false},
		{"FooLTE", false},
		{"FooNotIN", true},
		{"FooIN", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			f := NewFieldStrategy(tt.input, "")
			g.Expect(f.IsNotInStatement()).To(gomega.Equal(tt.expected))
		})
	}
}
