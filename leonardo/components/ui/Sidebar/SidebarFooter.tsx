"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarFooterProps = ComponentPropsWithoutRef<"div">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarFooter
 *
 * Footer section of the sidebar.
 */
export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

export default SidebarFooter;
