"use client";

/**
 * Alert Component
 *
 * Simple alert component for displaying messages.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type AlertVariant = "default" | "destructive" | "warning" | "success";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

// ============================================================================
// Variant Styles
// ============================================================================

const variantStyles: Record<AlertVariant, string> = {
  default: "bg-muted/50 border-muted-foreground/20 text-foreground",
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
  warning: "bg-warning/10 border-warning/30 text-warning-foreground",
  success: "bg-success/10 border-success/30 text-success-foreground",
};

// ============================================================================
// Components
// ============================================================================

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn(
          "mb-1 font-medium leading-none tracking-tight",
          className
        )}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";
