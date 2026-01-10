"use client";

/**
 * useDeleteTarget Hook
 *
 * Hook for capturing and managing delete targets in selection context.
 * Based on Leonardo.ai module 56339.
 */

import { useRef, useCallback } from "react";
import type {
  SelectedItem,
  SelectionOrigin,
} from "../components/ImageGuidanceModal/SelectionContext";

interface UseDeleteTargetProps {
  selectedItems: SelectedItem[];
  selectedItemOrigins: Map<string, SelectionOrigin>;
  sourceId: string;
}

interface UseDeleteTargetReturn {
  ids: string[];
  capture: () => string[];
  clear: () => void;
}

export function useDeleteTarget({
  selectedItems,
  selectedItemOrigins,
  sourceId,
}: UseDeleteTargetProps): UseDeleteTargetReturn {
  const idsRef = useRef<string[]>([]);

  const capture = useCallback(() => {
    const ids = selectedItems
      .filter((item) => selectedItemOrigins.get(item.id)?.id === sourceId)
      .map((item) => item.id);
    idsRef.current = ids;
    return ids;
  }, [selectedItems, selectedItemOrigins, sourceId]);

  const clear = useCallback(() => {
    idsRef.current = [];
  }, []);

  return {
    ids: idsRef.current,
    capture,
    clear,
  };
}

export default useDeleteTarget;
