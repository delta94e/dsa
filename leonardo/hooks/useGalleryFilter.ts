/**
 * Gallery Filter Utilities
 *
 * Filter utilities for gallery/feed components.
 * Based on Leonardo.ai module 764880.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import useFlags from "./useFlags";
import useSelectedTeam from "./useSelectedTeam";

// ============================================================================
// Enums
// ============================================================================

/**
 * Generation type filter options (f)
 */
export enum GenerationTypeFilter {
  All = "All",
  Upscaled = "Upscaled",
  Motion = "Video",
}

export enum ExploreFilter {
  Top = "top",
  Trending = "trending",
  New = "new",
}

export enum COLLECTIONS_FILTER {
  YOUR_COLLECTIONS = "YOUR_COLLECTIONS",
  SHARED_WITH_YOU = "SHARED_WITH_YOU",
}

// ============================================================================
// Constants
// ============================================================================

export const ALL_MODELS_FILTER_OPTION = { value: "all" };

export const COLLECTIONS_FILTER_QUERY_PARAM = "collections";

export const COLLECTIONS_FILTER_QUERY_PARAM_VALUES = {
  YOUR_COLLECTIONS: "your-collections",
  SHARED_WITH_YOU: "shared-with-you",
};

export const INITIAL_EXPLORE_FILTER = {
  VALUE: ExploreFilter.Trending,
};

// Feed types (u.FEED_TYPES)
export const FEED_TYPES = {
  YOURS: "yours",
  PROFILE: "profile",
  COMMUNITY: "community",
  FEATURED: "featured",
  FOLLOWING: "following",
  TEAM: "team",
} as const;

// Team feeds (u.TEAM_FEEDS)
export const TEAM_FEEDS = [FEED_TYPES.TEAM] as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get collections filter query param (c.getCollectionsFilterQueryParam)
 */
export function getCollectionsFilterQueryParam(
  filter: COLLECTIONS_FILTER,
  isSharedCollectionsEnabled: boolean,
  teamId?: string
): string {
  if (filter === COLLECTIONS_FILTER.SHARED_WITH_YOU && isSharedCollectionsEnabled) {
    return `?${COLLECTIONS_FILTER_QUERY_PARAM}=${COLLECTIONS_FILTER_QUERY_PARAM_VALUES.SHARED_WITH_YOU}`;
  }
  return "";
}

// ============================================================================
// Types
// ============================================================================

interface GalleryFilterOptions {
  onAnyChange?: () => void;
  feedsType?: string;
}

interface GalleryFilterResult {
  exploreFilter: ExploreFilter;
  generatedCategoryFilter: string;
  generationTypeFilter: GenerationTypeFilter;
  modelFilter: string;
  selectedCollectionsFilter: COLLECTIONS_FILTER;
  handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearch: (query: string) => void;
  handleSetExploreFilter: (filter: ExploreFilter) => void;
  handleSetGeneratedCategoryFilter: (category: string) => void;
  handleSetGenerationTypeFilter: (filter: GenerationTypeFilter) => void;
  handleSetModelFilter: (model: string) => void;
  handleCollectionsFilterChange: (filter: COLLECTIONS_FILTER) => void;
  isTop: boolean;
  isTrending: boolean;
  isNew: boolean;
  searchQuery: string;
  whereLikes: boolean;
  whereTrending: boolean;
}

// ============================================================================
// Sub-hooks
// ============================================================================

/**
 * useExploreFilter hook (l.useExploreFilter)
 */
function useExploreFilter(initialValue: ExploreFilter = INITIAL_EXPLORE_FILTER.VALUE) {
  const [exploreFilter, setExploreFilter] = useState<ExploreFilter>(initialValue);

  const isTop = exploreFilter === ExploreFilter.Top;
  const isTrending = exploreFilter === ExploreFilter.Trending;
  const isNew = exploreFilter === ExploreFilter.New;
  const whereLikes = isTop;
  const whereTrending = isTrending;

  return {
    exploreFilter,
    isTop,
    isTrending,
    isNew,
    whereLikes,
    whereTrending,
    setExploreFilter,
  };
}

/**
 * useGeneratedCategoryFilter hook (o.useGeneratedCategoryFilter)
 */
