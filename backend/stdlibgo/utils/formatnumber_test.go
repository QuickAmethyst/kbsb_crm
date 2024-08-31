package utils

import (
	"fmt"
	"testing"

	"github.com/bsm/gomega"
)

func TestFormatNumber(t *testing.T) {
	g := gomega.NewWithT(t)

	testCases := [][]interface{}{
		{float64(123), 0, "", "123"},
		{123.0, 0, "", "123"},
		{123.12, 0, "", "123"},
		{123.123123, 0, "", "123"},
		{123123.123123, 6, ",", "123,123.123123"},
		{123123.123123, 6, ".", "123.123,123123"},
		{123123.123123, 2, ".", "123.123,12"},
		{123123.123123, 5, ".", "123.123,12312"},
		{float64(123), 2, "", "123.00"},
		{float64(123), 0, ".", "123"},
		{float64(123123), 0, ".", "123.123"},
		{float64(123123), 0, ",", "123,123"},
		{123123.12, 2, ".", "123.123,12"},
		{123123.0, 2, ",", "123,123.00"},
		{123123123.0, 2, ".", "123.123.123,00"},
		{-123123123.0, 2, ".", "-123.123.123,00"},
		{123123.12, 6, ",", "123,123.120000"},
		{-123123.12, 6, ",", "-123,123.120000"},
		{-123123.12, 2, ",", "-123,123.12"},
		{-123123.12, 1, ",", "-123,123.1"},
		{float64(0), 0, "", "0"},
		{float64(10000000), 2, ",", "10,000,000.00"},
	}

	for i, testCase := range testCases {
		val, decimal, delimiter := testCase[0].(float64), testCase[1].(int), testCase[2].(string)
		expected := testCase[3].(string)

		t.Run(fmt.Sprintf("Test %d: val `%f`, decimal `%d`, delimiter `%s`", i, val, decimal, delimiter), func(t *testing.T) {
			actual := FormatNumber(val, decimal, delimiter)
			g.Expect(actual).To(gomega.Equal(expected))
		})
	}
}
