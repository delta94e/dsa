'use client';

import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ROUTE } from '@/constants/routes';

// Types
interface SidebarNavItemProps {
  href: string;
  pathname: string;
  isExternal?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * SidebarNavItem
 * 
 * Individual navigation item in the sidebar.
 * Handles active state based on current pathname.
 * Supports external links with target="_blank".
 */
export const SidebarNavItem: FC<SidebarNavItemProps> = ({
  href,
  pathname,
  isExternal = false,
  children,
  onClick,
  className,
}) => {
  // Special handling for image generation routes
  const isImageGenRoute = 
    href === ROUTE.IMAGE_GENERATION || 
    href === ROUTE.IMAGE_GENERATION_VIDEO;

  // Determine active state
  const isActive = isImageGenRoute
    ? pathname === href
    : href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        // Base styles
        'ring-offset-background focus-visible:ring-ring',
        'mx-auto flex h-auto w-full flex-col items-center gap-0.5',
        'rounded-3xl py-2',
        'text-xs text-[0.6875rem] font-medium whitespace-nowrap',
        'transition duration-120',
        'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        
        // Hover state
        'hover:bg-white/10',
        
        // Active state
        isActive && 'bg-white/10',
        
        className
      )}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default SidebarNavItem;
