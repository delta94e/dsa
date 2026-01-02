"use client";

import { type FC } from "react";
import { useSidebar } from "../../navigation/sidebar/SidebarContext";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons/CloseIcon";

/**
 * SidebarCloseButton
 *
 * Close button for the mobile sidebar drawer.
 */
export const SidebarCloseButton: FC = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <button
      type="button"
      onClick={() => setOpenMobile(false)}
      className={cn(
        // Base styles
        "flex items-center justify-center",
        "size-9 rounded-xl",
        "bg-white/5 text-white/70",
        "transition-colors duration-200",
        "hover:bg-white/10 hover:text-white",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      )}
      aria-label="Close sidebar"
    >
      <CloseIcon className="size-5" />
    </button>
  );
};

export default SidebarCloseButton;
