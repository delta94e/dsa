// Package submission contains the Submission domain entity.
package submission

import (
	"time"
)

// Status represents submission evaluation status
type Status string

const (
	StatusPending  Status = "Pending"
	StatusRunning  Status = "Running"
	StatusAccepted Status = "Accepted"
	StatusWrong    Status = "Wrong Answer"
	StatusError    Status = "Runtime Error"
	StatusTimeout  Status = "Time Limit Exceeded"
)

// Submission represents a code submission entity
type Submission struct {
	ID        string
	ProblemID uint
	Language  string
	Code      string
	Status    Status
	Runtime   int // in milliseconds
	Memory    int // in KB
	Output    string
	Results   []TestResult
	CreatedAt time.Time
}

// TestResult represents the result of a single test case
type TestResult struct {
	Input    string
	Expected string
	Actual   string
	Passed   bool
	Runtime  int // in milliseconds
}

// NewSubmission creates a new Submission entity
func NewSubmission(id string, problemID uint, language, code string) *Submission {
	return &Submission{
		ID:        id,
		ProblemID: problemID,
		Language:  language,
		Code:      code,
		Status:    StatusPending,
		CreatedAt: time.Now(),
	}
}

// SetResults updates the submission with test results
func (s *Submission) SetResults(results []TestResult) {
	s.Results = results
	s.Status = s.calculateStatus()
	s.Runtime = s.calculateTotalRuntime()
}

// calculateStatus determines the overall status from results
func (s *Submission) calculateStatus() Status {
	for _, r := range s.Results {
		if !r.Passed {
			return StatusWrong
		}
	}
	return StatusAccepted
}

// calculateTotalRuntime sums up all test runtimes
func (s *Submission) calculateTotalRuntime() int {
	total := 0
	for _, r := range s.Results {
		total += r.Runtime
	}
	return total
}

// PassedCount returns the number of passed tests
func (s *Submission) PassedCount() int {
	count := 0
	for _, r := range s.Results {
		if r.Passed {
			count++
		}
	}
	return count
}

// TotalCount returns the total number of tests
func (s *Submission) TotalCount() int {
	return len(s.Results)
}
