"use client";

/**
 * PromptInputContainer Component
 *
 * LiquidGlassCard wrapper with focus handling for the prompt input.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";

export interface PromptInputContainerProps {
  /**
   * Whether the container is expanded
   */
  isExpanded?: boolean;
  /**
   * Enable glass distortion effect
   */
  enableGlassDistortion?: boolean;
  /**
   * ID of the input to focus when clicking the container
   */
  focusTargetId?: string;
  /**
   * Children elements
   */
  children: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

export function PromptInputContainer({
  children,
  enableGlassDistortion = false,
  className,
  isExpanded = true,
  focusTargetId,
}: PromptInputContainerProps) {
  return (
    <LiquidGlassCard
      enableDistortion={enableGlassDistortion}
      borderRadius="1.5rem"
      blurIntensity="xl"
      shadowIntensity="xs"
      glowIntensity="none"
      className={cn(
        "relative mx-auto w-full max-w-272.5 flex-1 bg-[#0a0a0a]/50 transition-all",
        className
      )}
      style={{ transition: "all 150ms cubic-bezier(0.40,0.00,1.00,1.00)" }}
    >
      {/* Clickable label to focus input */}
      {focusTargetId && (
        <label
          htmlFor={focusTargetId}
          className="absolute inset-0 z-0 cursor-text"
        />
      )}

      <div
        className={cn("flex flex-col transition-all", {
          "gap-0 px-2.5 py-2.5 sm:p-2.5 md:px-4 md:py-4": !isExpanded,
          "gap-2.5 px-2.5 py-2.5 sm:p-2.5 md:gap-6 md:px-4 md:py-4": isExpanded,
          "pointer-events-none relative": focusTargetId,
        })}
      >
        {children}
      </div>
    </LiquidGlassCard>
  );
}

export default PromptInputContainer;
