"use client";

import { type FC, memo } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { track, HomePageEvents } from "@/lib/analytics";
import { ROUTE } from "@/constants/routes";
import { AuthPanelSkeleton } from "./AuthPanelSkeleton";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

// Components
import { PlansSwitcherDropdown } from "./PlansSwitcherDropdown";
import { TokenDisplay } from "./TokenDisplay";
import { TeamCongratsPopover } from "./TeamCongratsPopover";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";

// Hooks
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useTeamNotifications } from "@/hooks/useTeamNotifications";
import { useUserAWSMarketplaceAccess } from "@/hooks/useUserAWSMarketplaceAccess";
import { useTeamInviteNotifications } from "@/hooks/useTeamInviteNotifications";

// Types
export type AuthPanelVariant = "full" | "compact";

export interface AuthPanelProps {
  variant?: AuthPanelVariant;
  className?: string;
}

/**
 * AuthenticatedPanel (n1 in production)
 *
 * Shows authenticated user content:
 * - Popover wrapper for team invite success notifications (TeamCongratsPopover)
 * - PlansSwitcherDropdown (team/account switching)
 * - TokenDisplay (token balance) - conditionally shown
 *
 * Production structure:
 * - Uses useUserAWSMarketplaceAccess, useSelectedTeam, useTeamInviteNotifications, useTeamNotifications
 * - Wraps PlansSwitcherDropdown in Popover for congrats notification
 * - Conditionally shows TokenDisplay based on !(awsSubscription && !hasTeam)
 */
const AuthenticatedPanel: FC<{ variant: AuthPanelVariant }> = ({
  variant = "full",
}) => {
  // Get selected team info
  const { userSelectedTeam } = useSelectedTeam();
  const selectedTeam = userSelectedTeam();
  const hasTeamId = !!selectedTeam?.id;

  // Get team notifications count
  const { totalCount: notificationCount } = useTeamNotifications();

  // Get AWS marketplace access status
  const { awsAPISubscriptionStatus } = useUserAWSMarketplaceAccess();

  // Get team invite notifications
  const { showSuccessPopover, handleCloseCongratsPopup } =
    useTeamInviteNotifications();

  const isCompact = variant === "compact";

  // Show token display if: NOT (has AWS subscription AND no team)
  const showTokenDisplay = !(awsAPISubscriptionStatus && !hasTeamId);

  return (
    <div
      className={cn("flex w-full flex-col", {
        "flex-col-reverse gap-1": isCompact,
      })}
    >
      {/* PlansSwitcherDropdown Section with Popover wrapper for congrats */}
      <div
        className={cn("flex items-center justify-between", {
          "py-3": !isCompact,
        })}
      >
        <Popover open={showSuccessPopover}>
          <PopoverTrigger className="grow" asChild>
            <div>
              <PlansSwitcherDropdown
                variant={variant}
                dropdownAlign={isCompact ? "end" : "start"}
                dropdownSide={isCompact ? "right" : "bottom"}
                notificationCount={notificationCount}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isCompact ? "right" : "bottom"}
            align={isCompact ? "end" : "start"}
            sideOffset={8}
            className="w-80 p-0"
          >
            <TeamCongratsPopover
              teamName={selectedTeam?.teamName}
              onClose={handleCloseCongratsPopup}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* TokenDisplay Section - conditionally shown */}
      {showTokenDisplay && (
        <div
          className={cn("flex items-center justify-center", {
            "px-4": !isCompact,
          })}
        >
          <TokenDisplay
            hideTeamLogo
            compactStyle={isCompact}
            shortFormat={isCompact}
            popoverSide="right"
            popoverAlign={isCompact ? "end" : "start"}
          />
        </div>
      )}
    </div>
  );
};

/**
 * UnauthenticatedPanel
 *
 * Shows sign-in/sign-up buttons for unauthenticated users.
 */
const UnauthenticatedPanel: FC<{ variant: AuthPanelVariant }> = ({
  variant,
}) => {
  const isCompact = variant === "compact";

  const handleCreateAccountClick = () => {
    track(HomePageEvents.CREATE_ACCOUNT_BUTTON_CLICKED, {
      platform: "web",
    });
  };

  const handleSignInClick = () => {
    track(HomePageEvents.SIGN_IN_BUTTON_CLICKED, {
      platform: "web",
    });
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        isCompact ? "gap-2" : "mx-4.5 mt-4 mb-1.5 gap-3"
      )}
    >
      <Button
        size={isCompact ? "xs" : "sm"}
        variant={isCompact ? "gradientOutline" : "primary"}
        className={cn({ "rounded-full": isCompact })}
        asChild
        onClick={handleCreateAccountClick}
      >
        <Link href={ROUTE.LOGIN}>
          {isCompact ? "Sign Up" : "Create Free Account"}
        </Link>
      </Button>
      <Button
        size={isCompact ? "xs" : "sm"}
        variant={isCompact ? "primary" : "gradientOutline"}
        className={cn({ "rounded-full": isCompact })}
        asChild
        onClick={handleSignInClick}
      >
        <Link href={ROUTE.LOGIN}>Sign In</Link>
      </Button>
    </div>
  );
};

/**
 * AuthPanelContent (n0 in production)
 *
 * Internal component that handles the auth state logic.
 * - Unauthenticated: shows buttons
 * - Authenticated & ready: shows AuthenticatedPanel
 * - Loading: shows skeleton
 */
const AuthPanelContent: FC<{
  variant: AuthPanelVariant;
  panelHeight: string;
}> = ({ variant, panelHeight }) => {
  const { status } = useSession();
  const { isReady } = useUser();

  // Unauthenticated
  if (status === "unauthenticated") {
    return <UnauthenticatedPanel variant={variant} />;
  }

  // Authenticated and ready
  if (isReady) {
    return <AuthenticatedPanel variant={variant} />;
  }

  // Loading
  return <AuthPanelSkeleton height={panelHeight} variant={variant} />;
};

/**
 * AuthPanel (n2 in production)
 *
 * Main wrapper component that sets height and renders content.
 */
export const AuthPanel: FC<AuthPanelProps> = memo(({ variant = "full" }) => {
  const panelHeight = variant === "compact" ? "4.5rem" : "6.125rem";

  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: panelHeight }}
    >
      <AuthPanelContent variant={variant} panelHeight={panelHeight} />
    </div>
  );
});

AuthPanel.displayName = "AuthPanel";

export default AuthPanel;
