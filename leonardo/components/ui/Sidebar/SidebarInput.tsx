"use client";

import { type ComponentPropsWithoutRef } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarInputProps = ComponentPropsWithoutRef<typeof Input>;

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarInput
 *
 * A search input styled for the sidebar.
 */
export function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

export default SidebarInput;
