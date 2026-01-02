"use client";

import { type FC, memo } from "react";
import { cn } from "@/lib/utils";

// Types
export interface TokenDisplayProps {
  /** Hide team logo in display */
  hideTeamLogo?: boolean;
  /** Use compact styling */
  compactStyle?: boolean;
  /** Use short format for numbers */
  shortFormat?: boolean;
  /** Side for popover */
  popoverSide?: "top" | "right" | "bottom" | "left";
  /** Alignment for popover */
  popoverAlign?: "start" | "center" | "end";
  /** Additional CSS classes for the pill */
  pillClasses?: string;
}

/**
 * Format token number with suffix (K, M, etc)
 */
function formatTokensWithSuffix(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * TokenDisplay (nQ.default in production)
 *
 * Displays user's token balance with hover popover for detailed breakdown.
 *
 * Production structure:
 * - Token pill with coin icon and count
 * - Upgrade button for free users
 * - Popover with TokenBreakdown component
 * - Uses hooks: useSelectedTeam, useSubscriptionData, usePlan
 */
export const TokenDisplay: FC<TokenDisplayProps> = memo(
  ({ compactStyle = false, shortFormat = false, pillClasses = "" }) => {
    // TODO: Replace with actual hooks when available
    // const { totalTokens, currentTokens } = useTokens();
    // const { isUserFreePlan } = usePlan();

    // Placeholder values
    const totalTokens = 150;
    const isUserFreePlan = false;

    return (
      <div
        className={cn(
          "flex min-h-[1.625rem] cursor-pointer items-center justify-center gap-2 rounded-[1.875rem] border border-[#282C42]",
          compactStyle ? "flex-col gap-2.5 border-none p-0" : "w-full px-3.5",
          pillClasses
        )}
      >
        {/* Token display */}
        <div className="flex flex-1 items-center justify-center gap-0.5">
          {/* Coin icon with gradient */}
          <svg className="size-4" viewBox="0 0 20 20" fill="none">
            <defs>
              <linearGradient id="coin-gradient" x1="0" y1="0" x2="20" y2="20">
                <stop offset="0%" stopColor="#DB519E" />
                <stop offset="50%" stopColor="#C14DD4" />
                <stop offset="100%" stopColor="#6A6AFB" />
              </linearGradient>
            </defs>
            <circle cx="10" cy="10" r="8" fill="url(#coin-gradient)" />
            <path
              d="M10 5v10M7 8h6M7 12h6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Token count */}
          <p className="text-xs font-semibold text-white">
            {shortFormat
              ? formatTokensWithSuffix(totalTokens)
              : totalTokens.toLocaleString()}
          </p>
        </div>

        {/* Upgrade button for free users */}
        {isUserFreePlan && (
          <button
            className={cn(
              "m-0.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-3 py-1 text-xs font-medium text-white",
              compactStyle && "rounded"
            )}
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }
);

TokenDisplay.displayName = "TokenDisplay";

export default TokenDisplay;
