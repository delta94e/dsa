"use client";

import { type FC, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/components/ui/Sidebar";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/routes";
import { LEONARDO_LOGO_PNG, LEONARDO_LOGO_TEXT_PNG } from "@/constants/app";

// Icons
import { MenuAltIcon } from "@/components/icons/MenuAltIcon";

// Components
import { SidebarTrigger } from "@/components";
import { TokenDisplay } from "@/components/tokens/TokenDisplay";

// Types
interface MobileHeaderBarProps {
  isMobileHeaderSticky?: boolean;
  pageTitle?: ReactNode;
  shouldShowTokensOnMobile?: boolean;
}

/**
 * MobileHeaderBar
 *
 * The top header bar shown on mobile devices.
 * Contains logo, page title, and navigation trigger.
 */
export const MobileHeaderBar: FC<MobileHeaderBarProps> = ({
  isMobileHeaderSticky = false,
  pageTitle,
  shouldShowTokensOnMobile = false,
}) => {
  const { openMobile } = useSidebar();
  const { isReady } = useUser();

  return (
    <div
      className={cn(
        // Base styles
        "bg-gradient-bg-panel z-(--z-dialog)",
        "h-16 w-full min-w-[100vw]",
        "px-3 py-2",
        "transition-opacity",

        // Hide on desktop
        "md:hidden md:px-8",

        // Fade out when mobile sidebar is open
        openMobile && "pointer-events-none opacity-0",

        // Sticky positioning
        isMobileHeaderSticky && "sticky top-0 right-0 left-0"
      )}
    >
      <div className="flex h-full items-center justify-between">
        {/* Left Section: Logo/Title */}
        {pageTitle ? (
          <div className="flex items-center gap-2">
            <Image
              src={LEONARDO_LOGO_PNG}
              alt="Leonardo.Ai"
              width={34}
              height={33}
              fetchPriority="high"
            />
            <h1 className="text-sm font-medium">{pageTitle}</h1>
          </div>
        ) : (
          <Link href={ROUTE.HOME}>
            <Image
              src={LEONARDO_LOGO_TEXT_PNG}
              alt="Leonardo.Ai"
              width={131}
              height={33}
              fetchPriority="high"
            />
          </Link>
        )}

        {/* Right Section: Tokens & Menu */}
        <div className="flex gap-2">
          {shouldShowTokensOnMobile && isReady && <TokenDisplay />}

          <SidebarTrigger className="size-9.5 p-[0.438rem]">
            <MenuAltIcon className="h-3.5 w-5" />
          </SidebarTrigger>
        </div>
      </div>
    </div>
  );
};

export default MobileHeaderBar;
