"use client";

/**
 * ImageDropzone Component
 *
 * Image-specific dropzone wrapper with validation.
 * Based on Leonardo.ai module 508080.
 *
 * Wraps react-dropzone with image-specific file validation.
 */

import { type ReactNode, type RefObject } from "react";
import { useDropzone, type DropzoneState, type Accept } from "react-dropzone";
import { Box } from "@chakra-ui/react";
import { cn } from "@/lib/utils";

// ============================================================================
// Constants
// ============================================================================

// 25MB max file size (0x1900000 in hex = 26,214,400 bytes)
const DEFAULT_MAX_FILE_SIZE = 0x1900000;

const DEFAULT_ACCEPTED_FORMATS: Accept = {
  "image/jpg": [],
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
};

// ============================================================================
// Types
// ============================================================================

interface FileValidationError {
  code: string;
  message: string;
}

interface BaseDropzoneProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: unknown[]) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  children: (state: DropzoneState) => ReactNode;
  fileDialogRef?: RefObject<(() => void) | null>;
  openDialogOnClick?: boolean;
  acceptedFileFormats?: Accept;
  additionalValidation?: (file: File) => Promise<FileValidationError | null>;
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  fullHeight?: boolean;
  className?: string;
}

interface ImageDropzoneProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: unknown[]) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  children: (state: DropzoneState) => ReactNode;
  fileDialogRef?: RefObject<(() => void) | null>;
  openDialogOnClick?: boolean;
  fullHeight?: boolean;
  className?: string;
}

// ============================================================================
// BaseDropzone Component (i)
// ============================================================================

function BaseDropzone({
  onDrop,
  onError,
  disabled,
  children,
  fileDialogRef,
  openDialogOnClick,
  acceptedFileFormats,
  additionalValidation,
  maxNumberOfFiles,
  maxFileSize,
  fullHeight,
  className,
  ...rest
}: BaseDropzoneProps) {
  const dropzoneState = useDropzone({
    onDrop,
    onError,
    noClick: !openDialogOnClick,
    noKeyboard: !openDialogOnClick,
    disabled: disabled || !onDrop,
    accept: acceptedFileFormats,
    maxFiles: maxNumberOfFiles,
    validator: (file) => {
      // Skip validation for DataTransferItem
      if (file instanceof DataTransferItem) {
        return null;
      }

      // Check file size (synchronous validation)
      if (maxFileSize && file.size > maxFileSize) {
        return {
          code: "file-too-large",
          message: "The image dropped was not able to be validated",
        };
      }
      return null;
    },
  });

  // Expose open function via ref (side effect before return)
  if (fileDialogRef && fileDialogRef.current !== dropzoneState.open) {
    fileDialogRef.current = dropzoneState.open;
  }

  return (
    <Box
      position="relative"
      display={fullHeight ? "flex" : undefined}
      flexDirection={fullHeight ? "column" : undefined}
      flex={fullHeight ? 1 : undefined}
      className={className}
      {...rest}
    >
      {/* Disabled overlay */}
      {disabled && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          pointerEvents="none"
        />
      )}

      {/* Dropzone content - also spreads rest props as in original */}
      <Box
        display={fullHeight ? "flex" : undefined}
        flexDirection={fullHeight ? "column" : undefined}
        flex={fullHeight ? 1 : undefined}
        {...dropzoneState.getRootProps()}
        {...rest}
      >
        <input {...dropzoneState.getInputProps()} />
        {children(dropzoneState)}
      </Box>
    </Box>
  );
}

// ============================================================================
// ImageDropzone Component (default export)
// ============================================================================

/**
 * Image-specific dropzone with validation for jpg, jpeg, png, webp files.
 * Max file size: 25MB
 */
export function ImageDropzone({
  onDrop,
  onError,
  disabled,
  children,
  fileDialogRef,
  openDialogOnClick,
  fullHeight,
  ...rest
}: ImageDropzoneProps) {
  // Image-specific validation
  const validateImage = async (
    file: File
  ): Promise<FileValidationError | null> => {
    try {
      // Check if file has a type
      if (!file.type) {
        return {
          code: "couldnt-parse-image",
          message: "The image dropped was not able to be validated",
        };
      }

      // Check for supported image types
      const supportedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!supportedTypes.includes(file.type || "")) {
        return {
          code: "unsupported-image-type",
          message: `An unsupported image type was loaded. Only .jpg, .png and .webp are supported. (Received ${file.type})`,
        };
      }
    } catch {
      return {
        code: "couldnt-parse-image",
        message: "The image dropped was not able to be validated",
      };
    }

    return null;
  };

  return (
    <BaseDropzone
      onDrop={onDrop}
      onError={onError}
      fileDialogRef={fileDialogRef}
      openDialogOnClick={openDialogOnClick}
      disabled={disabled || !onDrop}
      acceptedFileFormats={DEFAULT_ACCEPTED_FORMATS}
      maxFileSize={DEFAULT_MAX_FILE_SIZE}
      additionalValidation={validateImage}
      fullHeight={fullHeight}
      {...rest}
    >
      {children}
    </BaseDropzone>
  );
}

export { BaseDropzone };
export type { ImageDropzoneProps, BaseDropzoneProps, FileValidationError };
export default ImageDropzone;
