/**
 * Post Composer Component
 */

import { useState, useRef } from 'react';
import { useFeed } from '../../store/FeedContext';
import { Avatar } from '../shared';
import './PostComposer.css';

export function PostComposer() {
  const { currentUser, createPost } = useFeed();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!currentUser) return null;

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost(content.trim());
      setContent('');
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className={`post-composer ${isExpanded ? 'post-composer--expanded' : ''}`}>
      <div className="post-composer__header">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.name} isVerified={currentUser.isVerified} />
        <textarea
          ref={textareaRef}
          className="post-composer__input"
          placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          rows={isExpanded ? 3 : 1}
          aria-label="Write a new post"
        />
      </div>

      {isExpanded && (
        <>
          <div className="post-composer__toolbar">
            <button className="post-composer__tool" aria-label="Add photo">
              📷 Photo
            </button>
            <button className="post-composer__tool" aria-label="Add video">
              🎥 Video
            </button>
            <button className="post-composer__tool" aria-label="Add location">
              📍 Location
            </button>
          </div>

          <div className="post-composer__actions">
            <button
              className="post-composer__cancel"
              onClick={() => {
                setIsExpanded(false);
                setContent('');
              }}
            >
              Cancel
            </button>
            <button
              className="post-composer__submit"
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
