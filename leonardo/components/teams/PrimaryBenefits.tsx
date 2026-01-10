"use client";

/**
 * PrimaryBenefits Components
 *
 * Components for displaying primary benefits in team plan cards.
 * Matches production bundle module 582587.
 */

import type { FC, ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { segmentTextByFormatMarkers } from "@/lib/utils/string";

interface PrimaryBenefitProps {
  heading: string;
}

interface PrimaryBenefitsProps {
  children: ReactNode;
}

/**
 * Renders a single primary benefit with formatted text.
 * Text wrapped in [[...]] will be highlighted.
 */
export const PrimaryBenefit: FC<PrimaryBenefitProps> = ({ heading }) => {
  const segments = segmentTextByFormatMarkers(heading);

  return (
    <Flex align="center" gap={1}>
      {segments.map((segment, idx) => (
        <Text
          key={idx}
          as="span"
          fontSize="sm"
          fontWeight={segment.type === "highlight" ? "bold" : "normal"}
          color={
            segment.type === "highlight"
              ? "content.primary"
              : "content.secondary"
          }
        >
          {segment.text}
        </Text>
      ))}
    </Flex>
  );
};

/**
 * Container for primary benefits.
 */
export const PrimaryBenefits: FC<PrimaryBenefitsProps> = ({ children }) => {
  return (
    <Flex direction="column" gap={1}>
      {children}
    </Flex>
  );
};

export default PrimaryBenefits;
