/**
 * Analytics Events Module
 *
 * Typed analytics event constants organized by category.
 * Generated from Leonardo.ai production bundle.
 */

// ============================================================================
// API Access Events
// ============================================================================

export const ApiAccessEvents = {
    API_DOCUMENTATION_BUTTON_CLICK: 'api_access_api_documentation_button_click',
    CONTACT_US_BUTTON_CLICK: 'api_access_contact_us_button_click',
    CONTACT_US_CANCEL_BUTTON_CLICK: 'api_access_contact_us_cancel_button_click',
    CONTACT_US_SUBMIT_BUTTON_CLICK: 'api_access_contact_us_submit_button_click',
    CREATE_NEW_KEY_BUTTON_CLICK: 'api_access_create_new_key_button_click',
    CREATE_NEW_KEY_OPEN_MODAL_BUTTON_CLICK: 'api_access_create_new_key_open_modal_button_click',
    NAVIGATION_CLICKED: 'api_access_navigation_clicked',
    USAGE_OVERVIEW_DATE_FILTER_SELECTED: 'api_access_usage_overview_date_filter_selected',
    USAGE_OVERVIEW_EXPORT_CSV_CLICKED: 'api_access_usage_overview_export_csv_clicked',
    USAGE_OVERVIEW_MODELS_FILTER_SELECTED: 'api_access_usage_overview_models_filter_selected',
    USAGE_OVERVIEW_SUMMARY_TOGGLE_CLICKED: 'api_access_usage_overview_summary_toggle_clicked',
    USAGE_OVERVIEW_TABLE_COLUMN_SORTED: 'api_access_usage_overview_table_column_sorted',
} as const;

// ============================================================================
// API Pay-As-You-Go Events
// ============================================================================

export const ApiPaygEvents = {
    AUTO_TOP_UP_GET_STARTED_FOR_FREE_BUTTON_CLICK: 'api_payg_auto_top_up_get_started_for_free_button_click',
    AUTO_TOP_UP_TOGGLE: 'api_payg_auto_top_up_toggle',
    BUY_CREDIT_BUTTON_CLICK: 'api_payg_buy_credit_button_click',
    BUY_CREDIT_CHECKOUT_BUTTON_CLICK: 'api_payg_buy_credit_checkout_button_click',
} as const;

// ============================================================================
// Asset Events
// ============================================================================

export const AssetEvents = {
    PAGE_VIEWED: 'asset_page_viewed',
    SELECTED_FOR_SHARING: 'asset_selected_for_sharing',
} as const;

// ============================================================================
// Batch Operations Events
// ============================================================================

export const BatchOperationsEvents = {
    REMOVE_CLICK: 'batch_operations_remove_click',
    UPDATE_IMAGE_PRIVACY_CLICK: 'batch_operations_update_image_privacy_click',
} as const;

// ============================================================================
// Blueprint Events
// ============================================================================

export const BlueprintEvents = {
    CLICKED_SHARE: 'blueprint_clicked_share',
    OPENED: 'blueprint_opened',
    STARTED: 'blueprint_started',
} as const;

// ============================================================================
// Bulk Download Events
// ============================================================================

export const BulkDownloadEvents = {
    REQUEST: 'bulk_download_request',
} as const;

// ============================================================================
// Buy Page Events
// ============================================================================

export const BuyPageEvents = {
    MATRIX_SCROLLED_INTO_VIEW: 'buy_page_matrix_scrolled_into_view',
} as const;

// ============================================================================
// Canva Events
// ============================================================================

export const CanvaEvents = {
    BENEFITS_NOTIFICATION_CONFIRMED: 'canva_benefits_notification_confirmed',
    BENEFITS_NOTIFICATION_DISPLAYED: 'canva_benefits_notification_displayed',
    CLICKED_BUS_TAG: 'web_client_clicked_canva_bus_tag',
} as const;

// ============================================================================
// Categories Filter Events
// ============================================================================

export const CategoriesFilterEvents = {
    LOAD: 'categories_filter',
} as const;

// ============================================================================
// Collections Events
// ============================================================================

export const CollectionsEvents = {
    CREATE_NEW_CLICK: 'collections_create_new_click',
    INVITE_BUTTON_CLICK: 'collections_invite_button_click',
    MODAL_OPEN: 'collections_modal_open',
    MOVE_BUTTON_CLICK: 'collections_move_button_click',
    ORGANIZER_MENU_CLICK: 'collections_organizer_menu_click',
    REVOKE_MEMBER_ACCESS: 'collections_revoke_member_access',
    REVOKE_TEAM_ACCESS: 'collections_revoke_team_access',
    SELECTION_CHANGE: 'collections_selection_change',
    SHARE_BUTTON_CLICK: 'collections_share_button_click',
    UPDATE_MEMBER_PERMISSION: 'collections_update_member_permission',
    UPDATE_TEAM_PERMISSION: 'collections_update_team_permission',
} as const;

