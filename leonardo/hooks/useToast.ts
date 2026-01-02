/**
 * useToast Hook
 *
 * Custom toast hook that wraps the underlying toast library.
 * Matches production bundle module 944254.
 */

import { useCallback } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
import { capitalizeSentences } from "@/lib/utils/string";

// ============================================================================
// Toast Types
// ============================================================================

export const TOAST_TYPES = {
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
  loading: "loading",
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

// ============================================================================
// Toast Options
// ============================================================================

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string | React.ReactNode;
  type?: ToastType;
  variant?: "solid" | "subtle" | "outline";
  duration?: number;
  position?: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  icon?: React.ReactNode;
  onCloseComplete?: () => void;
  containerStyle?: React.CSSProperties;
}

// ============================================================================
// Active Toasts Tracking
// ============================================================================

const activeToasts = new Set<string>();

function isActive(id: string): boolean {
  return activeToasts.has(id);
}

// ============================================================================
// useToast Hook
// ============================================================================

/**
 * Custom toast hook that provides a consistent API for showing notifications.
 * 
 * @example
 * const toast = useToast();
 * toast({
 *   type: 'success',
 *   description: 'Changes saved successfully',
 *   duration: 5000,
 * });
 */
export function useToast() {
  const showToast = useCallback((options: ToastOptions) => {
    const {
      id,
      title = "",
      description,
      type = TOAST_TYPES.info,
      duration = 10000,
      position = "top",
      icon,
      onCloseComplete,
    } = options;

    // Skip if toast with same ID is already active
    if (id && isActive(id)) {
      return;
    }

    // Track active toast
    if (id) {
      activeToasts.add(id);
    }

    // Format description if it's a string
    const formattedDescription =
      typeof description === "string" ? capitalizeSentences(description) : description;

    // Build sonner toast options
    const sonnerOptions: ExternalToast = {
      id,
      duration,
      position: position === "top" ? "top-center" : position === "bottom" ? "bottom-center" : position as ExternalToast["position"],
      icon,
      onDismiss: () => {
        if (id) {
          activeToasts.delete(id);
        }
        onCloseComplete?.();
      },
    };

    // Create toast message
    const message = title || formattedDescription;
    const toastDescription = title && formattedDescription ? formattedDescription : undefined;

    // Show toast based on type
    switch (type) {
      case TOAST_TYPES.success:
        sonnerToast.success(message, { ...sonnerOptions, description: toastDescription });
        break;
      case TOAST_TYPES.error:
        sonnerToast.error(message, { ...sonnerOptions, description: toastDescription });
        break;
      case TOAST_TYPES.warning:
        sonnerToast.warning(message, { ...sonnerOptions, description: toastDescription });
        break;
      case TOAST_TYPES.loading:
        sonnerToast.loading(message, { ...sonnerOptions, description: toastDescription });
        break;
      case TOAST_TYPES.info:
      default:
        sonnerToast.info(message, { ...sonnerOptions, description: toastDescription });
        break;
    }
  }, []);

  // Add isActive helper to the function
  const toastWithHelpers = Object.assign(showToast, { isActive });

  return toastWithHelpers;
}

export default useToast;
