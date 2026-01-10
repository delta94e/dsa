"use client";

/**
 * ImageGuidanceModal Component
 *
 * Modal for selecting images for guidance (references/start frames).
 * Uses tabs to show uploads and generations.
 *
 * TODO: Implement full functionality with:
 * - Asset selection from uploads
 * - Asset selection from generations
 * - Image dimension validation
 * - Multi-select for image mode
 */

import { type FC, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { InternalImageGuidanceItem } from "../../types";

// ============================================================================
// Types
// ============================================================================

export interface ImageAsset {
  id: string;
  url: string;
  initImageId?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ImageGuidanceModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Handler when assets are selected */
  onSelectAssets: (assets: InternalImageGuidanceItem[]) => void;
  /** Modal title */
  title?: string;
  /** Whether multiple images can be selected */
  isMultipleSelection?: boolean;
  /** Maximum number of images to select */
  selectionLimit?: number;
  /** Whether image dimensions are required */
  isImageDimensionsRequired?: boolean;
  /** Children (tab content) */
  children?: ReactNode;
}

// ============================================================================
// Placeholder Tab Components
// ============================================================================

interface UploadsTabProps {
  id: string;
  excludeImageIds?: string[];
}

export const UploadsTab: FC<UploadsTabProps> = ({ id, excludeImageIds }) => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>Your Uploads</p>
      <p className="text-sm">Upload images to use as guidance</p>
      {/* TODO: Implement uploads grid */}
    </div>
  );
};

interface GenerationsTabProps {
  id: string;
  label?: string;
  includeMotion?: boolean;
  excludeImageIds?: string[];
}

export const GenerationsTab: FC<GenerationsTabProps> = ({
  id,
  label = "Your Generations",
  includeMotion = false,
  excludeImageIds,
}) => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>{label}</p>
      <p className="text-sm">Select from your previous generations</p>
      {/* TODO: Implement generations grid */}
    </div>
  );
};

// ============================================================================
// Component
// ============================================================================

export const ImageGuidanceModal: FC<ImageGuidanceModalProps> = ({
  isOpen,
  onClose,
  onSelectAssets,
  title = "Select Images for Guidance",
  isMultipleSelection = true,
  selectionLimit = 4,
  isImageDimensionsRequired = true,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-[400px]">
          {children || (
            <div className="flex flex-col gap-4 p-4">
              <p className="text-center text-muted-foreground">
                {isMultipleSelection
                  ? `Select up to ${selectionLimit} images`
                  : "Select an image"}
              </p>
              {/* Placeholder content */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGuidanceModal;