// ============================================================================
// Community Events
// ============================================================================

export const CommunityEvents = {
    FEED_LOAD: 'community_feed_load',
} as const;

// ============================================================================
// Conversion Events
// ============================================================================

export const ConversionEvents = {
    FUNNEL_TOUCHPOINT: 'conversion_funnel_touchpoint',
} as const;

// ============================================================================
// Copy to API Events
// ============================================================================

export const CopyToApiEvents = {
    BUTTON_CLICK: 'copy_to_api_button_click',
    CODE_COPIED: 'copy_to_api_code_copied',
    LANGUAGE_SELECT: 'copy_to_api_language_select',
} as const;

// ============================================================================
// Datasets Events
// ============================================================================

export const DatasetsEvents = {
    CREATE_ELEMENT_BUTTON_CLICK: 'datasets_create_element_button',
    CREATE_ELEMENT_BUTTON_EMPTY_STATE_CLICK: 'datasets_create_element_button_empty_state',
    EDIT_ASSET_SELECTION_ADD_FROM_PLATFORM: 'datasets_edit_dataset_asset_selection_add_from_platform',
    EDIT_ASSET_SELECTION_UPLOAD_FROM_DEVICE: 'datasets_edit_dataset_asset_selection_upload_from_device',
    EDIT_OPEN_ASSET_SELECTION_DIALOG: 'datasets_edit_dataset_open_asset_selection_dialog',
} as const;

// ============================================================================
// Default Preset Events
// ============================================================================

export const DefaultPresetEvents = {
    ID_SELECTED: 'default_preset',
} as const;

// ============================================================================
// Download Events
// ============================================================================

export const DownloadEvents = {
    GLOBAL: 'web_client_download_global',
} as const;

// ============================================================================
// Focus Modal Events
// ============================================================================

export const FocusModalEvents = {
    COPY_SEED_MENU_ITEM_CLICK: 'focus_modal_copy_seed_menu_item',
    COPY_TO_CLIPBOARD_BUTTON_CLICK: 'focus_modal_copy_to_clipboard_button',
    CREATE_VIDEO_BUTTON_CLICK: 'focus_modal_create_video_button',
    DELETE_BUTTON_CLICK: 'focus_modal_delete_button',
    DOWNLOAD_BUTTON_CLICK: 'focus_modal_download_button',
    DOWNLOAD_MENU_ITEM_CLICK: 'focus_modal_download_menu_item',
    EDIT_CHARACTER_POSE_BUTTON_CLICK: 'focus_modal_edit_character_pose_button',
    EDIT_CHARACTER_POSE_MENU_ITEM_CLICK: 'focus_modal_edit_character_pose_menu_item',
    EDIT_WITH_CANVAS_MENU_ITEM_CLICK: 'focus_modal_edit_with_canvas_menu_item',
    IMAGE_GUIDANCE_BUTTON_CLICK: 'focus_modal_image_guidance_button',
    IMAGE_UPSCALE_BUTTON_CLICK: 'focus_modal_image_upscale_button',
    MORE_OPTIONS_BUTTON_CLICK: 'focus_modal_more_options_button',
    ORGANIZE_MENU_ITEM_CLICK: 'focus_modal_organize_menu_item',
    PRIVACY_BUTTON_CLICK: 'focus_modal_privacy_button',
    PRIVACY_MENU_ITEM_CLICK: 'focus_modal_privacy_menu_item',
    REMIX_BUTTON_CLICK: 'focus_modal_remix_button',
    REMOVE_BACKGROUND_MENU_ITEM_CLICK: 'focus_modal_remove_background_menu_item',
    REPORT_IMAGE_MENU_ITEM_CLICK: 'focus_modal_report_image_menu_item',
    UNZOOM_MENU_ITEM_CLICK: 'focus_modal_unzoom_menu_item',
    VIDEO_UPSCALE_BUTTON_CLICK: 'focus_modal_video_upscale_button',
} as const;

// ============================================================================
// Full Image Modal Events
// ============================================================================

