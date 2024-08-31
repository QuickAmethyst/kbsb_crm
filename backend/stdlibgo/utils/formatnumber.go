package utils

import (
	"math"
	"strconv"
	"strings"
)

func FormatNumber(val float64, decimal int, delimiter string) string {
	var res string

	number := val
	decimalDelimiter := "."
	if delimiter == "." {
		decimalDelimiter = ","
	}

	if decimal >= 0 {
		number = math.Round(number*math.Pow10(decimal)) / math.Pow10(decimal)
	}

	numberStr := strconv.FormatFloat(number, 'f', -1, 64)
	numberStr = strings.ReplaceAll(numberStr, ".", decimalDelimiter)
	numberSections := strings.Split(numberStr, decimalDelimiter)

	if numberSections[0][0] == '-' {
		numberSections[0] = numberSections[0][1:]
	}

	for i := len(numberSections[0]) - 1; i >= 0; i-- {
		if (len(numberSections[0])-i)%3 == 0 && i != 0 {
			res = delimiter + string(numberSections[0][i]) + res
		} else {
			res = string(numberSections[0][i]) + res
		}
	}

	numberSections[0] = res

	if decimal > 0 {
		if len(numberSections) == 1 {
			numberSections = append(numberSections, "")
		}

		var decimalZeroes string
		for i := 0; i < decimal-len(numberSections[1]); i++ {
			decimalZeroes += "0"
		}

		numberSections[1] += decimalZeroes
	}

	if val < 0 {
		numberSections[0] = "-" + numberSections[0]
	}

	return strings.Join(numberSections, decimalDelimiter)
}
