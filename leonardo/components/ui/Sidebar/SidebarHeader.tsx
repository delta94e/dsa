"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarHeaderProps = ComponentPropsWithoutRef<"div">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarHeader
 *
 * Header section of the sidebar.
 */
export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("bg-gradient-bg-dark flex flex-col gap-2 p-3", className)}
      {...props}
    />
  );
}

export default SidebarHeader;
