/**
 * News Feed System - API Service
 * 
 * HTTP client for server communication with mock data support.
 */

import {
    Post,
    User,
    Comment,
    CreatePostInput,
    CreateCommentInput,
    FeedResponse,
    ReactionResponse,
    ReactionType,
    PaginatedResponse
} from '../models';
import { generateId } from '../utils';

// ============================================
// Mock Data
// ============================================

const mockUsers: User[] = [
    {
        id: 'user-1',
        name: 'Nguyễn Văn A',
        username: 'nguyenvana',
        avatarUrl: 'https://i.pravatar.cc/150?u=user1',
        isVerified: true
    },
    {
        id: 'user-2',
        name: 'Trần Thị B',
        username: 'tranthib',
        avatarUrl: 'https://i.pravatar.cc/150?u=user2',
        isVerified: false
    },
    {
        id: 'user-3',
        name: 'Lê Văn C',
        username: 'levanc',
        avatarUrl: 'https://i.pravatar.cc/150?u=user3',
        isVerified: true
    },
    {
        id: 'user-4',
        name: 'Phạm Thị D',
        username: 'phamthid',
        avatarUrl: 'https://i.pravatar.cc/150?u=user4',
        isVerified: false
    }
];

const mockPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
    id: `post-${i + 1}`,
    author: mockUsers[i % mockUsers.length],
    content: getRandomPostContent(i),
    imageUrl: i % 3 === 0 ? `https://picsum.photos/600/400?random=${i}` : undefined,
    createdAt: Date.now() - (i * 3600000) - Math.random() * 3600000,
    reactions: {
        like: Math.floor(Math.random() * 1000),
        love: Math.floor(Math.random() * 200),
        haha: Math.floor(Math.random() * 100),
        wow: Math.floor(Math.random() * 50),
        sad: Math.floor(Math.random() * 20),
        angry: Math.floor(Math.random() * 10)
    },
    commentCount: Math.floor(Math.random() * 100),
    userReaction: i % 5 === 0 ? 'like' : undefined
}));

function getRandomPostContent(index: number): string {
    const contents = [
        'Hôm nay thời tiết đẹp quá! ☀️ Ai đi cafe không?',
        'Vừa hoàn thành project lớn. Cảm thấy rất hạnh phúc! 🎉',
        'Chia sẻ một tips hay: Đọc sách mỗi ngày 30 phút giúp tăng khả năng tập trung.',
        'Weekend này đi đâu chơi các bạn? Gợi ý cho mình với 🏖️',
        'Code review xong rồi, deploy production thôi! 🚀',
        'Món ăn mới học được hôm nay. Ngon tuyệt vời! 🍜',
        'Đang học TypeScript, thấy hay quá. Ai có tài liệu gì hay share với mình nhé!',
        'Cuối tuần vừa rồi đi camping. Thiên nhiên đẹp quá trời! 🏕️',
        'Mới adopt một chú mèo con. Cute quá đi! 🐱',
        'Chia sẻ kinh nghiệm phỏng vấn Frontend Developer...'
    ];
    return contents[index % contents.length];
}

const mockComments: Map<string, Comment[]> = new Map();

// Initialize some comments for first 10 posts
for (let i = 0; i < 10; i++) {
    const postId = `post-${i + 1}`;
    mockComments.set(postId, Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, j) => ({
        id: `comment-${postId}-${j}`,
        postId,
        author: mockUsers[(i + j) % mockUsers.length],
        content: `Bình luận số ${j + 1} cho bài viết này! 💬`,
        createdAt: Date.now() - Math.random() * 86400000,
        likeCount: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.7
    })));
}

// ============================================
// API Configuration
// ============================================

interface ApiConfig {
    baseUrl: string;
    timeout: number;
    mockDelay: number;
}

const defaultConfig: ApiConfig = {
    baseUrl: '/api',
    timeout: 10000,
    mockDelay: 500 // Simulate network delay
};

// ============================================
// API Service Class
// ============================================

export class ApiService {
    private config: ApiConfig;
    private pendingRequests: Map<string, Promise<unknown>> = new Map();

    constructor(config: Partial<ApiConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
    }

