import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Types
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

// Variant styles
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/70',
  primary: 'bg-purple-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-amber-500 text-black',
  danger: 'bg-red-500 text-white',
};

// Size styles
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
};

/**
 * Badge
 * 
 * Small status indicator or label component.
 */
export const Badge: FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}) => {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium',
        'rounded-full',
        'leading-none',

        // Variant & Size
        variantStyles[variant],
        sizeStyles[size],

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
