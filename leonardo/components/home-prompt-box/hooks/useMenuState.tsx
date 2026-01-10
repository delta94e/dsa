"use client";
/**
 * useMenuState Hook
 *
 * Manages open/close state for multiple dropdown menus.
 */

import { useState, useCallback } from "react";

export type MenuId = "aspect-ratio" | "style" | "model" | "settings" | null;

export interface UseMenuStateOptions {
  onOpenChange?: (isAnyOpen: boolean) => void;
}

export interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface UseMenuStateReturn {
  /**
   * Currently open menu ID (null if none open)
   */
  openMenu: MenuId;

  /**
   * Get props to spread on a DropdownMenu for a specific menu ID
   */
  getMenuProps: (menuId: Exclude<MenuId, null>) => MenuProps;

  /**
   * Close all menus
   */
  closeAllMenus: () => void;
}

/**
 * Hook to manage multiple dropdown menu states
 */
export function useMenuState(
  options: UseMenuStateOptions = {}
): UseMenuStateReturn {
  const { onOpenChange } = options;
  const [openMenu, setOpenMenu] = useState<MenuId>(null);

  const getMenuProps = useCallback(
    (menuId: Exclude<MenuId, null>): MenuProps => ({
      open: openMenu === menuId,
      onOpenChange: (open: boolean) => {
        const newMenuId = open ? menuId : null;
        setOpenMenu(newMenuId);
        onOpenChange?.(newMenuId !== null);
      },
    }),
    [openMenu, onOpenChange]
  );

  const closeAllMenus = useCallback(() => {
    setOpenMenu(null);
    onOpenChange?.(false);
  }, [onOpenChange]);

  return {
    openMenu,
    getMenuProps,
    closeAllMenus,
  };
}
