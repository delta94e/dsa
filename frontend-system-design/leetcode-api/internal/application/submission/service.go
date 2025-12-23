// Package submission contains the Submission application service.
package submission

import (
	"context"

	"github.com/google/uuid"

	problemDomain "leetcode-api/internal/domain/problem"
	domain "leetcode-api/internal/domain/submission"
)

// CodeExecutor interface for running code
type CodeExecutor interface {
	Execute(language, code string, testCases []problemDomain.TestCase) []domain.TestResult
}

// Service provides submission-related use cases
type Service struct {
	submissionRepo domain.Repository
	problemRepo    problemDomain.Repository
	executor       CodeExecutor
}

// NewService creates a new Submission service
func NewService(
	submissionRepo domain.Repository,
	problemRepo problemDomain.Repository,
	executor CodeExecutor,
) *Service {
	return &Service{
		submissionRepo: submissionRepo,
		problemRepo:    problemRepo,
		executor:       executor,
	}
}

// RunCode runs code against example (visible) test cases
func (s *Service) RunCode(ctx context.Context, problemID uint, language, code string) (*domain.Submission, error) {
	// Get problem with visible test cases only
	problem, err := s.problemRepo.FindByID(ctx, problemID)
	if err != nil {
		return nil, err
	}

	visibleTests := problem.VisibleTestCases()

	// Create submission
	submission := domain.NewSubmission(uuid.New().String(), problemID, language, code)

	// Execute code
	results := s.executor.Execute(language, code, visibleTests)
	submission.SetResults(results)

	// Save submission
	if err := s.submissionRepo.Create(ctx, submission); err != nil {
		return nil, err
	}

	return submission, nil
}

// SubmitCode runs code against all test cases (including hidden)
func (s *Service) SubmitCode(ctx context.Context, problemID uint, language, code string) (*domain.Submission, error) {
	// Get problem with ALL test cases
	problem, err := s.problemRepo.FindByID(ctx, problemID)
	if err != nil {
		return nil, err
	}

	// Create submission
	submission := domain.NewSubmission(uuid.New().String(), problemID, language, code)

	// Execute code against all tests
	results := s.executor.Execute(language, code, problem.TestCases)
	submission.SetResults(results)

	// Save submission
	if err := s.submissionRepo.Create(ctx, submission); err != nil {
		return nil, err
	}

	return submission, nil
}

// GetSubmission returns a submission by ID
func (s *Service) GetSubmission(ctx context.Context, id string) (*domain.Submission, error) {
	return s.submissionRepo.FindByID(ctx, id)
}
