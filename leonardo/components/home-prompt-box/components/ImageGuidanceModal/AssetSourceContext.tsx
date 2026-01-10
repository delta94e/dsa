import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useContext,
  ReactNode,
  use,
} from "react";

// --- Slot Context ---

interface SlotRegistry {
  [slotName: string]: {
    [sourceId: string]: ReactNode;
  };
}

interface SlotContextValue {
  registry: SlotRegistry;
  register: (slotName: string, sourceId: string, content: ReactNode) => void;
  unregister: (slotName: string, sourceId: string) => void;
}

const SlotContext = createContext<SlotContextValue | undefined>(undefined);

export function SlotProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<SlotRegistry>({});

  const register = useCallback(
    (slotName: string, sourceId: string, content: ReactNode) => {
      setRegistry((prev) => {
        // Warn on duplicate source registration for a slot
        if (prev[slotName]?.[sourceId]) {
          console.warn(
            `SlotProvider: Duplicate sourceId "${sourceId}" detected for slot "${slotName}". Each sourceId must be unique per slot.`
          );
        }

        return {
          ...prev,
          [slotName]: {
            ...prev[slotName],
            [sourceId]: content,
          },
        };
      });
    },
    []
  );

  const unregister = useCallback((slotName: string, sourceId: string) => {
    setRegistry((prev) => {
      const slotContent = prev[slotName];
      if (!slotContent) return prev;

      const newSlotContent = { ...slotContent };
      delete newSlotContent[sourceId];

      const newRegistry = { ...prev };
      if (Object.keys(newSlotContent).length > 0) {
        newRegistry[slotName] = newSlotContent;
      } else {
        delete newRegistry[slotName];
      }

      return newRegistry;
    });
  }, []);

  const value = useMemo(
    () => ({ registry, register, unregister }),
    [registry, register, unregister]
  );

  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
}

export function useSlotContext() {
  const context = useContext(SlotContext);
  if (context === undefined) {
    throw new Error("useSlotContext must be used within a SlotProvider");
  }
  return context;
}

// --- Asset Source Context ---

interface AssetSourceContextValue {
  id: string;
  label?: string;
  forceMount?: boolean;
}

const AssetSourceContext = createContext<AssetSourceContextValue | undefined>(
  undefined
);

interface AssetSourceProviderProps {
  id: string;
  label?: string;
  children: ReactNode;
  forceMount?: boolean;
}

export function AssetSourceProvider({
  id,
  label,
  children,
  forceMount,
}: AssetSourceProviderProps) {
  const value = useMemo(
    () => ({ id, label, forceMount }),
    [id, label, forceMount]
  );

  return (
    <AssetSourceContext.Provider value={value}>
      {children}
    </AssetSourceContext.Provider>
  );
}

export function useSourceId() {
  const context = useContext(AssetSourceContext);
  if (context === undefined) {
    throw new Error("useSourceId must be used within an AssetSourceProvider");
  }
  return context.id;
}
