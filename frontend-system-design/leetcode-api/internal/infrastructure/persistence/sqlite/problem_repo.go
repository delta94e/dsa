// Package sqlite provides SQLite implementations of domain repositories.
package sqlite

import (
	"context"
	"strings"

	"gorm.io/gorm"

	domain "leetcode-api/internal/domain/problem"
)

// ProblemModel is the GORM model for problems
type ProblemModel struct {
	gorm.Model
	Slug           string `gorm:"uniqueIndex"`
	Title          string
	Difficulty     string
	Category       string
	Description    string
	Examples       string
	Constraints    string
	StarterCode    string
	AcceptanceRate float64
	Submissions    int
	Accepted       int
	IsPremium      bool
	TestCases      []TestCaseModel `gorm:"foreignKey:ProblemID"`
	Topics         []TopicModel    `gorm:"many2many:problem_topics;"`
}

// TableName returns the table name
func (ProblemModel) TableName() string { return "problems" }

// TestCaseModel is the GORM model for test cases
type TestCaseModel struct {
	gorm.Model
	ProblemID uint
	Input     string
	Expected  string
	IsHidden  bool
}

// TableName returns the table name
func (TestCaseModel) TableName() string { return "test_cases" }

// TopicModel is the GORM model for topics
type TopicModel struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`
	Slug string `gorm:"uniqueIndex"`
}

// TableName returns the table name
func (TopicModel) TableName() string { return "topics" }

// ProblemRepository implements domain.Repository using SQLite
type ProblemRepository struct {
	db *gorm.DB
}

// NewProblemRepository creates a new ProblemRepository
func NewProblemRepository(db *gorm.DB) *ProblemRepository {
	return &ProblemRepository{db: db}
}

// FindAll returns all problems with optional filtering
func (r *ProblemRepository) FindAll(ctx context.Context, opts domain.FindOptions) ([]domain.Problem, int64, error) {
	var models []ProblemModel
	var total int64

	query := r.db.WithContext(ctx).Model(&ProblemModel{})

	// Apply filters
	if opts.Difficulty != "" {
		query = query.Where("difficulty = ?", opts.Difficulty)
	}
	if opts.Category != "" {
		query = query.Where("category = ?", opts.Category)
	}
	if opts.Search != "" {
		search := "%" + strings.ToLower(opts.Search) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(slug) LIKE ?", search, search)
	}
	if opts.TopicSlug != "" {
		query = query.Joins("JOIN problem_topics ON problem_topics.problem_model_id = problems.id").
			Joins("JOIN topics ON topics.id = problem_topics.topic_model_id").
			Where("topics.slug = ?", opts.TopicSlug)
	}

	query.Count(&total)

	offset := (opts.Page - 1) * opts.Limit
	if err := query.
		Preload("Topics").
		Select("problems.id, problems.slug, problems.title, problems.difficulty, problems.category, problems.acceptance_rate, problems.submissions, problems.accepted, problems.is_premium, problems.created_at").
		Order("problems.id ASC").
		Offset(offset).
		Limit(opts.Limit).
		Find(&models).Error; err != nil {
		return nil, 0, err
	}

	problems := make([]domain.Problem, len(models))
	for i, m := range models {
		problems[i] = toDomainProblem(m)
	}

	return problems, total, nil
}

// FindBySlug returns a problem by slug with test cases
func (r *ProblemRepository) FindBySlug(ctx context.Context, slug string) (*domain.Problem, error) {
	var model ProblemModel
	if err := r.db.WithContext(ctx).
		Preload("TestCases").
		Preload("Topics").
		Where("slug = ?", slug).
		First(&model).Error; err != nil {
		return nil, err
	}

	problem := toDomainProblem(model)
	return &problem, nil
}

// FindByID returns a problem by ID with all test cases
func (r *ProblemRepository) FindByID(ctx context.Context, id uint) (*domain.Problem, error) {
	var model ProblemModel
	if err := r.db.WithContext(ctx).
		Preload("TestCases").
		Preload("Topics").
		First(&model, id).Error; err != nil {
		return nil, err
	}

	problem := toDomainProblem(model)
	return &problem, nil
}

// Create creates a new problem
func (r *ProblemRepository) Create(ctx context.Context, problem *domain.Problem) error {
	model := toModelProblem(*problem)
	if err := r.db.WithContext(ctx).Create(&model).Error; err != nil {
		return err
	}
	problem.ID = model.ID
	return nil
}

// Update updates an existing problem
func (r *ProblemRepository) Update(ctx context.Context, problem *domain.Problem) error {
	model := toModelProblem(*problem)
	return r.db.WithContext(ctx).Save(&model).Error
}

// Delete deletes a problem by ID
func (r *ProblemRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&ProblemModel{}, id).Error
}

// GetTopics returns all topics with problem counts
func (r *ProblemRepository) GetTopics(ctx context.Context) ([]domain.Topic, error) {
	var results []struct {
		ID    uint
		Name  string
		Slug  string
		Count int
	}

	err := r.db.WithContext(ctx).
		Table("topics").
		Select("topics.id, topics.name, topics.slug, COUNT(problem_topics.problem_model_id) as count").
		Joins("LEFT JOIN problem_topics ON problem_topics.topic_model_id = topics.id").
		Group("topics.id").
		Order("count DESC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	topics := make([]domain.Topic, len(results))
	for i, r := range results {
		topics[i] = domain.Topic{
			ID:    r.ID,
			Name:  r.Name,
			Slug:  r.Slug,
			Count: r.Count,
		}
	}

	return topics, nil
}

// --- Mappers ---

func toDomainProblem(m ProblemModel) domain.Problem {
	testCases := make([]domain.TestCase, len(m.TestCases))
	for i, tc := range m.TestCases {
		testCases[i] = domain.TestCase{
			ID:        tc.ID,
			ProblemID: tc.ProblemID,
			Input:     tc.Input,
			Expected:  tc.Expected,
			IsHidden:  tc.IsHidden,
		}
	}

	topics := make([]domain.Topic, len(m.Topics))
	for i, t := range m.Topics {
		topics[i] = domain.Topic{
			ID:   t.ID,
			Name: t.Name,
			Slug: t.Slug,
		}
	}

	return domain.Problem{
		ID:             m.ID,
		Slug:           m.Slug,
		Title:          m.Title,
		Difficulty:     domain.Difficulty(m.Difficulty),
		Category:       domain.Category(m.Category),
		Description:    m.Description,
		Examples:       m.Examples,
		Constraints:    m.Constraints,
		StarterCode:    m.StarterCode,
		AcceptanceRate: m.AcceptanceRate,
		Submissions:    m.Submissions,
		Accepted:       m.Accepted,
		IsPremium:      m.IsPremium,
		Topics:         topics,
		TestCases:      testCases,
		CreatedAt:      m.CreatedAt,
		UpdatedAt:      m.UpdatedAt,
	}
}

func toModelProblem(p domain.Problem) ProblemModel {
	testCases := make([]TestCaseModel, len(p.TestCases))
	for i, tc := range p.TestCases {
		testCases[i] = TestCaseModel{
			ProblemID: p.ID,
			Input:     tc.Input,
			Expected:  tc.Expected,
			IsHidden:  tc.IsHidden,
		}
	}

	topics := make([]TopicModel, len(p.Topics))
	for i, t := range p.Topics {
		topics[i] = TopicModel{
			Model: gorm.Model{ID: t.ID},
			Name:  t.Name,
			Slug:  t.Slug,
		}
	}

	return ProblemModel{
		Model:          gorm.Model{ID: p.ID},
		Slug:           p.Slug,
		Title:          p.Title,
		Difficulty:     string(p.Difficulty),
		Category:       string(p.Category),
		Description:    p.Description,
		Examples:       p.Examples,
		Constraints:    p.Constraints,
		StarterCode:    p.StarterCode,
		AcceptanceRate: p.AcceptanceRate,
		Submissions:    p.Submissions,
		Accepted:       p.Accepted,
		IsPremium:      p.IsPremium,
		TestCases:      testCases,
		Topics:         topics,
	}
}
