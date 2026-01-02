/**
 * Application Routes
 * 
 * Centralized route definitions for Leonardo.ai.
 */
export const ROUTE = {
    // Home
    HOME: '/',
    AUTHENTICATED_HOME: '/authenticated-home',

    // Auth
    LOGIN: '/auth/login',
    LOGIN_CANVA: '/auth/canva-login',
    LOGIN_V2: '/auth/new-login',
    INVITE: '/invite',

    // Image Generation
    IMAGE_GENERATION: '/image-generation',
    IMAGE_GENERATION_LIGHTNING_STREAM: '/image-generation/flow-state',
    IMAGE_GENERATION_VIDEO: '/image-generation/video',

    // AI Generations
    AI_GENERATIONS: '/ai-generations',
    AI_GENERATIONS_IMAGE_GUIDANCE: '/ai-generations/image-guidance',
    GENERATE: '/generate',

    // Library
    LIBRARY: '/library',
    LIBRARY_COLLECTIONS: '/library/collections',
    LIBRARY_FOLLOWERS: '/library/followers',
    LIBRARY_LIKED: '/library/liked',

    // Team Library
    TEAM_LIBRARY: '/team-library',
    TEAM_FEED: '/team-library/team-feed',
    TEAM_FEED_COLLECTIONS: '/team-library/collections',
    TEAM_FEED_YOUR_COLLECTIONS: '/team-library/your-collections',
    TEAM_FEED_TEAM_COLLECTIONS: '/team-library/team-collections',

    // Blueprints
    BLUEPRINTS: '/blueprints',
    BLUEPRINTS_PLATFORM: '/blueprints/platform',
    BLUEPRINTS_YOUR_BLUEPRINTS: '/blueprints/your-blueprints',
    BLUEPRINTS_GENERATIONS: '/blueprints/generations',
    BLUEPRINTS_CREATE: '/blueprints/create',
    BLUEPRINTS_EDIT: '/blueprints/edit',
    BLUEPRINTS_TEAM_GENERATIONS: '/blueprints/team-generations',

    // Tools
    CANVAS: '/canvas',
    REALTIME_CANVAS: '/realtime-canvas',
    REALTIME_GEN: '/realtime-gen',
    TEXTURE_GENERATION: '/texture-generation',
    UNIVERSAL_UPSCALER: '/universal-upscaler',

    // Models & Training
    MODELS: '/models',
    MODELS_AND_TRAINING: '/models-and-training',
    MODELS_AND_TRAINING_DATASETS: '/models-and-training/datasets',
    MODELS_AND_TRAINING_DATASET_EDIT: '/models-and-training/datasets/edit',
    MODELS_AND_TRAINING_JOB_STATUS: '/models-and-training/job-status',
    TRAINING_DATASETS: '/training-datasets',

    // Community
    COMMUNITY_FEED: '/community-feed',
    PROFILE: '/profile',

    // Payments
    BUY: '/buy',
    BUY_API: '/buy-api',
    CREDIT_TOPUP: '/credit-topup',

    // AWS Marketplace
    AWS_MARKETPLACE_SUBSCRIPTION_PENDING: '/aws-marketplace/pending',
    AWS_MARKETPLACE_SUBSCRIPTION_SETUP: '/auth/login?awsMPsub=true',

    // Settings - General
    SETTINGS: '/settings',
    SETTINGS_PROFILE: '/settings/profile',
    SETTINGS_USER_API: '/settings/user-api',
    SETTINGS_ACCOUNT_MANAGEMENT: '/settings/account-management',
    SETTINGS_SUBSCRIPTION_AND_BILLING: '/settings/subscription-and-billing',

    // Settings - Team
    SETTINGS_TEAMS: '/settings/teams',
    TEAM_SETTINGS: '/settings/teams',
    SETTINGS_TEAM_PROFILE: '/settings/team-profile',
    SETTINGS_TEAM_MEMBERS: '/settings/team-members',
    SETTINGS_TEAM_INVITES: '/settings/team-invites',
    SETTINGS_TEAM_NOTIFICATIONS: '/settings/team-notifications',
    SETTINGS_TEAM_FEATURE_ACCESS: '/settings/team-feature-access',
    SETTINGS_TEAM_SSO_AND_AUTHENTICATION: '/settings/sso-and-authentication',

    // API
    API_ACCESS: '/api-access',

    // Other
    ASSET: '/generation/:generationType/:slug',
    CHANGELOG: '/changelog',
    FAQ: '/faq',
    MAINTENANCE: '/maintenance',

    // Aliases for backwards compatibility
    FLOW_STATE: '/image-generation/flow-state',
} as const;

export type Route = (typeof ROUTE)[keyof typeof ROUTE];