function useGeneratedCategoryFilter() {
  const [generatedCategoryFilter, setGeneratedCategoryFilter] = useState("");

  return {
    generatedCategoryFilter,
    setGeneratedCategoryFilter,
  };
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * useGalleryFilter Hook
 *
 * Manages gallery/feed filter state including:
 * - Generation type filter (All, Upscaled, Motion/Video)
 * - Model filter
 * - Search query
 * - Collections filter
 * - Category filter
 * - Explore filter
 */
export function useGalleryFilter({
  onAnyChange,
  feedsType,
}: GalleryFilterOptions = {}): GalleryFilterResult {
  const dispatch = useAppDispatch(); // f
  const searchParams = useSearchParams(); // p
  const router = useRouter(); // x

  // Filter states
  const [generationTypeFilter, setGenerationType] = useState<GenerationTypeFilter>(
    GenerationTypeFilter.All
  ); // [v, E]
  const [modelFilter, setModelFilter] = useState(ALL_MODELS_FILTER_OPTION.value); // [b, I]
  const [searchQuery, setSearchQuery] = useState(""); // [C, S]

  // Feature flags and team
  const { isSharedCollectionsEnabled } = useFlags(); // y
  const { userSelectedTeam } = useSelectedTeam();
  const selectedTeam = userSelectedTeam(); // w

  // Selected collections filter from URL (O)
  const selectedCollectionsFilter = useMemo(() => {
    const param = searchParams?.get(COLLECTIONS_FILTER_QUERY_PARAM);
    return param === COLLECTIONS_FILTER_QUERY_PARAM_VALUES.SHARED_WITH_YOU
      ? COLLECTIONS_FILTER.SHARED_WITH_YOU
      : COLLECTIONS_FILTER.YOUR_COLLECTIONS;
  }, [searchParams]);

  // Check feed types (M = yours or profile, _ = team feeds)
  const isYoursOrProfile = [FEED_TYPES.YOURS, FEED_TYPES.PROFILE].includes(
    feedsType as typeof FEED_TYPES.YOURS
  );
  const isTeamFeed = TEAM_FEEDS.includes(feedsType as typeof FEED_TYPES.TEAM);

  // Use explore filter hook with conditional initial value
  const {
    exploreFilter,
    isTop,
    isTrending,
    isNew,
    whereLikes,
    whereTrending,
    setExploreFilter,
  } = useExploreFilter(
    isYoursOrProfile || isTeamFeed ? ExploreFilter.New : INITIAL_EXPLORE_FILTER.VALUE
  );

  // Use generated category filter hook
  const { generatedCategoryFilter, setGeneratedCategoryFilter } =
    useGeneratedCategoryFilter();

  // Ref for change callback (U)
  const onAnyChangeRef = useRef(onAnyChange);
  useEffect(() => {
    onAnyChangeRef.current = onAnyChange;
  });

  // Trigger change callback (P)
  const triggerChange = useCallback(() => {
    onAnyChangeRef.current?.();
  }, []);

  // Handler: Category change (B)
  const handleCategoryChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      triggerChange();
      dispatch(setPreferences({ feedCategory: event.target.value }));
    },
    [triggerChange]
  );

  // Handler: Generation type filter (G)
  const handleSetGenerationTypeFilter = useCallback(
    (filter: GenerationTypeFilter) => {
      triggerChange();
      setGenerationType(filter);
    },
    [triggerChange]
  );

  // Handler: Model filter ($)
  const handleSetModelFilter = useCallback(
    (model: string) => {
      triggerChange();
      setModelFilter(model);
    },
    [triggerChange]
  );

  // Handler: Explore filter (W)
  const handleSetExploreFilter = useCallback(
    (filter: ExploreFilter) => {
      triggerChange();
      setExploreFilter(filter);
    },
    [triggerChange, setExploreFilter]
  );

  // Handler: Generated category filter (V)
  const handleSetGeneratedCategoryFilter = useCallback(
    (category: string) => {
      triggerChange();
      setGeneratedCategoryFilter(category);
      track(CATEGORIES_FILTER_LOAD, category);
    },
    [triggerChange, setGeneratedCategoryFilter]
  );

  // Handler: Search (H)
  const handleSearch = useCallback(
    (query: string) => {
      triggerChange();
      setSearchQuery(query);
    },
    [triggerChange]
  );

  // Handler: Collections filter change (Y)
  const handleCollectionsFilterChange = useCallback(
    (filter: COLLECTIONS_FILTER) => {
      triggerChange();
      const queryParam = getCollectionsFilterQueryParam(
        filter,
        isSharedCollectionsEnabled,
        selectedTeam?.id
      );
      router.replace(`${window.location.pathname}${queryParam}`);
    },
    [router, triggerChange, isSharedCollectionsEnabled, selectedTeam?.id]
  );

  return useMemo(
    () => ({
      exploreFilter,
      generatedCategoryFilter,
      generationTypeFilter,
      modelFilter,
      selectedCollectionsFilter,
      handleCategoryChange,
      handleSearch,
      handleSetExploreFilter,
      handleSetGeneratedCategoryFilter,
      handleSetGenerationTypeFilter,
      handleSetModelFilter,
      handleCollectionsFilterChange,
      isTop,
      isTrending,
      isNew,
      searchQuery,
      whereLikes,
      whereTrending,
    }),
    [
      exploreFilter,
      generatedCategoryFilter,
      generationTypeFilter,
      modelFilter,
      selectedCollectionsFilter,
      handleCategoryChange,
      handleCollectionsFilterChange,
      handleSearch,
      handleSetExploreFilter,
      handleSetGeneratedCategoryFilter,
      handleSetGenerationTypeFilter,
      handleSetModelFilter,
      isNew,
      isTop,
      isTrending,
      searchQuery,
      whereLikes,
      whereTrending,
    ]
  );
}

export { useExploreFilter, useGeneratedCategoryFilter };
export default useGalleryFilter;