export const FullImageModalEvents = {
    COPY_IMAGE_BUTTON_CLICK: 'full_image_modal_copy_image_button',
    DELETE_BUTTON_CLICK: 'full_image_modal_delete_image_button',
    DESCRIBE_WITH_AI_BUTTON_CLICK: 'full_image_modal_describe_with_ai_button',
    DOWNLOAD_BUTTON_CLICK: 'full_image_modal_download_button',
    EDIT_CHARACTER_POSE_BUTTON_CLICK: 'full_image_modal_edit_character_pose_button',
    EDIT_IN_CANVAS_BUTTON_CLICK: 'full_image_modal_edit_in_canvas_button',
    EDIT_WITH_AI_BUTTON_CLICK: 'full_image_modal_edit_with_ai_button',
    GENERATE_MOTION_BUTTON_CLICK: 'full_image_modal_generate_motion_button',
    MORE_OPTIONS_BUTTON_CLICK: 'full_image_modal_more_options_button',
    ORGANIZE_BUTTON_CLICK: 'full_image_modal_organize_button',
    REMOVE_BACKGROUND_BUTTON_CLICK: 'full_image_modal_remove_backgrounds_button',
    UNZOOM_BUTTON_CLICK: 'full_image_modal_unzoom_button',
    UPSCALE_BUTTON_CLICK: 'full_image_modal_upscale_button',
    USE_AS_IMAGE_GUIDANCE_BUTTON_CLICK: 'full_image_modal_use_as_image_guidance_button',
} as const;

// ============================================================================
// Generation Events
// ============================================================================

export const GenerationEvents = {
    REQUEST_INITIATED: 'generate_request_initiated',
    LDI_REQUEST: 'generate_ldi',
} as const;

// ============================================================================
// Hero Banner Events
// ============================================================================

export const HeroBannerEvents = {
    BUTTON_CLICKED: 'web_client_hero_banner_button_clicked',
} as const;

// ============================================================================
// Home Page Events
// ============================================================================

export const HomePageEvents = {
    CREATE_ACCOUNT_BUTTON_CLICKED: 'web_client_create_account_button_clicked',
    FLOATING_MENU_ITEM_CLICKED: 'web_client_floating_menu_clicked',
    SIGN_IN_BUTTON_CLICKED: 'web_client_sign_in_button_clicked',
    VIEWED: 'web_client_homepage_viewed',
} as const;

// ============================================================================
// Image Generation Events
// ============================================================================

export const ImageGenerationEvents = {
    COLLECTIONS_SELECTED: 'image_generation_collections_selected',
    IMAGE_GUIDANCE_SHORTCUT_CLICK: 'generation_image_guidance_shortcut_click',
    REMIX_INITIATED: 'image_remix',
    REQUEST_INITIATED: 'generate_images',
    RESOLUTION_BUTTON_TOGGLE: 'image_generation_resolution_toggle_button',
    SUCCESSFUL: 'web_client_successful_image_generation',
} as const;

// ============================================================================
// Image Guidance Events
// ============================================================================

export const ImageGuidanceEvents = {
    ADD_ELEMENTS_OPTIONS_SELECTED: 'image_guidance_add_elements_options',
    DRAG_DROP_END: 'image_guidance_drag_drop_end',
    IMAGE_UPLOAD: 'image_guidance_image_upload',
} as const;

// ============================================================================
// Intent to Pay Events
// ============================================================================

export const IntentToPayEvents = {
    CONSUMER_AND_TEAMS: 'web_client_intent_to_pay_consumer_and_teams',
} as const;

// ============================================================================
// Experiment Events
// ============================================================================

export const ExperimentEvents = {
    HIDE_USERNAME_FIELD_ON_SIGNUP: 'is_hide_username_field_on_signup_experiment',
} as const;

// ============================================================================
// Video Events
// ============================================================================

export const VideoEvents = {
    ITERATE: 'iterate_video',
} as const;

// ============================================================================
// Lightning Stream Events
// ============================================================================

export const LightningStreamEvents = {
    DOWNLOAD_BUTTON_CLICK: 'lightning_stream_download_button',
    GENERATION_REQUEST: 'lightning_stream_generate',
    IMAGE_GENERATION_COMPLETE: 'lightning_stream_image_generation_complete',
    MORE_LIKE_THIS_GENERATION_REQUEST: 'lightning_stream_generate_more',
    SAVE_BUTTON_CLICK: 'lightning_stream_save_button',
    UPSCALE_BUTTON_CLICK: 'lightning_stream_upscale_button',
} as const;

// ============================================================================
// Login/Signup Events
// ============================================================================

export const LoginSignupEvents = {
    ALTERNATIVE_SSO_CLICK: 'login_sign_up_alternative_sso',
    EMAIL_CONTINUE_CLICK: 'login_sign_up_email_continue',
    SSO_CLICK: 'login_sign_up_sso',
    COMPLETE: 'signup',
} as const;

// ============================================================================
// Manage Team Subscription Modal Events
// ============================================================================

