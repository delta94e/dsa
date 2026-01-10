"use client";

/**
 * ImageGuidanceImage Component
 *
 * Displays the reference image inside the thumbnail.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

const LEONARDO_LOGO = "https://cdn.leonardo.ai/static/images/logo.webp";

export interface ImageGuidanceImageProps {
  /**
   * Image URL
   */
  imageUrl?: string;
  /**
   * Alt text
   */
  alt?: string;
  /**
   * Whether image is disabled
   */
  disabled?: boolean;
  /**
   * Image width
   */
  width?: number;
  /**
   * Image height
   */
  height?: number;
  /**
   * Additional class name
   */
  className?: string;
}

export function ImageGuidanceImage({
  imageUrl = LEONARDO_LOGO,
  disabled = false,
  alt = "Reference image",
  className,
  height = 88,
  width = 88,
}: ImageGuidanceImageProps) {
  return (
    <Image
      src={imageUrl}
      alt={alt}
      loading="eager"
      width={width}
      height={height}
      className={cn(
        "absolute inset-0 z-[0] aspect-square size-full object-cover",
        disabled && "opacity-50 brightness-60 saturate-0",
        className
      )}
    />
  );
}

export default ImageGuidanceImage;
