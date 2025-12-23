// Package apperrors provides application-wide error types.
package apperrors

import "fmt"

// AppError represents an application error
type AppError struct {
	Code    string
	Message string
	Err     error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s - %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// Common error codes
const (
	ErrCodeNotFound     = "NOT_FOUND"
	ErrCodeValidation   = "VALIDATION"
	ErrCodeInternal     = "INTERNAL"
	ErrCodeUnauthorized = "UNAUTHORIZED"
)

// NewNotFound creates a not found error
func NewNotFound(message string) *AppError {
	return &AppError{
		Code:    ErrCodeNotFound,
		Message: message,
	}
}

// NewValidation creates a validation error
func NewValidation(message string) *AppError {
	return &AppError{
		Code:    ErrCodeValidation,
		Message: message,
	}
}

// NewInternal creates an internal error
func NewInternal(message string, err error) *AppError {
	return &AppError{
		Code:    ErrCodeInternal,
		Message: message,
		Err:     err,
	}
}