export const ManageTeamSubscriptionModalEvents = {
    ADD_REMOVE_SEATS_BUTTON_CLICK: 'manage_team_subscription_modal_add_remove_seats_button',
    CANCEL_SUBSCRIPTION_BUTTON_CLICK: 'manage_team_subscription_modal_cancel_subscription_button',
    DELETE_TEAM_BUTTON_CLICK: 'manage_team_subscription_modal_delete_team_button',
    DELETE_TEAM_CANCEL_BUTTON_CLICK: 'manage_team_subscription_modal_delete_team_cancel',
    DELETE_TEAM_CONFIRM_BUTTON_CLICK: 'manage_team_subscription_modal_delete_team_confirm',
    MANAGE_FEATURE_ACCESS_BUTTON_CLICK: 'manage_team_subscription_modal_manage_feature_access_button',
    PLAN_ENQUIRIES_BUTTON_CLICK: 'manage_team_subscription_modal_plan_enquiries_button',
    RENEW_SUBSCRIPTION_BUTTON_CLICK: 'manage_team_subscription_modal_renew_subscription_button',
    SELECT_PLAN_BACK_BUTTON_CLICK: 'manage_team_subscription_modal_select_a_plan_go_back_button',
    SELECT_PLAN_REVIEW_CHANGES_BUTTON_CLICK: 'manage_team_subscription_modal_select_a_plan_review_changes_button',
    SWITCH_SUBSCRIPTION_BUTTON_CLICK: 'manage_team_subscription_modal_switch_subscription_button',
    UPDATE_PAYMENT_METHOD_BUTTON_CLICK: 'manage_team_subscription_modal_update_payment_method_button',
    VIEW_INVOICES_BUTTON_CLICK: 'manage_team_subscription_modal_view_invoices_button',
} as const;

// ============================================================================
// Modal Events
// ============================================================================

export const ModalEvents = {
    RETENTION_OFFER_DISPLAYED: 'retention_offer_show',
    SIGN_UP_SIMPLE_ONBOARDING_COMPLETE: 'sign_up_simple_onboarding_complete',
    UPGRADE_DURATION_TOGGLE: 'upgrade_modal_duration_toggle',
    UPGRADE_PLAN_TOGGLE: 'upgrade_modal_plan_toggle',
} as const;

// ============================================================================
// Not Found Page Events
// ============================================================================

export const NotFoundPageEvents = {
    HOME_BUTTON_CLICKED: 'web_client_clicked_404_homepage_button',
    IMAGE_CLICKED: 'web_client_clicked_404_image',
    PAGE_VIEW: 'web_client_viewed_404',
} as const;

// ============================================================================
// Omni Editor Events
// ============================================================================

export const OmniEditorEvents = {
    IMAGE_COUNT_SELECTED: 'omni_editor_image_count_selected',
    MODEL_SELECTED: 'omni_editor_model_selected',
    QUALITY_SELECTED: 'omni_editor_quality_selected',
} as const;

// ============================================================================
// Onboarding Checklist Events
// ============================================================================

export const OnboardingChecklistEvents = {
    ALL_TASKS_COMPLETED: 'web_client_is_onboarding_checklist_all_tasks_completed',
    DISMISSED: 'web_client_is_onboarding_checklist_dismissed',
    DONE_BUTTON_CLICKED: 'web_client_is_onboarding_checklist_done_button_clicked',
    FIRST_OPENED: 'web_client_is_onboarding_checklist_first_opened',
    MINIMIZED: 'web_client_is_onboarding_checklist_minimized',
    REOPENED: 'web_client_is_onboarding_checklist_reopen_clicked',
    TASK_CLICKED: 'web_client_is_onboarding_checklist_task_clicked',
    TASK_COMPLETED: 'web_client_is_onboarding_checklist_task_completed',
} as const;

// ============================================================================
// Personal Generation Modal Events
// ============================================================================

export const PersonalGenerationModalEvents = {
    DO_NOT_SHOW_AGAIN_TOGGLED: 'personal_generation_modal_do_not_show_again_toggle',
    GENERATE: 'personal_generation_modal_generate',
    SWITCH_TEAM: 'personal_generation_modal_switch_team',
} as const;

// ============================================================================
// Premium Plans Events
// ============================================================================

export const PremiumPlansEvents = {
    API_PLAN_CHECKOUT_INITIATED: 'api_plans_checkout_initiated',
    BEGIN_CHECKOUT: 'begin_checkout',
    CHECKOUT_INITIATED: 'premiumplans_checkout_initiated',
    PURCHASE: 'purchase',
    SUBSCRIPTION_DISCOUNT_OFFER_ACCEPTED: 'subscription_discount_offer_accepted',
    TEAMS_CHECKOUT_INITIATED: 'initiate_teams_checkout',
    VIEW: 'view_item_list',
} as const;

// ============================================================================
// Prompt Enhance Events
// ============================================================================

