"use client";

/**
 * ContextualBanner Component
 *
 * A banner with icon, heading, description, and actions.
 * Matches production bundle module 847673.
 */

import type { FC, ReactNode } from "react";
import {
  Flex,
  type FlexProps,
  Heading,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { Image } from "@/components/ui/Image";

interface ContextualBannerImage {
  src: string;
  alt?: string;
}

interface ContextualBannerProps {
  variant?: string;
  icon?: ReactNode;
  image?: ContextualBannerImage;
  heading: string;
  description?: string;
  actions?: ReactNode;
}

export const ContextualBanner: FC<ContextualBannerProps> = ({
  variant,
  icon,
  image,
  heading,
  description,
  actions,
  ...rest
}) => {
  const styles = useStyleConfig("Banner", { variant }) as FlexProps;

  return (
    <Flex {...styles} {...rest}>
      <Flex flex={1} gap={3}>
        {image && (
          <Image
            src={image.src}
            alt={image.alt || ""}
            height={48}
            width={48}
            style={{ objectFit: "contain" }}
            optimized
          />
        )}
        {icon && (
          <Flex alignItems="center" justifyContent="center">
            {icon}
          </Flex>
        )}
        <Flex flexDirection="column" justifyContent="center">
          <Heading
            fontSize="sm"
            fontWeight={600}
            lineHeight={1.5}
            color="content.primary"
          >
            {heading}
          </Heading>
          {description && (
            <Text
              fontSize="xs"
              fontWeight={500}
              lineHeight={1.5}
              color="content.secondary"
            >
              {description}
            </Text>
          )}
        </Flex>
      </Flex>
      {actions && (
        <Flex
          gap={5}
          alignItems="center"
          justifyContent={{ base: "flex-end", sm_next: "center" }}
        >
          {actions}
        </Flex>
      )}
    </Flex>
  );
};

export default ContextualBanner;
