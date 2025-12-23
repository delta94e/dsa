// Package submission contains the Submission repository interface.
package submission

import "context"

// Repository defines the interface for submission data access
type Repository interface {
	// FindByID returns a submission by its ID
	FindByID(ctx context.Context, id string) (*Submission, error)

	// Create creates a new submission
	Create(ctx context.Context, submission *Submission) error

	// Update updates an existing submission
	Update(ctx context.Context, submission *Submission) error
}
