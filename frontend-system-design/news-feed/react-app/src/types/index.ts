/**
 * News Feed - Type Definitions
 */

// User Types
export interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    isVerified?: boolean;
}

// Reaction Types
export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface ReactionCounts {
    [key: string]: number;
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

export const REACTION_LABELS: Record<ReactionType, string> = {
    like: 'Like',
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry'
};

// Post Types
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

// Comment Types
export interface Comment {
    id: string;
    postId: string;
    author: User;
    content: string;
    createdAt: number;
    likeCount: number;
    isLiked: boolean;
}

// Feed State Types
export interface FeedState {
    posts: Post[];
    cursor: string | null;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
}

// API Response Types
export interface FeedResponse {
    posts: Post[];
    pagination: {
        nextCursor: string | null;
        hasMore: boolean;
    };
}
