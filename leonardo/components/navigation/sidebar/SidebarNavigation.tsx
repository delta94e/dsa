"use client";

import { useState, useEffect, useRef, type FC, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Components
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { MobileSidebarLayout } from "./MobileSidebarLayout";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarExpandedPanel } from "./SidebarExpandedPanel";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarProvider } from "@/components/ui/Sidebar/SidebarContext";

// Icons
import { MoreHorizontalFillIcon } from "@/components/icons/MoreHorizontalFillIcon";
import { SettingsOutlineIcon } from "@/components/icons/SettingsOutlineIcon";

// Hooks
import { useTeamNotifications } from "@/hooks/useTeamNotifications";
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useClickOutside } from "@/hooks/useClickOutside";

// Constants & Analytics
import { ROUTE } from "@/constants/routes";
import { track, SidebarNavigationEvents } from "@/lib/analytics";

// Types
interface SidebarNavigationProps {
  isMobileHeaderSticky?: boolean;
  pageTitle?: ReactNode;
  shouldShowTokensOnMobile?: boolean;
}

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

// Constants
const SIDEBAR_WIDTH_REM = 5.5;
const EXPANDED_PANEL_OFFSET_REM = 6;
const EXPANDED_PANEL_WIDTH_REM = 15.3125;

/**
 * SidebarNavigation
 *
 * Main navigation sidebar component with support for:
 * - Responsive mobile/desktop views
 * - Collapsible expanded panel
 * - Team notifications badge
 * - Authentication status handling
 */
export const SidebarNavigation: FC<SidebarNavigationProps> = ({
  isMobileHeaderSticky = false,
  pageTitle,
  shouldShowTokensOnMobile = false,
}) => {
  const { status } = useSession();
  const pathname = usePathname() ?? "";
  const sidebarRef = useRef<HTMLDivElement>(null);

  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    status === "authenticated"
  );

  // Hooks
  const { totalCount: notificationCount } = useTeamNotifications();
  const { selectedTeamUUID } = useSelectedTeam();

  // Sync authentication state
  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
    } else if (status === "unauthenticated") {
      setIsAuthenticated(false);
    }
  }, [status]);

  // Close expanded panel on route change
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Close expanded panel on click outside
  useClickOutside({
    ref: sidebarRef,
    onClickOutside: () => setIsExpanded(false),
    enabled: isExpanded,
  });

  // Handlers
  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleNavItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) {
      setIsExpanded(false);
    }
  };

  const handleSettingsClick = () => {
    track(SidebarNavigationEvents.ITEM_CLICKED, {
      menu_item: "Settings",
      menu_location: "settings",
    });
  };

  // Computed values
  const settingsHref = selectedTeamUUID
    ? ROUTE.SETTINGS_TEAM_PROFILE
    : ROUTE.SETTINGS_PROFILE;

  return (
    <div>
      {/* Mobile Navigation (Header + Sidebar Drawer) */}
      <div className="md:hidden">
        <SidebarProvider>
          <MobileSidebarLayout
            isMobileHeaderSticky={isMobileHeaderSticky}
            pageTitle={pageTitle}
            shouldShowTokensOnMobile={shouldShowTokensOnMobile}
          />
        </SidebarProvider>
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed bottom-0 z-(--z-dialog) hidden h-[calc(100vh-var(--global-banner-height,0px))] py-3 pl-3 md:flex">
        <div
          ref={sidebarRef}
          className="relative h-full"
          style={{ width: `${SIDEBAR_WIDTH_REM}rem` }}
        >
          <LiquidGlassCard
            blurIntensity="xl"
            shadowIntensity="xs"
            glowIntensity="none"
            borderRadius="16px"
            className="h-full bg-[#0a0a0a]/50"
          >
            <div
              className="relative flex h-full flex-col justify-between px-2 py-4"
              onClick={handleNavItemClick}
            >
              {/* Main Navigation Menu */}
              <SidebarMenu pathname={pathname} />

              {/* Bottom Section */}
              <div>
                {/* More Button */}
                <Button
                  variant="ghost"
                  className={cn(
                    "mx-auto flex h-auto w-full flex-col gap-0.5 rounded-3xl py-2 text-xs text-[0.6875rem] hover:bg-white/10",
                    isExpanded && "bg-white/10"
                  )}
                  onClick={handleToggleExpanded}
                >
                  <MoreHorizontalFillIcon className="size-5" />
                  More
                </Button>

                {/* Authenticated User Section */}
                {isAuthenticated && (
                  <>
                    {/* Divider */}
                    <div className="mx-auto my-3 h-px w-full max-w-6 bg-white/25" />

                    {/* Settings Navigation */}
                    <nav className="mb-2.5" aria-label="Settings">
                      <ul>
                        <li className="relative w-full">
                          <SidebarNavItem
                            href={settingsHref}
                            pathname={pathname}
                            onClick={handleSettingsClick}
                          >
                            <SettingsOutlineIcon className="size-5" />
                            <span>Settings</span>

                            {/* Notification Badge */}
                            {notificationCount > 0 && (
                              <Badge
                                variant="primary"
                                className="pointer-events-none absolute top-0 right-3 flex size-4.5 justify-center rounded-full"
                                aria-label={`${notificationCount} notifications`}
                              >
                                {notificationCount}
                              </Badge>
                            )}
                          </SidebarNavItem>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}

                {/* Auth Panel */}
                <AuthPanel variant="compact" />
              </div>
            </div>
          </LiquidGlassCard>

          {/* Expanded Panel */}
          {isExpanded && (
            <SidebarExpandedPanel
              panelOffsetRem={EXPANDED_PANEL_OFFSET_REM}
              panelWidthRem={EXPANDED_PANEL_WIDTH_REM}
              pathname={pathname}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
