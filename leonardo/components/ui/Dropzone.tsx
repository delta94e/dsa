"use client";

/**
 * Dropzone Component
 *
 * A wrapper around react-dropzone for file uploads.
 * Based on Leonardo.ai module 508080.
 */

import { FC, ReactNode, useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";

interface DropzoneRenderProps {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  open: () => void;
}

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  disabled?: boolean;
  className?: string;
  accept?: DropzoneOptions["accept"];
  maxSize?: number;
  children: (props: DropzoneRenderProps) => ReactNode;
}

const DEFAULT_ACCEPT = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const Dropzone: FC<DropzoneProps> = ({
  onDrop,
  disabled = false,
  className,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  children,
}) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!disabled) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop, disabled]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    disabled,
    noClick: true, // We handle click via the Button inside
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          isDragAccept && "border-green-500 bg-green-500/5",
          isDragReject && "border-destructive bg-destructive/5",
          disabled && "opacity-50 cursor-not-allowed",
          className
        ),
      })}
    >
      <input {...getInputProps()} />
      {children({ isDragActive, isDragAccept, isDragReject, open })}
    </div>
  );
};

export default Dropzone;
