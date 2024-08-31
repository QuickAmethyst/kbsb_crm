package utils

import "regexp"

func ValidateEmail(email string) bool {
	// Regular expression pattern for validating email addresses
	emailPattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	// Compile the regular expression pattern
	regex := regexp.MustCompile(emailPattern)

	// Check if the email address matches the pattern
	return regex.MatchString(email)
}
