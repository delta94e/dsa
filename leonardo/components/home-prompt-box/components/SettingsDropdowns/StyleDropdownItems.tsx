"use client";

/**
 * StyleDropdownItems Component
 *
 * Dropdown menu items for style selection.
 */

import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { CheckIcon } from "@/components/icons/CheckIcon";

export interface StyleOption {
  id: string;
  label: string;
}

export interface StyleDropdownItemsProps {
  /**
   * Available style options
   */
  options: StyleOption[];
  /**
   * Currently selected value
   */
  value: string;
  /**
   * Selection handler
   */
  onValueSelected: (value: string) => void;
}

export function StyleDropdownItems({
  options,
  value,
  onValueSelected,
}: StyleDropdownItemsProps) {
  return (
    <>
      {options.map((option) => {
        const isSelected = option.id === value;

        return (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => onValueSelected(option.id)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-2",
              { "bg-hover": isSelected }
            )}
          >
            <span>{option.label}</span>
            {isSelected && <CheckIcon className="h-4 w-4" />}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

export default StyleDropdownItems;
