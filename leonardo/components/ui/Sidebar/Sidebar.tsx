"use client";

import { type ComponentPropsWithoutRef } from "react";
import { useSidebar } from "./SidebarContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type SidebarSide = "left" | "right";
type SidebarVariant = "sidebar" | "floating" | "inset";
type SidebarCollapsible = "none" | "icon" | "offcanvas";

interface SidebarProps extends ComponentPropsWithoutRef<"div"> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
  modal?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Sidebar
 *
 * The main sidebar container component.
 * Supports desktop (collapsible icon) and mobile (sheet) modes.
 */
export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  modal,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // Non-collapsible mode
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "text-sidebar-foreground bg-gradient-bg-dark flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Mobile mode - use Sheet
  if (isMobile) {
    return (
      <Sheet
        open={openMobile}
        onOpenChange={setOpenMobile}
        modal={modal}
        {...props}
      >
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="text-sidebar-foreground bg-gradient-bg-dark w-(--sidebar-width) p-0 [&>button]:hidden"
          style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop mode
  return (
    <div
      className={cn(
        "group peer text-sidebar-foreground hidden md:block",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      {...props}
    >
      {/* Gap element for layout */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />

      {/* Main sidebar container */}
      <div
        data-slot="sidebar-container"
        className={cn(
          "bg-gradient-bg-dark [position:inherit] inset-y-0 z-50 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          "border-sidebar-border group-data-[side=left]:border-r group-data-[side=right]:border-l"
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="group-data-[variant=floating]:border-sidebar-border bg-gradient-bg-dark flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
