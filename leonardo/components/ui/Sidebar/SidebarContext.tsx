"use client";

import {
  createContext,
  use,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type FC,
  type ReactNode,
} from "react";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";

// ============================================================================
// Constants
// ============================================================================

export const SIDEBAR_WIDTH = "20rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ============================================================================
// Types
// ============================================================================

type SidebarState = "expanded" | "collapsed";

interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// Context
// ============================================================================

const SidebarContext = createContext<SidebarContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

/**
 * useSidebar
 *
 * Hook to access sidebar context.
 * Must be used within a SidebarProvider.
 */
export function useSidebar(): SidebarContextValue {
  const context = use(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

// ============================================================================
// Provider
// ============================================================================

/**
 * SidebarProvider
 *
 * Provides sidebar state management with:
 * - Desktop: Collapsible sidebar with cookie persistence
 * - Mobile: Off-canvas drawer
 * - Keyboard shortcut: Cmd/Ctrl + B to toggle
 */
export const SidebarProvider: FC<SidebarProviderProps> = ({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  className,
  style,
  children,
}) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Use controlled or internal state
  const open = controlledOpen ?? internalOpen;

  // Set open handler with cookie persistence
  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const newValue = typeof value === "function" ? value(open) : value;

      if (onOpenChange) {
        onOpenChange(newValue);
      } else {
        setInternalOpen(newValue);
      }

      // Persist to cookie
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${newValue}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange, open]
  );

  // Toggle handler - mobile or desktop
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen]);

  // Keyboard shortcut: Cmd/Ctrl + B
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [toggleSidebar]);

  // Compute state
  const state: SidebarState = open ? "expanded" : "collapsed";

  // Memoized context value
  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper has-data-[variant=inset]:bg-gradient-bg-dark flex min-h-svh w-full",
          className
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
