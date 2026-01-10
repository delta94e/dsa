"use client";

import { ExternalUrls } from "@/constants/externalUrls";
import { ROUTE } from "@/constants/routes";
import { SidebarNavigationEvents, track } from "@/lib/analytics";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type FC } from "react";

// Components
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { ExpandedNavItem } from "./ExpandedNavItem";
import { SocialLinksFooter } from "./SocialLinksFooter";

// Icons
import { ApiIcon } from "@/components/icons/ApiIcon";
import { CanvasIcon } from "@/components/icons/CanvasIcon";
import { FlowStateIcon } from "@/components/icons/FlowStateIcon";
import { PremiumIcon } from "@/components/icons/PremiumIcon";
import { RocketLaunchIcon } from "@/components/icons/RocketLaunchIcon";
import {
  FeedbackIcon,
  FineTunedModelIcon,
  GraduationCapIcon,
  LifeRingOutlineIcon,
  RealtimeDrawIcon,
  RealtimeGenIcon,
  TextureIcon,
} from "@/components/icons/SocialIcons";

// Types
interface SidebarExpandedPanelProps {
  panelOffsetRem: number;
  panelWidthRem: number;
  pathname: string;
}

interface ExpandedMenuItem {
  key: string;
  href: string;
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  isExternal?: boolean;
  authRequired?: boolean;
}

// Menu items configuration
const EXPANDED_MENU_ITEMS: ExpandedMenuItem[] = [
  {
    key: "flow-state",
    href: ROUTE.FLOW_STATE,
    icon: FlowStateIcon,
    title: "Flow State",
    description: "Spawn continuous images",
  },
  {
    key: "realtime-canvas",
    href: ROUTE.REALTIME_CANVAS,
    icon: RealtimeDrawIcon,
    title: "Realtime Canvas",
    description: "Turn your sketches into art",
  },
  {
    key: "realtime-gen",
    href: ROUTE.REALTIME_GEN,
    icon: RealtimeGenIcon,
    title: "Realtime Generation",
    description: "Generates images as you type",
  },
  {
    key: "texture-gen",
    href: ROUTE.TEXTURE_GENERATION,
    icon: TextureIcon,
    title: "Texture Generation",
    description: "Generate seamless textures for your 3D models",
  },
  {
    key: "canvas",
    href: ROUTE.CANVAS,
    icon: CanvasIcon,
    title: "Canvas Editor",
    description: "Edit and refine AI creations",
  },
  {
    key: "models-training",
    href: ROUTE.MODELS_AND_TRAINING,
    icon: FineTunedModelIcon,
    title: "Models & Training",
    description: "Customize, train, and discover models",
  },
];

const EXPANDED_MENU_ITEMS_SECONDARY: ExpandedMenuItem[] = [
  {
    key: "learn",
    href: ExternalUrls.learn,
    icon: GraduationCapIcon,
    title: "Learn",
    description: "Explore tutorials and walkthroughs",
    isExternal: true,
  },
  {
    key: "faq-help",
    href: ExternalUrls.faq,
    icon: LifeRingOutlineIcon,
    title: "FAQ and Help",
    description: "Find answers and get support",
    isExternal: true,
  },
  {
    key: "plans",
    href: ROUTE.BUY,
    icon: PremiumIcon,
    title: "Plans",
    description: "Manage or upgrade subscriptions",
    authRequired: true,
  },
  {
    key: "api",
    href: ROUTE.API_ACCESS,
    icon: ApiIcon,
    title: "API",
    description: "Access documentation and manage keys",
  },
  {
    key: "whats-new",
    href: ROUTE.CHANGELOG,
    icon: RocketLaunchIcon,
    title: "What's New",
    description: "See the latest features",
  },
  {
    key: "feedback",
    href: ExternalUrls.feedback,
    icon: FeedbackIcon,
    title: "Feedback",
    description: "Share ideas and report issues",
    isExternal: true,
    authRequired: true,
  },
];

/**
 * SidebarExpandedPanel
 *
 * Expanded navigation panel with additional menu items.
 * Shows when "More" button is clicked.
 */
export const SidebarExpandedPanel: FC<SidebarExpandedPanelProps> = ({
  panelOffsetRem,
  panelWidthRem,
  pathname,
}) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleItemClick = (title: string) => () => {
    track(SidebarNavigationEvents.ITEM_CLICKED, {
      menu_item: title,
      menu_location: "more",
    });
  };

  return (
    <div
      className="absolute top-0 bottom-0 z-[100]"
      style={{
        left: `${panelOffsetRem}rem`,
        width: `${panelWidthRem}rem`,
      }}
    >
      <LiquidGlassCard
        blurIntensity="lg"
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="16px"
        className="h-full overflow-hidden bg-[#0a0a0a]/50"
      >
        <div className="flex h-full flex-col">
          {/* Navigation Content */}
          <nav
            className="flex-1 overflow-y-auto px-2 py-5"
            style={{ width: `${panelWidthRem}rem` }}
            aria-label="Supplemental navigation"
          >
            {/* Logo */}
            <div className="mb-5 py-3">
              <Image
                className="mx-auto"
                src="/img/leonardo-ai.svg"
                alt="Leonardo.ai"
                width={91}
                height={12}
              />
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-2.5">
              {/* Primary Items */}
              {EXPANDED_MENU_ITEMS.map((item) => (
                <ExpandedNavItem
                  key={item.key}
                  href={item.href}
                  pathname={pathname}
                  isExternal={item.isExternal}
                  onClick={handleItemClick(item.title)}
                >
                  <item.icon className="size-5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{item.title}</span>
                    <span className="font-normal">{item.description}</span>
                  </div>
                </ExpandedNavItem>
              ))}

              {/* Divider */}
              <div className="mx-4.5 h-px bg-white/25" />

              {/* Secondary Items */}
              {EXPANDED_MENU_ITEMS_SECONDARY.map((item) => {
                // Skip auth-required items if not authenticated
                if (item.authRequired && !isAuthenticated) return null;

                // Handle Plans item with external URL for unauthenticated users
                const href =
                  item.key === "plans" && !isAuthenticated
                    ? ExternalUrls.pricing
                    : item.href;
                const isExternal =
                  item.key === "plans" && !isAuthenticated
                    ? true
                    : item.isExternal;

                return (
                  <ExpandedNavItem
                    key={item.key}
                    href={href}
                    pathname={pathname}
                    isExternal={isExternal}
                    onClick={handleItemClick(item.title)}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.title}</span>
                      <span className="font-normal">{item.description}</span>
                    </div>
                  </ExpandedNavItem>
                );
              })}
            </ul>
          </nav>

          {/* Social Links Footer */}
          <SocialLinksFooter />
        </div>
      </LiquidGlassCard>
    </div>
  );
};

export default SidebarExpandedPanel;
