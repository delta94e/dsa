/**
 * Mock API Service
 */

import { Post, User, Comment, FeedResponse, ReactionType, ReactionCounts } from '../types';
import { generateId } from '../utils';

// Mock Users
const mockUsers: User[] = [
    { id: 'user-1', name: 'Nguyễn Văn A', username: 'nguyenvana', avatarUrl: 'https://i.pravatar.cc/150?u=1', isVerified: true },
    { id: 'user-2', name: 'Trần Thị B', username: 'tranthib', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
    { id: 'user-3', name: 'Lê Văn C', username: 'levanc', avatarUrl: 'https://i.pravatar.cc/150?u=3', isVerified: true },
    { id: 'user-4', name: 'Phạm Thị D', username: 'phamthid', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
];

const postContents = [
    'Hôm nay thời tiết đẹp quá! ☀️ Ai đi cafe không?',
    'Vừa hoàn thành project lớn. Cảm thấy rất hạnh phúc! 🎉',
    'Chia sẻ tips: Đọc sách 30 phút mỗi ngày giúp tăng khả năng tập trung.',
    'Weekend này đi đâu chơi các bạn? Gợi ý cho mình với 🏖️',
    'Code review xong rồi, deploy production thôi! 🚀',
    'Món ăn mới học được hôm nay. Ngon tuyệt vời! 🍜',
    'Đang học TypeScript, thấy hay quá. Ai có tài liệu hay share nhé!',
    'Cuối tuần vừa rồi đi camping. Thiên nhiên đẹp quá! 🏕️',
];

// Generate mock posts
const mockPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
    id: `post-${i + 1}`,
    author: mockUsers[i % mockUsers.length],
    content: postContents[i % postContents.length],
    imageUrl: i % 3 === 0 ? `https://picsum.photos/600/400?random=${i}` : undefined,
    createdAt: Date.now() - i * 3600000 - Math.random() * 3600000,
    reactions: {
        like: Math.floor(Math.random() * 1000),
        love: Math.floor(Math.random() * 200),
        haha: Math.floor(Math.random() * 100),
        wow: Math.floor(Math.random() * 50),
        sad: Math.floor(Math.random() * 20),
        angry: Math.floor(Math.random() * 10),
    },
    commentCount: Math.floor(Math.random() * 100),
    userReaction: i % 5 === 0 ? 'like' : undefined,
}));

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getCurrentUser: async (): Promise<User> => {
        await delay(100);
        return mockUsers[0];
    },

    fetchFeed: async (cursor?: string, limit = 10): Promise<FeedResponse> => {
        await delay(500);

        let startIndex = 0;
        if (cursor) {
            const idx = mockPosts.findIndex(p => p.id === cursor);
            startIndex = idx >= 0 ? idx + 1 : 0;
        }

        const posts = mockPosts.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < mockPosts.length;

        return {
            posts,
            pagination: {
                nextCursor: hasMore && posts.length > 0 ? posts[posts.length - 1].id : null,
                hasMore,
            },
        };
    },

    createPost: async (content: string, imageUrl?: string): Promise<Post> => {
        await delay(300);
        const newPost: Post = {
            id: generateId(),
            author: mockUsers[0],
            content,
            imageUrl,
            createdAt: Date.now(),
            reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
            commentCount: 0,
        };
        mockPosts.unshift(newPost);
        return newPost;
    },

    addReaction: async (postId: string, type: ReactionType): Promise<{ reactions: ReactionCounts; userReaction: ReactionType }> => {
        await delay(200);
        const post = mockPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        if (post.userReaction) {
            post.reactions[post.userReaction] = Math.max(0, post.reactions[post.userReaction] - 1);
        }
        post.reactions[type]++;
        post.userReaction = type;

        return { reactions: { ...post.reactions }, userReaction: type };
    },

    removeReaction: async (postId: string): Promise<{ reactions: ReactionCounts; userReaction: null }> => {
        await delay(200);
        const post = mockPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        if (post.userReaction) {
            post.reactions[post.userReaction] = Math.max(0, post.reactions[post.userReaction] - 1);
            post.userReaction = undefined;
        }

        return { reactions: { ...post.reactions }, userReaction: null };
    },

    fetchComments: async (postId: string): Promise<Comment[]> => {
        await delay(300);
        return Array.from({ length: 5 }, (_, i) => ({
            id: `comment-${postId}-${i}`,
            postId,
            author: mockUsers[(i + 1) % mockUsers.length],
            content: `Bình luận số ${i + 1} 💬`,
            createdAt: Date.now() - Math.random() * 86400000,
            likeCount: Math.floor(Math.random() * 50),
            isLiked: false,
        }));
    },

    addComment: async (postId: string, content: string): Promise<Comment> => {
        await delay(200);
        const post = mockPosts.find(p => p.id === postId);
        if (post) post.commentCount++;

        return {
            id: generateId(),
            postId,
            author: mockUsers[0],
            content,
            createdAt: Date.now(),
            likeCount: 0,
            isLiked: false,
        };
    },
};
