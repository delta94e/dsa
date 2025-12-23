// Package sqlite provides SQLite implementations of domain repositories.
package sqlite

import (
	"context"
	"encoding/json"

	"gorm.io/gorm"

	domain "leetcode-api/internal/domain/submission"
)

// SubmissionModel is the GORM model for submissions
type SubmissionModel struct {
	ID        string `gorm:"primaryKey"`
	ProblemID uint
	Language  string
	Code      string
	Status    string
	Runtime   int
	Memory    int
	Output    string
	Results   string // JSON-encoded results
	CreatedAt int64
}

// TableName returns the table name
func (SubmissionModel) TableName() string { return "submissions" }

// SubmissionRepository implements domain.Repository using SQLite
type SubmissionRepository struct {
	db *gorm.DB
}

// NewSubmissionRepository creates a new SubmissionRepository
func NewSubmissionRepository(db *gorm.DB) *SubmissionRepository {
	return &SubmissionRepository{db: db}
}

// FindByID returns a submission by ID
func (r *SubmissionRepository) FindByID(ctx context.Context, id string) (*domain.Submission, error) {
	var model SubmissionModel
	if err := r.db.WithContext(ctx).First(&model, "id = ?", id).Error; err != nil {
		return nil, err
	}

	submission := toDomainSubmission(model)
	return &submission, nil
}

// Create creates a new submission
func (r *SubmissionRepository) Create(ctx context.Context, submission *domain.Submission) error {
	model := toModelSubmission(*submission)
	return r.db.WithContext(ctx).Create(&model).Error
}

// Update updates an existing submission
func (r *SubmissionRepository) Update(ctx context.Context, submission *domain.Submission) error {
	model := toModelSubmission(*submission)
	return r.db.WithContext(ctx).Save(&model).Error
}

// --- Mappers ---

func toDomainSubmission(m SubmissionModel) domain.Submission {
	var results []domain.TestResult
	if m.Results != "" {
		json.Unmarshal([]byte(m.Results), &results)
	}

	return domain.Submission{
		ID:        m.ID,
		ProblemID: m.ProblemID,
		Language:  m.Language,
		Code:      m.Code,
		Status:    domain.Status(m.Status),
		Runtime:   m.Runtime,
		Memory:    m.Memory,
		Output:    m.Output,
		Results:   results,
	}
}

func toModelSubmission(s domain.Submission) SubmissionModel {
	resultsJSON, _ := json.Marshal(s.Results)

	return SubmissionModel{
		ID:        s.ID,
		ProblemID: s.ProblemID,
		Language:  s.Language,
		Code:      s.Code,
		Status:    string(s.Status),
		Runtime:   s.Runtime,
		Memory:    s.Memory,
		Output:    s.Output,
		Results:   string(resultsJSON),
		CreatedAt: s.CreatedAt.Unix(),
	}
}
