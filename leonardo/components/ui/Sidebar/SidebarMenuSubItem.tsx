"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarMenuSubItemProps = ComponentPropsWithoutRef<"li">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarMenuSubItem
 *
 * A list item for nested menu items within a SidebarMenuSub.
 */
export function SidebarMenuSubItem({
  className,
  ...props
}: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

export default SidebarMenuSubItem;
