"use client";

/**
 * ModeSelectorButton Component
 *
 * Individual mode button with icon and optional tooltip.
 */

import { type ReactNode, type ComponentType, type SVGProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export interface ModeSelectorButtonProps {
  /**
   * Whether this mode is currently selected
   */
  isSelected: boolean;
  /**
   * Click handler to select this mode
   */
  onSelect: () => void;
  /**
   * Button label
   */
  children: ReactNode;
  /**
   * Optional icon component
   */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * Whether button is disabled
   */
  disabled?: boolean;
  /**
   * Tooltip content when disabled
   */
  tooltip?: string;
  /**
   * Additional class name
   */
  className?: string;
}

export function ModeSelectorButton({
  isSelected,
  onSelect,
  children,
  icon: Icon,
  disabled = false,
  tooltip,
  className,
}: ModeSelectorButtonProps) {
  const button = (
    <Button
      variant={isSelected ? "gradientOutline" : "ghost"}
      size="default"
      className={cn(
        "rounded-full whitespace-nowrap hover:bg-transparent",
        !isSelected && "inactive-btn",
        className
      )}
      onClick={onSelect}
      aria-label={`${children} generation`}
      aria-pressed={isSelected}
      disabled={disabled}
      type="button"
    >
      {Icon && <Icon className="hidden md:block" />}
      <span>{children}</span>
    </Button>
  );

  if (disabled && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-not-allowed">{button}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export default ModeSelectorButton;
