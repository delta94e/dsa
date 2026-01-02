"use client";

import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type Orientation = "horizontal" | "vertical";

interface SeparatorProps extends ComponentPropsWithoutRef<"div"> {
  decorative?: boolean;
  orientation?: Orientation;
}

// ============================================================================
// Constants
// ============================================================================

const ORIENTATIONS: Orientation[] = ["horizontal", "vertical"];
const DEFAULT_ORIENTATION: Orientation = "horizontal";

// ============================================================================
// Component
// ============================================================================

/**
 * Separator
 *
 * A visual divider between content sections.
 * Matches production implementation.
 */
const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      decorative = true,
      orientation = DEFAULT_ORIENTATION,
      ...props
    },
    ref
  ) => {
    // Validate orientation
    const validOrientation = ORIENTATIONS.includes(orientation)
      ? orientation
      : DEFAULT_ORIENTATION;

    return (
      <div
        ref={ref}
        data-slot="separator-root"
        data-orientation={validOrientation}
        {...(decorative
          ? { role: "none" }
          : {
              "aria-orientation":
                validOrientation === "vertical" ? validOrientation : undefined,
              role: "separator",
            })}
        className={cn(
          "shrink-0 [background-color:var(--border-primary)]",
          "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
