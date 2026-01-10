"use client";

/**
 * AspectRatioDropdownItems Component
 *
 * Dropdown menu items for aspect ratio selection.
 */

import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { AspectRatioOption } from "../../constants";

export interface AspectRatioDropdownItemsProps {
  /**
   * Available aspect ratio options
   */
  options: AspectRatioOption[];
  /**
   * Currently selected value
   */
  value: string;
  /**
   * Selection handler
   */
  onValueSelected: (value: string) => void;
}

export function AspectRatioDropdownItems({
  options,
  value,
  onValueSelected,
}: AspectRatioDropdownItemsProps) {
  return (
    <>
      {options.map((option) => {
        const isSelected = option.value === value;

        const menuItem = (
          <DropdownMenuItem
            key={option.value}
            disabled={option.disabled}
            onSelect={() => onValueSelected(option.value)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-2",
              { "bg-hover": isSelected }
            )}
          >
            <span>{option.displayLabel}</span>
            {isSelected && <CheckIcon className="h-4 w-4" />}
          </DropdownMenuItem>
        );

        // Show tooltip if disabled with reason
        if (option.disabled && option.disabledReason) {
          return (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>{menuItem}</TooltipTrigger>
              <TooltipContent side="left">
                {option.disabledReason}
              </TooltipContent>
            </Tooltip>
          );
        }

        return menuItem;
      })}
    </>
  );
}

export default AspectRatioDropdownItems;
