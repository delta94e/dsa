/**
 * User Mutations
 *
 * GraphQL mutations for user operations.
 */

import { gql, TypedDocumentNode } from '@apollo/client';

// ============================================================================
// Types
// ============================================================================

export interface ChangeUsernameData {
    changeUsername: {
        id: string;
        username: string;
        success: boolean;
        usernameVariations: string[];
    };
}

export interface ChangeUsernameVariables {
    username: string;
}

export interface ConfirmNotificationMessageVariables {
    messageId: string;
    userId: string;
}

export interface CreateApiKeyData {
    createApiKey: {
        key: string;
    };
}

export interface CreateApiKeyVariables {
    arg1: {
        name?: string;
    };
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Change username
 */
export const ChangeUsernameDocument: TypedDocumentNode<
    ChangeUsernameData,
    ChangeUsernameVariables
> = gql`
    mutation ChangeUsername($username: String!) {
        changeUsername(updateUsernameInput: { username: $username }) {
            id
            username
            success
            usernameVariations
        }
    }
`;

/**
 * Confirm notification message
 */
export const ConfirmNotificationMessageDocument = gql`
    mutation ConfirmNotificationMessage($messageId: String!, $userId: String!) {
        confirmNotificationMessage(input: { messageId: $messageId, userId: $userId })
    }
`;

/**
 * Create API key
 */
export const CreateApiKeyDocument: TypedDocumentNode<
    CreateApiKeyData,
    CreateApiKeyVariables
> = gql`
    mutation CreateApiKey($arg1: CreateApiKeyInput!) {
        createApiKey(arg1: $arg1) {
            key
        }
    }
`;

/**
 * Background removal job
 */
export const BackgroundRemovalJobDocument = gql`
    mutation BackgroundRemovalJob($arg1: BackgroundRemovalInput!) {
        backgroundRemovalJob(arg1: $arg1) {
            ... on BackgroundRemovalOutput {
                imageDataUrl
            }
        }
    }
`;

/**
 * Check image (for moderation)
 */
export const CreateCheckImageDocument = gql`
    mutation CreateCheckImage($initImageId: String!) {
        checkImage(arg1: { initImageId: $initImageId }) {
            initImageId
            checkStatus
        }
    }
`;

// ============================================================================
// Delete Operations
// ============================================================================

/**
 * Delete user account
 */
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
        deleteAccount {
            status
        }
    }
`;

/**
 * Delete API key
 */
export const DeleteApiKeyDocument = gql`
    mutation DeleteApiKey($id: uuid!) {
        delete_api_keys_by_pk(id: $id) {
            id
        }
    }
`;

/**
 * Delete asset/generation
 */
export const DeleteAssetGenerationDocument = gql`
    mutation DeleteAssetGeneration(
        $assetId: uuid!
        $generationId: uuid!
        $deleteGeneration: Boolean!
    ) {
        delete_generated_images_by_pk(id: $assetId) @skip(if: $deleteGeneration) {
            id
        }
        delete_generations_by_pk(id: $generationId) @include(if: $deleteGeneration) {
            id
        }
    }
`;

// ============================================================================
// Survey & Support
// ============================================================================

/**
 * Save survey response
 */
export const SaveSurveyDocument = gql`
    mutation SaveSurvey($surveyCategory: String!, $surveyPayload: String!) {
        saveSurveyResponse(
            save: { surveyCategory: $surveyCategory, surveyPayload: $surveyPayload }
        ) {
            success
        }
    }
`;

/**
 * Send customer support email
 */
export const SendCustomerSupportEmailDocument = gql`
    mutation SendCustomerSupportEmail($input: SendCustomerSupportEmailDto!) {
        sendCustomerSupportEmail(sendCustomerSupportEmailInput: $input) {
            success
        }
    }
`;

// ============================================================================
// User State & Trial
// ============================================================================

/**
 * Set user for API trial
 */
export const SetUserForApiTrialDocument = gql`
    mutation SetUserForApiTrial {
        setUserForApiTrial
    }
`;

/**
 * Set user state
 */
export const SetUserStateDocument = gql`
    mutation SetUserState($type: UserStateType!, $input: SetUserStateInput!) {
        setUserState(type: $type, input: $input) {
            state
        }
    }
`;

/**
 * Share asset via email
 */
export const ShareAssetViaEmailDocument = gql`
    mutation ShareAssetViaEmail($input: ShareAssetDTO!) {
        shareAssetViaEmail(input: $input) {
            success
        }
    }
`;

/**
 * Update API key
 */
export const UpdateApiKeyDocument = gql`
    mutation UpdateApiKey($_set: api_keys_set_input, $pk_columns: api_keys_pk_columns_input!) {
        update_api_keys_by_pk(_set: $_set, pk_columns: $pk_columns) {
            id
        }
    }
`;

// ============================================================================
// User Updates
// ============================================================================

/**
 * Update user API auto top-up settings
 */
export const UpdateUserApiAutoTopUpSettingsDocument = gql`
    mutation UpdateUserApiAutoTopUpSettings($autoTopUpTrigger: Int!, $autoTopUpCreditsAmount: Int) {
        updateUserApiAutoTopUpSettings(
            updateUserApiAutoTopUpSettingsInput: {
                autoTopUpTrigger: $autoTopUpTrigger
                autoTopUpCreditsAmount: $autoTopUpCreditsAmount
            }
        )
    }
`;

/**
 * Update user details during signup
 */
export const UpdateUserDetailsSignUpDocument = gql`
    mutation UpdateUserDetailsSignUp($userDetailsInput: userDetailsInput!) {
        updateUserDetails(userDetailsInput: $userDetailsInput) {
            id
        }
    }
`;

/**
 * Update user details
 */
export const UpdateUserDetailsDocument = gql`
    mutation UpdateUserDetails($where: user_details_bool_exp!, $_set: user_details_set_input) {
        update_user_details(where: $where, _set: $_set) {
            affected_rows
            returning {
                id
                interests
                showNsfw
            }
        }
    }
`;

/**
 * Update user element (lora)
 */
export const UpdateUserElementDocument = gql`
    mutation UpdateUserElement($pk_columns: user_loras_pk_columns_input!, $_set: user_loras_set_input) {
        update_user_loras_by_pk(pk_columns: $pk_columns, _set: $_set) {
            id
            name
            description
        }
    }
`;

/**
 * Update user retentions
 */
export const UpdateUserRetentionsDocument = gql`
    mutation UpdateUserRetentions($arg1: UpdateUserRetentionsInput!) {
        updateUserRetentions(arg1: $arg1) {
            offerCode
            update
        }
    }
`;

/**
 * Update generated images public status
 */
export const UpdateGeneratedImagesPublicDocument = gql`
    mutation UpdateGeneratedImagesPublic($public: Boolean!, $generatedImageIds: [String!]!) {
        updateGeneratedImagesPublic(
            arg1: { public: $public, generatedImageIds: $generatedImageIds }
        ) {
            affectedRows
        }
    }
`;

// ============================================================================
// Upload Operations
// ============================================================================

/**
 * Upload image
 */
export const UploadImageDocument = gql`
    mutation UploadImage($uploadImageInput: UploadImageInput!) {
        uploadImage(arg1: $uploadImageInput) {
            uploadId
            url
            fields
        }
    }
`;

/**
 * Upload model asset
 */
export const UploadModelAssetDocument = gql`
    mutation UploadModelAsset($arg1: ModelAssetUploadInput!) {
        uploadModelAsset(arg1: $arg1) {
            modelFields
            modelId
            modelKey
            modelUrl
            thumbnailFields
            thumbnailKey
            thumbnailUrl
        }
    }
`;
