"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarInsetProps = ComponentPropsWithoutRef<"main">;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarInset
 *
 * Main content area that sits alongside the sidebar.
 * Responds to sidebar state for inset variant styling.
 */
export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  );
}

export default SidebarInset;
