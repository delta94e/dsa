"use client";

import { type FC, memo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { AvatarWithName } from "@/components/ui/AvatarWithName";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";
import { CreateTeamModal } from "@/components/auth/CreateTeamModal";

// Icons
import { LoginIcon } from "@/components/icons/LoginIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { CaretDownIcon } from "@/components/icons/CaretDownIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { SettingsOutlineIcon } from "@/components/icons/SettingsOutlineIcon";

// Hooks
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useUserAWSMarketplaceAccess } from "@/hooks/useUserAWSMarketplaceAccess";
import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";

// Constants
import { ROUTE } from "@/constants/routes";

// Utils
import {
  getAWSUserInfo,
  shouldFilterTeamsToCustomOnly,
  filterTeamsForAwsRestrictions,
  shouldHidePersonalAccount,
  getPersonalAccountRoute,
  getTeamSelectRoute,
  canUserCreateTeam,
} from "@/lib/aws-marketplace";

// Analytics
import { track, SettingsEvents } from "@/lib/analytics";

// ============================================================================
// Types
// ============================================================================

export type PlansSwitcherVariant = "full" | "compact";

export interface PlansSwitcherDropdownProps {
  className?: string;
  displaySettings?: boolean;
  displayLogout?: boolean;
  notificationCount?: number;
  variant?: PlansSwitcherVariant;
  dropdownAlign?: "start" | "end" | "center";
  dropdownSide?: "bottom" | "top" | "left" | "right";
}

// ============================================================================
// Sub-components
// ============================================================================

interface CreateNewTeamButtonProps {
  onCreateNewTeamClick: (open: boolean) => void;
}

const CreateNewTeamButton: FC<CreateNewTeamButtonProps> = ({
  onCreateNewTeamClick,
}) => (
  <DropdownMenuItem
    className="bg-primary hover:bg-white/5 w-full cursor-pointer pb-2"
    onClick={() => onCreateNewTeamClick(true)}
  >
    <Button variant="ghost" size="xs">
      <div className="border-gradient-primary mr-2 -ml-1 flex size-8 items-center justify-center rounded-full border border-transparent">
        <PlusIcon className="size-4" />
      </div>
      Create New Team
    </Button>
  </DropdownMenuItem>
);

// Login/Logout Button
const AuthButton: FC = () => {
  const { isLoggedIn, isReady } = useUser();
  const logout = useLogout();

  return (
    <Button
      className={cn(
        "text-foreground-tertiary !flex w-full justify-start gap-1.5 p-0 text-xs focus:!bg-transparent",
        { block: isReady, hidden: !isReady }
      )}
      variant="ghost"
      size="sm"
      onClick={() => {
        if ("Intercom" in window) {
          (
            window as typeof window & { Intercom: (cmd: string) => void }
          ).Intercom("shutdown");
        }
        if (isLoggedIn) {
          logout();
        } else {
          signIn();
        }
      }}
    >
      {isLoggedIn ? (
        <>
          <LogoutIcon aria-label="Sign out" className="h-6 w-6" />
          <span className="text-sm">Logout</span>
        </>
      ) : (
        <>
          <LoginIcon aria-label="Sign in" className="h-6 w-6" />
          <span className="text-sm">Login</span>
        </>
      )}
    </Button>
  );
};

// Logout Menu Item
const LogoutMenuItem: FC = () => (
  <DropdownMenuItem className="bg-primary text-secondary-foreground hover:bg-hover px-4 py-2 text-xs hover:text-white [&_svg]:size-6">
    <AuthButton />
  </DropdownMenuItem>
);

// Settings Menu Item
interface SettingsMenuItemProps {
  notificationCount?: number;
}

