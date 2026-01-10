"use client";

/**
 * useImageDropzone Hook
 *
 * Hook for handling image file uploads via dropzone.
 * Based on Leonardo.ai module 634620.
 */

import { useState, useCallback } from "react";

interface UseImageDropzoneProps {
  onAddImage: (image: {
    id: string;
    url: string;
    alt?: string;
    initImageId?: string;
  }) => Promise<void>;
}

interface UseImageDropzoneReturn {
  handleFileUpload: (acceptedFiles: File[]) => Promise<void>;
  isLoading: boolean;
}

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useImageDropzone({
  onAddImage,
}: UseImageDropzoneProps): UseImageDropzoneReturn {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        console.warn("Invalid file type:", file.type);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        console.warn("File too large:", file.size);
        return;
      }

      setIsLoading(true);

      try {
        // Create a temporary URL for the file
        const url = URL.createObjectURL(file);
        const id = `upload-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        await onAddImage({
          id,
          url,
          alt: file.name,
          initImageId: id, // Use the generated id as initImageId for uploads
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onAddImage]
  );

  return {
    handleFileUpload,
    isLoading,
  };
}

export default useImageDropzone;