export const PromptEnhanceEvents = {
    DESCRIBE_IMAGE_GENERATED: 'prompt_enhance_describe_image',
} as const;

// ============================================================================
// Purchase Token Events
// ============================================================================

export const PurchaseTokenEvents = {
    TOPUP_CLICKED: 'purchase_token_topup_clicked',
    TOPUP_REQUESTED: 'purchase_token_topup_requested',
} as const;

// ============================================================================
// Quick Actions Events
// ============================================================================

export const QuickActionsEvents = {
    DELETE_BUTTON_CLICK: 'quick_actions_delete_image_button',
    DESCRIBE_WITH_AI_BUTTON_CLICK: 'quick_actions_describe_with_ai_button',
    DOWNLOAD_BUTTON_CLICK: 'quick_actions_download_button',
    EDIT_IN_CANVAS_BUTTON_CLICK: 'quick_actions_edit_in_canvas_button',
    GENERATE_MOTION_BUTTON_CLICK: 'quick_actions_generate_motion_button',
    IMAGE_GUIDANCE_BUTTON_CLICK: 'quick_actions_use_as_image_guidance_button',
    ORGANIZE_BUTTON_CLICK: 'quick_actions_organize_button',
    REMOVE_BACKGROUND_BUTTON_CLICK: 'quick_actions_remove_backgrounds_button',
    REPOSE_BUTTON_CLICK: 'quick_actions_edit_character_pose_button',
    UPSCALE_BUTTON_CLICK: 'quick_actions_upscale_button',
    VIEW_REMOVED_BACKGROUND_BUTTON_CLICK: 'quick_actions_view_removed_backgrounds_button',
} as const;

// ============================================================================
// Remix Events
// ============================================================================

export const RemixEvents = {
    IMAGE_BUTTON_CLICKED: 'web_client_image_card_remix_clicked',
    VIDEO_BUTTON_CLICKED: 'web_client_video_card_remix_clicked',
} as const;

// ============================================================================
// Settings Events
// ============================================================================

export const SettingsEvents = {
    DROPDOWN_CLICKED: 'settings_dropdown_clicked',
    SUBSCRIPTION_BILLING_ADD_TOKENS_CLICK: 'settings_subscription_billing_add_tokens_click',
    SUBSCRIPTION_BILLING_CANCEL_PLAN_CLICK: 'settings_subscription_billing_cancel_plan_click',
    SUBSCRIPTION_BILLING_CHANGE_PLAN_CLICK: 'settings_subscription_billing_change_plan_click',
    SUBSCRIPTION_BILLING_CONTACT_US_CLICK: 'settings_subscription_billing_contact_us_click',
    SUBSCRIPTION_BILLING_MANAGE_SEATS_CLICK: 'settings_subscription_billing_manage_seats_click',
    SUBSCRIPTION_BILLING_RENEW_PLAN_CLICK: 'settings_subscription_billing_renew_plan_click',
    SUBSCRIPTION_BILLING_UPDATE_PAYMENT_CLICK: 'settings_subscription_billing_update_payment_click',
    SUBSCRIPTION_BILLING_VIEW_INVOICES_CLICK: 'settings_subscription_billing_view_invoices_click',
    TEAM_CONTACT_US_CLICKED: 'settings_team_contact_us_clicked',
    TEAM_FAQ_VISITED: 'settings_team_faq_visited',
    TEAM_LOGO_CHANGED: 'settings_team_logo_changed',
    TEAM_NAME_CHANGED: 'settings_team_name_changed',
    USER_PROFILE_INTEREST_CHANGED: 'settings_user_profile_interest_changed',
    USER_PROFILE_NSFW_TOGGLED: 'settings_user_profile_nsfw_toggled',
} as const;

// ============================================================================
// Sidebar Navigation Events
// ============================================================================

export const SidebarNavigationEvents = {
    ITEM_CLICKED: 'web_client_clicked_sidebar_navigation_item',
} as const;

// ============================================================================
// Subscription Events
// ============================================================================

export const SubscriptionEvents = {
    SUCCESS_REDIRECT: 'web_client_subscription_success_redirect',
} as const;

// ============================================================================
// Team Feed Events
// ============================================================================

export const TeamFeedEvents = {
    DELETE_EVERYWHERE_BUTTON_CLICK: 'team_feed_delete_everywhere_button_click',
    DELETE_SOURCE_CHECKBOX_TOGGLED: 'team_feed_delete_source_checkbox_toggled',
} as const;

// ============================================================================
// Team Member Events
// ============================================================================

export const TeamMemberEvents = {
    INVITE_CREATED: 'team_member_invite_created',
    REMOVED: 'team_member_removed',
    ROLE_CHANGED: 'team_member_role_change',
} as const;

