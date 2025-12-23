/**
 * API configuration constants
 * @module constants/api
 */

/** Base URL for API requests */
export const API_BASE_URL = 'http://localhost:8080/api';

/** API endpoints */
export const API_ENDPOINTS = {
    /** Get all problems */
    PROBLEMS: `${API_BASE_URL}/problems`,
    /** Get problem by slug */
    PROBLEM: (slug: string) => `${API_BASE_URL}/problems/${slug}`,
    /** Get all topics */
    TOPICS: `${API_BASE_URL}/topics`,
    /** Run code against example test cases */
    RUN: `${API_BASE_URL}/run`,
    /** Submit code for full evaluation */
    SUBMIT: `${API_BASE_URL}/submit`,
    /** Get submission by ID */
    SUBMISSION: (id: string) => `${API_BASE_URL}/submissions/${id}`,
} as const;

/** HTTP request timeout in milliseconds */
export const REQUEST_TIMEOUT = 30000;

/** Default pagination settings */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
} as const;
