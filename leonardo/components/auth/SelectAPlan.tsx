"use client";

/**
 * SelectAPlan Component
 *
 * Plan selection step in the team creation wizard.
 * Matches production bundle module 822853.
 */

import { useCallback, useEffect, useRef, type FC } from "react";

import { AngleDownIcon } from "@/components/icons/AngleDownIcon";
import { DiamondIcon } from "@/components/icons/DiamondIcon";
import { SelectableGrowthTeamPlanCard } from "@/components/teams/SelectableGrowthTeamPlanCard";
import { SelectableStarterTeamPlanCard } from "@/components/teams/SelectableStarterTeamPlanCard";
import { Button } from "@/components/ui/Button";
import { CardsNavigation } from "@/components/ui/CardsNavigation";
import { ContextualBanner } from "@/components/ui/ContextualBanner";
import { NumberStepper } from "@/components/ui/NumberStepper";
import {
  SplitDialogBody,
  SplitDialogFooter,
  SplitDialogHeader,
  SplitDialogTitle,
} from "@/components/ui/SplitDialog";

import {
  MAXIMUM_NUMBER_OF_SEATS,
  MINIMUM_NUMBER_OF_SEATS,
} from "@/constants/plans";
import { ExternalUrls } from "@/constants/externalUrls";
import { useScrollCards } from "@/hooks/useScrollCards";
import { MODAL_TEAM_CREATION_SELECT_A_PLAN_BACK_BUTTON } from "@/lib/analytics/trackingIds";

// ============================================================================
// Types
// ============================================================================

interface SelectAPlanProps {
  onPlanSelect: (plan: string) => void;
  selectedPlan: string;
  numberOfSeats: number;
  onChangeNumberOfSeats: (seats: number) => void;
  onNext: () => void;
  onBack: () => void;
  isNextButtonLoading?: boolean;
}

// ============================================================================
// SelectAPlan Component
// ============================================================================

export const SelectAPlan: FC<SelectAPlanProps> = ({
  onPlanSelect,
  selectedPlan,
  numberOfSeats,
  onChangeNumberOfSeats,
  onNext,
  onBack,
  isNextButtonLoading = false,
}) => {
  const scrollParentRef = useRef<HTMLDivElement>(null);

  const getInitialIndex = useCallback(() => {
    return 1 * (selectedPlan !== "STARTER" ? 1 : 0);
  }, [selectedPlan]);

  const { currentIndex, scrollToCard } = useScrollCards({
    scrollParentRef,
    numberOfCards: 2,
    initialIndex: getInitialIndex(),
  });

  useEffect(() => {
    scrollToCard(getInitialIndex());
  }, [scrollToCard, getInitialIndex]);

  const handlePlanSelect = (plan: string, index: number) => {
    onPlanSelect(plan);
    scrollToCard(index);
  };

  return (
    <>
      <SplitDialogHeader>
        <SplitDialogTitle>Select Your Team Plan</SplitDialogTitle>
      </SplitDialogHeader>

      <SplitDialogBody className="@container/select-a-plan-container py-6">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          {/* Number of Seats */}
          <div className="flex items-center justify-center gap-3 px-5">
            <span className="text-sm">Number of Seats</span>
            <NumberStepper
              value={numberOfSeats}
              onChange={onChangeNumberOfSeats}
              min={MINIMUM_NUMBER_OF_SEATS}
              max={MAXIMUM_NUMBER_OF_SEATS}
            />
          </div>

          {/* Custom Plan Banner */}
          <div className="w-full">
            <ContextualBanner
              variant="contextualBannerSecondary"
              heading="Need a Custom Plan?"
              description="Contact us for a plan that is tailored to your team."
              icon={<DiamondIcon className="path-gradient size-10" />}
              actions={
                <Button
                  asChild
                  variant="outline"
                  className="bg-surface-primary hover:bg-surface-secondary px-4 font-medium"
                >
                  <a
                    href={ExternalUrls.registerInterestForm}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Us
                  </a>
                </Button>
              }
            />
          </div>

          {/* Plan Cards Section */}
          <div className="flex w-full flex-col gap-5">
            {/* Cards Navigation (visible on mobile) */}
            <div className="flex w-full flex-col">
              <CardsNavigation
                currentIndex={currentIndex}
                columnCount={2}
                scrollToCard={scrollToCard}
                display="none"
                className="@[30rem]/select-a-plan-container:hidden flex"
              />
            </div>

            {/* Plan Cards */}
            <div
              ref={scrollParentRef}
              className="flex w-full gap-3 @max-[30rem]/select-a-plan-container:snap-x @max-[30rem]/select-a-plan-container:snap-mandatory @max-[30rem]/select-a-plan-container:overflow-x-auto @max-[30rem]/select-a-plan-container:scroll-smooth @max-[30rem]/select-a-plan-container:[scrollbar-width:none]"
            >
              <SelectableStarterTeamPlanCard
                isSelected={selectedPlan === "STARTER"}
                isCurrentPlan={false}
                numberOfSeats={numberOfSeats}
                onSelect={() => handlePlanSelect("STARTER", 0)}
                className="@max-[30rem]/select-a-plan-container:w-[92%] @max-[30rem]/select-a-plan-container:flex-none @max-[30rem]/select-a-plan-container:snap-center"
              />
              <SelectableGrowthTeamPlanCard
                isSelected={selectedPlan === "GROWTH"}
                isCurrentPlan={false}
                numberOfSeats={numberOfSeats}
                badgeText="20% more value!"
                onSelect={() => handlePlanSelect("GROWTH", 1)}
                className="@max-[30rem]/select-a-plan-container:w-[92%] @max-[30rem]/select-a-plan-container:flex-none @max-[30rem]/select-a-plan-container:snap-center"
              />
            </div>
          </div>
        </div>
      </SplitDialogBody>

      <SplitDialogFooter>
        <div className="flex w-full justify-center gap-6">
          <Button
            variant="outline"
            className="h-11 flex-shrink-0 flex-grow basis-26 px-2 py-4 text-sm font-medium"
            onClick={onBack}
            data-tracking-id={MODAL_TEAM_CREATION_SELECT_A_PLAN_BACK_BUTTON}
          >
            <AngleDownIcon className="rotate-90" />
            Back
          </Button>
          <Button
            variant="primary"
            className="h-11 flex-shrink-0 flex-grow basis-26 px-2 py-4 text-sm"
            onClick={onNext}
            isLoading={isNextButtonLoading}
            disabled={!selectedPlan || numberOfSeats < MINIMUM_NUMBER_OF_SEATS}
          >
            Checkout
            <AngleDownIcon className="rotate-270" />
          </Button>
        </div>
      </SplitDialogFooter>
    </>
  );
};

export default SelectAPlan;
