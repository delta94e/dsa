"use client";

/**
 * SelectImageThumbnail Component
 *
 * Thumbnail component for image selection in modals.
 * Based on Leonardo.ai module 989982.
 *
 * Features:
 * - Image preview with loading states
 * - Selection indicator with gradient background
 * - Source label display
 * - Transparent background pattern support
 */

import {
  forwardRef,
  memo,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, isValidMotionProp, type MotionProps } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { Image as NextImage } from "@/components/ui/Image";
import { type ModalImage, type LegacyModalImage } from "./imageModalUtils";

// ============================================================================
// Constants
// ============================================================================

const LEONARDO_LOGO_GREYSCALE = "/images/leonardo-logo-greyscale.svg";
const IMG_AS_MD = "?w=400&q=75";

// Image cache for tracking loaded images
const imageLoadCache = new Map<string, boolean>();

// Animation variants
const exitVariants = { exit: { opacity: 0 }, initial: false };

const staggerAnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Types (using ModalImage from imageModalUtils)
// ============================================================================

// ============================================================================
// Helper Functions
// ============================================================================

function isProtectedUrl(url: string): boolean {
  // Check if URL requires credentials
  return (
    url.includes("cdn.leonardo.ai") || url.includes("storage.googleapis.com")
  );
}

function getIsTransparent(transparency?: boolean): boolean {
  return transparency === true;
}

function getImageDataUri(
  imgElement: HTMLImageElement,
  maxBytes: number = 589824
): string {
  const canvas = document.createElement("canvas");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(imgElement, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.8);
}

// ============================================================================
// Placeholder Component
// ============================================================================

interface PlaceholderProps {
  width: number;
  aspectRatio: number;
  placeholderBgSize?: string;
}

function Placeholder({
  width,
  aspectRatio,
  placeholderBgSize = "35%",
}: PlaceholderProps) {
  return (
    <div
      className="relative rounded-md before:absolute before:inset-0 before:block before:h-full before:w-full before:bg-[image:var(--placeholder-bg-image)] before:bg-[length:var(--placeholder-bg-size,35%)] before:bg-center before:bg-no-repeat before:opacity-20 before:grayscale before:content-['']"
      style={
        {
          "--placeholder-width": `${width}px`,
          "--placeholder-aspect-ratio": `${aspectRatio}`,
          "--placeholder-height":
            "calc(var(--placeholder-width) / var(--placeholder-aspect-ratio))",
          "--placeholder-bg-image": `url(${LEONARDO_LOGO_GREYSCALE})`,
          "--placeholder-bg-size": placeholderBgSize,
          width: "var(--placeholder-width)",
          height: "var(--placeholder-height)",
        } as React.CSSProperties
      }
    />
  );
}

// ============================================================================
// ThumbnailImage Component (E)
// ============================================================================

interface ThumbnailImageProps extends Partial<MotionProps> {
  imageUrl?: string;
  alt?: string;
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isTransparent?: boolean;
  width?: number;
  height?: number;
  cursor?: string;
  onThumbLoad?: () => void;
  onThumbError?: () => void;
  onThumbClick?: () => void;
  selectedSourceLabel?: string;
}

const ThumbnailImage = memo(
  forwardRef<HTMLImageElement, ThumbnailImageProps>(
    (
      {
        imageUrl,
        alt,
        isLoading,
        isSelected,
        isDisabled,
        isTransparent,
        width = 100,
        height = 100,
        cursor,
        onThumbLoad,
        onThumbError,
        onThumbClick,
        selectedSourceLabel,
        ...restProps
      },
      ref
    ) => {
      // Extract motion props from rest props (matching original w = Object.keys(y).reduce...)
      const { motionProps } = Object.keys(restProps).reduce<{
        motionProps: Record<string, unknown>;
      }>(
        (acc, key) => {
          if (isValidMotionProp(key)) {
            acc.motionProps[key] = (restProps as Record<string, unknown>)[key];
          }
          return acc;
        },
        { motionProps: {} }
      );

      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);
      const aspectRatio = width > 0 && height > 0 ? width / height : 1;
      const showPlaceholder = isLoading || !imageUrl || imageUrl === "";

      const style: React.CSSProperties = {
        width: `${width}px`,
        height: "auto",
        cursor:
          cursor ||
          (isDisabled && !showPlaceholder ? "not-allowed" : "pointer"),
      };

      return (
        <motion.div
          variants={staggerAnimationVariants}
          animate="visible"
          {...exitVariants}
        >
          <div
            className={cn(
              "group relative flex justify-center overflow-hidden rounded-md border-solid select-none",
              {
                [`bg-[url(${LEONARDO_LOGO_GREYSCALE})] bg-[length:35%] bg-center bg-no-repeat opacity-20 grayscale`]:
                  showPlaceholder,
                "hover:border-gradient-primary hover:bg-gradient-primary":
                  !isDisabled && !showPlaceholder,
                "border-gradient-primary bg-gradient-primary":
                  isSelected && !showPlaceholder,
                "opacity-50": isDisabled && !showPlaceholder,
              }
            )}
            style={style}
            onClick={isDisabled ? undefined : onThumbClick}
          >
            {!showPlaceholder && imageUrl && width > 0 && height > 0 ? (
              <NextImage
                src={imageUrl}
                ref={ref}
                alt={alt || ""}
                width={roundedWidth}
                height={roundedHeight}
                onLoad={onThumbLoad}
                onError={onThumbError}
                className={cn(
                  "m-1 max-h-[calc(100%-8px)] max-w-[calc(100%-8px)] rounded-md object-contain",
                  isTransparent &&
                    "bg-[conic-gradient(#2D3445_90deg,transparent_90deg_180deg,#2D3445_180deg_270deg,transparent_270deg),repeating-linear-gradient(to_right,#06080D,#0D121C)] bg-[length:20px_20px,10px_10px]"
                )}
                crossOrigin={
                  isProtectedUrl(imageUrl) ? "use-credentials" : "anonymous"
                }
                loading="lazy"
              />
            ) : (
              <Placeholder width={roundedWidth} aspectRatio={aspectRatio} />
            )}

            {/* Selection overlay */}
            <div
              className={cn(
                "absolute inset-0 m-1 box-border flex items-center justify-center rounded-md bg-clip-border",
                {
                  "bg-black/65": isSelected,
                  "group-hover:bg-black/65": !isDisabled,
                }
              )}
            >
              {isSelected && (
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #FA5560 -23.47%, #B14BF4 45.52%, #4D91FF 114.8%)",
                    }}
                  >
                    <CheckIcon width={10} height={10} />
                  </div>
                  {selectedSourceLabel && (
                    <p className="text-secondary-foreground mt-2 text-center text-xs font-normal">
                      Selected in
                      <span className="block font-medium">
                        {selectedSourceLabel}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }
  )
);
ThumbnailImage.displayName = "ThumbnailImage";

// ============================================================================
// SelectImageThumbnail Component (b)
// ============================================================================

interface SelectImageThumbnailProps extends Partial<MotionProps> {
  image: LegacyModalImage;
  isDisabled?: boolean;
  isSelected?: boolean;
  selectedImages?: LegacyModalImage[];
  onImageSelected?: (image: LegacyModalImage) => void;
  cursor?: string;
  columnWidth: number;
  isLoading?: boolean;
  sourceLabel?: string;
  estimatedHeight?: number;
}

const SelectImageThumbnail = memo(
  forwardRef<HTMLImageElement, SelectImageThumbnailProps>(
    (
      {
        image,
        isDisabled,
        selectedImages,
        onImageSelected,
        cursor,
        columnWidth,
        isLoading,
        sourceLabel,
        ...props
      },
      ref
    ) => {
      const imgRef = useRef<HTMLImageElement>(null);
      useImperativeHandle(ref, () => imgRef.current as HTMLImageElement);

      const { getValues } = useFormContext();

      // Check if selected
      const isSelected =
        selectedImages?.some(
          (item) => item.initImageId === image.initImageId
        ) || false;

      // Check transparency
      const isTransparent = getIsTransparent(image.generation?.transparency);

      // Cache key
      const cacheKey = image.initImageId || image.url;

      // Track if image is loaded
      const [_isImgLoaded, setIsImgLoaded] = useState(
        () => !!imageLoadCache.has(cacheKey) && imageLoadCache.get(cacheKey)!
      );

      // Get image URL (with variation fallback for upscaled)
      const generationTypeFilter = getValues(
        "YOUR_GENERATIONS.generationTypeFilter"
      );
      const imageUrl =
        (generationTypeFilter === "Upscaled" && image.urlVariation) ||
        image.url;

      // Thumbnail URL with size params
      const [thumbnailUrl] = useState(() => imageUrl + IMG_AS_MD);

      // Original URL for selection
      const originalUrl = image.url;

      // Aspect ratio
      const aspectRatio = image.aspectRatio || 1;

      // Handle image selection
      const handleSelect = useCallback(
        (overrides: Partial<LegacyModalImage> = {}, clickedUrl?: string) => {
          const updatedImage = { ...image, ...overrides };
          const isOriginal = clickedUrl === originalUrl;
          if (!clickedUrl || isOriginal) {
            onImageSelected?.(updatedImage);
          }
        },
        [image, originalUrl, onImageSelected]
      );

      // Handle click
      const handleClick = useCallback(async () => {
        if (!isDisabled && imgRef.current) {
          try {
            if (isSelected) {
              handleSelect({}, originalUrl);
            } else {
              const dataUri = getImageDataUri(imgRef.current, 589824);
              handleSelect({ base64ImageUri: dataUri });
            }
          } catch (error) {
            handleSelect({});
          }
        }
      }, [isDisabled, isSelected, handleSelect, originalUrl]);

      // Handle load
      const handleLoad = useCallback(() => {
        setIsImgLoaded(true);
        imageLoadCache.set(cacheKey, true);
      }, [cacheKey]);

      // Handle error
      const handleError = useCallback(() => {
        imageLoadCache.set(cacheKey, false);
      }, [cacheKey]);

      return (
        <ThumbnailImage
          ref={imgRef}
          imageUrl={thumbnailUrl}
          alt={image.alt}
          isDisabled={isDisabled}
          isSelected={isSelected}
          isTransparent={isTransparent}
          width={columnWidth}
          isLoading={isLoading || !imageUrl || imageUrl === ""}
          height={
            columnWidth > 0 && aspectRatio > 0 ? columnWidth / aspectRatio : 100
          }
          cursor={cursor}
          onThumbLoad={handleLoad}
          onThumbError={handleError}
          onThumbClick={handleClick}
          selectedSourceLabel={sourceLabel}
          {...props}
        />
      );
    }
  )
);
SelectImageThumbnail.displayName = "SelectImageThumbnail";

// ============================================================================
// Exports
// ============================================================================

export {
  ThumbnailImage,
  SelectImageThumbnail,
  Placeholder,
  type LegacyModalImage,
  type ThumbnailImageProps,
  type SelectImageThumbnailProps,
};

export default SelectImageThumbnail;
