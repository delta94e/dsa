/**
 * Generation Mutations
 *
 * GraphQL mutations for image/video generation operations.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Image Description
// ============================================================================

export const DescribeImageDocument = gql`
    mutation DescribeImage($arg1: DescribeImageInput!) {
        describeImage(arg1: $arg1) {
            description
        }
    }
`;

// ============================================================================
// LDI/LCM Generation (Live Canvas)
// ============================================================================

export const GenerateLDIJobDocument = gql`
    mutation GenerateLDIJob($arg1: LDIGenerationInput!) {
        ldiGenerationJob(arg1: $arg1) {
            dataUrlImages
        }
    }
`;

export const CreateLCMGenerationJobDocument = gql`
    mutation CreateLCMGenerationJob($arg1: LcmGenerationInput!) {
        lcmGenerationJob(arg1: $arg1) {
            imageDataUrl
            requestTimestamp
        }
    }
`;

export const CreateLCMRefineGenerationJobDocument = gql`
    mutation CreateLCMRefineGenerationJob($arg1: LcmGenerationInput!) {
        lcmGenerationJob(arg1: $arg1) {
            generatedImageId
            variationId
        }
    }
`;

// ============================================================================
// Lightning Stream Generation
// ============================================================================

export const CreateLightningStreamGenerationDocument = gql`
    mutation CreateLightningStreamGeneration(
        $enhancedPrompt: Boolean
        $height: Int!
        $jpegQuality: Int
        $noiseDelta: Float
        $noiseSeed: Int
        $prompt: String!
        $seed: Int!
        $styleIds: [String!]!
        $teamId: String
        $width: Int!
    ) {
        lightningStreamGeneration(
            enhancedPrompt: $enhancedPrompt
            height: $height
            jpegQuality: $jpegQuality
            noiseDelta: $noiseDelta
            noiseSeed: $noiseSeed
            prompt: $prompt
            seed: $seed
            styleIds: $styleIds
            teamId: $teamId
            width: $width
        ) {
            imageDataUrl
            message
            nonce
            paidTokens
            rolloverTokens
            subscriptionTokens
            tokenTimestamp
        }
    }
`;

export const CreateLightningStreamPromptsDocument = gql`
    mutation CreateLightningStreamPrompts(
        $numberOfPrompts: Int!
        $prompt: String!
        $skipEnhancement: Boolean
        $styleIds: [[String]]!
        $teamId: String
    ) {
        lightningStreamPrompts(
            numberOfPrompts: $numberOfPrompts
            prompt: $prompt
            skipEnhancement: $skipEnhancement
            styleIds: $styleIds
            teamId: $teamId
        ) {
            enhancedPrompts
            message
            paidTokens
            rolloverTokens
            subscriptionTokens
            tokenTimestamp
        }
    }
`;

export const CreateLightningStreamSaveDocument = gql`
    mutation CreateLightningStreamSave(
        $enhancedPrompt: Boolean
        $height: Int!
        $generationInput: LightningStreamPersistedGenerationInput
        $jpegQuality: Int
        $noiseDelta: Float
        $noiseSeed: Int
        $nonce: String!
        $prompt: String!
        $seed: Int!
        $styleIds: [String!]!
        $teamId: String
        $width: Int!
    ) {
        lightningStreamGeneration(
            enhancedPrompt: $enhancedPrompt
            generationInput: $generationInput
            height: $height
            jpegQuality: $jpegQuality
            noiseDelta: $noiseDelta
            noiseSeed: $noiseSeed
            nonce: $nonce
            prompt: $prompt
            seed: $seed
            styleIds: $styleIds
            teamId: $teamId
            width: $width
        ) {
            generatedImageId
            generationId
            message
            url
        }
    }
`;

// ============================================================================
// Motion/Video Generation
// ============================================================================

export const CreateMotionSvdGenerationJobDocument = gql`
    mutation CreateMotionSvdGenerationJob($arg1: MotionSvdGenerationInput!) {
        motionSvdGenerationJob(arg1: $arg1) {
            apiCreditCost
            generationId
        }
    }
`;

export const CreateMotionVideoGenerationJobDocument = gql`
    mutation CreateMotionVideoGenerationJob($arg1: MotionVideoGenerationInput!) {
        motionVideoGenerationJob(arg1: $arg1) {
            generationId
            variationId
        }
    }
`;

// ============================================================================
// GPT Prompt Generation
// ============================================================================

export const CreateGPTPromptDocument = gql`
    mutation CreateGPTPrompt($arg1: GptPromptGeneratorInput!) {
        gptPromptGenerator(arg1: $arg1) {
            id
            output
        }
    }
`;

// ============================================================================
// Generation Feedback
// ============================================================================

export const CreateGenerationFeedbackDocument = gql`
    mutation CreateGenerationFeedback(
        $generationId: ID!
        $isPositive: Boolean!
        $feedbackType: FeedbackType!
        $reasonIds: [Int!]
    ) {
        createGenerationFeedback(
            request: {
                generationId: $generationId
                isPositive: $isPositive
                feedbackType: $feedbackType
                reasonIds: $reasonIds
            }
        ) {
            success
        }
    }
`;

// ============================================================================
// Background/NoBG Jobs
// ============================================================================

export const CreateNoBGJobDocument = gql`
    mutation CreateNoBGJob($arg1: SDNobgJobInput!) {
        sdNobgJob(arg1: $arg1) {
            id
        }
    }
`;

// ============================================================================
// SD Generation Jobs
// ============================================================================

export const CreateSDGenerationJobDocument = gql`
    mutation CreateSDGenerationJob($arg1: SDGenerationInput!) {
        sdGenerationJob(arg1: $arg1) {
            generationId
        }
    }
`;

export const CreateSDTrainingJobDocument = gql`
    mutation CreateSDTrainingJob($arg1: SDTrainingInput!) {
        sdTrainingJob(arg1: $arg1) {
            customModelId
        }
    }
`;

// ============================================================================
// Texture Generation
// ============================================================================

export const CreateTextureGenerationJobDocument = gql`
    mutation CreateTextureGenerationJob($arg1: TextureGenerationJobInput!) {
        textureGenerationJob(arg1: $arg1) {
            id
        }
    }
`;

// ============================================================================
// Turbo Generation
// ============================================================================

export const CreateTurboGenerationJobDocument = gql`
    mutation CreateTurboGenerationJob($arg1: TurboGenerationInput!) {
        turboGenerationJob(arg1: $arg1) {
            imageDataUrl
            requestId
            requestTimestamp
            generationId
            generatedImageId
            variationId
        }
    }
`;

export const CreateTurboRefineJobDocument = gql`
    mutation CreateTurboRefineJob($arg1: TurboGenerationInput!) {
        turboGenerationJob(arg1: $arg1) {
            imageDataUrl
            generationId
            generatedImageId
            variationId
        }
    }
`;

// ============================================================================
// Upscale Jobs
// ============================================================================

export const CreateUniversalUpscalerJobDocument = gql`
    mutation CreateUniversalUpscalerJob($arg1: UniversalUpscalerInput!) {
        universalUpscaler(arg1: $arg1) {
            apiCreditCost
            generationId
            generated_image_variation {
                id
                createdAt
                status
                url
                transformType
                generated_image {
                    id
                    url
                    generation {
                        id
                        imageWidth
                        imageHeight
                        alchemy
                        highResolution
                        photoReal
                        sdVersion
                        photoRealVersion
                    }
                }
                upscale_details {
                    id
                    variationId
                    oneClicktype
                    isOneClick
                    creativityStrength
                    upscaleMultiplier
                    width
                    height
                    alchemyRefinerCreative
                    alchemyRefinerStrength
                    optional_metadata
                    generated_image_variation_generic {
                        id
                        status
                        url
                    }
                }
            }
        }
    }
`;

export const CreateUpscaleJobDocument = gql`
    mutation CreateUpscaleJob($arg1: SDUpscaleJobInput!) {
        sdUpscaleJob(arg1: $arg1) {
            id
        }
    }
`;

export const CreateUnzoomJobDocument = gql`
    mutation CreateUnzoomJob($arg1: SDUnzoomInput!) {
        sdUnzoomJob(arg1: $arg1) {
            id
        }
    }
`;

// ============================================================================
// Upload Init Images
// ============================================================================

export const CreateUploadInitImageDocument = gql`
    mutation CreateUploadInitImage($arg1: InitImageUploadInput!) {
        uploadInitImage(arg1: $arg1) {
            id
            fields
            key
            url
        }
    }
`;

export const CreateUploadReposeInitImageDocument = gql`
    mutation CreateUploadReposeInitImage($uploadReposeInitImageInput: UploadReposeInitImageDto!) {
        uploadReposeInitImage(uploadReposeInitImageInput: $uploadReposeInitImageInput) {
            akUUID
            key
            url
            fields
        }
    }
`;

// ============================================================================
// Reports
// ============================================================================

export const CreateReportDocument = gql`
    mutation CreateReport($objects: [reports_insert_input!]!) {
        insert_reports(objects: $objects) {
            affected_rows
        }
    }
`;

// ============================================================================
// Prompt Generation
// ============================================================================

export const PromptGenerationDocument = gql`
    mutation PromptGeneration(
        $prompt: String
        $promptInstructions: String
        $teamId: String
        $isVideo: Boolean
    ) {
        promptGeneration(
            prompt: $prompt
            promptInstructions: $promptInstructions
            teamId: $teamId
            isVideo: $isVideo
        ) {
            prompt
        }
    }
`;

// ============================================================================
// Moderation
// ============================================================================

export const S3UploadModerationDocument = gql`
    mutation S3UploadModeration($datasetImageIds: [String]) {
        s3UploadModeration(datasetImageIds: $datasetImageIds) {
            id
            moderation_result
        }
    }
`;

export const ModerationReviewDocument = gql`
    mutation ModerationReview($objects: [moderation_review_insert_input!]!) {
        insert_moderation_review(objects: $objects) {
            affected_rows
        }
    }
`;