// ============================================================================
// Tokens Events
// ============================================================================

export const TokensEvents = {
    DEPLETED: 'tokens_depleted',
} as const;

// ============================================================================
// Training Model Events
// ============================================================================

export const TrainingModelEvents = {
    CATEGORY_STEP_COMPLETED: 'training_model_category_step_completed',
    CREATE_OR_EDIT_DATASET_STEP_COMPLETED: 'training_model_create_or_edit_dataset_step_completed',
    DATASET_SELECTION_STEP_COMPLETED: 'training_model_dataset_selection_step_completed',
    OPEN_MODAL: 'training_model_open_modal',
    TRAIN_REQUEST: 'train_model_request',
} as const;

// ============================================================================
// Upgrade Banner Events
// ============================================================================

export const UpgradeBannerEvents = {
    TEAM_SWITCH: 'upgrade_banner_team_switch',
} as const;

// ============================================================================
// User Events
// ============================================================================

export const UserEvents = {
    DELETE_ACCOUNT_CONFIRMATION_CLICK: 'delete_account_confirmation',
    DELETE_ACCOUNT_INITIATION_CLICK: 'delete_account_initiation',
    FEEDBACK_SURVEY_DATA_SUBMITTED: 'submit_user_feedback_survey_data',
    FEED_QUERY_FAILED: 'user_feed_query_failed',
} as const;

// ============================================================================
// Video Generation Events
// ============================================================================

export const VideoGenerationEvents = {
    AUDIO_ENABLED_TOGGLED: 'video_generation_audio_enabled_toggled',
    COLLECTIONS_SELECTED: 'video_generation_collections_selected',
    DIMENSIONS_SELECTED: 'video_generation_dimensions_selected',
    FIXED_SEED_TOGGLED: 'video_generation_fixed_seed_toggled',
    IMAGE_ADDED: 'video_generation_image_added',
    MODE_SELECTED: 'video_generation_mode_selected',
    MOTION_ELEMENT_SELECTED: 'video_generation_motion_element_selected',
    NEGATIVE_PROMPT_TOGGLED: 'video_generation_negative_prompt_toggled',
    NEGATIVE_PROMPT_UPDATED: 'video_generation_negative_prompt_updated',
    NUMBER_OF_VIDEOS_SELECTED: 'video_generation_number_of_videos_selected',
    PRIVACY_MODE_TOGGLED: 'video_generation_privacy_mode_toggled',
    PROMPT_ENHANCE_TOGGLED: 'video_generation_prompt_enhance_toggled',
    REQUEST_INITIATED: 'video_generation_request_initiated',
    SMOOTH_VIDEO_TOGGLED: 'video_generation_smooth_video_toggled',
    UPSCALE_480P_TO_720P_REQUEST_INITIATED: 'video_generation_upscale_480p_to_720p_request_initiated',
} as const;

// ============================================================================
// View Events
// ============================================================================

export const ViewEvents = {
    LOW_TOKEN_UPGRADE_MODAL: 'view_low_token_upgrade_modal',
} as const;

// ============================================================================
// Web Click Events
// ============================================================================

export const WebClickEvents = {
    GENERATION_HISTORY_GLOBAL: 'web_click_generation_history_global',
    GENERATION_HISTORY_OPTIONS: 'web_click_generation_history_options',
    QUICK_ACTIONS_GLOBAL: 'web_click_quick_actions_global',
    QUICK_ACTIONS_GLOBAL_OPTIONS: 'web_click_quick_actions_global_options',
} as const;

// ============================================================================
// Web Client Events
// ============================================================================

export const WebClientEvents = {
    CONFIRM_PAID_TO_FREE_DOWNGRADE: 'web_client_confirm_paid_to_free_downgrade',
    CONFIRM_PAID_TO_PAID_DOWNGRADE: 'web_client_confirm_paid_to_paid_downgrade',
    CONFIRM_UPGRADE: 'web_client_confirm_upgrade',
    PLAN_PROVIDER_SELECTED: 'web_client_planProvider_selected',
    PLAN_PROVIDER_VIEWED: 'web_client_plan_provider_viewed',
    SUBSCRIPTION_TRANSITION_COMING_SOON: 'web_client_subscription_transition_coming_soon',
    VIEWED_UPGRADE_CONFIRMATION_MODAL: 'web_client_viewed_upgrade_confirmation_modal',
} as const;

// ============================================================================
// Type Utilities
// ============================================================================

