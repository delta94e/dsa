"use client";

/**
 * TeamPlanCardHeader Component
 *
 * Header for team plan cards showing plan name, price, and selection status.
 * Matches production bundle module 450972.
 */

import type { FC, ReactNode } from "react";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";

interface ActionButtonProps {
  displayActionButton?: boolean;
  // Extend with other action button props as needed
}

interface TeamPlanCardHeaderProps {
  isCurrentPlan?: boolean;
  isSelected?: boolean;
  planName: string;
  planNameStyle?: "gradient" | "apprentice" | "default";
  pricePerSeat: number;
  numberOfSeats: number;
  actionButtonProps?: ActionButtonProps;
  children?: ReactNode;
}

const getPlanNameStyles = (style?: string) => {
  switch (style) {
    case "gradient":
      return {
        bgGradient: "linear(to-r, purple.400, pink.400)",
        bgClip: "text",
      };
    case "apprentice":
      return {
        color: "content.secondary",
      };
    default:
      return {};
  }
};

export const TeamPlanCardHeader: FC<TeamPlanCardHeaderProps> = ({
  isCurrentPlan,
  isSelected,
  planName,
  planNameStyle = "default",
  pricePerSeat,
  numberOfSeats,
  actionButtonProps,
  children,
}) => {
  const totalCost = pricePerSeat * numberOfSeats;
  const { displayActionButton } = actionButtonProps || {};

  return (
    <Flex direction="column" gap={3} mb={4}>
      {/* Plan name and selection indicator */}
      <Flex justify="space-between" align="center">
        <Heading
          as="h3"
          fontSize="lg"
          fontWeight="semibold"
          {...getPlanNameStyles(planNameStyle)}
        >
          {planName}
        </Heading>

        {/* Selection radio indicator */}
        {!displayActionButton && !isCurrentPlan && (
          <Box
            w={5}
            h={5}
            borderRadius="full"
            borderWidth="2px"
            borderColor={isSelected ? "primary" : "border"}
            bg={isSelected ? "primary" : "transparent"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Box>
        )}

        {isCurrentPlan && (
          <Box
            px={2}
            py={0.5}
            fontSize="xs"
            fontWeight="medium"
            bg="secondary"
            borderRadius="full"
          >
            Current Plan
          </Box>
        )}
      </Flex>

      {/* Pricing */}
      <Box>
        <Flex align="baseline" gap={1}>
          <Text fontSize="3xl" fontWeight="bold">
            ${pricePerSeat}
          </Text>
          <Text fontSize="sm" color="content.secondary">
            /seat/mo
          </Text>
        </Flex>
        <Text fontSize="sm" color="content.secondary" mt={1}>
          ${totalCost}/month for {numberOfSeats} seats
        </Text>
      </Box>

      {children}
    </Flex>
  );
};

export default TeamPlanCardHeader;
