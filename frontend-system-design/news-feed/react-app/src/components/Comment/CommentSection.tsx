/**
 * Comment Section Component - List of comments with input
 */

import { useState, useEffect } from 'react';
import { Comment } from '../../types';
import { useFeed } from '../../store/FeedContext';
import { Avatar } from '../shared';
import { CommentItem } from './CommentItem';
import { api } from '../../services/api';
import './CommentSection.css';

interface CommentSectionProps {
  postId: string;
  commentCount: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function CommentSection({ postId, commentCount, isExpanded = false, onToggle }: CommentSectionProps) {
  const { currentUser } = useFeed();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments when expanded
  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      setIsLoading(true);
      api.fetchComments(postId)
        .then(setComments)
        .finally(() => setIsLoading(false));
    }
  }, [isExpanded, postId, comments.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await api.addComment(postId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, isLiked: !c.isLiked, likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1 }
        : c
    ));
  };

  if (!isExpanded) {
    return (
      <button 
        className="comment-section__toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {commentCount > 0 ? `View ${commentCount} comments` : 'Write a comment...'}
      </button>
    );
  }

  return (
    <div className="comment-section" role="region" aria-label="Comments">
      {/* Comment List */}
      <div className="comment-section__list">
        {isLoading ? (
          <div className="comment-section__loading">Loading comments...</div>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onLike={handleLikeComment}
            />
          ))
        )}
      </div>

      {/* Comment Input */}
      {currentUser && (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="sm" />
          <input
            type="text"
            className="comment-section__input"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            aria-label="Write a comment"
          />
          <button 
            type="submit" 
            className="comment-section__submit"
            disabled={!newComment.trim() || isSubmitting}
            aria-label="Post comment"
          >
            {isSubmitting ? '...' : '→'}
          </button>
        </form>
      )}
    </div>
  );
}
