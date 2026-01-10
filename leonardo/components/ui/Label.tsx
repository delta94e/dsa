"use client";

/**
 * Label Component
 *
 * Accessible label component built on Radix UI Label.
 * Matches Leonardo.ai module 756975.
 */

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

const labelVariants = cva(
  "text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// ============================================================================
// Label
// ============================================================================

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, onMouseDown, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    onMouseDown={(e) => {
      // Prevent double-click text selection on label
      // unless clicking on interactive elements
      if (
        !e.target ||
        !(e.target as Element).closest("button, input, select, textarea")
      ) {
        onMouseDown?.(e);
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      }
    }}
    {...props}
  />
));
Label.displayName = "Label";

export { Label, labelVariants };
