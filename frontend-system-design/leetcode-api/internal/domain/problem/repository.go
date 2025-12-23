// Package problem contains the Problem repository interface.
package problem

import "context"

// Repository defines the interface for problem data access
type Repository interface {
	// FindAll returns all problems with optional filtering
	FindAll(ctx context.Context, opts FindOptions) ([]Problem, int64, error)

	// FindBySlug returns a problem by its slug
	FindBySlug(ctx context.Context, slug string) (*Problem, error)

	// FindByID returns a problem by its ID
	FindByID(ctx context.Context, id uint) (*Problem, error)

	// Create creates a new problem
	Create(ctx context.Context, problem *Problem) error

	// Update updates an existing problem
	Update(ctx context.Context, problem *Problem) error

	// Delete deletes a problem by ID
	Delete(ctx context.Context, id uint) error

	// GetTopics returns all available topics with problem counts
	GetTopics(ctx context.Context) ([]Topic, error)
}

// FindOptions represents query options for finding problems
type FindOptions struct {
	Page       int
	Limit      int
	Difficulty Difficulty
	Category   Category
	TopicSlug  string
	Search     string
}

// DefaultFindOptions returns default find options
func DefaultFindOptions() FindOptions {
	return FindOptions{
		Page:  1,
		Limit: 50,
	}
}
