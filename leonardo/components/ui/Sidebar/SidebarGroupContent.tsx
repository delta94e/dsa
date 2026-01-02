"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarGroupContentProps = ComponentPropsWithoutRef<"div">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarGroupContent
 *
 * Content wrapper within a sidebar group.
 */
export function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

export default SidebarGroupContent;
