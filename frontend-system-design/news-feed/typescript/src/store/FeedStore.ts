/**
 * News Feed System - Feed Store
 * 
 * Observable store pattern for managing feed state.
 * This is a pure TypeScript implementation without React dependencies.
 */

import {
    Post,
    FeedState,
    PaginationInfo,
    ReactionCounts,
    ReactionType,
    initialFeedState
} from '../models';
import { uniqueBy, updateById, removeById } from '../utils';

// ============================================
// Store Types
// ============================================

export type Listener = () => void;

export type FeedAction =
    | { type: 'FETCH_FEED_START' }
    | { type: 'FETCH_FEED_SUCCESS'; payload: { posts: Post[]; pagination: PaginationInfo } }
    | { type: 'FETCH_FEED_ERROR'; payload: string }
    | { type: 'FETCH_MORE_START' }
    | { type: 'FETCH_MORE_SUCCESS'; payload: { posts: Post[]; pagination: PaginationInfo } }
    | { type: 'FETCH_MORE_ERROR'; payload: string }
    | { type: 'CREATE_POST'; payload: Post }
    | { type: 'DELETE_POST'; payload: string }
    | { type: 'UPDATE_POST_REACTION'; payload: { postId: string; reactions: ReactionCounts; userReaction: ReactionType | null } }
    | { type: 'UPDATE_COMMENT_COUNT'; payload: { postId: string; count: number } }
    | { type: 'RESET_FEED' };

// ============================================
// Reducer
// ============================================

export function feedReducer(state: FeedState, action: FeedAction): FeedState {
    switch (action.type) {
        case 'FETCH_FEED_START':
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case 'FETCH_FEED_SUCCESS':
            return {
                ...state,
                isLoading: false,
                posts: action.payload.posts,
                pagination: {
                    ...state.pagination,
                    cursor: action.payload.pagination.cursor,
                    hasMore: action.payload.pagination.hasMore
                },
                error: null
            };

        case 'FETCH_FEED_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case 'FETCH_MORE_START':
            return {
                ...state,
                isLoadingMore: true
            };

        case 'FETCH_MORE_SUCCESS':
            return {
                ...state,
                isLoadingMore: false,
                posts: uniqueBy([...state.posts, ...action.payload.posts], 'id'),
                pagination: {
                    ...state.pagination,
                    cursor: action.payload.pagination.cursor,
                    hasMore: action.payload.pagination.hasMore
                }
            };

        case 'FETCH_MORE_ERROR':
            return {
                ...state,
                isLoadingMore: false,
                error: action.payload
            };

        case 'CREATE_POST':
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };

        case 'DELETE_POST':
            return {
                ...state,
                posts: removeById(state.posts, action.payload)
            };

        case 'UPDATE_POST_REACTION':
            return {
                ...state,
                posts: updateById(state.posts, action.payload.postId, {
                    reactions: action.payload.reactions,
                    userReaction: action.payload.userReaction ?? undefined
                })
            };

        case 'UPDATE_COMMENT_COUNT':
            return {
                ...state,
                posts: updateById(state.posts, action.payload.postId, {
                    commentCount: action.payload.count
                })
            };

        case 'RESET_FEED':
            return initialFeedState;

        default:
            return state;
    }
}

// ============================================
// Feed Store Class
// ============================================

export class FeedStore {
    private state: FeedState;
    private listeners: Set<Listener> = new Set();

    constructor(initialState: FeedState = initialFeedState) {
        this.state = initialState;
    }

    /**
     * Get the current state
     */
    getState(): FeedState {
        return this.state;
    }

    /**
     * Dispatch an action to update state
     */
    dispatch(action: FeedAction): void {
        const prevState = this.state;
        this.state = feedReducer(prevState, action);

        // Only notify if state actually changed
        if (this.state !== prevState) {
            this.notifyListeners();
        }
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Notify all listeners of state change
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    // ============================================
    // Convenience Methods
    // ============================================

    /**
     * Get all posts
     */
    getPosts(): Post[] {
        return this.state.posts;
    }

    /**
     * Get a post by ID
     */
    getPostById(id: string): Post | undefined {
        return this.state.posts.find(post => post.id === id);
    }

    /**
     * Check if feed is loading
     */
    isLoading(): boolean {
        return this.state.isLoading;
    }

    /**
     * Check if loading more posts
     */
    isLoadingMore(): boolean {
        return this.state.isLoadingMore;
    }

    /**
     * Check if there are more posts to load
     */
    hasMore(): boolean {
        return this.state.pagination.hasMore;
    }

    /**
     * Get the current cursor
     */
    getCursor(): string | null {
        return this.state.pagination.cursor;
    }

    /**
     * Get any error
     */
    getError(): string | null {
        return this.state.error;
    }
}

// ============================================
// Default Store Instance
// ============================================

export const feedStore = new FeedStore();
