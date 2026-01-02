"use client";

import { type FC, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/routes";
import { track, SidebarNavigationEvents } from "@/lib/analytics";
import { useUser } from "@/hooks/useUser";
import { remToPx } from "@/lib/units";
import debounce from "lodash.debounce";

// Components
import { SidebarNavItem } from "./SidebarNavItem";
import { Badge } from "@/components/ui/Badge";

// Icons
import { HomeIcon } from "@/components/icons/HomeIcon";
import { GridSquareOutlineIcon } from "@/components/icons/GridSquareOutlineIcon";
import { ImageIcon } from "@/components/icons/ImageIcon";
import { VideoIcon } from "@/components/icons/VideoIcon";
import { BlueprintsIcon } from "@/components/icons/BlueprintsIcon";
import { UniversalUpscalerIcon } from "@/components/icons/UniversalUpscalerIcon";
import { FlowStateIcon } from "@/components/icons/FlowStateIcon";
import { PremiumIcon } from "@/components/icons/PremiumIcon";
import { ApiIcon } from "@/components/icons/ApiIcon";
import { RocketLaunchIcon } from "@/components/icons/RocketLaunchIcon";
import { LeonardoLogoIcon } from "@/components/icons/LeonardoLogoIcon";

// External URLs
import { ExternalUrls } from "@/constants/externalUrls";

// Types
interface SidebarMenuProps {
  pathname: string;
}

interface UseVisibleItemsOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  gap: number;
  logoHeight: number;
  logoToNavGap: number;
}

/**
 * Hook to calculate how many nav items can fit in the container
 */
function useVisibleItems({
  containerRef,
  gap,
  logoHeight,
  logoToNavGap,
}: UseVisibleItemsOptions): number | null {
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const itemHeights = useRef<Map<number, number>>(new Map());

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const list = container.querySelector("ul");
    if (!list) return false;

    const items = Array.from(list.querySelectorAll("li"));
    if (items.length === 0) return false;

    items.forEach((item, index) => {
      itemHeights.current.set(index, item.offsetHeight);
    });

    return true;
  }, [containerRef]);

  const calculateVisible = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const list = container.querySelector("ul");
    if (!list) return;

    const items = Array.from(list.querySelectorAll("li"));
    if (items.length === 0) {
      setVisibleCount(0);
      return;
    }

    const containerHeight = container.offsetHeight;
    let usedHeight = logoHeight + logoToNavGap;
    let count = 0;

    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.current.get(i);
      if (height !== undefined) {
        if (usedHeight + height + gap <= containerHeight) {
          usedHeight += height + gap;
          count++;
        } else {
          break;
        }
      }
    }

    setVisibleCount(count);
  }, [containerRef, gap, logoHeight, logoToNavGap]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timeout = setTimeout(() => {
      if (measureItems()) {
        calculateVisible();
      }
    }, 0);

    const debouncedCalculate = debounce(calculateVisible, 50);
    const resizeObserver = new ResizeObserver(debouncedCalculate);

    resizeObserver.observe(container);
    window.addEventListener("resize", debouncedCalculate);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCalculate);
    };
  }, [containerRef, measureItems, calculateVisible]);

  return visibleCount;
}

/**
 * SidebarMenu
 *
 * Main navigation menu with logo and responsive nav items.
 * Automatically hides items that don't fit in the container.
 */
export const SidebarMenu: FC<SidebarMenuProps> = ({ pathname }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { isTeamAccount } = useUser();

  const visibleCount = useVisibleItems({
    containerRef,
    gap: remToPx(0.5),
    logoHeight: remToPx(3.375),
    logoToNavGap: remToPx(0.75),
  });

  // Navigation items configuration
  const navItems = [
    {
      key: "home",
      href: ROUTE.HOME,
      icon: HomeIcon,
      label: "Home",
    },
    {
      key: "library",
      href: isTeamAccount ? ROUTE.TEAM_LIBRARY : ROUTE.LIBRARY,
      icon: GridSquareOutlineIcon,
      label: "Library",
    },
    {
      key: "image",
      href: ROUTE.IMAGE_GENERATION,
      icon: ImageIcon,
      label: "Image",
    },
    {
      key: "video",
      href: ROUTE.IMAGE_GENERATION_VIDEO,
      icon: VideoIcon,
      label: "Video",
    },
    {
      key: "blueprints",
      href: ROUTE.BLUEPRINTS,
      icon: BlueprintsIcon,
      label: "Blueprints",
      badge: "BETA",
    },
    {
      key: "upscaler",
      href: ROUTE.UNIVERSAL_UPSCALER,
      icon: UniversalUpscalerIcon,
      label: "Upscaler",
    },
    {
      key: "flow-state",
      href: ROUTE.FLOW_STATE,
      icon: FlowStateIcon,
      label: "Flow State",
    },
    {
      key: "divider",
      isDivider: true,
    },
    {
      key: "plans",
      href: isAuthenticated ? ROUTE.BUY : ExternalUrls.pricing,
      icon: PremiumIcon,
      label: "Plans",
      isExternal: !isAuthenticated,
    },
    {
      key: "api",
      href: ROUTE.API_ACCESS,
      icon: ApiIcon,
      label: "API",
    },
    {
      key: "whats-new",
      href: ROUTE.CHANGELOG,
      icon: RocketLaunchIcon,
      label: "What's new",
    },
  ];

  const handleItemClick = (label: string) => () => {
    track(SidebarNavigationEvents.ITEM_CLICKED, {
      menu_item: label,
      menu_location: "primary",
    });
  };

  const handleLogoClick = () => {
    track(SidebarNavigationEvents.ITEM_CLICKED, {
      menu_item: "Leonardo Logo",
      menu_location: "primary",
    });
  };

  return (
    <div className="h-full overflow-hidden p-1" ref={containerRef}>
      <nav aria-label="Main navigation">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <Link
            href={ROUTE.HOME}
            onClick={handleLogoClick}
            aria-label="Leonardo.Ai Home"
            title="Go to Leonardo.Ai Home"
            className={cn(
              "ring-offset-background focus-visible:ring-ring",
              "rounded-3xl p-2",
              "transition duration-120",
              "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0"
            )}
          >
            <LeonardoLogoIcon className="size-9.5" />
          </Link>
        </div>

        {/* Navigation Items */}
        <ul className="flex flex-col items-center gap-2 text-xs">
          {navItems.map((item, index) => {
            const isHidden = visibleCount !== null && index >= visibleCount;

            if (item.isDivider) {
              return (
                <hr
                  key={item.key}
                  className={cn(
                    "mx-auto h-px w-full max-w-6 bg-white/25",
                    isHidden && "hidden"
                  )}
                />
              );
            }

            const Icon = item.icon!;

            return (
              <li key={item.key} className={isHidden ? "hidden" : "w-full"}>
                <SidebarNavItem
                  href={item.href!}
                  pathname={pathname}
                  isExternal={item.isExternal}
                  onClick={handleItemClick(item.label!)}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      size="sm"
                      className="mt-1 rounded-full text-[0.625rem]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarNavItem>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMenu;
