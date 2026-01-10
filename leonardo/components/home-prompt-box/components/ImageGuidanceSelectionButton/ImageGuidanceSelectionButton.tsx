"use client";

/**
 * ImageGuidanceSelectionButton Component
 *
 * Button for selecting image guidance type (Reference vs Start Frame).
 * Shows thumbnail, label, description, and current count/limit.
 */

import { type FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type GuidanceStatus = "available" | "disabled" | "locked";

export interface ImageGuidanceSelectionButtonProps {
  /** Unique identifier */
  id: string;
  /** Button label */
  label: string;
  /** Description text */
  description: string;
  /** Click handler */
  onClick: () => void;
  /** Thumbnail image source */
  src: string;
  /** Current status */
  status: GuidanceStatus;
  /** Current count of selected items */
  count?: number;
  /** Maximum allowed items */
  limit?: number;
}

// ============================================================================
// Component
// ============================================================================

export const ImageGuidanceSelectionButton: FC<
  ImageGuidanceSelectionButtonProps
> = ({ id, label, description, onClick, src, status, count, limit }) => {
  const isDisabled = status === "disabled" || status === "locked";
  const showCount = count !== undefined && limit !== undefined;

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
        "bg-background-secondary hover:bg-background-tertiary",
        "border border-transparent hover:border-border-default",
        {
          "cursor-not-allowed opacity-50": isDisabled,
        }
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {showCount && (
            <span className="text-xs text-muted-foreground">
              ({count}/{limit})
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </button>
  );
};

export default ImageGuidanceSelectionButton;
