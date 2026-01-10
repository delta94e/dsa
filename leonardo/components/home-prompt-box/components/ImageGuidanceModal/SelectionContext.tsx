import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useContext,
  ReactNode,
} from "react";

// --- Types ---

export type SelectionMode = "single" | "multiple";

// Base item type - requires id, other fields are optional
export interface SelectedItem {
  id: string;
  url: string;
  base64ImageUri?: string;
  initImageType?: string;
  initImageId?: string;
  alt?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

// Input type for toggleSelection - requires id (matches original behavior)
export interface SelectableItem {
  id: string;
  url: string;
  base64ImageUri?: string;
  initImageType?: string;
  initImageId?: string;
  alt?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface SelectionOrigin {
  id: string;
  label?: string;
  [key: string]: unknown;
}

export interface SelectionContextValue {
  selectedItems: SelectedItem[];
  isSelected: (id: string) => boolean;
  toggleSelection: (item: SelectableItem, origin: SelectionOrigin) => void;
  clearSelection: () => void;
  selectionMode: SelectionMode;
  selectedItemOrigins: Map<string, SelectionOrigin>;
  selectionLimit?: number;
  isSelectionLimitReached: boolean;
}

interface SelectionProviderProps {
  children: ReactNode;
  mode?: SelectionMode;
  selectionLimit?: number;
}

// --- Context ---

const SelectionContext = createContext<SelectionContextValue | null>(null);

// --- Provider ---

export function SelectionProvider({
  children,
  mode = "single",
  selectionLimit,
}: SelectionProviderProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedItemOrigins, setSelectedItemOrigins] = useState<
    Map<string, SelectionOrigin>
  >(new Map());

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectedItemOrigins(new Map());
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedItems.some((item) => item.id === id),
    [selectedItems]
  );

  let isSelectionLimitReached = false;
  if (mode === "single") {
    isSelectionLimitReached = selectedItems.length >= 1;
  } else if (selectionLimit) {
    isSelectionLimitReached = selectedItems.length >= selectionLimit;
  }

  const toggleSelection = useCallback(
    (item: SelectableItem, origin: SelectionOrigin) => {
      const existingIndex = selectedItems.findIndex((t) => t.id === item.id);
      const newOrigins = new Map(selectedItemOrigins);

      // Case 1: Deselect if already selected
      if (existingIndex > -1) {
        newOrigins.delete(item.id);
        setSelectedItems((prev) => prev.filter((t) => t.id !== item.id));
        setSelectedItemOrigins(newOrigins);
        return;
      }

      // Case 2: Handle Selection Limit
      if (isSelectionLimitReached) {
        // In single mode, selecting a new item replaces the old one
        if (mode === "single") {
          newOrigins.clear();
          newOrigins.set(item.id, origin);
          setSelectedItems([item]);
          setSelectedItemOrigins(newOrigins);
        }
        // In multiple mode, if limit is reached, do nothing (prevent addition)
        return;
      }

      // Case 3: Add new selection
      if (mode === "single") {
        newOrigins.clear();
        newOrigins.set(item.id, origin);
        setSelectedItems([item]);
      } else {
        newOrigins.set(item.id, origin);
        setSelectedItems((prev) => [...prev, item]);
      }
      setSelectedItemOrigins(newOrigins);
    },
    [selectedItems, selectedItemOrigins, isSelectionLimitReached, mode]
  );

  const value = useMemo(
    () => ({
      selectedItems,
      isSelected,
      toggleSelection,
      clearSelection,
      selectionMode: mode,
      selectedItemOrigins,
      selectionLimit,
      isSelectionLimitReached,
    }),
    [
      selectedItems,
      isSelected,
      toggleSelection,
      clearSelection,
      mode,
      selectedItemOrigins,
      selectionLimit,
      isSelectionLimitReached,
    ]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

// --- Hook ---

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
