"use client";

/**
 * Input Component
 *
 * A styled input component with size variants.
 * Matches production bundle module 988846.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Input Variants
// ============================================================================

export const inputVariants = cva(
  [
    "bg-primary text-primary-foreground placeholder:text-tertiary-foreground focus-visible:border-selected hover:enabled:border-selected aria-invalid:border-negative flex w-full rounded-lg border transition-colors file:border-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
    "theme-rebrand:not-aria-invalid:not-disabled:text-secondary-foreground theme-rebrand:placeholder:text-tertiary-foreground theme-rebrand:hover:aria-invalid:border-negative theme-rebrand:aria-invalid:border-negative theme-rebrand:bg-input theme-rebrand:border-transparent theme-rebrand:focus:outline-4 theme-rebrand:not-disabled:hover:border-transparent theme-rebrand:not-aria-invalid:not-disabled:focus-visible:border-transparent theme-rebrand:not-aria-invalid:not-disabled:focus-visible:bg-input-active theme-rebrand:not-disabled:hover:bg-input-hover theme-rebrand:outline-focus border-primary",
    "theme-rebrand:disabled:bg-disabled theme-rebrand:disabled:placeholder:text-disabled-foreground theme-rebrand:disabled:opacity-70",
    "theme-rebrand:not-aria-invalid:not-disabled:focus:text-primary-foreground",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-3 py-1.5 text-sm",
        default: "h-10 px-4 py-2 text-base",
        lg: "h-12 px-3 py-2.5 text-lg",
      },
    },
    defaultVariants: { size: "default" },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

// ============================================================================
// Input Component
// ============================================================================

export function Input({ className, size, type, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      type={type}
      {...props}
    />
  );
}

export default Input;
