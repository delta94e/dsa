"use client";

/**
 * ImageGuidanceThumbnail Component
 *
 * Container for image guidance thumbnail with remove button.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ImageGuidanceThumbnailProps {
  /**
   * Whether thumbnail is disabled
   */
  disabled?: boolean;
  /**
   * Children elements (image, remove button)
   */
  children: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

export function ImageGuidanceThumbnail({
  children,
  className,
  disabled = false,
}: ImageGuidanceThumbnailProps) {
  return (
    <div
      className={cn(
        "group/image-guidance-thumbnail border-primary relative flex aspect-square size-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-black md:size-22.5",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export default ImageGuidanceThumbnail;
