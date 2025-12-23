// Package http provides HTTP handlers and routing.
package http

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	problemApp "leetcode-api/internal/application/problem"
	submissionApp "leetcode-api/internal/application/submission"
)

// Router holds all HTTP handlers
type Router struct {
	problemHandler    *ProblemHandler
	submissionHandler *SubmissionHandler
}

// NewRouter creates a new Router
func NewRouter(
	problemService *problemApp.Service,
	submissionService *submissionApp.Service,
) *Router {
	return &Router{
		problemHandler:    NewProblemHandler(problemService),
		submissionHandler: NewSubmissionHandler(submissionService),
	}
}

// Setup configures the Gin router
func (r *Router) Setup() *gin.Engine {
	engine := gin.Default()

	// CORS configuration
	engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001", "http://localhost:3003", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	// API routes
	api := engine.Group("/api")
	{
		// Problems
		api.GET("/problems", r.problemHandler.List)
		api.GET("/problems/:slug", r.problemHandler.Get)

		// Topics
		api.GET("/topics", r.problemHandler.GetTopics)

		// Submissions
		api.POST("/run", r.submissionHandler.Run)
		api.POST("/submit", r.submissionHandler.Submit)
		api.GET("/submissions/:id", r.submissionHandler.Get)
	}

	return engine
}
