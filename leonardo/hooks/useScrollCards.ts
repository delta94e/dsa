"use client";

/**
 * useScrollCards Hook
 *
 * Hook for managing horizontal card scrolling with snap functionality.
 * Matches production bundle module 607423.
 */

import { useCallback, useEffect, useState, type RefObject } from "react";

interface UseScrollCardsOptions {
  scrollParentRef: RefObject<HTMLElement | null>;
  numberOfCards: number;
  initialIndex?: number;
}

interface UseScrollCardsReturn {
  currentIndex: number;
  scrollToCard: (index: number) => void;
  numberOfCards: number;
}

export function useScrollCards({
  scrollParentRef,
  numberOfCards,
  initialIndex = 0,
}: UseScrollCardsOptions): UseScrollCardsReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Calculate scroll position for a card at given index
  const getCardScrollPosition = useCallback(
    (index: number): number | null => {
      const container = scrollParentRef.current;
      if (!container || index < 0 || index >= container.children.length) {
        return null;
      }

      const card = container.children[index] as HTMLElement;
      const containerCenterOffset = container.clientWidth / 2;
      
      return card.offsetLeft + card.clientWidth / 2 - containerCenterOffset;
    },
    [scrollParentRef]
  );

  // Scroll to a specific card
  const scrollToCard = useCallback(
    (index: number) => {
      const scrollPosition = getCardScrollPosition(index);
      const container = scrollParentRef.current;
      
      if (container && scrollPosition !== null) {
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    },
    [getCardScrollPosition, scrollParentRef]
  );

  // Update current index on scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollParentRef.current;
      if (!container) return;

      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const element = child as HTMLElement;
        const elementCenter = element.offsetLeft + element.clientWidth / 2;
        const distance = Math.abs(containerCenter - elementCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    };

    const container = scrollParentRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollParentRef]);

  return {
    currentIndex,
    scrollToCard,
    numberOfCards,
  };
}

export default useScrollCards;
