"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarGroupProps = ComponentPropsWithoutRef<"div">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarGroup
 *
 * A group container for organizing sidebar content.
 */
export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

export default SidebarGroup;
