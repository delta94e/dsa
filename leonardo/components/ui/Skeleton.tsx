"use client";

/**
 * Skeleton Component
 *
 * A placeholder loading component that displays a pulsing animation.
 * Used to indicate content is loading.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Skeleton
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

export { Skeleton };
