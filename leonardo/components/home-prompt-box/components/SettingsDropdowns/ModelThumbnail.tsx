"use client";

/**
 * ModelThumbnail Component
 *
 * Thumbnail preview for model selection.
 */

import { FineTunedModelIcon } from "@/components/icons/FineTunedModelIcon";

export interface ModelThumbnailProps {
  /**
   * Thumbnail URL (can be image or video)
   */
  thumbnailUrl?: string;
}

export function ModelThumbnail({ thumbnailUrl }: ModelThumbnailProps) {
  const isVideo =
    thumbnailUrl?.endsWith(".webm") || thumbnailUrl?.endsWith(".mp4");

  if (!thumbnailUrl) {
    return (
      <div className="flex size-24 shrink-0 items-center justify-center rounded-md bg-(--neutral-dark-85)">
        <FineTunedModelIcon className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-(--neutral-dark-85)">
      {isVideo ? (
        <video
          src={thumbnailUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt="Model thumbnail"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export default ModelThumbnail;
