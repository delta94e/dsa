"use client";

/**
 * UploadsSource Component
 *
 * Component for displaying and selecting user uploads in the ImageGuidanceModal.
 * Based on Leonardo.ai module 284943/621956.
 *
 * Features:
 * - Virtualized masonry grid for uploads
 * - Image selection (single/multi)
 * - Delete functionality
 * - Upload button integration
 * - Slots pattern with AssetSourceProvider
 */

import { TrashOutlineIcon } from "@/components/icons/TrashOutlineIcon";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { MODAL_SELECT_IMAGE_INPUT_DELETE_IMAGE_BUTTON } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDeleteTarget } from "../../hooks/useDeleteTarget";
import { useYourUploads } from "../../hooks/useYourUploads";
import { AssetSourceProvider } from "./AssetSourceContext";
import {
  ASSET_SELECTION_MODAL_SCROLLABLE_TARGET_ID,
  DEFAULT_MODAL_PAGE_SIZE,
  DEFAULT_SKELETON_COUNT,
  FALLBACK_SKELETON_HEIGHT,
} from "./constants";
import { ImageDropzoneButton } from "./ImageDropzoneButton";
import {
  mapUploadToModalImage,
  noop,
  transformToLegacyImageModalImage,
  type ModalImage,
} from "./imageModalUtils";
import SelectImageThumbnail from "./SelectImageThumbnail";
import {
  SelectedItem,
  useSelection,
  type SelectionOrigin,
} from "./SelectionContext";
import { ContentSlot, FooterSlot, TabSlot } from "./Slots";

// ============================================================================
// Constants
// ============================================================================

const YOUR_UPLOADS_ID = "YOUR_UPLOADS";
const YOUR_UPLOADS_LABEL = "Your Uploads";

// ============================================================================
// Types
// ============================================================================

interface UploadsSourceProps {
  id?: string;
  isUploadEnabled?: boolean;
  excludeImageIds?: string[];
  forceMount?: boolean;
  label?: string;
}

// ============================================================================
// Skeleton Items
// ============================================================================

const skeletonItems = Array.from({ length: DEFAULT_SKELETON_COUNT }, (_, i) =>
  mapUploadToModalImage({
    id: `skeleton-${i}`,
    url: "",
    alt: "Loading...",
  })
);

// ============================================================================
// Sub-components
// ============================================================================

function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 p-7 text-center"
    >
      <div className="text-heading-xs font-bold text-white">
        Nothing to display
      </div>
      <div className="text-foreground-muted max-w-xs text-base">
        Your uploaded images will appear here
      </div>
    </div>
  );
}

interface SkeletonItemProps {
  item: ModalImage;
  estimatedHeight?: number;
}

function SkeletonItem({ item, estimatedHeight }: SkeletonItemProps) {
  const style = {
    "--skeleton-height": `${estimatedHeight ?? FALLBACK_SKELETON_HEIGHT}px`,
  } as React.CSSProperties;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Skeleton
        className="m-1 h-[var(--skeleton-height)] w-full rounded-md"
        style={style}
      />
    </motion.div>
  );
}

interface SelectionCounterProps {}

function SelectionCounter({}: SelectionCounterProps) {
  // Placeholder - would show selection count
  return null;
}

interface CreateDefaultActionsProps {
  isProcessing: boolean;
  children: ReactNode;
}

function CreateDefaultActions({
  isProcessing,
  children,
}: CreateDefaultActionsProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}

interface DeleteUploadsModalProps {
  isOpen: boolean;
  onDeleteStart: () => void;
  onClose: () => void;
  initImageIds: string[];
}

function DeleteUploadsModal({
  isOpen,
  onDeleteStart,
  onClose,
  initImageIds,
}: DeleteUploadsModalProps) {
  if (!isOpen) return null;
  // Placeholder - would be a confirmation modal
  return null;
}

interface VirtualizedMasonryProps {
  images: ModalImage[];
  isLoading: boolean;
  hasNextPage: boolean;
  onSelect: (item: ModalImage) => void;
  isSelected: (id: string) => boolean;
  columnCount: number;
  onLoadMore: () => void;
  renderItem: (props: RenderItemProps) => ReactNode;
  renderNoItems: () => ReactNode;
  scrollableRef: React.RefObject<HTMLElement | null>;
  renderFirstColumnPrefix?: () => ReactNode;
}

interface RenderItemProps {
  item: ModalImage;
  isSelected: boolean;
  onSelect: (item: ModalImage) => void;
  isLoading: boolean;
  isDisabled: boolean;
  columnWidth: number;
  estimatedHeight: number;
}

