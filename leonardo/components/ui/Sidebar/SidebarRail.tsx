"use client";

import { type ComponentPropsWithoutRef } from "react";
import { useSidebar } from "../../navigation/sidebar/SidebarContext";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarRailProps = ComponentPropsWithoutRef<"button">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarRail
 *
 * An invisible drag handle at the sidebar edge that toggles the sidebar.
 * Shows a resize cursor and visual indicator on hover.
 */
export function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        // Base positioning
        "hover:after:bg-gradient-bg-dark-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        // Cursor styles
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        // Collapsed state cursor
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        // Offcanvas collapsible styles
        "hover:group-data-[collapsible=offcanvas]:bg-gradient-bg-dark group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
}

export default SidebarRail;
