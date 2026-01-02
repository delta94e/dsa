"use client";

import { type ComponentPropsWithoutRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SidebarMenuSkeletonProps extends ComponentPropsWithoutRef<"div"> {
  showIcon?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SidebarMenuSkeleton
 *
 * A loading skeleton for menu items.
 */
export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
}

export default SidebarMenuSkeleton;
