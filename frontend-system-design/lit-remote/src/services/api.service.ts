/**
 * API Service - Centralized HTTP client for backend communication
 * @module services/api
 */

import { API_ENDPOINTS, REQUEST_TIMEOUT } from '../constants/api.js';
import type {
    Problem,
    ProblemsResponse,
    TopicsResponse,
    SubmissionResponse,
    ProblemsQueryParams
} from '../types/index.js';

/**
 * Custom error for API failures
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Generic fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new ApiError(
                `Request failed: ${response.statusText}`,
                response.status
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        if ((error as Error).name === 'AbortError') {
            throw new ApiError('Request timeout', undefined, 'TIMEOUT');
        }
        throw new ApiError((error as Error).message, undefined, 'NETWORK_ERROR');
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * API Service singleton
 */
export const ApiService = {
    /**
     * Fetch paginated list of problems with filters
     */
    async getProblems(params?: ProblemsQueryParams): Promise<ProblemsResponse> {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
        if (params?.category) searchParams.set('category', params.category);
        if (params?.topic) searchParams.set('topic', params.topic);
        if (params?.search) searchParams.set('search', params.search);

        const url = `${API_ENDPOINTS.PROBLEMS}?${searchParams}`;
        return fetchWithTimeout<ProblemsResponse>(url);
    },

    /**
     * Fetch all topics
     */
    async getTopics(): Promise<TopicsResponse> {
        return fetchWithTimeout<TopicsResponse>(API_ENDPOINTS.TOPICS);
    },

    /**
     * Fetch single problem by slug
     */
    async getProblem(slug: string): Promise<Problem> {
        return fetchWithTimeout<Problem>(API_ENDPOINTS.PROBLEM(slug));
    },

    /**
     * Run code against example test cases
     */
    async runCode(params: {
        problemId: number;
        language: string;
        code: string;
    }): Promise<SubmissionResponse> {
        return fetchWithTimeout<SubmissionResponse>(API_ENDPOINTS.RUN, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    /**
     * Submit code for full evaluation
     */
    async submitCode(params: {
        problemId: number;
        language: string;
        code: string;
    }): Promise<SubmissionResponse> {
        return fetchWithTimeout<SubmissionResponse>(API_ENDPOINTS.SUBMIT, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },
};
