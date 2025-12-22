/**
 * Feed Store - React Context + useReducer
 */

import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useState } from 'react';
import { Post, User, ReactionType, FeedState, ReactionCounts } from '../types';
import { api } from '../services/api';

// Actions
type FeedAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; posts: Post[]; cursor: string | null; hasMore: boolean }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'FETCH_MORE_START' }
  | { type: 'FETCH_MORE_SUCCESS'; posts: Post[]; cursor: string | null; hasMore: boolean }
  | { type: 'CREATE_POST'; post: Post }
  | { type: 'UPDATE_REACTION'; postId: string; reactions: ReactionCounts; userReaction: ReactionType | null };

// Initial State
const initialState: FeedState = {
  posts: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

// Reducer
function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, posts: action.posts, cursor: action.cursor, hasMore: action.hasMore };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'FETCH_MORE_START':
      return { ...state, isLoadingMore: true };
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        isLoadingMore: false,
        posts: [...state.posts, ...action.posts],
        cursor: action.cursor,
        hasMore: action.hasMore,
      };
    case 'CREATE_POST':
      return { ...state, posts: [action.post, ...state.posts] };
    case 'UPDATE_REACTION':
      return {
        ...state,
        posts: state.posts.map(p =>
          p.id === action.postId
            ? { ...p, reactions: action.reactions, userReaction: action.userReaction ?? undefined }
            : p
        ),
      };
    default:
      return state;
  }
}

// Context Types
interface FeedContextType {
  state: FeedState;
  currentUser: User | null;
  loadFeed: () => Promise<void>;
  loadMore: () => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  toggleReaction: (postId: string, type: ReactionType) => Promise<void>;
}

const FeedContext = createContext<FeedContextType | null>(null);

// Provider
export function FeedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(feedReducer, initialState);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load current user on mount
  useEffect(() => {
    api.getCurrentUser().then(setCurrentUser);
  }, []);

  const loadFeed = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await api.fetchFeed();
      dispatch({
        type: 'FETCH_SUCCESS',
        posts: response.posts,
        cursor: response.pagination.nextCursor,
        hasMore: response.pagination.hasMore,
      });
    } catch (e) {
      dispatch({ type: 'FETCH_ERROR', error: e instanceof Error ? e.message : 'Failed to load feed' });
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore) return;
    
    dispatch({ type: 'FETCH_MORE_START' });
    try {
      const response = await api.fetchFeed(state.cursor ?? undefined);
      dispatch({
        type: 'FETCH_MORE_SUCCESS',
        posts: response.posts,
        cursor: response.pagination.nextCursor,
        hasMore: response.pagination.hasMore,
      });
    } catch {
      dispatch({ type: 'FETCH_ERROR', error: 'Failed to load more posts' });
    }
  }, [state.cursor, state.isLoadingMore, state.hasMore]);

  const createPost = useCallback(async (content: string, imageUrl?: string) => {
    const post = await api.createPost(content, imageUrl);
    dispatch({ type: 'CREATE_POST', post });
  }, []);

  const toggleReaction = useCallback(async (postId: string, type: ReactionType) => {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    const prevReaction = post.userReaction;
    const newReactions = { ...post.reactions };

    if (prevReaction === type) {
      newReactions[type] = Math.max(0, newReactions[type] - 1);
      dispatch({ type: 'UPDATE_REACTION', postId, reactions: newReactions, userReaction: null });
      try {
        await api.removeReaction(postId);
      } catch {
        dispatch({ type: 'UPDATE_REACTION', postId, reactions: post.reactions, userReaction: prevReaction ?? null });
      }
    } else {
      if (prevReaction) newReactions[prevReaction] = Math.max(0, newReactions[prevReaction] - 1);
      newReactions[type]++;
      dispatch({ type: 'UPDATE_REACTION', postId, reactions: newReactions, userReaction: type });
      try {
        await api.addReaction(postId, type);
      } catch {
        dispatch({ type: 'UPDATE_REACTION', postId, reactions: post.reactions, userReaction: prevReaction ?? null });
      }
    }
  }, [state.posts]);

  return (
    <FeedContext.Provider value={{ state, currentUser, loadFeed, loadMore, createPost, toggleReaction }}>
      {children}
    </FeedContext.Provider>
  );
}

// Hook
export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) throw new Error('useFeed must be used within FeedProvider');
  return context;
}