/** All analytics event categories */
export const AnalyticsEvents = {
    ApiAccess: ApiAccessEvents,
    ApiPayg: ApiPaygEvents,
    Asset: AssetEvents,
    BatchOperations: BatchOperationsEvents,
    Blueprint: BlueprintEvents,
    BulkDownload: BulkDownloadEvents,
    BuyPage: BuyPageEvents,
    Canva: CanvaEvents,
    CategoriesFilter: CategoriesFilterEvents,
    Collections: CollectionsEvents,
    Community: CommunityEvents,
    Conversion: ConversionEvents,
    CopyToApi: CopyToApiEvents,
    Datasets: DatasetsEvents,
    DefaultPreset: DefaultPresetEvents,
    Download: DownloadEvents,
    FocusModal: FocusModalEvents,
    FullImageModal: FullImageModalEvents,
    Generation: GenerationEvents,
    HeroBanner: HeroBannerEvents,
    HomePage: HomePageEvents,
    ImageGeneration: ImageGenerationEvents,
    ImageGuidance: ImageGuidanceEvents,
    IntentToPay: IntentToPayEvents,
    Experiment: ExperimentEvents,
    Video: VideoEvents,
    LightningStream: LightningStreamEvents,
    LoginSignup: LoginSignupEvents,
    ManageTeamSubscriptionModal: ManageTeamSubscriptionModalEvents,
    Modal: ModalEvents,
    NotFoundPage: NotFoundPageEvents,
    OmniEditor: OmniEditorEvents,
    OnboardingChecklist: OnboardingChecklistEvents,
    PersonalGenerationModal: PersonalGenerationModalEvents,
    PremiumPlans: PremiumPlansEvents,
    PromptEnhance: PromptEnhanceEvents,
    PurchaseToken: PurchaseTokenEvents,
    QuickActions: QuickActionsEvents,
    Remix: RemixEvents,
    Settings: SettingsEvents,
    SidebarNavigation: SidebarNavigationEvents,
    Subscription: SubscriptionEvents,
    TeamFeed: TeamFeedEvents,
    TeamMember: TeamMemberEvents,
    Tokens: TokensEvents,
    TrainingModel: TrainingModelEvents,
    UpgradeBanner: UpgradeBannerEvents,
    User: UserEvents,
    VideoGeneration: VideoGenerationEvents,
    View: ViewEvents,
    WebClick: WebClickEvents,
    WebClient: WebClientEvents,
} as const;

