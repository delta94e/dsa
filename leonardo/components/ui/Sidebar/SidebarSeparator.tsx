"use client";

import { type ComponentPropsWithoutRef } from "react";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarSeparatorProps = ComponentPropsWithoutRef<typeof Separator>;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarSeparator
 *
 * A horizontal separator styled for the sidebar.
 */
export function SidebarSeparator({
  className,
  ...props
}: SidebarSeparatorProps) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-gradient-bg-dark-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

export default SidebarSeparator;
