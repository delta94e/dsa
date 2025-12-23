// Package problem contains the Problem domain entity and related types.
package problem

import (
	"time"
)

// Difficulty represents problem difficulty level
type Difficulty string

const (
	Easy   Difficulty = "Easy"
	Medium Difficulty = "Medium"
	Hard   Difficulty = "Hard"
)

// Category represents problem category
type Category string

const (
	CategoryAlgorithms  Category = "algorithms"
	CategoryDatabase    Category = "database"
	CategoryShell       Category = "shell"
	CategoryConcurrency Category = "concurrency"
	CategoryJavaScript  Category = "javascript"
)

// Topic represents a problem topic/tag
type Topic struct {
	ID    uint
	Name  string
	Slug  string
	Count int // Number of problems with this topic
}

// Problem represents a coding challenge entity
type Problem struct {
	ID             uint
	Slug           string
	Title          string
	Difficulty     Difficulty
	Category       Category
	Description    string
	Examples       string
	Constraints    string
	StarterCode    string // JSON map of language -> code
	AcceptanceRate float64
	Submissions    int
	Accepted       int
	Topics         []Topic
	TestCases      []TestCase
	IsPremium      bool
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

// TestCase represents a test case for a problem
type TestCase struct {
	ID        uint
	ProblemID uint
	Input     string
	Expected  string
	IsHidden  bool
}

// NewProblem creates a new Problem entity
func NewProblem(slug, title string, difficulty Difficulty, category Category, description string) *Problem {
	return &Problem{
		Slug:        slug,
		Title:       title,
		Difficulty:  difficulty,
		Category:    category,
		Description: description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

// AddTestCase adds a test case to the problem
func (p *Problem) AddTestCase(input, expected string, isHidden bool) {
	p.TestCases = append(p.TestCases, TestCase{
		ProblemID: p.ID,
		Input:     input,
		Expected:  expected,
		IsHidden:  isHidden,
	})
}

// AddTopic adds a topic to the problem
func (p *Problem) AddTopic(topic Topic) {
	p.Topics = append(p.Topics, topic)
}

// VisibleTestCases returns only non-hidden test cases
func (p *Problem) VisibleTestCases() []TestCase {
	var visible []TestCase
	for _, tc := range p.TestCases {
		if !tc.IsHidden {
			visible = append(visible, tc)
		}
	}
	return visible
}

// CalculateAcceptanceRate computes acceptance rate
func (p *Problem) CalculateAcceptanceRate() float64 {
	if p.Submissions == 0 {
		return 0
	}
	return float64(p.Accepted) / float64(p.Submissions) * 100
}
