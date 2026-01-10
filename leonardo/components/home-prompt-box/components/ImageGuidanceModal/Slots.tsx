"use client";

/**
 * Slot Components
 *
 * Slot components for composing modal content using the slot registry pattern.
 * Based on Leonardo.ai module 247652.
 *
 * These slots work with SlotProvider to allow components to register content
 * into named slots that are rendered elsewhere in the component tree.
 */

import { useEffect, type FC, type ReactNode } from "react";
import { useSourceId, useSlotContext } from "./AssetSourceContext";

// ============================================================================
// Types
// ============================================================================

type SlotComponent = FC<{ children: ReactNode }>;

// ============================================================================
// Slot Factory (n)
// ============================================================================

/**
 * Creates a slot component that registers its children to the slot registry.
 * When mounted, registers content under the current source ID.
 * When unmounted, unregisters the content.
 */
function createSlot(slotName: string): SlotComponent {
  function Slot({ children }: { children: ReactNode }) {
    const sourceId = useSourceId();
    const { register, unregister } = useSlotContext();

    useEffect(() => {
      register(slotName, sourceId, children);
      return () => {
        unregister(slotName, sourceId);
      };
    }, [sourceId, register, unregister, children]);

    // Slots don't render anything directly - content is rendered via SlotTarget
    return null;
  }

  // Set display name for debugging
  Slot.displayName = `${
    slotName.charAt(0).toUpperCase() + slotName.slice(1)
  }Slot`;

  return Slot;
}

// ============================================================================
// Slot Components
// ============================================================================

/**
 * TabSlot - Registers content for the tab header area
 */
export const TabSlot = createSlot("tab");

/**
 * HeaderSlot - Registers content for the header area
 */
export const HeaderSlot = createSlot("header");

/**
 * ContentSlot - Registers content for the main content area
 */
export const ContentSlot = createSlot("content");

/**
 * FooterSlot - Registers content for the footer area
 */
export const FooterSlot = createSlot("footer");

/**
 * FiltersSlot - Registers content for the filters area
 */
export const FiltersSlot = createSlot("filters");

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Checks if a value is a render function (a)
 */
export function isRendererFunction(
  value: unknown
): value is (props: unknown) => ReactNode {
  return typeof value === "function";
}

// ============================================================================
// Slot Target Component
// ============================================================================

interface SlotTargetProps {
  name: string;
  renderProps?: unknown;
}

/**
 * SlotTarget - Renders content registered to a slot
 *
 * Use this component to render the content that was registered via slot components.
 */
export function SlotTarget({ name, renderProps }: SlotTargetProps) {
  const { registry } = useSlotContext();
  const slotContent = registry[name];

  if (!slotContent) return null;

  // Render all registered content for this slot
  return (
    <>
      {Object.entries(slotContent).map(([sourceId, content]) => {
        // If content is a render function, call it with renderProps
        if (isRendererFunction(content)) {
          return <div key={sourceId}>{content(renderProps)}</div>;
        }
        return <div key={sourceId}>{content}</div>;
      })}
    </>
  );
}

export { createSlot };
