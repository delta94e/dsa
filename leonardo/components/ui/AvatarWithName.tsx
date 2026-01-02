"use client";

import React, { type FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@chakra-ui/react";
import { Text, type TextProps } from "@/components/ui/Text";
import { useFlags } from "@/hooks/useFlags";
import { calculateAvatarColorFromId, removeSpaces } from "@/lib/utils";
import { GRADIENTS, FOCUS_BOX_SHADOW } from "@/constants/styles";

const SmallText: FC<TextProps & { children: React.ReactNode }> = ({
  children,
  ...rest
}) => (
  <Text
    fontSize="xs"
    textAlign="center"
    lineHeight="0.6rem"
    paddingY="0.3rem"
    textTransform="capitalize"
    {...rest}
  >
    {children}
  </Text>
);

// ============================================================================
// Types - matching production props exactly
// ============================================================================

interface AvatarWithNameProps {
  accountName: string; // e
  accountId?: string; // p
  isPersonalAccount?: boolean; // g
  showTypeOfPlan?: boolean; // x = false
  width?: number; // f
  height?: number; // C
  fontSize?: "xs" | "sm" | "md"; // b = "sm"
  avatarFontSize?: string; // T = "1.25rem"
  avatarFontWeight?: string; // y = "medium"
  avatarInitialsColor?: string; // I
  avatarBackground?: string; // j
  showAccountName?: boolean; // E = true
  backgroundImageSource?: string | null; // N
  isEditEnabled?: boolean; // v = false
  teamAkUUID?: string; // _
  onAvatarImageSelect?: (url: string | undefined) => void; // S
  // Rest props spread to Avatar (...w)
  [key: string]: unknown;
}

// ============================================================================
// AvatarWithName Component
// Matches production bundle module 498402 exactly
// Uses Chakra UI Avatar (module 438024)
// ============================================================================

export const AvatarWithName: FC<AvatarWithNameProps> = ({
  accountName,
  accountId,
  isPersonalAccount = false,
  showTypeOfPlan = false,
  width,
  height,
  fontSize = "sm",
  avatarFontSize = "1.25rem",
  avatarFontWeight = "medium",
  avatarInitialsColor,
  avatarBackground,
  showAccountName = true,
  backgroundImageSource,
  isEditEnabled = false,
  teamAkUUID,
  onAvatarImageSelect,
  ...rest
}) => {
  const { isTeamNameAndAvatarCustomizable } = useFlags();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // M, D

  return (
    <>
      <div
        className={cn(
          "flex min-w-0 items-center",
          showAccountName ? "gap-3" : "gap-0"
        )}
      >
        <Avatar
          {...(isPersonalAccount
            ? { background: GRADIENTS.PINK_PURPLE_BRIGHT }
            : backgroundImageSource && isTeamNameAndAvatarCustomizable
            ? { src: backgroundImageSource }
            : accountId
            ? { background: calculateAvatarColorFromId(accountId) }
            : { background: avatarBackground })}
          name={removeSpaces(accountName || "")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variant="gradientBackground"
          borderRadius="100%"
          borderWidth={0}
          onBlur={() => setIsHovered(false)}
          {...(isEditEnabled &&
            isTeamNameAndAvatarCustomizable && {
              tabIndex: 0,
              onFocus: () => setIsHovered(true),
              ...(isHovered && {
                borderRadius: "0.5rem",
                borderWidth: "px",
                backgroundColor: "surface.hover",
                onKeyUp: (e: React.KeyboardEvent) => {
                  ("Enter" === e.key || "Space" === e.code) &&
                    setIsModalOpen(true);
                },
              }),
            })}
          _focusVisible={{
            outline: "none",
            boxShadow: FOCUS_BOX_SHADOW,
          }}
          borderColor="borderNew.primary"
          transition="border-radius 0.2s ease, background-color 0.2s ease"
          overflow="hidden"
          w={width || 8}
          h={height || 8}
          color={avatarInitialsColor || isPersonalAccount ? "white" : "black"}
          css={{
            "> div, > span": {
              fontSize: avatarFontSize,
              fontWeight: avatarFontWeight,
            },
          }}
          {...rest}
        >
          {isEditEnabled && isTeamNameAndAvatarCustomizable && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <div
                className="flex flex-col items-center justify-center w-full h-full"
                style={{
                  backgroundColor:
                    "var(--chakra-colors-surface-hover, rgba(255,255,255,0.05))",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg
                  className="size-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <SmallText
                  fontWeight={500}
                  color="white"
                  style={{
                    height: "auto",
                    alignContent: "center",
                    paddingBottom: 0,
                  }}
                >
                  Change
                </SmallText>
              </div>
              <SmallText
                fontWeight={400}
                color="content.secondary"
                className="absolute bottom-0 w-full"
                style={{
                  background: isHovered ? "inherit" : "rgba(16, 21, 31, 0.90)",
                  opacity: isHovered ? 0 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                Edit
              </SmallText>
            </div>
          )}
        </Avatar>

        <div className="flex min-w-0 flex-col items-start gap-0 overflow-hidden">
          {showAccountName && (
            <Text fontSize={fontSize} color="white" isTruncated maxW="full">
              {accountName}
            </Text>
          )}
          {showTypeOfPlan && (
            <Text
              fontWeight={400}
              fontSize="xs"
              color="secondary.inactive"
              isTruncated
            >
              {isPersonalAccount ? "Personal" : "Team"}
            </Text>
          )}
        </div>
      </div>

      {isEditEnabled && isTeamNameAndAvatarCustomizable && isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="rounded-lg bg-primary p-6 min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-medium text-white">
              Add an Image
            </h3>
            <p className="text-secondary-foreground mb-4">
              Team ID: {isPersonalAccount ? undefined : accountId}
              <br />
              Team AkUUID: {isPersonalAccount ? undefined : teamAkUUID}
            </p>
            <div className="flex gap-2">
              <button
                className="rounded bg-accent px-4 py-2 text-white"
                onClick={() => {
                  onAvatarImageSelect?.(undefined);
                  setIsModalOpen(false);
                }}
              >
                Select Image
              </button>
              <button
                className="rounded bg-secondary px-4 py-2 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AvatarWithName.displayName = "AvatarWithName";

export default AvatarWithName;
