// Package http provides HTTP handlers for problems.
package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	problemApp "leetcode-api/internal/application/problem"
	domain "leetcode-api/internal/domain/problem"
)

// ProblemHandler handles problem-related HTTP requests
type ProblemHandler struct {
	service *problemApp.Service
}

// NewProblemHandler creates a new ProblemHandler
func NewProblemHandler(service *problemApp.Service) *ProblemHandler {
	return &ProblemHandler{service: service}
}

// ProblemResponse is the API response for a problem
type ProblemResponse struct {
	ID             uint               `json:"id"`
	Slug           string             `json:"slug"`
	Title          string             `json:"title"`
	Difficulty     string             `json:"difficulty"`
	Category       string             `json:"category,omitempty"`
	AcceptanceRate float64            `json:"acceptanceRate"`
	IsPremium      bool               `json:"isPremium"`
	Description    string             `json:"description,omitempty"`
	Examples       string             `json:"examples,omitempty"`
	Constraints    string             `json:"constraints,omitempty"`
	StarterCode    string             `json:"starterCode,omitempty"`
	Topics         []TopicResponse    `json:"topics,omitempty"`
	TestCases      []TestCaseResponse `json:"testCases,omitempty"`
}

// TopicResponse is the API response for a topic
type TopicResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Count int    `json:"count,omitempty"`
}

// TestCaseResponse is the API response for a test case
type TestCaseResponse struct {
	ID       uint   `json:"id"`
	Input    string `json:"input"`
	Expected string `json:"expected"`
}

// List handles GET /api/problems
func (h *ProblemHandler) List(c *gin.Context) {
	opts := domain.DefaultFindOptions()

	if page, err := strconv.Atoi(c.DefaultQuery("page", "1")); err == nil {
		opts.Page = page
	}
	if limit, err := strconv.Atoi(c.DefaultQuery("limit", "50")); err == nil {
		opts.Limit = limit
	}
	if difficulty := c.Query("difficulty"); difficulty != "" {
		opts.Difficulty = domain.Difficulty(difficulty)
	}
	if category := c.Query("category"); category != "" {
		opts.Category = domain.Category(category)
	}
	if topic := c.Query("topic"); topic != "" {
		opts.TopicSlug = topic
	}
	if search := c.Query("search"); search != "" {
		opts.Search = search
	}

	problems, total, err := h.service.ListProblems(c.Request.Context(), opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]ProblemResponse, len(problems))
	for i, p := range problems {
		responses[i] = toProblemResponse(p, false)
	}

	c.JSON(http.StatusOK, gin.H{
		"problems": responses,
		"total":    total,
		"page":     opts.Page,
		"limit":    opts.Limit,
	})
}

// Get handles GET /api/problems/:slug
func (h *ProblemHandler) Get(c *gin.Context) {
	slug := c.Param("slug")

	problem, err := h.service.GetProblem(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Problem not found"})
		return
	}

	c.JSON(http.StatusOK, toProblemResponse(*problem, true))
}

// GetTopics handles GET /api/topics
func (h *ProblemHandler) GetTopics(c *gin.Context) {
	topics, err := h.service.GetTopics(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]TopicResponse, len(topics))
	for i, t := range topics {
		responses[i] = TopicResponse{
			ID:    t.ID,
			Name:  t.Name,
			Slug:  t.Slug,
			Count: t.Count,
		}
	}

	c.JSON(http.StatusOK, gin.H{"topics": responses})
}

// toProblemResponse converts domain to API response
func toProblemResponse(p domain.Problem, includeDetails bool) ProblemResponse {
	resp := ProblemResponse{
		ID:             p.ID,
		Slug:           p.Slug,
		Title:          p.Title,
		Difficulty:     string(p.Difficulty),
		Category:       string(p.Category),
		AcceptanceRate: p.AcceptanceRate,
		IsPremium:      p.IsPremium,
	}

	// Include topics in list view
	if len(p.Topics) > 0 {
		resp.Topics = make([]TopicResponse, len(p.Topics))
		for i, t := range p.Topics {
			resp.Topics[i] = TopicResponse{
				ID:   t.ID,
				Name: t.Name,
				Slug: t.Slug,
			}
		}
	}

	if includeDetails {
		resp.Description = p.Description
		resp.Examples = p.Examples
		resp.Constraints = p.Constraints
		resp.StarterCode = p.StarterCode

		resp.TestCases = make([]TestCaseResponse, len(p.TestCases))
		for i, tc := range p.TestCases {
			resp.TestCases[i] = TestCaseResponse{
				ID:       tc.ID,
				Input:    tc.Input,
				Expected: tc.Expected,
			}
		}
	}

	return resp
}
