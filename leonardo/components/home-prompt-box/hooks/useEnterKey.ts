/**
 * useEnterKey Hook
 *
 * Handles Enter key press for form submission.
 */

import { useCallback, type KeyboardEvent } from "react";

export interface UseEnterKeyReturn {
  /**
   * Handle Enter key press - calls onSubmit unless Shift/Meta is held
   */
  handleEnterKey: (event: KeyboardEvent<HTMLTextAreaElement>, onSubmit: () => void) => void;
}

/**
 * Hook to handle Enter key press for submitting forms
 */
export function useEnterKey(): UseEnterKeyReturn {
  const handleEnterKey = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>, onSubmit: () => void) => {
      // Allow new line with Shift+Enter or Meta+Enter
      if (event.key === "Enter" && !event.shiftKey && !event.metaKey) {
        event.preventDefault();
        onSubmit();
      }
    },
    []
  );

  return { handleEnterKey };
}