const SettingsMenuItem: FC<SettingsMenuItemProps> = ({
  notificationCount = 0,
}) => {
  const { selectedTeamUUID } = useSelectedTeam();
  const settingsRoute = selectedTeamUUID
    ? ROUTE.SETTINGS_TEAM_PROFILE
    : ROUTE.SETTINGS_PROFILE;

  return (
    <DropdownMenuItem
      asChild
      className="bg-primary text-secondary-foreground hover:bg-hover group gap-1.5 px-4 py-2 hover:text-white [&_svg]:size-6"
    >
      <Link
        href={settingsRoute}
        className="flex items-center no-underline focus:shadow-none"
        onClick={() => {
          track(SettingsEvents.DROPDOWN_CLICKED, {
            user_action: "click_settings_dropdown",
          });
        }}
      >
        <SettingsOutlineIcon className="text-secondary-foreground group-hover:text-white" />
        <span className="text-secondary-foreground text-sm font-medium group-hover:text-white">
          Settings
        </span>
        {notificationCount > 0 && (
          <Avatar size="sm">
            <AvatarFallback>{notificationCount}</AvatarFallback>
          </Avatar>
        )}
      </Link>
    </DropdownMenuItem>
  );
};

// Email Display
interface EmailDisplayProps {
  email: string;
}

