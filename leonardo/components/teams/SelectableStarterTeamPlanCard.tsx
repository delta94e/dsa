"use client";

/**
 * SelectableStarterTeamPlanCard Component
 *
 * Selectable plan card for Starter team plan.
 * Matches production bundle module 836075.
 */

import type { FC } from "react";
import { TEAM_PLANS_COST_PER_SEAT } from "@/constants/plans";

interface SelectableStarterTeamPlanCardProps {
  isSelected: boolean;
  isCurrentPlan: boolean;
  numberOfSeats: number;
  onSelect: () => void;
  className?: string;
}

const STARTER_FEATURES = [
  "8,500 tokens per seat/month",
  "Team asset sharing",
  "Priority support",
  "Collaborative workspaces",
];

export const SelectableStarterTeamPlanCard: FC<
  SelectableStarterTeamPlanCardProps
> = ({
  isSelected,
  isCurrentPlan,
  numberOfSeats,
  onSelect,
  className = "",
}) => {
  const costPerSeat = TEAM_PLANS_COST_PER_SEAT.STARTER ?? 24;
  const totalCost = costPerSeat * numberOfSeats;

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-1 cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
        isSelected
          ? "border-primary bg-surface-secondary"
          : "border-border hover:border-primary/50"
      } ${className}`}
    >
      {isCurrentPlan && (
        <div className="bg-secondary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
          Current Plan
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Starter</h3>
        <div
          className={`flex size-5 items-center justify-center rounded-full border-2 ${
            isSelected ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {isSelected && (
            <svg
              className="size-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">${costPerSeat}</span>
          <span className="text-secondary-foreground text-sm">/seat/mo</span>
        </div>
        <p className="text-secondary-foreground mt-1 text-sm">
          ${totalCost}/month for {numberOfSeats} seats
        </p>
      </div>

      <ul className="space-y-2">
        {STARTER_FEATURES.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <svg
              className="text-primary size-4 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectableStarterTeamPlanCard;
