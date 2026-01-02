/**
 * Feed Types
 * 
 * Feed and library type constants for Leonardo.ai
 */

// ============================================================================
// Feed Types
// ============================================================================

export const FEED_TYPES = {
    YOURS: 'personal-feed',
    FOLLOWERS: 'followers-feed',
    LIKED: 'liked-feed',
    COMMUNITY: 'community-feed',
    COMMUNITY_PUBLIC: 'community-feed-public',
    TEAM: 'team-feed',
    PERSONAL_TEAM: 'personal-team-feed',
    COLLECTIONS: 'collections',
    TEAM_COLLECTIONS: 'team-collections',
    YOUR_COLLECTIONS: 'your-collections',
    TEAM_HOME: 'team-home',
    MODEL: 'model',
    TEAM_MODEL: 'team-model',
    PROFILE: 'profile',
    TEAM_PROFILE: 'team-profile',
    TRAINING_DATASET_TEAM_FEED: 'training-dataset-team-feed',
    TRAINING_DATASET_PERSONAL_TEAM: 'training-dataset-personal-team',
    TRAINING_DATASET_YOURS: 'training-dataset-yours',
    TRAINING_DATASET_COMMUNITY: 'training-dataset-community',
} as const;

export type FeedType = (typeof FEED_TYPES)[keyof typeof FEED_TYPES];

// ============================================================================
// Team Feeds (Require Team Context)
// ============================================================================

export const TEAM_FEEDS: FeedType[] = [
    FEED_TYPES.PERSONAL_TEAM,
    FEED_TYPES.TEAM,
    FEED_TYPES.COLLECTIONS,
    FEED_TYPES.TEAM_COLLECTIONS,
    FEED_TYPES.YOUR_COLLECTIONS,
    FEED_TYPES.TEAM_HOME,
    FEED_TYPES.TRAINING_DATASET_TEAM_FEED,
    FEED_TYPES.TRAINING_DATASET_PERSONAL_TEAM,
    FEED_TYPES.TEAM_MODEL,
    FEED_TYPES.TEAM_PROFILE,
];

// ============================================================================
// Team Library Image Feeds
// ============================================================================

export const TEAM_LIBRARY_IMAGE_FEEDS: FeedType[] = [
    FEED_TYPES.PERSONAL_TEAM,
    FEED_TYPES.TEAM,
];

// ============================================================================
// Team Library Collection Feeds
// ============================================================================

export const TEAM_LIBRARY_COLLECTION_FEEDS: FeedType[] = [
    FEED_TYPES.COLLECTIONS,
    FEED_TYPES.TEAM_COLLECTIONS,
    FEED_TYPES.YOUR_COLLECTIONS,
];

// ============================================================================
// Personal Library Feeds
// ============================================================================

export const PERSONAL_LIBRARY_FEEDS: FeedType[] = [
    FEED_TYPES.YOURS,
    FEED_TYPES.FOLLOWERS,
    FEED_TYPES.LIKED,
    FEED_TYPES.COLLECTIONS,
];

// ============================================================================
// Job Statuses
// ============================================================================

export const JOB_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETE: 'COMPLETE',
    FAILED: 'FAILED',
    UNKNOWN: 'UNKNOWN',
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const JOB_STATUSES = JOB_STATUS;

export const FINISHED_JOB_STATUSES: JobStatus[] = [
    JOB_STATUS.COMPLETE,
    JOB_STATUS.FAILED,
];

// ============================================================================
// Training Dataset Tabs
// ============================================================================

export const TRAINING_DATASET_TABS = {
    DATASETS: 'datasets',
    JOB_STATUS: 'job-status',
} as const;

// ============================================================================
// Query Filters
// ============================================================================

export const HIDE_NSFW = {
    nsfw: { _eq: false },
} as const;

export const GET_NSFW_QUERY_APPEND = (showNsfw: boolean) =>
    showNsfw ? {} : HIDE_NSFW;

export const HIDE_IMG_2_IMG = {
    imageToImage: { _eq: false },
} as const;

export const MOTION_EXCLUDE_FILTER_WHERE = {
    motionGIFURL: { _is_null: true },
    motionMP4URL: { _is_null: true },
} as const;

export const MOTION_ONLY_FILTER_WHERE = {
    motionMP4URL: { _is_null: false },
} as const;

export const QUERY_HACK_NEW_FEED = {} as const;

export const QUERY_HACK_TOP_FEED = {
    likeCount: { _gt: 2 },
} as const;

export const QUERY_HACK_TRENDING_FEED = {
    trendingScore: { _gt: 1 },
} as const;

// ============================================================================
// API Plan States
// ============================================================================

export const API_PLAN_STATES = {
    CANCELLED: 'Cancelled',
} as const;
