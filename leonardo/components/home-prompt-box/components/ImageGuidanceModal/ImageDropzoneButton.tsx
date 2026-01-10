"use client";

/**
 * ImageDropzoneButton Component
 *
 * A dropzone button for uploading images in the ImageGuidanceModal.
 * Based on Leonardo.ai module 736763.
 */

import { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";
import { UploadOutlineIcon } from "@/components/icons/UploadOutlineIcon";
import { useImageDropzone } from "@/hooks/useImageDropzone";
import { Dropzone } from "@/components/ui";

interface ImageDropzoneButtonProps {
  isDisabled?: boolean;
  onAddImage: (image: {
    id: string;
    url: string;
    alt?: string;
    initImageId?: string;
  }) => Promise<void>;
}

export const ImageDropzoneButton: FC<ImageDropzoneButtonProps> = ({
  isDisabled,
  onAddImage,
}) => {
  const { handleFileUpload, isLoading } = useImageDropzone({
    onAddImage,
  });

  return (
    <Dropzone
      onDrop={handleFileUpload}
      disabled={isDisabled}
      className={cn({ "cursor-not-allowed": isDisabled })}
    >
      {({ isDragReject, isDragAccept, open }) => (
        <Button
          onClick={open}
          variant="secondary"
          size="lg"
          disabled={isDisabled || isLoading}
          className={cn("size-full min-h-32 px-2 py-5", {
            "border-gradient-bg-hover border-gradient-primary": isDragAccept,
            "border-negative-foreground": isDragReject,
          })}
        >
          <div className="flex items-center justify-center">
            {isLoading ? (
              <SpinnerIcon
                className="absolute animate-spin duration-500"
                aria-hidden
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <UploadOutlineIcon className="size-11" />
                <div className="flex flex-col items-center text-sm">
                  <span className="text-foreground-primary font-medium">
                    Upload an image
                  </span>
                  {isDragReject ? (
                    <span className="text-negative-foreground font-normal break-words whitespace-normal">
                      Only accepts .jpeg .jpg .png and .webp
                    </span>
                  ) : (
                    <span className="text-secondary-foreground font-normal break-words whitespace-normal">
                      PNG, JPG or WEBP up to 5MB
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Button>
      )}
    </Dropzone>
  );
};

export default ImageDropzoneButton;
