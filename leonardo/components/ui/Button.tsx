"use client";

/**
 * Button Component
 *
 * Reusable button component with variants and sizes.
 * Based on Leonardo.ai module 167815.
 */

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";

// Button variants using cva (matching module 167815)
export const buttonVariants = cva(
  "theme-rebrand:disabled:text-disabled-foreground text-primary-foreground ring-offset-background focus-visible:ring-ring theme-rebrand:focus-visible:ring-4 theme-rebrand:ring-focus theme-rebrand:focus-visible:ring-focus relative inline-flex items-center justify-center rounded-md border text-base font-medium whitespace-nowrap transition duration-120 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "theme-rebrand:[&_svg.chakra-icon]:fill-primary-brand-foreground! theme-rebrand:hover:bg-primary-brand-light theme-rebrand:disabled:bg-disabled theme-rebrand:bg-primary-brand theme-rebrand:text-primary-brand-foreground not-theme-rebrand:bg-gradient-primary not-theme-rebrand:hover:bg-gradient-primary-light not-theme-rebrand:hover:shadow-glow not-theme-rebrand:active:bg-gradient-primary-strong theme-rebrand:active:bg-primary-brand-strong not-theme-rebrand:disabled:bg-gradient-disabled border-none",
        secondary:
          "border-primary bg-primary hover:bg-hover active:bg-active theme-rebrand:bg-white/10 theme-rebrand:hover:bg-white/20 theme-rebrand:active:bg-white/5 theme-rebrand:border-none theme-rebrand:disabled:bg-white/5",
        gradientOutline:
          "border-gradient-bg-primary hover:border-gradient-bg-hover active:border-gradient-bg-active theme-rebrand:border-primary theme-rebrand:hover:bg-white/20 theme-rebrand:active:bg-white/5 theme-rebrand:bg-none border-gradient-primary",
        outline:
          "border-primary hover:bg-hover active:bg-active theme-rebrand:hover:bg-white/20 theme-rebrand:active:bg-white/5 bg-none",
        glass:
          "bg-glass-backdrop/50 hover:bg-glass-backdrop/30 active:bg-glass-backdrop [&[data-state=open]]:bg-glass-backdrop filter-blur-xs hover:shadow-glow active:shadow-glow border-transparent backdrop-blur-xs disabled:opacity-70",
        ghost:
          "hover:bg-hover active:bg-active [&[data-state=open]]:bg-active theme-rebrand:hover:bg-white/20 theme-rebrand:active:bg-white/5 theme-rebrand:[&[data-state=open]]:bg-white/5 border-transparent bg-transparent",
        destructive:
          "bg-negative hover:bg-negative-light active:bg-negative-strong theme-rebrand:text-negative-foreground theme-rebrand:disabled:text-negative-foreground/50 border-transparent",
        positive:
          "bg-positive hover:bg-positive-light active:bg-positive-strong border-transparent",
      },
      size: {
        xs: 'h-6 gap-1 rounded px-1.5 py-1 text-xs [&_svg:not([class*="size-"])]:size-4 [&[aria-busy="true"]_svg]:size-4',
        sm: 'h-8 gap-1.5 rounded-lg px-2.5 py-1.5 text-sm [&_svg:not([class*="size-"])]:size-5 [&[aria-busy="true"]_svg]:size-5',
        default:
          'h-10 gap-2 rounded-lg p-2.5 text-sm [&_svg:not([class*="size-"])]:size-5 [&[aria-busy="true"]_svg]:size-5',
        lg: 'h-12 gap-2 rounded-lg p-3 text-base [&_svg:not([class*="size-"])]:size-6 [&[aria-busy="true"]_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  loading,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <SpinnerIcon
            className="theme-rebrand:text-primary-foreground absolute animate-spin duration-500"
            aria-hidden
          />
          <span className="sr-only">Loading</span>
          <span className="invisible">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
};

Button.displayName = "Button";

export default Button;
