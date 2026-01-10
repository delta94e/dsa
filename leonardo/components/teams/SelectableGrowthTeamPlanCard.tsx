"use client";

/**
 * SelectableGrowthTeamPlanCard Component
 *
 * Selectable plan card for Growth team plan.
 * Matches production bundle module 262975.
 */

import React, { type FC, type ReactNode } from "react";
import {
  VStack,
  Flex,
  Divider,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CheckCircleOutlineIcon } from "@/components/icons/CheckCircleOutlineIcon";
import { QuestionCircleIcon } from "@/components/icons/QuestionCircleIcon";
import { GRADIENTS } from "@/constants/styles";
import { TEAM_PLANS_COST_PER_SEAT } from "@/constants/plans";
import { segmentTextByFormatMarkers } from "@/lib/utils/string";
import { SelectablePlanCard } from "./SelectablePlanCard";
import { TeamPlanCardHeader } from "./TeamPlanCardHeader";
import { PrimaryBenefits, PrimaryBenefit } from "./PrimaryBenefits";

// Helper component to render formatted text with markers
const FormattedText: FC<{ text: string }> = ({ text }) => (
  <>
    {segmentTextByFormatMarkers(text).map((segment, idx) => (
      <Text
        key={idx}
        as="span"
        variant={segment.type === "highlight" ? "textAccent" : undefined}
        fontWeight={
          ["highlight", "bold"].includes(segment.type) ? "semibold" : "normal"
        }
      >
        {segment.text}
      </Text>
    ))}
  </>
);

// Feature item component
const FeatureItem: FC<{
  icon: ReactNode;
  text: string | string[];
  tooltipText?: string;
}> = ({ icon, text, tooltipText }) => (
  <div className="flex items-start gap-2">
    <span className="text-highlight-foreground mt-0.5 flex h-4 w-4 shrink-0">
      {icon}
    </span>
    <Text fontSize="xs">
      {typeof text === "string" && <FormattedText text={text} />}
      {Array.isArray(text) &&
        text.map((line, idx) => {
          const isLast = idx === text.length - 1;
          return (
            <React.Fragment key={line}>
              <FormattedText text={line} />
              {!isLast && <br />}
            </React.Fragment>
          );
        })}
      {tooltipText && (
        <Tooltip
          label={tooltipText}
          aria-label={tooltipText}
          hasArrow
          placement="auto"
          fontSize="sm"
        >
          <button
            style={{ display: "inline", marginLeft: 4 }}
            aria-label={tooltipText}
            data-interactive
          >
            <QuestionCircleIcon cursor="pointer" />
          </button>
        </Tooltip>
      )}
    </Text>
  </div>
);

// Benefits section component
const BenefitsSection: FC<{ heading: ReactNode; children: ReactNode }> = ({
  heading,
  children,
}) => (
  <VStack
    gap={3}
    px={3}
    py={4}
    rounded="xl"
    bg="background.tealblue"
    alignItems="stretch"
    flexGrow={1}
  >
    <Heading as="h3" fontSize="sm">
      {heading}
    </Heading>
    <Divider
      sx={{
        border: "none",
        height: "1px",
        background: GRADIENTS.PURPLE_THREE,
      }}
    />
    <Flex
      direction="column"
      gap={4}
      color="lightbluegrey"
      fontWeight="normal"
      as="ul"
      width="100%"
    >
      {children}
    </Flex>
  </VStack>
);

const GROWTH_COST_PER_SEAT = TEAM_PLANS_COST_PER_SEAT.GROWTH ?? 48;

const GROWTH_FEATURES: (string | [string, string])[] = [
  [
    `${(60000).toLocaleString()}  Fast Tokens Per Seat`,
    "Resets on your Billing Date",
  ],
  `${(180000).toLocaleString()} Rollover Token Bank Capacity Per Seat`,
  "Unlimited Image Generation at a relaxed pace*",
  "Unlimited Video Generation at a relaxed pace*",
  "Unlimited generation excludes Flow State, GPT-1, Flux Kontext, Ideogram, Nano Banana, Flux Kontext Max, Veo 3, Kling 2.5 Turbo, Kling 2.1 Pro, Sora 2 and Sora 2 Pro",
  "Create Private Team Generations",
  "Ability to train AI models using team tokens",
  "Unlimited collections – organize all your creations",
  "Unlimited Realtime Canvas actions",
  "Unlimited Realtime Generation actions",
  "Run 6 generations simultaneously",
  "Queue up to 20 generations at once",
  "Unlock Enhanced Quality",
];

interface ActionButtonProps {
  displayActionButton?: boolean;
  // Add other action button props as needed
}

interface SelectableGrowthTeamPlanCardProps {
  isSelected: boolean;
  isCurrentPlan: boolean;
  numberOfSeats: number;
  badgeText?: string;
  onSelect: () => void;
  actionButtonProps?: ActionButtonProps;
  className?: string;
}

export const SelectableGrowthTeamPlanCard: FC<
  SelectableGrowthTeamPlanCardProps
> = ({
  isSelected,
  isCurrentPlan,
  numberOfSeats,
  badgeText,
  onSelect,
  actionButtonProps,
  ...rest
}) => {
  const { displayActionButton } = actionButtonProps || {};
  const isSelectable = !displayActionButton && !isCurrentPlan;

  return (
    <SelectablePlanCard
      onSelect={isSelectable ? onSelect : undefined}
      showBorder={isSelectable && isSelected}
      badgeText={badgeText}
      {...rest}
    >
      <TeamPlanCardHeader
        isCurrentPlan={isCurrentPlan}
        isSelected={isSelected}
        planName="Growth"
        planNameStyle="gradient"
        pricePerSeat={GROWTH_COST_PER_SEAT}
        numberOfSeats={numberOfSeats}
        actionButtonProps={actionButtonProps}
      />
      <BenefitsSection
        heading={
          <PrimaryBenefits>
            <PrimaryBenefit
              heading={`[[${(
                60000 * numberOfSeats
              ).toLocaleString()}]] Shared Tokens`}
            />
            <PrimaryBenefit
              heading={`[[${(
                180000 * numberOfSeats
              ).toLocaleString()}]] Bank Capacity`}
            />
          </PrimaryBenefits>
        }
      >
        {GROWTH_FEATURES.map((feature, idx) => (
          <FeatureItem
            key={idx}
            icon={
              <CheckCircleOutlineIcon className="text-highlight-foreground h-4 w-4 shrink-0" />
            }
            text={feature}
          />
        ))}
      </BenefitsSection>
    </SelectablePlanCard>
  );
};

export default SelectableGrowthTeamPlanCard;
