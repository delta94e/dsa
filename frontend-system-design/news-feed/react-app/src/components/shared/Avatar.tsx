/**
 * Avatar Component
 */

import './Avatar.css';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  isVerified?: boolean;
}

export function Avatar({ src, alt, size = 'md', isVerified }: AvatarProps) {
  return (
    <div className={`avatar avatar--${size}`}>
      <img src={src} alt={alt} className="avatar__image" />
      {isVerified && <span className="avatar__badge" title="Verified">✓</span>}
    </div>
  );
}
