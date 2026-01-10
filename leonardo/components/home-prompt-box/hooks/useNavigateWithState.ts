"use client";

/**
 * useNavigateWithState Hook
 *
 * Provides a function to navigate to generation pages with compressed state.
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { PromptFormValues, ImageGuidanceItem } from "../types";
import { buildGenerationUrl } from "../utils";


export function useNavigateWithState() {
  const router = useRouter();

  /**
   * Navigate to generation page with form state
   */
  const navigateWithState = useCallback(
    (
      formValues: PromptFormValues,
      autoGenerate: boolean,
      imageGuidance?: ImageGuidanceItem[]
    ) => {
      const url = buildGenerationUrl(formValues, autoGenerate, imageGuidance);
      router.push(url);
    },
    [router]
  );

  return { navigateWithState };
}

export default useNavigateWithState;
