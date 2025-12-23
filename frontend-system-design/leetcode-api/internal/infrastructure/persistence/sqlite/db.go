// Package sqlite provides database initialization.
package sqlite

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// NewDB creates a new SQLite database connection
func NewDB(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate
	if err := db.AutoMigrate(
		&ProblemModel{},
		&TestCaseModel{},
		&SubmissionModel{},
		&TopicModel{},
	); err != nil {
		return nil, err
	}

	return db, nil
}
