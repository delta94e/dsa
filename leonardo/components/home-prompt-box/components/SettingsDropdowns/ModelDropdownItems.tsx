"use client";

/**
 * ModelDropdownItems Component
 *
 * Dropdown menu items for model selection with thumbnails.
 */

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { ModelThumbnail } from "./ModelThumbnail";
import type { ModelPreset } from "../../constants";

export interface ModelDropdownItemsProps {
  /**
   * Available model options
   */
  options: ModelPreset[];
  /**
   * Currently selected value
   */
  value: string;
  /**
   * Selection handler
   */
  onValueSelected: (value: string) => void;
  /**
   * Handler for "More options" button
   */
  onMoreOptions: () => void;
}

export function ModelDropdownItems({
  options,
  value,
  onValueSelected,
  onMoreOptions,
}: ModelDropdownItemsProps) {
  return (
    <>
      {options.map((option) => {
        const isSelected = option.id === value;

        return (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => onValueSelected(option.id)}
            className="flex cursor-pointer items-center gap-4 p-4 focus:bg-transparent focus:outline-none data-highlighted:bg-transparent"
          >
            <ModelThumbnail thumbnailUrl={option.thumbnailUrl} />
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-sm font-medium text-white">
                {option.label}
              </span>
              {option.description && (
                <span className="text-tertiary-foreground text-xs">
                  {option.description}
                </span>
              )}
            </div>
            {isSelected && (
              <CheckIcon className="ml-2 h-4 w-4 shrink-0 text-white" />
            )}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={onMoreOptions}
        className="flex cursor-pointer items-center justify-between gap-2 px-4 py-2"
      >
        <span className="text-sm font-medium">More options</span>
        <ChevronRightIcon className="h-4 w-4" />
      </DropdownMenuItem>
    </>
  );
}

export default ModelDropdownItems;