    /**
     * Simulate network delay
     */
    private async delay(ms: number = this.config.mockDelay): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Deduplicate concurrent requests
     */
    private async deduplicatedRequest<T>(
        key: string,
        request: () => Promise<T>
    ): Promise<T> {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key) as Promise<T>;
        }

        const promise = request();
        this.pendingRequests.set(key, promise);

        try {
            return await promise;
        } finally {
            this.pendingRequests.delete(key);
        }
    }

    // ============================================
    // Feed APIs
    // ============================================

    /**
     * Fetch feed posts with pagination
     */
    async fetchFeed(cursor?: string, limit: number = 10): Promise<FeedResponse> {
        const cacheKey = `feed-${cursor || 'initial'}-${limit}`;

        return this.deduplicatedRequest(cacheKey, async () => {
            await this.delay();

            // Find starting index based on cursor
            let startIndex = 0;
            if (cursor) {
                const cursorIndex = mockPosts.findIndex(p => p.id === cursor);
                startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
            }

            // Get posts for this page
            const posts = mockPosts.slice(startIndex, startIndex + limit);
            const hasMore = startIndex + limit < mockPosts.length;
            const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

            return {
                posts,
                pagination: {
                    nextCursor: hasMore ? nextCursor : null,
                    hasMore
                }
            };
        });
    }

    /**
     * Create a new post
     */
    async createPost(input: CreatePostInput, author: User): Promise<Post> {
        await this.delay();

        const newPost: Post = {
            id: generateId(),
            author,
            content: input.content,
            imageUrl: input.imageUrl,
            createdAt: Date.now(),
            reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
            commentCount: 0,
            userReaction: undefined
        };

        // Add to mock data
        mockPosts.unshift(newPost);

        return newPost;
    }

    /**
     * Delete a post
     */
    async deletePost(postId: string): Promise<void> {
        await this.delay();

        const index = mockPosts.findIndex(p => p.id === postId);
        if (index >= 0) {
            mockPosts.splice(index, 1);
        }
    }

    // ============================================
    // Reaction APIs
    // ============================================

    /**
     * Add or update reaction on a post
     */
    async addReaction(postId: string, type: ReactionType): Promise<ReactionResponse> {
        await this.delay(200);

        const post = mockPosts.find(p => p.id === postId);
        if (!post) {
            throw new Error('Post not found');
        }

        // Remove previous reaction if exists
        if (post.userReaction) {
            post.reactions[post.userReaction] = Math.max(0, post.reactions[post.userReaction] - 1);
        }

        // Add new reaction
        post.reactions[type]++;
        post.userReaction = type;

        return {
            reactions: { ...post.reactions },
            userReaction: type
        };
    }

    /**
     * Remove reaction from a post
     */
    async removeReaction(postId: string): Promise<ReactionResponse> {
        await this.delay(200);

        const post = mockPosts.find(p => p.id === postId);
        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userReaction) {
            post.reactions[post.userReaction] = Math.max(0, post.reactions[post.userReaction] - 1);
            post.userReaction = undefined;
        }

        return {
            reactions: { ...post.reactions },
            userReaction: null
        };
    }

    // ============================================
    // Comment APIs
    // ============================================

    /**
     * Fetch comments for a post
     */
    async fetchComments(
        postId: string,
        cursor?: string,
        limit: number = 10
    ): Promise<PaginatedResponse<Comment>> {
        await this.delay();

        const comments = mockComments.get(postId) || [];

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = comments.findIndex(c => c.id === cursor);
            startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
        }

        const pageComments = comments.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < comments.length;

        return {
            data: pageComments,
            pagination: {
                nextCursor: hasMore ? pageComments[pageComments.length - 1]?.id : null,
                hasMore
            }
        };
    }

    /**
     * Add a comment to a post
     */
    async addComment(input: CreateCommentInput, author: User): Promise<Comment> {
        await this.delay();

        const newComment: Comment = {
            id: generateId(),
            postId: input.postId,
            author,
            content: input.content,
            createdAt: Date.now(),
            likeCount: 0,
            isLiked: false
        };

        const comments = mockComments.get(input.postId) || [];
        comments.unshift(newComment);
        mockComments.set(input.postId, comments);

        // Update comment count on post
        const post = mockPosts.find(p => p.id === input.postId);
        if (post) {
            post.commentCount++;
        }

        return newComment;
    }

    // ============================================
    // User APIs
    // ============================================

    /**
     * Get current user (mock)
     */
    async getCurrentUser(): Promise<User> {
        await this.delay(100);
        return mockUsers[0];
    }
}

// ============================================
// Default API Instance
// ============================================

export const apiService = new ApiService();
