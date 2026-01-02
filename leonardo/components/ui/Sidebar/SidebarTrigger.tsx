"use client";

import { Button, useSidebar } from "@/components";
import { cn } from "@/lib/utils";
import { type ComponentProps, type MouseEvent, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

interface SidebarTriggerProps
  extends Omit<ComponentProps<typeof Button>, "onClick"> {
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarTrigger
 *
 * Button that toggles the sidebar open/closed.
 * Supports custom onClick handler that runs before toggle.
 */
export const SidebarTrigger = ({
  children,
  className,
  onClick,
  ...props
}: SidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="secondary"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