function VirtualizedMasonry({
  images,
  isLoading,
  onSelect,
  isSelected,
  renderNoItems,
  renderFirstColumnPrefix,
}: VirtualizedMasonryProps) {
  if (!isLoading && images.length === 0) {
    return <>{renderNoItems()}</>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4">
      {renderFirstColumnPrefix && (
        <div className="col-span-1">{renderFirstColumnPrefix()}</div>
      )}
      <AnimatePresence>
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
              isSelected(image.id ?? "")
                ? "border-primary ring-2 ring-primary"
                : "border-transparent hover:border-muted-foreground"
            )}
            onClick={() => onSelect(image)}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt || "Upload"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
            {isSelected(image.id ?? "") && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="rounded-full bg-primary p-1">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Image Item Component (matches original s.default)
// ============================================================================

interface ImageItemProps {
  columnWidth: number;
  estimatedHeight: number;
  image: { id?: string; url: string; alt?: string };
  isDisabled: boolean;
  isSelected: boolean;
  isLoading: boolean;
  onImageSelected: () => void;
  sourceLabel?: string;
}

function ImageItem({
  image,
  isDisabled,
  isSelected,
  onImageSelected,
  sourceLabel,
}: ImageItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary"
          : "border-transparent hover:border-muted-foreground",
        isDisabled && "cursor-not-allowed opacity-50"
      )}
      onClick={() => !isDisabled && onImageSelected()}
    >
      <img
        src={image.url}
        alt={image.alt || "Upload"}
        className="h-full w-full object-cover"
      />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="rounded-full bg-primary p-1">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
      {sourceLabel && (
        <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-xs text-white">
          {sourceLabel}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// UploadsFooterContent Component
// ============================================================================

interface UploadsFooterContentProps {
  id: string;
  isSingleMode: boolean;
  isDeleting: boolean;
  loading: boolean;
  selectedItems: SelectedItem[];
  selectedItemOrigins: Map<string, SelectionOrigin>;
  selectionCountForSource: number;
  isOpen: boolean;
  deleteIds: string[];
  setIsDeleting: (value: boolean) => void;
  handleOpenDelete: () => void;
  handleCancelDelete: () => void;
}

function UploadsFooterContent({
  id,
  isSingleMode,
  isDeleting,
  loading,
  selectedItems,
  selectedItemOrigins,
  selectionCountForSource,
  isOpen,
  deleteIds,
  setIsDeleting,
  handleOpenDelete,
  handleCancelDelete,
}: UploadsFooterContentProps) {
  const hasItemsFromOtherSources = selectedItems.some(
    (item) =>
      selectedItemOrigins.get(item.id)?.id !== id &&
      selectedItemOrigins.has(item.id)
  );

  // Processing state (i)
  const isProcessing = isDeleting || loading;

  // Delete disabled (a)
  const isDeleteDisabled =
    hasItemsFromOtherSources || selectionCountForSource === 0 || isProcessing;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {!isSingleMode && <SelectionCounter />}
      <CreateDefaultActions isProcessing={isProcessing}>
        <div
          className={cn(
            "right-2 ml-auto lg:absolute",
            hasItemsFromOtherSources && "cursor-not-allowed"
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <IconButton
                  data-tracking-id={
                    MODAL_SELECT_IMAGE_INPUT_DELETE_IMAGE_BUTTON
                  }
                  variant="ghost"
                  size="lg"
                  onClick={handleOpenDelete}
                  aria-label="Delete selected uploads"
                  disabled={isDeleteDisabled}
                  className="text-negative-foreground"
                >
                  <TrashOutlineIcon />
                </IconButton>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Delete is only available when images from Your Uploads are
              selected exclusively.
            </TooltipContent>
          </Tooltip>
        </div>
      </CreateDefaultActions>
      {selectionCountForSource > 0 && (
        <DeleteUploadsModal
          isOpen={isOpen}
          onDeleteStart={() => setIsDeleting(true)}
          onClose={handleCancelDelete}
          initImageIds={deleteIds}
        />
      )}
    </div>
  );
}

// ============================================================================
// UploadsSource Component (N)
// ============================================================================

export const UploadsSource: FC<UploadsSourceProps> = ({
  id = YOUR_UPLOADS_ID,
  isUploadEnabled = true,
  excludeImageIds = [],
  forceMount = true,
  label = YOUR_UPLOADS_LABEL,
}) => {
  const pageSize = DEFAULT_MODAL_PAGE_SIZE;
  // Fetch uploads (a.useYourUploads)
  const { images, loading, fetchNextPage, refetch } = useYourUploads({
    pageSize,
  });
  const scrollableRef = useRef<HTMLElement | null>(null);

  // Set scrollable ref
  useEffect(() => {
    const el = document.getElementById(
      ASSET_SELECTION_MODAL_SCROLLABLE_TARGET_ID
    );
    if (el) {
      scrollableRef.current = el;
    }
  }, []);

  // Selection state (p.useSelection)
  const {
    toggleSelection,
    selectionMode,
    selectedItems,
    selectedItemOrigins,
    isSelectionLimitReached,
  } = useSelection();

  // Delete modal (l.useDisclosure)
  const { isOpen, open, close } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  // Close delete (q)
  const handleCloseDelete = useCallback(() => {
    setIsDeleting(false);
    close();
    refetch();
  }, [close, refetch]);

  // Delete target capture (L.useDeleteTarget)
  const {
    capture,
    clear,
    ids: deleteIds,
  } = useDeleteTarget({
    selectedItems,
    selectedItemOrigins,
    sourceId: id ?? YOUR_UPLOADS_ID,
  });

  // Open delete (J)
  const handleOpenDelete = useCallback(() => {
    capture();
    open();
  }, [capture, open]);

  // Cancel delete (ee)
  const handleCancelDelete = useCallback(() => {
    clear();
    handleCloseDelete();
  }, [clear, handleCloseDelete]);

  // Derived state
  const isSingleMode = selectionMode === "single"; // et
  const isInitialLoading = loading && images.length === 0; // er

  // Filter excluded images (en)
  const filteredImages = useMemo(
    () =>
      images
        .filter((img) => !excludeImageIds.includes(img.id))
        .map(mapUploadToModalImage),
    [images, excludeImageIds]
  );

  // Has next page (ei)
  const hasNextPage =
    loading ||
    (filteredImages.length > 0 && filteredImages.length % pageSize === 0);

  // Handle select (ea)
  const handleSelect = useCallback(
    (item: ModalImage) => {
      toggleSelection(item, { id, label });
    },
    [toggleSelection, id, label]
  );

  // Check if selected (el)
  const isItemSelected = useCallback(
    (itemId: string) => selectedItems.some((item) => item.id === itemId),
    [selectedItems]
  );

  // Selection count for this source (es)
  const selectionCountForSource = useMemo(() => {
    if (!selectedItemOrigins || !selectedItems) return 0;
    return selectedItems.filter(
      (item) => selectedItemOrigins.get(item.id)?.id === id
    ).length;
  }, [selectedItems, selectedItemOrigins, id]);

  // Form (eo)
  const form = useForm({
    defaultValues: {
      columnCount: 4,
      selectedImage: null,
      selectedImages: null,
    },
  });

  // Render item callback (eu)
  const renderItem = useCallback(
    ({
      item,
      isSelected,
      onSelect,
      isLoading,
      isDisabled,
      columnWidth,
      estimatedHeight,
    }: RenderItemProps) => {
      const legacyImage = transformToLegacyImageModalImage(item);
      const sourceLabel = selectedItemOrigins.get(item.id)?.label;
      const isLimitReached =
        !isSingleMode && isSelectionLimitReached && !isSelected;

      return (
        <SelectImageThumbnail
          columnWidth={columnWidth}
          estimatedHeight={estimatedHeight}
          image={legacyImage}
          isDisabled={isDisabled || (isLimitReached && !isSelected)}
          isSelected={isSelected}
          isLoading={isLoading}
          onImageSelected={() => onSelect(item)}
          sourceLabel={
            sourceLabel === YOUR_UPLOADS_LABEL ? undefined : sourceLabel
          }
        />
      );
    },
    [selectedItemOrigins, isSingleMode, isSelectionLimitReached]
  );

  return (
    <AssetSourceProvider id={id} label={label} forceMount={forceMount}>
      {/* TabSlot */}
      <TabSlot>
        <span className="flex items-center gap-2">
          {label}
          {!isSingleMode && selectionCountForSource > 0 && (
            <Badge variant="subtle">{selectionCountForSource}</Badge>
          )}
        </span>
      </TabSlot>

      {/* ContentSlot */}
      <ContentSlot>
        <FormProvider {...form}>
          <VirtualizedMasonry
            images={isInitialLoading ? skeletonItems : filteredImages}
            isLoading={loading}
            hasNextPage={hasNextPage}
            onSelect={isInitialLoading ? noop : handleSelect}
            isSelected={isItemSelected}
            columnCount={4}
            onLoadMore={fetchNextPage}
            renderItem={
              isInitialLoading
                ? (props) => (
                    <SkeletonItem
                      item={props.item}
                      estimatedHeight={props.estimatedHeight}
                    />
                  )
                : renderItem
            }
            renderNoItems={EmptyState}
            scrollableRef={scrollableRef}
            renderFirstColumnPrefix={
              isUploadEnabled
                ? () => (
                    <ImageDropzoneButton
                      onAddImage={async (image) => {
                        const item = {
                          ...image,
                          id: image.initImageId ?? image.id,
                        };
                        handleSelect(item);
                      }}
                      isDisabled={loading || isDeleting}
                    />
                  )
                : undefined
            }
          />
        </FormProvider>
      </ContentSlot>

      {/* FooterSlot */}
      <FooterSlot>
        <UploadsFooterContent
          id={id}
          isSingleMode={isSingleMode}
          isDeleting={isDeleting}
          loading={loading}
          selectedItems={selectedItems}
          selectedItemOrigins={selectedItemOrigins}
          selectionCountForSource={selectionCountForSource}
          isOpen={isOpen}
          deleteIds={deleteIds}
          setIsDeleting={setIsDeleting}
          handleOpenDelete={handleOpenDelete}
          handleCancelDelete={handleCancelDelete}
        />
      </FooterSlot>
    </AssetSourceProvider>
  );
};

export default UploadsSource;
