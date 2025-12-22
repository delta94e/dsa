/**
 * Post Card Component
 */

import { useState, memo } from 'react';
import { Post, ReactionType, REACTION_EMOJIS, REACTION_LABELS } from '../../types';
import { useFeed } from '../../store/FeedContext';
import { useClickOutside } from '../../hooks';
import { Avatar } from '../shared';
import { CommentSection } from '../Comment';
import { formatRelativeTime, formatCount, getTotalReactions } from '../../utils';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const { toggleReaction } = useFeed();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const pickerRef = useClickOutside(() => setShowReactionPicker(false));

  const totalReactions = getTotalReactions(post.reactions);

  const handleReaction = (type: ReactionType) => {
    toggleReaction(post.id, type);
    setShowReactionPicker(false);
  };

  const handleLikeClick = () => {
    if (post.userReaction) {
      toggleReaction(post.id, post.userReaction);
    } else {
      toggleReaction(post.id, 'like');
    }
  };

  return (
    <article className="post-card" role="article" aria-labelledby={`post-${post.id}-author`}>
      {/* Header */}
      <header className="post-card__header">
        <Avatar
          src={post.author.avatarUrl}
          alt={post.author.name}
          isVerified={post.author.isVerified}
        />
        <div className="post-card__author-info">
          <h3 id={`post-${post.id}-author`} className="post-card__author-name">
            {post.author.name}
          </h3>
          <span className="post-card__meta">
            @{post.author.username} • {formatRelativeTime(post.createdAt)}
          </span>
        </div>
        <button className="post-card__menu" aria-label="More options">
          ⋯
        </button>
      </header>

      {/* Content */}
      <div className="post-card__content">
        <p className="post-card__text">{post.content}</p>
        
        {post.imageUrl && (
          <div className="post-card__image-container">
            {!imageLoaded && <div className="post-card__image-placeholder" />}
            <img
              src={post.imageUrl}
              alt="Post image"
              className={`post-card__image ${imageLoaded ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      {(totalReactions > 0 || post.commentCount > 0) && (
        <div className="post-card__stats">
          {totalReactions > 0 && (
            <span className="post-card__reactions-count">
              {getTopReactionEmojis(post.reactions)} {formatCount(totalReactions)}
            </span>
          )}
          {post.commentCount > 0 && (
            <span className="post-card__comments-count">
              {formatCount(post.commentCount)} comments
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="post-card__actions" role="group" aria-label="Post actions">
        <div className="post-card__action-wrapper" ref={pickerRef}>
          <button
            className={`post-card__action ${post.userReaction ? 'post-card__action--active' : ''}`}
            onClick={handleLikeClick}
            onMouseEnter={() => setShowReactionPicker(true)}
            onFocus={() => setShowReactionPicker(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowReactionPicker(false);
            }}
            aria-label={post.userReaction ? `You reacted with ${post.userReaction}. Press to change.` : 'Like this post'}
            aria-pressed={!!post.userReaction}
            aria-haspopup="listbox"
            aria-expanded={showReactionPicker}
          >
            {post.userReaction ? (
              <>
                <span className="post-card__reaction-emoji">
                  {REACTION_EMOJIS[post.userReaction]}
                </span>
                {REACTION_LABELS[post.userReaction]}
              </>
            ) : (
              <>👍 Like</>
            )}
          </button>

          {showReactionPicker && (
            <div 
              className="reaction-picker" 
              role="listbox" 
              aria-label="Choose a reaction"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setShowReactionPicker(false);
              }}
            >
              {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type, index) => (
                <button
                  key={type}
                  className={`reaction-picker__item ${post.userReaction === type ? 'active' : ''}`}
                  onClick={() => handleReaction(type)}
                  aria-label={REACTION_LABELS[type]}
                  role="option"
                  aria-selected={post.userReaction === type}
                  tabIndex={0}
                  autoFocus={index === 0}
                >
                  {REACTION_EMOJIS[type]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          className="post-card__action" 
          aria-label="Comment"
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
        >
          💬 Comment
        </button>

        <button className="post-card__action" aria-label="Share">
          ↗️ Share
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        postId={post.id}
        commentCount={post.commentCount}
        isExpanded={showComments}
        onToggle={() => setShowComments(true)}
      />
    </article>
  );
});

function getTopReactionEmojis(reactions: Post['reactions']): string {
  return Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => REACTION_EMOJIS[type as ReactionType])
    .join('');
}
