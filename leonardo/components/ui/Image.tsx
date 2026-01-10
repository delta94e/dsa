"use client";

/**
 * Image Component
 *
 * Wrapper around Next.js Image with additional optimization options.
 * Matches production bundle module 877369.
 *
 * Next.js Image (module 949524) already uses forwardRef internally,
 * so refs are automatically forwarded when passed as props.
 */

import type { ComponentProps } from "react";
import NextImage from "next/image";

type NextImageProps = ComponentProps<typeof NextImage>;

export interface ImageProps
  extends Omit<NextImageProps, "alt" | "unoptimized"> {
  alt?: string;
  optimized?: boolean;
}

export function Image({ optimized, alt = "", ...props }: ImageProps) {
  return <NextImage alt={alt} {...props} unoptimized={!optimized} />;
}

export default Image;
