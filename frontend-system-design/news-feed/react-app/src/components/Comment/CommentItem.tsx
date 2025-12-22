/**
 * Comment Component - Displays a single comment
 */

import { Comment } from '../../types';
import { Avatar } from '../shared';
import { formatRelativeTime } from '../../utils';
import './Comment.css';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
}

export function CommentItem({ comment, onLike }: CommentItemProps) {
  return (
    <div className="comment" role="article" aria-label={`Comment by ${comment.author.name}`}>
      <Avatar src={comment.author.avatarUrl} alt={comment.author.name} size="sm" />
      
      <div className="comment__body">
        <div className="comment__bubble">
          <span className="comment__author">{comment.author.name}</span>
          <p className="comment__text">{comment.content}</p>
        </div>
        
        <div className="comment__actions">
          <button 
            className={`comment__action ${comment.isLiked ? 'comment__action--liked' : ''}`}
            onClick={() => onLike?.(comment.id)}
            aria-pressed={comment.isLiked}
            aria-label={comment.isLiked ? 'Unlike comment' : 'Like comment'}
          >
            Like
          </button>
          <button className="comment__action">Reply</button>
          <span className="comment__time">{formatRelativeTime(comment.createdAt)}</span>
          {comment.likeCount > 0 && (
            <span className="comment__likes" aria-label={`${comment.likeCount} likes`}>
              👍 {comment.likeCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
