"use client";

/**
 * ModeSelector Component
 *
 * Image/Video mode toggle container.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ModeSelectorProps {
  /**
   * Children (ModeSelectorButton components)
   */
  children: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

export function ModeSelector({ children, className }: ModeSelectorProps) {
  return (
    <div
      className={cn(
        "border-secondary bg-secondary [&:has(.inactive-btn:hover)]:bg-hover relative flex h-full shrink-0 flex-nowrap items-center gap-0 rounded-full border",
        className
      )}
    >
      {children}
    </div>
  );
}

export default ModeSelector;