const EmailDisplay: FC<EmailDisplayProps> = ({ email }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, []);

  return (
    <DropdownMenuItem className="bg-secondary w-full cursor-default justify-center p-4 text-center">
      <div className="overflow-hidden">
        <Tooltip disabled={!isOverflowing}>
          <TooltipTrigger aria-label="Full email address">
            <span
              ref={textRef}
              className="truncate text-xs font-semibold text-white"
            >
              {email}
            </span>
          </TooltipTrigger>
          <TooltipContent>{email}</TooltipContent>
        </Tooltip>
      </div>
    </DropdownMenuItem>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * PlansSwitcherDropdown
 *
 * Dropdown component for switching between personal account and teams.
 * Matches production implementation with full team switching functionality.
 */
export const PlansSwitcherDropdown: FC<PlansSwitcherDropdownProps> = memo(
  ({
    className,
    displaySettings = true,
    displayLogout = true,
    notificationCount = 0,
    variant = "compact",
    dropdownAlign = "start",
    dropdownSide = "bottom",
  }) => {
    const router = useRouter();
    const {
      userSelectedTeam,
      setSelectedTeam,
      resetSelectedTeam,
      selectedTeamUUID,
    } = useSelectedTeam();

    const selectedTeam = userSelectedTeam();
    const { isOpen, open, close } = useDisclosure();
    const { user, fetching } = useCurrentUser();

    // AWS Marketplace access
    const { awsTeamSubscriptionStatus, awsAPISubscriptionStatus } =
      useUserAWSMarketplaceAccess();
    const awsUserInfo = getAWSUserInfo(
      awsTeamSubscriptionStatus,
      awsAPISubscriptionStatus
    );

    // Don't render if loading or no user
    if (fetching || !user) return null;

    const displayName = selectedTeam.teamName || user.username;
    const isPersonalAccount = displayName === user.username;

    // Filter teams based on AWS restrictions
    const teams = shouldFilterTeamsToCustomOnly(
      awsTeamSubscriptionStatus,
      awsAPISubscriptionStatus
    )
      ? filterTeamsForAwsRestrictions(user.teams || [])
      : user.teams || [];

    // Check if personal account should be hidden for AWS users
    const hidePersonalAccount = shouldHidePersonalAccount(
      awsTeamSubscriptionStatus,
      awsAPISubscriptionStatus,
      user.apiPlan?.type || null // apiPlanType - could be passed if needed
    );

    // Check if user can create teams
    const canCreateTeam = canUserCreateTeam(
      awsTeamSubscriptionStatus,
      awsAPISubscriptionStatus
    );

    // Handle personal account selection
    const handleSelectPersonalAccount = () => {
      // Use requestAnimationFrame for smooth transition
      let count = 0;
      const animate = () => {
        if (++count < 18) {
          requestAnimationFrame(animate);
        } else {
          resetSelectedTeam();
        }
      };
      requestAnimationFrame(animate);
      const route = getPersonalAccountRoute(awsUserInfo.hasAwsApiSubscription);
      if (route) router.push(route);
    };

    // Handle team selection
    const handleSelectTeam = (team: { akUUID?: string }) => {
      if (!team.akUUID) return;
      setSelectedTeam(team.akUUID);
      const isFromPersonal = !selectedTeamUUID;
      const route = getTeamSelectRoute(
        isFromPersonal,
        awsUserInfo.hasAwsTeamSubscription
      );
      if (route) router.push(route);
    };

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger className="group" asChild>
            <Button
              variant="ghost"
              className={cn(
                "data-[state=open]:bg-[#0d0f14] h-12 w-full",
                variant === "compact"
                  ? "justify-center gap-0.5 rounded-3xl p-0"
                  : "justify-between gap-3 rounded-none px-4",
                className
              )}
              aria-label="Profile menu"
            >
              {variant === "full" ? (
                <div className="flex min-w-0 items-center justify-between gap-3 overflow-hidden">
                  <AvatarWithName
                    accountName={displayName}
                    isPersonalAccount={isPersonalAccount}
                    backgroundImageSource={selectedTeam.teamLogoUrl}
                    accountId={selectedTeam.id}
                    width={10}
                  />
                  <Avatar
                    size="sm"
                    className={cn("group-data-[state=open]:hidden", {
                      hidden: !notificationCount,
                    })}
                  >
                    <AvatarFallback>{notificationCount}</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <AvatarWithName
                  accountName={displayName}
                  isPersonalAccount={isPersonalAccount}
                  backgroundImageSource={selectedTeam.teamLogoUrl}
                  accountId={selectedTeam.id}
                  width={8}
                  showAccountName={false}
                />
              )}
              <CaretDownIcon className="text-white transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-primary z-10 mx-3 mt-0.5 max-h-[80vh] min-w-[var(--radix-dropdown-menu-trigger-width)] shadow-[0px_0px_0.9375rem_0px_rgba(0,0,0,0.40)] [&>*:not(:first-of-type)]:border-t-0"
            align={dropdownAlign}
            side={dropdownSide}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {/* Scrollable team list */}
            <div className="scrollbar-thin max-h-[40vh] overflow-y-auto">
              <div className="pt-2">
                {/* Personal Account Option - hidden for some AWS users */}
                {!hidePersonalAccount && (
                  <DropdownMenuItem
                    className="bg-primary hover:bg-white/5 my-2 flex cursor-pointer items-center justify-between px-3 py-1"
                    onClick={handleSelectPersonalAccount}
                  >
                    <AvatarWithName
                      accountName={user.username}
                      accountId={selectedTeam.id}
                      isPersonalAccount={true}
                      showTypeOfPlan={true}
                      avatarFontSize="1rem"
                      avatarFontWeight="normal"
                      fontSize="xs"
                      size="sm"
                    />
                    {!selectedTeam.akUUID && (
                      <CheckIcon color="white" className="size-5" />
                    )}
                  </DropdownMenuItem>
                )}

                {/* Team Options */}
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.akUUID}
                    className="bg-primary hover:bg-white/5 my-2 flex cursor-pointer items-center justify-between px-3 py-1"
                    onClick={() => handleSelectTeam(team)}
                  >
                    <AvatarWithName
                      accountName={team.teamName || "Team"}
                      accountId={team.id}
                      isPersonalAccount={false}
                      showTypeOfPlan={true}
                      avatarFontSize="1rem"
                      avatarFontWeight="normal"
                      fontSize="xs"
                      size="sm"
                    />
                    {selectedTeam.akUUID === team.akUUID && (
                      <CheckIcon color="white" className="size-5" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>

            {/* Create New Team - hidden for some AWS users */}
            {canCreateTeam && (
              <CreateNewTeamButton onCreateNewTeamClick={open} />
            )}

            {/* Separator */}
            {(displaySettings || displayLogout) && (
              <DropdownMenuSeparator className="mx-3 my-1 w-auto" />
            )}

            {/* Settings */}
            {displaySettings && (
              <SettingsMenuItem notificationCount={notificationCount} />
            )}

            {/* Logout & Email */}
            {displayLogout && (
              <div className="w-full">
                <LogoutMenuItem />
                <EmailDisplay email={user.email} />
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Team Modal */}
        <CreateTeamModal isOpen={isOpen} onClose={close} />
      </>
    );
  }
);

PlansSwitcherDropdown.displayName = "PlansSwitcherDropdown";

export default PlansSwitcherDropdown;
