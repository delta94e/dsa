import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { cn } from "@/lib/utils";

// Types
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "gradientOutline"
  | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";
export type { ButtonVariant, ButtonSize };

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  /**
   * When true, the button will render its children as a slot,
   * allowing the button styles to be applied to a child element (e.g., Link).
   */
  asChild?: boolean;
}

// Variant styles
const variantStyles: Record<ButtonVariant, string> = {
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
  gradientOutline: cn(
    "bg-transparent",
    "text-white",
    "border border-transparent",
    "[background:linear-gradient(#0a0a0a,#0a0a0a)_padding-box,linear-gradient(to_right,#a855f7,#ec4899,#a855f7)_border-box]",
    "hover:opacity-90"
  ),
  danger: cn("bg-red-600", "text-white", "hover:bg-red-500"),
};

// Size styles
const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-[10px] gap-1",
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

/**
 * Get button classes for external use
 */
export function getButtonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center",
    "font-medium",
    "rounded-xl",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98]",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );
}

/**
 * Button
 *
 * Reusable button component with variants and sizes.
 * Supports asChild prop for polymorphic rendering (e.g., with Link).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = getButtonClasses({
      variant,
      size,
      fullWidth,
      className,
    });

    // asChild mode: clone the child with button styles
    if (asChild) {
      const child = Children.only(children);
      if (isValidElement(child)) {
        return cloneElement(child as ReactElement<{ className?: string }>, {
          className: cn(
            buttonClasses,
            (child.props as { className?: string }).className
          ),
          ...props,
        });
      }
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left Icon */}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}

        {/* Children */}
        {children}

        {/* Right Icon */}
        {rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
