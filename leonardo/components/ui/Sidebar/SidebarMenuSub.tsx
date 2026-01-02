"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarMenuSubProps = ComponentPropsWithoutRef<"ul">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarMenuSub
 *
 * A container for nested submenu items.
 */
export function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

export default SidebarMenuSub;
