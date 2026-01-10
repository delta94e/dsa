"use client";

/**
 * ImageGuidanceRemoveButton Component
 *
 * Remove button for image guidance thumbnail.
 */

import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { TimesIcon } from "@/components/icons/TimesIcon";

export interface ImageGuidanceRemoveButtonProps {
  /**
   * Click handler to remove the image
   */
  onClose: () => void;
  /**
   * Label for the image (for accessibility)
   */
  label?: string;
  /**
   * Additional class name
   */
  className?: string;
}

export function ImageGuidanceRemoveButton({
  onClose,
  className,
  label = "Image Reference",
}: ImageGuidanceRemoveButtonProps) {
  return (
    <IconButton
      type="button"
      variant="secondary"
      size="xs"
      onClick={onClose}
      className={cn(
        "absolute top-1 right-1 z-[3] size-6 p-0 opacity-0 group-hover/image-guidance-thumbnail:opacity-100",
        className
      )}
      aria-label={`Remove ${label}`}
    >
      <TimesIcon />
    </IconButton>
  );
}

export default ImageGuidanceRemoveButton;