// Extract event value types
export type ApiAccessEvent = (typeof ApiAccessEvents)[keyof typeof ApiAccessEvents];
export type ApiPaygEvent = (typeof ApiPaygEvents)[keyof typeof ApiPaygEvents];
export type AssetEvent = (typeof AssetEvents)[keyof typeof AssetEvents];
export type BatchOperationsEvent = (typeof BatchOperationsEvents)[keyof typeof BatchOperationsEvents];
export type BlueprintEvent = (typeof BlueprintEvents)[keyof typeof BlueprintEvents];
export type BulkDownloadEvent = (typeof BulkDownloadEvents)[keyof typeof BulkDownloadEvents];
export type BuyPageEvent = (typeof BuyPageEvents)[keyof typeof BuyPageEvents];
export type CanvaEvent = (typeof CanvaEvents)[keyof typeof CanvaEvents];
export type CategoriesFilterEvent = (typeof CategoriesFilterEvents)[keyof typeof CategoriesFilterEvents];
export type CollectionsEvent = (typeof CollectionsEvents)[keyof typeof CollectionsEvents];
export type CommunityEvent = (typeof CommunityEvents)[keyof typeof CommunityEvents];
export type ConversionEvent = (typeof ConversionEvents)[keyof typeof ConversionEvents];
export type CopyToApiEvent = (typeof CopyToApiEvents)[keyof typeof CopyToApiEvents];
export type DatasetsEvent = (typeof DatasetsEvents)[keyof typeof DatasetsEvents];
export type DefaultPresetEvent = (typeof DefaultPresetEvents)[keyof typeof DefaultPresetEvents];
export type DownloadEvent = (typeof DownloadEvents)[keyof typeof DownloadEvents];
export type FocusModalEvent = (typeof FocusModalEvents)[keyof typeof FocusModalEvents];
export type FullImageModalEvent = (typeof FullImageModalEvents)[keyof typeof FullImageModalEvents];
export type GenerationEvent = (typeof GenerationEvents)[keyof typeof GenerationEvents];
export type HeroBannerEvent = (typeof HeroBannerEvents)[keyof typeof HeroBannerEvents];
export type HomePageEvent = (typeof HomePageEvents)[keyof typeof HomePageEvents];
export type ImageGenerationEvent = (typeof ImageGenerationEvents)[keyof typeof ImageGenerationEvents];
export type ImageGuidanceEvent = (typeof ImageGuidanceEvents)[keyof typeof ImageGuidanceEvents];
export type IntentToPayEvent = (typeof IntentToPayEvents)[keyof typeof IntentToPayEvents];
export type ExperimentEvent = (typeof ExperimentEvents)[keyof typeof ExperimentEvents];
export type VideoEvent = (typeof VideoEvents)[keyof typeof VideoEvents];
export type LightningStreamEvent = (typeof LightningStreamEvents)[keyof typeof LightningStreamEvents];
export type LoginSignupEvent = (typeof LoginSignupEvents)[keyof typeof LoginSignupEvents];
export type ManageTeamSubscriptionModalEvent = (typeof ManageTeamSubscriptionModalEvents)[keyof typeof ManageTeamSubscriptionModalEvents];
export type ModalEvent = (typeof ModalEvents)[keyof typeof ModalEvents];
export type NotFoundPageEvent = (typeof NotFoundPageEvents)[keyof typeof NotFoundPageEvents];
export type OmniEditorEvent = (typeof OmniEditorEvents)[keyof typeof OmniEditorEvents];
export type OnboardingChecklistEvent = (typeof OnboardingChecklistEvents)[keyof typeof OnboardingChecklistEvents];
export type PersonalGenerationModalEvent = (typeof PersonalGenerationModalEvents)[keyof typeof PersonalGenerationModalEvents];
export type PremiumPlansEvent = (typeof PremiumPlansEvents)[keyof typeof PremiumPlansEvents];
export type PromptEnhanceEvent = (typeof PromptEnhanceEvents)[keyof typeof PromptEnhanceEvents];
export type PurchaseTokenEvent = (typeof PurchaseTokenEvents)[keyof typeof PurchaseTokenEvents];
export type QuickActionsEvent = (typeof QuickActionsEvents)[keyof typeof QuickActionsEvents];
export type RemixEvent = (typeof RemixEvents)[keyof typeof RemixEvents];
export type SettingsEvent = (typeof SettingsEvents)[keyof typeof SettingsEvents];
export type SidebarNavigationEvent = (typeof SidebarNavigationEvents)[keyof typeof SidebarNavigationEvents];
export type SubscriptionEvent = (typeof SubscriptionEvents)[keyof typeof SubscriptionEvents];
export type TeamFeedEvent = (typeof TeamFeedEvents)[keyof typeof TeamFeedEvents];
export type TeamMemberEvent = (typeof TeamMemberEvents)[keyof typeof TeamMemberEvents];
export type TokensEvent = (typeof TokensEvents)[keyof typeof TokensEvents];
export type TrainingModelEvent = (typeof TrainingModelEvents)[keyof typeof TrainingModelEvents];
export type UpgradeBannerEvent = (typeof UpgradeBannerEvents)[keyof typeof UpgradeBannerEvents];
export type UserEvent = (typeof UserEvents)[keyof typeof UserEvents];
export type VideoGenerationEvent = (typeof VideoGenerationEvents)[keyof typeof VideoGenerationEvents];
export type ViewEvent = (typeof ViewEvents)[keyof typeof ViewEvents];
export type WebClickEvent = (typeof WebClickEvents)[keyof typeof WebClickEvents];
export type WebClientEvent = (typeof WebClientEvents)[keyof typeof WebClientEvents];

/** Union type of all analytics event strings */
export type AnalyticsEventName =
    | ApiAccessEvent
    | ApiPaygEvent
    | AssetEvent
    | BatchOperationsEvent
    | BlueprintEvent
    | BulkDownloadEvent
    | BuyPageEvent
    | CanvaEvent
    | CategoriesFilterEvent
    | CollectionsEvent
    | CommunityEvent
    | ConversionEvent
    | CopyToApiEvent
    | DatasetsEvent
    | DefaultPresetEvent
    | DownloadEvent
    | FocusModalEvent
    | FullImageModalEvent
    | GenerationEvent
    | HeroBannerEvent
    | HomePageEvent
    | ImageGenerationEvent
    | ImageGuidanceEvent
    | IntentToPayEvent
    | ExperimentEvent
    | VideoEvent
    | LightningStreamEvent
    | LoginSignupEvent
    | ManageTeamSubscriptionModalEvent
    | ModalEvent
    | NotFoundPageEvent
    | OmniEditorEvent
    | OnboardingChecklistEvent
    | PersonalGenerationModalEvent
    | PremiumPlansEvent
    | PromptEnhanceEvent
    | PurchaseTokenEvent
    | QuickActionsEvent
    | RemixEvent
    | SettingsEvent
    | SidebarNavigationEvent
    | SubscriptionEvent
    | TeamFeedEvent
    | TeamMemberEvent
    | TokensEvent
    | TrainingModelEvent
    | UpgradeBannerEvent
    | UserEvent
    | VideoGenerationEvent
    | ViewEvent
    | WebClickEvent
    | WebClientEvent;
