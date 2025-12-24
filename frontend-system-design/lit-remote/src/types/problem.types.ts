/**
 * Problem-related type definitions
 * @module types/problem
 */

/** Difficulty level for problems */
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** Category for problems */
export type Category = 'algorithms' | 'database' | 'shell' | 'concurrency' | 'javascript';

/** Topic tag */
export interface Topic {
    id: number;
    name: string;
    slug: string;
    count?: number;
}

/** Problem entity from API */
export interface Problem {
    id: number;
    slug: string;
    title: string;
    difficulty: Difficulty;
    category?: Category;
    acceptanceRate?: number;
    isPremium?: boolean;
    topics?: Topic[];
    description?: string;
    content?: string;
    examples?: string;
    constraints?: string;
    starterCode?: string;
    testCases?: TestCase[];
    likes?: number;
    dislikes?: number;
}

/** Test case for a problem */
export interface TestCase {
    id: number;
    input: string;
    expected: string;
    isHidden?: boolean;
}

/** Result of running a test case */
export interface TestResult {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtime: number;
}

/** Submission status enum */
export type SubmissionStatus =
    | 'Pending'
    | 'Running'
    | 'Accepted'
    | 'Wrong Answer'
    | 'Runtime Error'
    | 'Time Limit Exceeded';

/** API response for run/submit */
export interface SubmissionResponse {
    submissionId: string;
    status: SubmissionStatus;
    results: TestResult[];
    passed?: number;
    total?: number;
}

/** Paginated problems response */
export interface ProblemsResponse {
    problems: Problem[];
    total: number;
    page: number;
    limit: number;
}

/** Topics response from API */
export interface TopicsResponse {
    topics: Topic[];
}

/** Query params for fetching problems */
export interface ProblemsQueryParams {
    page?: number;
    limit?: number;
    difficulty?: Difficulty;
    category?: Category;
    topic?: string;
    search?: string;
}
