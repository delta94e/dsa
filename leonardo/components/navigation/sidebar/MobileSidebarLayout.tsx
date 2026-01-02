"use client";

import { type FC, type ReactNode } from "react";
import { MobileHeaderBar } from "./MobileHeader";
import { Sidebar } from "../../ui/Sidebar";
import { SidebarContent } from "../../ui/Sidebar/SidebarContent";
import { SidebarCloseButton } from "../../ui/Sidebar/SidebarCloseButton";

// Types
interface MobileSidebarLayoutProps {
  isMobileHeaderSticky?: boolean;
  pageTitle?: ReactNode;
  shouldShowTokensOnMobile?: boolean;
}

/**
 * MobileSidebarLayout
 *
 * Complete mobile navigation layout including:
 * - Header bar with logo and menu trigger
 * - Off-canvas sidebar drawer
 */
export const MobileSidebarLayout: FC<MobileSidebarLayoutProps> = ({
  isMobileHeaderSticky = false,
  pageTitle,
  shouldShowTokensOnMobile = false,
}) => {
  return (
    <>
      {/* Mobile Header Bar */}
      <MobileHeaderBar
        isMobileHeaderSticky={isMobileHeaderSticky}
        pageTitle={pageTitle}
        shouldShowTokensOnMobile={shouldShowTokensOnMobile}
      />

      {/* Mobile Sidebar Drawer */}
      <Sidebar
        side="left"
        collapsible="offcanvas"
        className="[&_[data-mobile=true]]:w-full [&_[data-slot=sidebar-inner]]:w-full"
      >
        <SidebarContent closeElement={<SidebarCloseButton />} />
      </Sidebar>
    </>
  );
};

export default MobileSidebarLayout;
