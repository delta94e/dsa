// Package main is the entry point for the LeetCode API.
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	problemApp "leetcode-api/internal/application/problem"
	submissionApp "leetcode-api/internal/application/submission"
	"leetcode-api/internal/infrastructure/executor"
	"leetcode-api/internal/infrastructure/persistence/sqlite"
	httpInterface "leetcode-api/internal/interfaces/http"

	"gorm.io/gorm"
)

func main() {
	// Remove old database for fresh schema
	os.Remove("leetcode.db")

	// Initialize database
	db, err := sqlite.NewDB("leetcode.db")
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// Seed topics and problems
	seedData(db)

	// Initialize repositories
	problemRepo := sqlite.NewProblemRepository(db)
	submissionRepo := sqlite.NewSubmissionRepository(db)

	// Initialize executor
	codeExecutor := executor.New(5 * time.Second)

	// Initialize services
	problemService := problemApp.NewService(problemRepo)
	submissionService := submissionApp.NewService(submissionRepo, problemRepo, codeExecutor)

	// Initialize router
	router := httpInterface.NewRouter(problemService, submissionService)
	engine := router.Setup()

	// Create server
	srv := &http.Server{
		Addr:    ":8080",
		Handler: engine,
	}

	// Start server in goroutine
	go func() {
		log.Println("🚀 LeetCode API running on http://localhost:8080")
		log.Println("📊 API endpoints:")
		log.Println("   GET  /api/problems?page=1&limit=50&category=algorithms&topic=array&search=sum")
		log.Println("   GET  /api/problems/:slug")
		log.Println("   GET  /api/topics")
		log.Println("   POST /api/run")
		log.Println("   POST /api/submit")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}

func seedData(db *gorm.DB) {
	// Seed topics first
	topics := sqlite.DefaultTopics()
	for i := range topics {
		db.FirstOrCreate(&topics[i], sqlite.TopicModel{Slug: topics[i].Slug})
	}
	log.Printf("✅ Seeded %d topics", len(topics))

	// Seed problems
	problems := sqlite.SeedProblems()
	problemRepo := sqlite.NewProblemRepository(db)

	for _, p := range problems {
		existing, _ := problemRepo.FindBySlug(context.Background(), p.Slug)
		if existing == nil {
			problemRepo.Create(context.Background(), &p)
		}
	}
	log.Printf("✅ Seeded %d problems", len(problems))
}
