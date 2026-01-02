"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type IconButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "link";
type IconButtonSize = "xs" | "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children?: ReactNode;
  icon?: ReactNode;
  isRound?: boolean;
  color?: string;
  "aria-label"?: string;
}

// ============================================================================
// Variant Styles
// ============================================================================

const variantStyles: Record<IconButtonVariant, string> = {
  primary: cn(
    "bg-gradient-to-r from-purple-600 to-purple-500",
    "text-white",
    "hover:from-purple-500 hover:to-purple-400",
    "shadow-lg shadow-purple-500/25"
  ),
  secondary: cn(
    "bg-white/10",
    "text-white",
    "hover:bg-white/20",
    "border border-white/10"
  ),
  ghost: cn(
    "bg-transparent",
    "text-white/70",
    "hover:bg-white/10 hover:text-white"
  ),
  outline: cn(
    "bg-transparent",
    "text-white",
    "border border-white/20",
    "hover:bg-white/5 hover:border-white/40"
  ),
  danger: cn("bg-red-600", "text-white", "hover:bg-red-500"),
  link: cn("bg-transparent", "text-white", "hover:opacity-80"),
};

// ============================================================================
// Size Styles
// ============================================================================

const sizeStyles: Record<IconButtonSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const iconSizeStyles: Record<IconButtonSize, string> = {
  xs: "[&>svg]:size-3",
  sm: "[&>svg]:size-4",
  md: "[&>svg]:size-5",
  lg: "[&>svg]:size-6",
};

// ============================================================================
// IconButton Component
// ============================================================================

/**
 * IconButton
 *
 * A square button optimized for icons.
 * Supports both children and icon prop for Chakra UI compatibility.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      icon,
      className,
      variant = "secondary",
      size = "md",
      isRound = false,
      color,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center",
          isRound ? "rounded-full" : "rounded-lg",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          iconSizeStyles[size],
          className
        )}
        style={{ color, ...style }}
        {...props}
      >
        {icon || children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
