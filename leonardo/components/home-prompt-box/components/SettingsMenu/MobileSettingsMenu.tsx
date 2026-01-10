"use client";

/**
 * MobileSettingsMenu Component
 *
 * Mobile-only settings menu using DropdownMenu with nested sections.
 */

import { createContext, use, useState, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { SettingsOutlineIcon } from "@/components/icons/SettingsOutlineIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

// ============================================================================
// Context
// ============================================================================

type SectionId = "model" | "aspect-ratio" | "style" | null;

interface SettingsMenuContextValue {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
}

const SettingsMenuContext = createContext<SettingsMenuContextValue | null>(
  null
);

function useSettingsMenuContext(): SettingsMenuContextValue {
  const context = use(SettingsMenuContext);
  if (!context) {
    throw new Error(
      "SettingsMenu compound components must be used within SettingsMenu"
    );
  }
  return context;
}

// ============================================================================
// Main Component
// ============================================================================

export interface MobileSettingsMenuProps {
  /**
   * Whether menu is open
   */
  open: boolean;
  /**
   * Open change handler
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Children (menu items and sections)
   */
  children: ReactNode;
}

export function MobileSettingsMenu({
  children,
  open,
  onOpenChange,
}: MobileSettingsMenuProps) {
  const [activeSection, setActiveSection] = useState<SectionId>(null);

  const contextValue = useMemo(
    () => ({ activeSection, setActiveSection }),
    [activeSection]
  );

  return (
    <SettingsMenuContext.Provider value={contextValue}>
      <div className="md:hidden">
        <DropdownMenu
          open={open}
          onOpenChange={(isOpen) => {
            if (isOpen) setActiveSection(null);
            onOpenChange?.(isOpen);
          }}
        >
          <DropdownMenuTrigger asChild>
            <IconButton
              variant="secondary"
              size="md"
              className="rounded-full"
              aria-label="Open settings"
            >
              <SettingsOutlineIcon />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={
              activeSection === null
                ? "w-[13.125rem]"
                : activeSection === "model"
                ? "max-w-[23.625rem] min-w-[20rem]"
                : "w-auto"
            }
          >
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SettingsMenuContext.Provider>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

export interface RootViewProps {
  children: ReactNode;
}

export function RootView({ children }: RootViewProps) {
  const { activeSection } = useSettingsMenuContext();
  if (activeSection === null) {
    return <>{children}</>;
  }
  return null;
}

export interface SectionsViewProps {
  children: ReactNode;
}

export function SectionsView({ children }: SectionsViewProps) {
  const { activeSection } = useSettingsMenuContext();
  if (activeSection !== null) {
    return <>{children}</>;
  }
  return null;
}

export interface SettingsMenuItemProps {
  /**
   * Item label
   */
  label: string;
  /**
   * Current value to display
   */
  value: string;
  /**
   * Section ID to navigate to
   */
  sectionId: Exclude<SectionId, null>;
  /**
   * Additional class name
   */
  className?: string;
}

export function SettingsMenuItem({
  label,
  value,
  sectionId,
  className,
}: SettingsMenuItemProps) {
  const { setActiveSection } = useSettingsMenuContext();

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        setActiveSection(sectionId);
      }}
      className={cn(
        "flex h-12 cursor-pointer items-center justify-between gap-3 px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-tertiary-foreground flex items-center justify-end">
        <span>{value}</span>
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </DropdownMenuItem>
  );
}

export interface SettingsSectionProps {
  /**
   * Section ID
   */
  id: Exclude<SectionId, null>;
  /**
   * Section content
   */
  children: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

export function SettingsSection({
  id,
  children,
  className,
}: SettingsSectionProps) {
  const { activeSection } = useSettingsMenuContext();

  if (activeSection === id) {
    return <div className={className}>{children}</div>;
  }
  return null;
}

// Compound component export
MobileSettingsMenu.RootView = RootView;
MobileSettingsMenu.SectionsView = SectionsView;
MobileSettingsMenu.Item = SettingsMenuItem;
MobileSettingsMenu.Section = SettingsSection;

export default MobileSettingsMenu;
