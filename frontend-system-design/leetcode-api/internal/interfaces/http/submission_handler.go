// Package http provides HTTP handlers for submissions.
package http

import (
	"net/http"

	"github.com/gin-gonic/gin"

	submissionApp "leetcode-api/internal/application/submission"
	domain "leetcode-api/internal/domain/submission"
)

// SubmissionHandler handles submission-related HTTP requests
type SubmissionHandler struct {
	service *submissionApp.Service
}

// NewSubmissionHandler creates a new SubmissionHandler
func NewSubmissionHandler(service *submissionApp.Service) *SubmissionHandler {
	return &SubmissionHandler{service: service}
}

// RunRequest is the request body for run/submit
type RunRequest struct {
	ProblemID uint   `json:"problemId" binding:"required"`
	Language  string `json:"language" binding:"required"`
	Code      string `json:"code" binding:"required"`
}

// SubmissionResponse is the API response for a submission
type SubmissionResponse struct {
	SubmissionID string               `json:"submissionId"`
	Status       string               `json:"status"`
	Passed       int                  `json:"passed,omitempty"`
	Total        int                  `json:"total,omitempty"`
	Results      []TestResultResponse `json:"results"`
}

// TestResultResponse is the API response for a test result
type TestResultResponse struct {
	Input    string `json:"input"`
	Expected string `json:"expected"`
	Actual   string `json:"actual"`
	Passed   bool   `json:"passed"`
	Runtime  int    `json:"runtime"`
}

// Run handles POST /api/run
func (h *SubmissionHandler) Run(c *gin.Context) {
	var req RunRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	submission, err := h.service.RunCode(
		c.Request.Context(),
		req.ProblemID,
		req.Language,
		req.Code,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, toSubmissionResponse(submission))
}

// Submit handles POST /api/submit
func (h *SubmissionHandler) Submit(c *gin.Context) {
	var req RunRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	submission, err := h.service.SubmitCode(
		c.Request.Context(),
		req.ProblemID,
		req.Language,
		req.Code,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp := toSubmissionResponse(submission)
	resp.Passed = submission.PassedCount()
	resp.Total = submission.TotalCount()

	c.JSON(http.StatusOK, resp)
}

// Get handles GET /api/submissions/:id
func (h *SubmissionHandler) Get(c *gin.Context) {
	id := c.Param("id")

	submission, err := h.service.GetSubmission(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission not found"})
		return
	}

	c.JSON(http.StatusOK, toSubmissionResponse(submission))
}

// toSubmissionResponse converts domain to API response
func toSubmissionResponse(s *domain.Submission) SubmissionResponse {
	results := make([]TestResultResponse, len(s.Results))
	for i, r := range s.Results {
		results[i] = TestResultResponse{
			Input:    r.Input,
			Expected: r.Expected,
			Actual:   r.Actual,
			Passed:   r.Passed,
			Runtime:  r.Runtime,
		}
	}

	return SubmissionResponse{
		SubmissionID: s.ID,
		Status:       string(s.Status),
		Results:      results,
	}
}
