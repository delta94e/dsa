"use client";

/**
 * VirtualizedMasonry Component
 *
 * Virtualized masonry grid for efficiently rendering large image lists.
 * Based on Leonardo.ai module 502975.
 *
 * Uses @tanstack/react-virtual for virtualization.
 */

import {
  Component,
  useRef,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
  type ReactNode,
  type RefObject,
} from "react";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { type ModalImage, InitImageType } from "./imageModalUtils";

// ============================================================================
// Constants
// ============================================================================

const MAX_COLUMN_COUNT: Record<string, number> = {
  xl: 6,
  lg: 5,
  md: 4,
  sm: 3,
  xs: 2,
};

// ============================================================================
// Types
// ============================================================================

interface RenderItemProps {
  item: ModalImage;
  id?: string;
  isSelected: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  columnWidth: number;
  estimatedHeight: number;
  onSelect: (item: ModalImage) => void;
}

interface VirtualizedMasonryProps {
  images: ModalImage[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  gap?: number;
  columnCount?: number;
  overscan?: number;
  onSelect: (item: ModalImage) => void;
  isSelected: (id: string) => boolean;
  onLoadMore: () => void;
  renderItem: (props: RenderItemProps) => ReactNode;
  renderNoItems?: () => ReactNode;
  renderFirstColumnPrefix?: () => ReactNode;
  renderFooter?: (props: {
    isEndOfList: boolean;
    virtualizer: Virtualizer<HTMLElement, Element>;
  }) => ReactNode;
  scrollableRef?: RefObject<HTMLElement | null>;
}

// ============================================================================
// Error Boundary (d)
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error if needed
    console.error("VirtualizedMasonry Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert variant="destructive">
            <AlertTitle className="text-lg font-bold">
              Something went wrong
            </AlertTitle>
            <AlertDescription>
              Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// End of List Component (c)
// ============================================================================

interface EndOfListProps {
  renderFooter?: VirtualizedMasonryProps["renderFooter"];
  rowVirtualizer: Virtualizer<HTMLElement, Element>;
  gapValue: number;
}

function EndOfList({ renderFooter, rowVirtualizer, gapValue }: EndOfListProps) {
  if (renderFooter) {
    return (
      <>{renderFooter({ isEndOfList: true, virtualizer: rowVirtualizer })}</>
    );
  }

  return (
    <div
      style={{ "--gap-value": `${gapValue}px` } as React.CSSProperties}
      className="flex w-full items-center justify-center rounded-md bg-black/20 py-[var(--gap-value)]"
    >
      <p className="text-sm font-medium text-gray-500">
        You've reached the end of your images.
      </p>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function isModalImage(item: unknown): item is ModalImage {
  return (
    typeof item === "object" &&
    item !== null &&
    "url" in item &&
    typeof (item as ModalImage).url === "string"
  );
}

// ============================================================================
// VirtualizedMasonry Component (u)
// ============================================================================

export function VirtualizedMasonry({
  images,
  isLoading = false,
  hasNextPage = true,
  gap = 4,
  columnCount = 4,
  overscan = 8,
  onSelect,
  isSelected,
  onLoadMore,
  renderItem,
  renderNoItems,
  renderFirstColumnPrefix,
  renderFooter,
  scrollableRef,
}: VirtualizedMasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  // Get responsive column count (O)
  const breakpoint = useBreakpoint();
  const responsiveColumnCount =
    MAX_COLUMN_COUNT[
      (["xl", "lg", "md", "sm"] as const).find((bp) => breakpoint[bp]) || "xs"
    ];

  // Column width state
  const [columnWidth, setColumnWidth] = useState(0);

  // Gap calculations
  const gapValue = 4 * gap;

  // Effective column count
  const effectiveColumnCount =
    Math.min(responsiveColumnCount, columnCount) || 1;

  // Add prefix item if renderFirstColumnPrefix is provided (L)
  const itemsWithPrefix = useMemo(() => {
    if (renderFirstColumnPrefix) {
      const prefixItem: ModalImage = {
        id: "first-column-prefix",
        initImageId: "first-column-prefix",
        initImageType: InitImageType.Generated,
        alt: "Prefix Item",
        aspectRatio: 1,
        url: "",
      };
      return [prefixItem, ...images];
    }
    return images;
  }, [renderFirstColumnPrefix, images]);

  // Find scrollable parent
  useEffect(() => {
    if (scrollableRef?.current) {
      scrollElementRef.current = scrollableRef.current;
      return;
    }

    const findScrollableParent = (
      element: HTMLElement | null
    ): HTMLElement | null => {
      if (!element) return null;
      const { overflow, overflowY } = window.getComputedStyle(element);
      const isScrollable =
        (overflow === "auto" ||
          overflow === "scroll" ||
          overflowY === "auto" ||
          overflowY === "scroll") &&
        element.scrollHeight > element.clientHeight;
      return isScrollable
        ? element
        : findScrollableParent(element.parentElement);
    };

    const container = containerRef.current;
    if (container) {
      const scrollable = findScrollableParent(container);
      if (scrollable) {
        scrollElementRef.current = scrollable;
      }
    }
  }, [scrollableRef]);

  // Calculate column width on resize
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateColumnWidth = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      if (containerWidth > 0) {
        setColumnWidth(
          (containerWidth - gapValue * (effectiveColumnCount - 1)) /
            effectiveColumnCount
        );
      }
    };

    updateColumnWidth();

    const resizeObserver = new window.ResizeObserver(updateColumnWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [columnCount, effectiveColumnCount, images.length, gapValue]);

  // Measure element height
  const measureElement = useCallback(
    (element: Element) => element.getBoundingClientRect().height,
    []
  );

  // Estimate item size (z)
  const estimateSize = useCallback(
    (index: number) => {
      const item = itemsWithPrefix[index];

      if (isModalImage(item) && item.id === "first-column-prefix") {
        return 150;
      }

      let aspectRatio = 1;
      const itemAspectRatio = isModalImage(item) ? item.aspectRatio : 1;

      if (typeof itemAspectRatio === "string") {
        const parts = itemAspectRatio.split(" / ");
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        if (height !== 0 && !isNaN(width) && !isNaN(height)) {
          aspectRatio = width / height;
        }
      } else if (typeof itemAspectRatio === "number" && itemAspectRatio > 0) {
        aspectRatio = itemAspectRatio;
      }

      if (columnWidth > 0 && aspectRatio > 0) {
        return Math.max(50, columnWidth / aspectRatio + gapValue);
      }
      return Math.max(50, 150 / aspectRatio + gapValue);
    },
    [itemsWithPrefix, columnWidth, gapValue]
  );

  // Create virtualizer (j)
  const virtualizer = useVirtualizer({
    count: itemsWithPrefix.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize,
    getItemKey: (index) => itemsWithPrefix[index]?.id ?? String(index),
    overscan: overscan ?? 8,
    lanes: effectiveColumnCount,
    measureElement,
    paddingStart: 0,
    paddingEnd: gapValue / 2,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Load more when near end
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem &&
      lastItem.index >= itemsWithPrefix.length - 10 &&
      hasNextPage &&
      !isLoading
    ) {
      onLoadMore();
    }
  }, [
    hasNextPage,
    onLoadMore,
    virtualItems,
    isLoading,
    itemsWithPrefix.length,
  ]);

  // Re-measure when no more pages
  useEffect(() => {
    if (!hasNextPage) {
      virtualizer.measure();
    }
  }, [hasNextPage, virtualizer]);

  // Show placeholder while calculating width
  if (columnWidth <= 0) {
    return (
      <div
        ref={containerRef}
        id="virtualized-image-container-placeholder"
        className="relative min-h-[200px] w-full"
      />
    );
  }

  // Show empty state
  if (!isLoading && itemsWithPrefix.length === 0) {
    return renderNoItems?.() ?? null;
  }

  const paddingX = `${gapValue / 2}px`;
  const lastIndex = itemsWithPrefix.length - 1;
  const isLastItemVisible =
    virtualItems.length > 0 &&
    virtualItems[virtualItems.length - 1].index === lastIndex;
  const hasEnoughItems = itemsWithPrefix.length > 15;
  const showEndOfList =
    !hasNextPage && !isLoading && isLastItemVisible && hasEnoughItems;

  return (
    <ErrorBoundary>
      <div
        id="virtualized-image-container-wrapper"
        className="flex min-h-96 flex-1 flex-col"
      >
        <div
          ref={containerRef}
          id="virtualized-image-container"
          key={`virtualized-image-${columnCount}`}
          className="relative w-full px-[--padding-x] will-change-contents"
          style={
            {
              "--total-height": `${virtualizer.getTotalSize()}px`,
              height: "var(--total-height)",
              "--padding-x": paddingX,
            } as React.CSSProperties
          }
        >
          {virtualItems.map((virtualItem) => {
            const item = itemsWithPrefix[virtualItem.index];
            const isPrefix = item.id === "first-column-prefix";

            let estimatedHeight: number | undefined;
            if (!isPrefix) {
              const itemAspectRatio =
                (isModalImage(item) && item.aspectRatio) || 1;
              let aspectRatio = 1;
              if (typeof itemAspectRatio === "string") {
                const parts = itemAspectRatio.split(" / ");
                const w = parseFloat(parts[0]);
                const h = parseFloat(parts[1]);
                if (h !== 0 && !isNaN(w) && !isNaN(h)) {
                  aspectRatio = w / h;
                }
              } else if (
                typeof itemAspectRatio === "number" &&
                itemAspectRatio > 0
              ) {
                aspectRatio = itemAspectRatio;
              }
              estimatedHeight =
                columnWidth > 0 && aspectRatio > 0
                  ? Math.max(20, columnWidth / aspectRatio)
                  : 200;
            }

            const leftPosition = virtualItem.lane * (columnWidth + gapValue);
            const leftStyle =
              columnWidth > 0
                ? `${leftPosition}px`
                : `${(virtualItem.lane * 100) / effectiveColumnCount}%`;
            const widthStyle =
              columnWidth > 0
                ? `${columnWidth}px`
                : `${100 / effectiveColumnCount}%`;

            return (
              <div
                key={`${item.id || "item"}-${virtualItem.index}`}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                className="absolute top-0 left-[var(--left-position)] w-[var(--item-width)] translate-y-[var(--translate-y)] pt-[var(--padding-t)] pb-[var(--padding-b)] will-change-transform contain-layout contain-paint"
                style={
                  {
                    "--left-position": leftStyle,
                    "--item-width": widthStyle,
                    "--translate-y": `${virtualItem.start}px`,
                    "--padding-t":
                      virtualItem.index < effectiveColumnCount
                        ? "0px"
                        : paddingX,
                    "--padding-b": paddingX,
                  } as React.CSSProperties
                }
              >
                {isPrefix
                  ? renderFirstColumnPrefix?.()
                  : renderItem({
                      item,
                      id: item.id,
                      isSelected: isSelected(item.id ?? ""),
                      isDisabled: isLoading,
                      isLoading,
                      columnWidth,
                      estimatedHeight: estimatedHeight ?? 150,
                      onSelect,
                    })}
              </div>
            );
          })}
        </div>

        {showEndOfList && (
          <EndOfList
            renderFooter={renderFooter}
            rowVirtualizer={virtualizer}
            gapValue={gap ?? 4}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export type { VirtualizedMasonryProps, RenderItemProps };
export default VirtualizedMasonry;
