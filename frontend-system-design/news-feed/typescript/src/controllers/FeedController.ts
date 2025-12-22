/**
 * News Feed System - Feed Controller
 * 
 * Orchestrates feed operations between UI, Store, and API.
 */

import { FeedStore, feedStore } from '../store';
import { ApiService, apiService } from '../services/ApiService';
import { CacheService, cacheService } from '../services/CacheService';
import {
    Post,
    User,
    CreatePostInput,
    ReactionType
} from '../models';

// ============================================
// Controller Configuration
// ============================================

interface FeedControllerConfig {
    pageSize: number;
    cacheTtl: number;
}

const defaultConfig: FeedControllerConfig = {
    pageSize: 10,
    cacheTtl: 60000 // 1 minute
};

// ============================================
// Feed Controller Class
// ============================================

export class FeedController {
    private store: FeedStore;
    private api: ApiService;
    private cache: CacheService;
    private config: FeedControllerConfig;
    private currentUser: User | null = null;

    constructor(
        store: FeedStore = feedStore,
        api: ApiService = apiService,
        cache: CacheService = cacheService,
        config: Partial<FeedControllerConfig> = {}
    ) {
        this.store = store;
        this.api = api;
        this.cache = cache;
        this.config = { ...defaultConfig, ...config };
    }

    // ============================================
    // Initialization
    // ============================================

    /**
     * Initialize controller and load current user
     */
    async initialize(): Promise<void> {
        try {
            this.currentUser = await this.api.getCurrentUser();
        } catch (error) {
            console.error('Failed to load current user:', error);
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return this.currentUser;
    }

    // ============================================
    // Feed Operations
    // ============================================

    /**
     * Load initial feed
     */
    async loadFeed(): Promise<void> {
        // Check cache first
        const cacheKey = 'feed-initial';
        const cached = this.cache.get<Post[]>(cacheKey);

        if (cached) {
            this.store.dispatch({
                type: 'FETCH_FEED_SUCCESS',
                payload: {
                    posts: cached,
                    pagination: {
                        cursor: cached[cached.length - 1]?.id || null,
                        hasMore: true,
                        pageSize: this.config.pageSize
                    }
                }
            });
            return;
        }

        // Fetch from API
        this.store.dispatch({ type: 'FETCH_FEED_START' });

        try {
            const response = await this.api.fetchFeed(undefined, this.config.pageSize);

            // Cache the result
            this.cache.set(cacheKey, response.posts, this.config.cacheTtl);

            this.store.dispatch({
                type: 'FETCH_FEED_SUCCESS',
                payload: {
                    posts: response.posts,
                    pagination: {
                        cursor: response.pagination.nextCursor,
                        hasMore: response.pagination.hasMore,
                        pageSize: this.config.pageSize
                    }
                }
            });
        } catch (error) {
            this.store.dispatch({
                type: 'FETCH_FEED_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to load feed'
            });
        }
    }

    /**
     * Load more posts (pagination)
     */
    async loadMore(): Promise<void> {
        const state = this.store.getState();

        // Prevent multiple concurrent loads
        if (state.isLoadingMore || !state.pagination.hasMore) {
            return;
        }

        this.store.dispatch({ type: 'FETCH_MORE_START' });

        try {
            const response = await this.api.fetchFeed(
                state.pagination.cursor || undefined,
                this.config.pageSize
            );

            this.store.dispatch({
                type: 'FETCH_MORE_SUCCESS',
                payload: {
                    posts: response.posts,
                    pagination: {
                        cursor: response.pagination.nextCursor,
                        hasMore: response.pagination.hasMore,
                        pageSize: this.config.pageSize
                    }
                }
            });
        } catch (error) {
            this.store.dispatch({
                type: 'FETCH_MORE_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to load more posts'
            });
        }
    }

    /**
     * Refresh feed (pull to refresh)
     */
    async refreshFeed(): Promise<void> {
        // Clear cache
        this.cache.invalidatePattern(/^feed-/);

        // Reset and reload
        this.store.dispatch({ type: 'RESET_FEED' });
        await this.loadFeed();
    }

    // ============================================
    // Post Operations
    // ============================================

    /**
     * Create a new post
     */
    async createPost(input: CreatePostInput): Promise<Post | null> {
        if (!this.currentUser) {
            console.error('No current user');
            return null;
        }

        try {
            const post = await this.api.createPost(input, this.currentUser);

            // Add to store immediately
            this.store.dispatch({
                type: 'CREATE_POST',
                payload: post
            });

            // Invalidate cache
            this.cache.invalidatePattern(/^feed-/);

            return post;
        } catch (error) {
            console.error('Failed to create post:', error);
            return null;
        }
    }

    /**
     * Delete a post
     */
    async deletePost(postId: string): Promise<boolean> {
        try {
            await this.api.deletePost(postId);

            this.store.dispatch({
                type: 'DELETE_POST',
                payload: postId
            });

            return true;
        } catch (error) {
            console.error('Failed to delete post:', error);
            return false;
        }
    }

    // ============================================
    // Reaction Operations (with Optimistic Updates)
    // ============================================

    /**
     * Toggle reaction on a post
     */
    async toggleReaction(postId: string, type: ReactionType): Promise<void> {
        const post = this.store.getPostById(postId);
        if (!post) return;

        // Store previous state for rollback
        const previousReaction = post.userReaction;
        const previousReactions = { ...post.reactions };

        // Optimistic update
        const newReactions = { ...post.reactions };

        if (previousReaction === type) {
            // Remove reaction
            newReactions[type] = Math.max(0, newReactions[type] - 1);
            this.store.dispatch({
                type: 'UPDATE_POST_REACTION',
                payload: { postId, reactions: newReactions, userReaction: null }
            });

            try {
                await this.api.removeReaction(postId);
            } catch (error) {
                // Rollback
                this.store.dispatch({
                    type: 'UPDATE_POST_REACTION',
                    payload: { postId, reactions: previousReactions, userReaction: previousReaction ?? null }
                });
            }
        } else {
            // Add/change reaction
            if (previousReaction) {
                newReactions[previousReaction] = Math.max(0, newReactions[previousReaction] - 1);
            }
            newReactions[type]++;

            this.store.dispatch({
                type: 'UPDATE_POST_REACTION',
                payload: { postId, reactions: newReactions, userReaction: type }
            });

            try {
                await this.api.addReaction(postId, type);
            } catch (error) {
                // Rollback
                this.store.dispatch({
                    type: 'UPDATE_POST_REACTION',
                    payload: { postId, reactions: previousReactions, userReaction: previousReaction ?? null }
                });
            }
        }
    }

    // ============================================
    // Utility Methods
    // ============================================

    /**
     * Get store for subscribing to changes
     */
    getStore(): FeedStore {
        return this.store;
    }

    /**
     * Check if should load more (for infinite scroll)
     */
    shouldLoadMore(): boolean {
        const state = this.store.getState();
        return !state.isLoadingMore && state.pagination.hasMore;
    }
}

// ============================================
// Default Controller Instance
// ============================================

export const feedController = new FeedController();
