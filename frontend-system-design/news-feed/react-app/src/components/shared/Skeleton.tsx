/**
 * Skeleton Loading Component
 */

import './Skeleton.css';

export function PostSkeleton() {
  return (
    <div className="skeleton-post">
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-info">
          <div className="skeleton-line skeleton-line--name" />
          <div className="skeleton-line skeleton-line--time" />
        </div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button" />
        <div className="skeleton-button" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </>
  );
}
