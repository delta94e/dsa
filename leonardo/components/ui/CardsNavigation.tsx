"use client";

/**
 * CardsNavigation Component
 *
 * Navigation controls for horizontal card scrolling with arrows and pagination dots.
 * Matches production bundle module 844751.
 */

import { Flex, Grid, IconButton, Box } from "@chakra-ui/react";
import { motion } from "motion/react";
import type { FC, HTMLAttributes } from "react";

import { LeftCaratIcon } from "@/components/icons/LeftCaratIcon";
import { RightCaratIcon } from "@/components/icons/RightCaratIcon";

// ============================================================================
// Animation Constants
// ============================================================================

const ANIMATION_DURATION = 0.2;
const ANIMATION_EASE = "easeOut";

// ============================================================================
// Motion Box
// ============================================================================

const MotionBox = motion(Box);

// ============================================================================
// PaginationDot Component (module d)
// ============================================================================

interface PaginationDotProps {
  isSelected?: boolean;
  w?: number;
  h?: number;
  onClick?: () => void;
}

const PaginationDot: FC<PaginationDotProps> = ({
  isSelected = false,
  w = 2,
  h = 2,
  onClick,
}) => {
  return (
    <MotionBox
      onClick={onClick}
      cursor={onClick ? "pointer" : undefined}
      as={onClick ? "button" : "span"}
      type={onClick ? "button" : undefined}
      animate={{ scale: isSelected ? 1.6 : 1 }}
      transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      w={w}
      h={h}
      rounded="full"
      bg="#4e4e4e"
      mx={3}
    >
      <MotionBox
        animate={{ opacity: isSelected ? 1 : 0 }}
        opacity={0}
        transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
        w="100%"
        h="100%"
        rounded="full"
        bg="gradient.main"
      />
    </MotionBox>
  );
};

// ============================================================================
// CardsNavigation Component
// ============================================================================

interface CardsNavigationProps extends HTMLAttributes<HTMLDivElement> {
  currentIndex: number;
  columnCount: number;
  scrollToCard: (index: number) => void;
  display?: "none" | "flex" | { base?: string; md_next?: string };
}

export const CardsNavigation: FC<CardsNavigationProps> = ({
  currentIndex,
  columnCount,
  scrollToCard,
  ...restProps
}) => {
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex + 1 >= columnCount;

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      display={{ base: "flex", md: "none" }}
      gap={11}
      mb={4}
      px={4}
      {...restProps}
    >
      {/* Left Arrow - IconButton */}
      <IconButton
        aria-label="Show the previous card"
        onClick={() => scrollToCard(currentIndex - 1)}
        variant="link"
        color="white"
        isRound
        size="sm"
        visibility={isFirstCard ? "hidden" : "visible"}
        icon={<LeftCaratIcon width={6} height={6} />}
      />

      {/* Pagination Dots - Grid */}
      <Grid
        templateColumns={`repeat(${columnCount}, 1.125rem)`}
        alignItems="center"
        justifyItems="center"
        gap={1}
      >
        {Array.from(Array(columnCount).keys()).map((index) => (
          <PaginationDot key={index} isSelected={index === currentIndex} />
        ))}
      </Grid>

      {/* Right Arrow - IconButton */}
      <IconButton
        aria-label="Show the next card"
        onClick={() => scrollToCard(currentIndex + 1)}
        variant="link"
        color="whites"
        border="none"
        isRound
        size="sm"
        visibility={isLastCard ? "hidden" : "visible"}
        icon={<RightCaratIcon width={6} height={6} />}
      />
    </Flex>
  );
};

export default CardsNavigation;
