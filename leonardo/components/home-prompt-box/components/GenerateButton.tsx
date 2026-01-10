"use client";

/**
 * GenerateButton Component
 *
 * Generate button with loading state, tooltip, and gradient styling.
 */

import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export interface GenerateButtonProps {
  /**
   * Click handler for generate action
   */
  onGenerate: () => void;
  /**
   * Whether generation is in progress
   */
  isGenerating?: boolean;
  /**
   * Whether button is disabled
   */
  isDisabled?: boolean;
  /**
   * Tooltip content to show
   */
  tooltipContent?: ReactNode;
  /**
   * Tooltip position
   */
  tooltipSide?: "top" | "bottom" | "left" | "right";
  /**
   * Button content (default: "Generate")
   */
  children?: ReactNode;
  /**
   * Border radius class
   */
  borderRadius?: string;
  /**
   * Content width class
   */
  contentWidth?: string;
  /**
   * Additional class name
   */
  className?: string;
}

export const GenerateButton = forwardRef<
  HTMLButtonElement,
  GenerateButtonProps
>(function GenerateButton(
  {
    onGenerate,
    isGenerating = false,
    isDisabled = false,
    tooltipContent,
    tooltipSide = "bottom",
    children,
    borderRadius = "rounded-xl",
    contentWidth = "w-fit",
    className,
  },
  ref
) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isGenerating) {
      onGenerate();
    }
  };

  return (
    <div
      data-tour-id="generate-button"
      className={cn("relative h-min", contentWidth, className)}
    >
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            onClick={handleClick}
            disabled={isDisabled || isGenerating}
            aria-busy={isGenerating}
            aria-label={isGenerating ? "Generating, please wait" : "Generate"}
            type="button"
            className={cn(contentWidth, borderRadius)}
          >
            <div
              className={cn("flex items-center justify-center gap-2", {
                "opacity-50": isGenerating,
                "opacity-100": !isGenerating,
              })}
            >
              <span>{children || "Generate"}</span>
            </div>
          </Button>
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
        )}
      </Tooltip>
    </div>
  );
});

export default GenerateButton;
