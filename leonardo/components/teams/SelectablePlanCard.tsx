"use client";

/**
 * SelectablePlanCard Component
 *
 * A selectable card wrapper for team plan cards.
 * Matches production bundle module 66282.
 */

import type { FC, ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface SelectablePlanCardProps {
  onSelect?: () => void;
  showBorder?: boolean;
  badgeText?: string;
  children: ReactNode;
  className?: string;
}

export const Root: FC<SelectablePlanCardProps> = ({
  onSelect,
  showBorder,
  badgeText,
  children,
  className,
  ...rest
}) => {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      flex={1}
      cursor={onSelect ? "pointer" : "default"}
      onClick={onSelect}
      borderWidth={showBorder ? "2px" : "1px"}
      borderColor={showBorder ? "primary" : "border"}
      borderRadius="xl"
      p={4}
      transition="all 0.2s"
      _hover={onSelect ? { borderColor: "primary" } : undefined}
      className={className}
      {...rest}
    >
      {badgeText && (
        <Box
          position="absolute"
          top="-12px"
          left="50%"
          transform="translateX(-50%)"
          whiteSpace="nowrap"
          bg="primary"
          color="white"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="medium"
          borderRadius="full"
        >
          {badgeText}
        </Box>
      )}
      {children}
    </Box>
  );
};

export const SelectablePlanCard = Root;

export default SelectablePlanCard;
