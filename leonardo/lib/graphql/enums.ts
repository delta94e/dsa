/**
 * GraphQL Enums
 *
 * All enum definitions extracted from Leonardo.ai GraphQL schema.
 */

// ============================================================================
// Action Types
// ============================================================================

export const ActionType = {
    Delete: 'DELETE',
    Edit: 'EDIT',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

// ============================================================================
// Status Enums
// ============================================================================

export const GenerationStatus = {
    Completed: 'COMPLETED',
    Failed: 'FAILED',
    Pending: 'PENDING',
    Queued: 'QUEUED',
} as const;

export type GenerationStatus = (typeof GenerationStatus)[keyof typeof GenerationStatus];

export const VariationStatus = {
    Completed: 'COMPLETED',
    Failed: 'FAILED',
    Pending: 'PENDING',
    Queued: 'QUEUED',
} as const;

export type VariationStatus = (typeof VariationStatus)[keyof typeof VariationStatus];

export const ModerationStatus = {
    Accepted: 'Accepted',
    Blocked: 'Blocked',
    Failed: 'Failed',
    Pending: 'Pending',
    TimeOut: 'TimeOut',
} as const;

export type ModerationStatus = (typeof ModerationStatus)[keyof typeof ModerationStatus];

export const SafteyStatus = {
    Accepted: 'Accepted',
    Blocked: 'Blocked',
    Failed: 'Failed',
    TimeOut: 'TimeOut',
} as const;

export type SafteyStatus = (typeof SafteyStatus)[keyof typeof SafteyStatus];

// ============================================================================
// Sort & Order
// ============================================================================

export const SortField = {
    CreatedAt: 'CREATED_AT',
    FeaturedSortOrder: 'FEATURED_SORT_ORDER',
    Relevance: 'RELEVANCE',
} as const;

export type SortField = (typeof SortField)[keyof typeof SortField];

export const SortOrder = {
    Asc: 'ASC',
    Desc: 'DESC',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const Order_By = {
    Asc: 'asc',
    AscNullsFirst: 'asc_nulls_first',
    AscNullsLast: 'asc_nulls_last',
    Desc: 'desc',
    DescNullsFirst: 'desc_nulls_first',
    DescNullsLast: 'desc_nulls_last',
} as const;

export type OrderBy = (typeof Order_By)[keyof typeof Order_By];

// ============================================================================
// Team & Permission
// ============================================================================

export const TeamRole = {
    Editor: 'EDITOR',
    Owner: 'OWNER',
    Viewer: 'VIEWER',
} as const;

export type TeamRole = (typeof TeamRole)[keyof typeof TeamRole];

export const ProjectCollaboratorRole = {
    Editor: 'EDITOR',
    Viewer: 'VIEWER',
} as const;

export type ProjectCollaboratorRole = (typeof ProjectCollaboratorRole)[keyof typeof ProjectCollaboratorRole];

export const TeamMemberRole = {
    Admin: 'ADMIN',
    Editor: 'EDITOR',
    Owner: 'OWNER',
} as const;

export type TeamMemberRole = (typeof TeamMemberRole)[keyof typeof TeamMemberRole];

export const InviteAction = {
    Accept: 'ACCEPT',
    Decline: 'DECLINE',
} as const;

export type InviteAction = (typeof InviteAction)[keyof typeof InviteAction];

// ============================================================================
// Plans & Payments
// ============================================================================

export const PlanType = {
    Basic: 'BASIC',
    Free: 'FREE',
    Freeplus: 'FREEPLUS',
    Pro: 'PRO',
    Standard: 'STANDARD',
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];

export const SubscriptionPeriod = {
    Monthly: 'MONTHLY',
    Yearly: 'YEARLY',
} as const;

export type SubscriptionPeriod = (typeof SubscriptionPeriod)[keyof typeof SubscriptionPeriod];

export const PaymentProvider = {
    Paypal: 'PAYPAL',
    Stripe: 'STRIPE',
} as const;

export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const SubscriptionStatus = {
    NoSubscription: 'noSubscription',
    PreviousSubscription: 'previousSubscription',
    Subscription: 'subscription',
    SubscriptionIncomplete: 'subscriptionIncomplete',
    SubscriptionWithPaymentPastDue: 'subscriptionWithPaymentPastDue',
    SubscriptionWithPendingCancellation: 'subscriptionWithPendingCancellation',
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

// ============================================================================
// Content Types
// ============================================================================

export const ContentType = {
    Image: 'IMAGE',
    Video: 'VIDEO',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const ImageSource = {
    Generated: 'GENERATED',
    Uploaded: 'UPLOADED',
} as const;

export type ImageSource = (typeof ImageSource)[keyof typeof ImageSource];

export const ElementCategory = {
    Character: 'Character',
    General: 'General',
    Object: 'Object',
    Style: 'Style',
} as const;

export type ElementCategory = (typeof ElementCategory)[keyof typeof ElementCategory];

// ============================================================================
// Video Generation
// ============================================================================

export const VideoGenerationType = {
    ImageToMotion: 'imageToMotion',
    ImageToVideo: 'imageToVideo',
    ImageToVideoFast: 'imageToVideoFast',
    Kling2_1: 'kling2_1',
    Kling2_5: 'kling2_5',
    TextToVideo: 'textToVideo',
    TextToVideoFast: 'textToVideoFast',
    Veo3: 'veo3',
    Veo3Fast: 'veo3Fast',
    Veo3_1: 'veo3_1',
    Veo3_1Fast: 'veo3_1Fast',
    WanVideo480Upscale: 'wanVideo480Upscale',
} as const;

export type VideoGenerationType = (typeof VideoGenerationType)[keyof typeof VideoGenerationType];

export const VideoResolution = {
    Resolution_480: 'RESOLUTION_480',
    Resolution_720: 'RESOLUTION_720',
    Resolution_768: 'RESOLUTION_768',
    Resolution_1080: 'RESOLUTION_1080',
    Resolution_1440: 'RESOLUTION_1440',
    Resolution_2160: 'RESOLUTION_2160',
} as const;

export type VideoResolution = (typeof VideoResolution)[keyof typeof VideoResolution];

export const QualityLevel = {
    High: 'High',
    Low: 'Low',
    Max: 'Max',
    Mid: 'Mid',
    Ultra: 'Ultra',
} as const;

export type QualityLevel = (typeof QualityLevel)[keyof typeof QualityLevel];

// ============================================================================
// Dataset & Training
// ============================================================================

export const DatasetStatus = {
    Dataset: 'DATASET',
    Init: 'INIT',
} as const;

export type DatasetStatus = (typeof DatasetStatus)[keyof typeof DatasetStatus];

export const ModelStatus = {
    Generated: 'GENERATED',
    Init: 'INIT',
} as const;

export type ModelStatus = (typeof ModelStatus)[keyof typeof ModelStatus];

// ============================================================================
// Activity & Notifications
// ============================================================================

export const ActivityType = {
    Activity: 'ACTIVITY',
    LoginActivity: 'LOGIN_ACTIVITY',
    OnboardingChecklist: 'ONBOARDING_CHECKLIST',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const FeedbackType = {
    BinaryThumb: 'BINARY_THUMB',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];

export const TimeUnit = {
    Day: 'DAY',
    Hour: 'HOUR',
} as const;

export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

// ============================================================================
// CRM & Analytics
// ============================================================================

export const CrmProvider = {
    Hubspot: 'HUBSPOT',
} as const;

export type CrmProvider = (typeof CrmProvider)[keyof typeof CrmProvider];

export const OfferEventType = {
    OfferAcceptance: 'OfferAcceptance',
    OfferActivation: 'OfferActivation',
    ShowingCountIncrement: 'ShowingCountIncrement',
} as const;

export type OfferEventType = (typeof OfferEventType)[keyof typeof OfferEventType];

// ============================================================================
// Background Settings
// ============================================================================

export const BackgroundSetting = {
    Disabled: 'disabled',
    ForegroundOnly: 'foreground_only',
} as const;

export type BackgroundSetting = (typeof BackgroundSetting)[keyof typeof BackgroundSetting];

// ============================================================================
// User Column Enum (for updates)
// ============================================================================

export const UserColumn = {
    ApiConcurrencySlots: 'apiConcurrencySlots',
    ApiCredit: 'apiCredit',
    ApiPaidTokens: 'apiPaidTokens',
    ApiPlan: 'apiPlan',
    ApiPlanAutoTopUpTriggerBalance: 'apiPlanAutoTopUpTriggerBalance',
    ApiPlanSubscribeDate: 'apiPlanSubscribeDate',
    ApiPlanSubscribeFrequency: 'apiPlanSubscribeFrequency',
    ApiPlanSubscriptionSource: 'apiPlanSubscriptionSource',
    ApiPlanTokenRenewalDate: 'apiPlanTokenRenewalDate',
    ApiPlanTopUpAmount: 'apiPlanTopUpAmount',
    ApiStripeId: 'apiStripeId',
    ApiSubscriptionTokens: 'apiSubscriptionTokens',
    Auth0Email: 'auth0Email',
    Auth0Id: 'auth0Id',
    Auth0Name: 'auth0Name',
    CognitoId: 'cognitoId',
    CognitoProvider: 'cognitoProvider',
    CustomApiTokenRenewalAmount: 'customApiTokenRenewalAmount',
    Id: 'id',
    Interests: 'interests',
    InterestsRoles: 'interestsRoles',
    InterestsRolesOther: 'interestsRolesOther',
    IsChangelogVisible: 'isChangelogVisible',
    LastSeenChangelogId: 'lastSeenChangelogId',
    LiveCanvasTime: 'liveCanvasTime',
    PaddleId: 'paddleId',
    PaidTokens: 'paidTokens',
    Plan: 'plan',
    PlanSubscribeDate: 'planSubscribeDate',
    PlanSubscribeFrequency: 'planSubscribeFrequency',
    PromptTokens: 'promptTokens',
    RolloverTokens: 'rolloverTokens',
    ShowNsfw: 'showNsfw',
    StreamTokens: 'streamTokens',
    StripeId: 'stripeId',
    SubscriptionGptTokens: 'subscriptionGptTokens',
    SubscriptionModelTokens: 'subscriptionModelTokens',
    SubscriptionPostProcessingTokens: 'subscriptionPostProcessingTokens',
    SubscriptionSource: 'subscriptionSource',
    SubscriptionTokens: 'subscriptionTokens',
    TokenRenewalDate: 'tokenRenewalDate',
    UserId: 'userId',
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
