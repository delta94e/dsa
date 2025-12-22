/**
 * News Feed System - Core Type Definitions
 * 
 * This file contains all the TypeScript interfaces and types
 * used throughout the News Feed application.
 */

// ============================================
// User Types
// ============================================

export interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    isVerified?: boolean;
}

// ============================================
// Reaction Types
// ============================================

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface ReactionCounts {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
}

export const REACTION_EMOJIS: Record<ReactionType, string> = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
};

// ============================================
// Post Types
// ============================================

export interface Post {
    id: string;
    author: User;
    content: string;
    imageUrl?: string;
    createdAt: number;
    reactions: ReactionCounts;
    commentCount: number;
    userReaction?: ReactionType;
}

export interface CreatePostInput {
    content: string;
    imageUrl?: string;
}

// ============================================
// Comment Types
// ============================================

export interface Comment {
    id: string;
    postId: string;
    author: User;
    content: string;
    createdAt: number;
    likeCount: number;
    isLiked: boolean;
}

export interface CreateCommentInput {
    postId: string;
    content: string;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationInfo {
    cursor: string | null;
    hasMore: boolean;
    pageSize: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        nextCursor: string | null;
        hasMore: boolean;
    };
}

// ============================================
// Feed State Types
// ============================================

export interface FeedState {
    posts: Post[];
    pagination: PaginationInfo;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
}

export const initialFeedState: FeedState = {
    posts: [],
    pagination: {
        cursor: null,
        hasMore: true,
        pageSize: 10
    },
    isLoading: false,
    isLoadingMore: false,
    error: null
};

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

export interface FeedResponse {
    posts: Post[];
    pagination: {
        nextCursor: string | null;
        hasMore: boolean;
    };
}

export interface ReactionResponse {
    reactions: ReactionCounts;
    userReaction: ReactionType | null;
}

// ============================================
// Error Types
// ============================================

export enum ErrorType {
    NETWORK = 'NETWORK',
    UNAUTHORIZED = 'UNAUTHORIZED',
    NOT_FOUND = 'NOT_FOUND',
    SERVER = 'SERVER',
    VALIDATION = 'VALIDATION'
}

export interface AppError {
    type: ErrorType;
    message: string;
    retryable: boolean;
}

// ============================================
// Event Types
// ============================================

export type FeedEventType =
    | 'post_created'
    | 'post_deleted'
    | 'reaction_added'
    | 'reaction_removed'
    | 'comment_added';

export interface FeedEvent {
    type: FeedEventType;
    payload: unknown;
    timestamp: number;
}
