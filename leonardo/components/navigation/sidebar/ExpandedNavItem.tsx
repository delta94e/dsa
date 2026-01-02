'use client';

import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Types
interface ExpandedNavItemProps {
  href: string;
  pathname: string;
  children: ReactNode;
  isExternal?: boolean;
  onClick?: () => void;
}

/**
 * ExpandedNavItem
 * 
 * Navigation item for the expanded sidebar panel.
 * Shows title and description in a horizontal layout.
 */
export const ExpandedNavItem: FC<ExpandedNavItemProps> = ({
  href,
  pathname,
  children,
  isExternal = false,
  onClick,
}) => {
  const isActive = pathname === href;

  return (
    <li className="w-full">
      <Link
        href={href}
        className={cn(
          // Base styles
          'ring-offset-background focus-visible:ring-ring',
          'flex h-auto w-full flex-row items-center justify-start gap-2',
          'rounded-3xl px-2 py-2',
          'text-xs text-[0.6875rem] break-words whitespace-normal',
          'transition duration-120',
          'hover:bg-white/10',
          'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
          '[&_svg]:pointer-events-none [&_svg]:shrink-0',
          
          // Active state
          isActive && 'bg-white/10'
        )}
        aria-current={isActive ? 'page' : undefined}
        {...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

export default ExpandedNavItem;
