/**
 * Feed Component - Main feed container with infinite scroll
 */

import { useEffect } from 'react';
import { useFeed } from '../../store/FeedContext';
import { useInfiniteScroll } from '../../hooks';
import { PostComposer } from '../PostComposer';
import { PostCard } from '../Post';
import { FeedSkeleton, PostSkeleton } from '../shared';
import './Feed.css';

export function Feed() {
  const { state, loadFeed, loadMore } = useFeed();
  const { posts, isLoading, isLoadingMore, hasMore, error } = state;

  // Load feed on mount
  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Infinite scroll
  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !isLoading && !isLoadingMore && hasMore,
  });

  if (error && posts.length === 0) {
    return (
      <div className="feed">
        <div className="feed__error">
          <span className="feed__error-icon">⚠️</span>
          <p>{error}</p>
          <button className="feed__retry" onClick={loadFeed}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed" role="feed" aria-busy={isLoading || isLoadingMore} aria-label="News feed">
      <PostComposer />

      {isLoading && posts.length === 0 ? (
        <FeedSkeleton count={3} />
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="feed__sentinel" aria-hidden="true" />

          {isLoadingMore && <PostSkeleton />}

          {!hasMore && posts.length > 0 && (
            <div className="feed__end" role="status" aria-live="polite">
              <span>🎉</span>
              <p>You're all caught up!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
