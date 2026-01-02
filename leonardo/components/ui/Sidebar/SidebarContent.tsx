"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarContentProps = ComponentPropsWithoutRef<"div"> & {
  /** Optional close element to render inside the content area */
  closeElement?: ReactNode;
};

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarContent
 *
 * Scrollable content area within the sidebar.
 */
export function SidebarContent({
  className,
  closeElement,
  ...props
}: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "bg-gradient-bg-dark z-50 flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    >
      {closeElement}
      {props.children}
    </div>
  );
}

export default SidebarContent;
