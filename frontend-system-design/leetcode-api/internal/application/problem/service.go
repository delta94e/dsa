// Package problem contains the Problem application service.
package problem

import (
	"context"

	domain "leetcode-api/internal/domain/problem"
)

// Service provides problem-related use cases
type Service struct {
	repo domain.Repository
}

// NewService creates a new Problem service
func NewService(repo domain.Repository) *Service {
	return &Service{repo: repo}
}

// ListProblems returns paginated problems with optional filtering
func (s *Service) ListProblems(ctx context.Context, opts domain.FindOptions) ([]domain.Problem, int64, error) {
	return s.repo.FindAll(ctx, opts)
}

// GetProblem returns a problem by slug with visible test cases only
func (s *Service) GetProblem(ctx context.Context, slug string) (*domain.Problem, error) {
	problem, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	// Filter to visible test cases only
	problem.TestCases = problem.VisibleTestCases()
	return problem, nil
}

// GetProblemWithAllTests returns a problem with all test cases (for submission)
func (s *Service) GetProblemWithAllTests(ctx context.Context, id uint) (*domain.Problem, error) {
	return s.repo.FindByID(ctx, id)
}

// GetTopics returns all available topics
func (s *Service) GetTopics(ctx context.Context) ([]domain.Topic, error) {
	return s.repo.GetTopics(ctx)
}
