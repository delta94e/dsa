/**
 * Generation Queries
 *
 * GraphQL queries for AI generation feed and statuses.
 */

import { gql } from '@apollo/client';

/**
 * Get AI generation feed statuses
 */
export const GetAIGenerationFeedStatusesDocument = gql`
    query GetAIGenerationFeedStatuses($where: generations_bool_exp = {}) {
        generations(where: $where) {
            id
            status
        }
    }
`;

/**
 * Get AI generation feed with full details
 */
export const GetAIGenerationFeedDocument = gql`
    query GetAIGenerationFeed(
        $where: generations_bool_exp = {}
        $userId: uuid
        $limit: Int
        $offset: Int = 0
    ) {
        generations(
            limit: $limit
            offset: $offset
            order_by: [{ createdAt: desc }]
            where: $where
        ) {
            id
            modelId
            motionModel
            alchemy
            contrastRatio
            controlnetsUsed
            coreModel
            createdAt
            custom_model {
                id
                modelHeight
                modelWidth
                name
                userId
            }
            expandedDomain
            generated_image {
                id
                url
            }
            generated_images(order_by: [{ url: desc }]) {
                id
                createdAt
                generationId
                image_height
                image_width
                likeCount
                motionGIFURL
                motionMP4URL
                nsfw
                public
                teamId
                url
                userId
                user {
                    id
                    username
                }
                collection_images {
                    collectionId
                    id
                    generatedImageId
                }
                user_liked_generated_images(limit: 1) {
                    generatedImageId
                    userId
                }
            }
            generation_context_images {
                id
                initGeneratedImageId
                initImageId
                endGeneratedImageId
                endImageId
            }
            guidanceScale
            highContrast
            highResolution
            imageHeight
            imagePromptStrength
            imageToImage
            imageToVideo
            imageWidth
            inferenceSteps
            init_image {
                id
                url
            }
            initGeneratedImageId
            initStrength
            motion
            motionGenerationResolution
            motionFrameInterpolation
            motionDurationSeconds
            motionHasAudio
            negativePrompt
            notes {
                id
                notePayload
                noteType
            }
            nsfw
            photoReal
            photoRealStrength
            photoRealVersion
            presetStyle
            prompt
            promptMagic
            promptMagicStrength
            promptMagicVersion
            prompt_moderations {
                moderationClassification
            }
            public
            quantity
            scheduler
            sdVersion
            seed
            source
            status
            styles {
                style {
                    akUUID
                    name
                }
            }
            styleUUID
            tiling
            transparency
            ultra
            user {
                id
                username
            }
            generation_presets_useds {
                id
                originalPrompt
                presetId
            }
            generation_feedbacks {
                feedbackType
                generationId
                id
                isPositive
                generation_feedback_reasons {
                    reasonId
                }
            }
        }
    }
`;

/**
 * Get AI texture generation feed status
 */
export const GetAiTextureGenerationFeedStatusDocument = gql`
    query GetAiTextureGenerationFeedStatus($where: model_asset_texture_generations_bool_exp) {
        model_asset_texture_generations(where: $where) {
            id
            status
        }
    }
`;

/**
 * Check upload for generations mutation (misplaced in queries chunk)
 */
export const CheckUploadForGenerationsDocument = gql`
    mutation CheckUploadForGenerations($input: CheckUploadForGenerationsInput!) {
        checkUploadForGenerations(arg1: $input) {
            canDelete
        }
    }
`;

// ============================================================================
// Generated Image Source Queries
// ============================================================================

export const GetGeneratedImageGenerationGeneratedImagesDocument = gql`
    query GetGeneratedImageGenerationGeneratedImages($id: uuid!) {
        generated_images_by_pk(id: $id) {
            id
            generation {
                id
                generated_images {
                    id
                }
            }
        }
    }
`;

export const GetGeneratedImageSourceDocument = gql`
    query GetGeneratedImageSource($generatedImageId: uuid!) {
        generated_images_by_pk(id: $generatedImageId) {
            id
            url
        }
    }
`;

export const GetGeneratedImageSourcesDocument = gql`
    query GetGeneratedImageSources($ids: [uuid!]!) {
        generated_images(where: { id: { _in: $ids } }) {
            id
            url
            __typename
        }
    }
`;

// ============================================================================
// Generation Detail Queries
// ============================================================================

export const GetGenerationByIdDocument = gql`
    query GetGenerationById($id: uuid!) {
        generations_by_pk(id: $id) {
            id
            prompt
            negativePrompt
            imageWidth
            imageHeight
            modelId
            seed
            guidanceScale
            inferenceSteps
            scheduler
            presetStyle
            sdVersion
            alchemy
            photoReal
            photoRealVersion
            photoRealStrength
            promptMagic
            promptMagicStrength
            promptMagicVersion
            highContrast
            highResolution
            contrastRatio
            tiling
            transparency
            ultra
            public
            styleUUID
            initGeneratedImageId
            initStrength
            init_image {
                id
            }
            generation_elements {
                id
                weightApplied
                lora {
                    akUUID
                }
                user_lora {
                    id
                }
            }
            generation_controlnets(order_by: { controlnetOrder: asc }) {
                initImageId
                initGeneratedImageId
                imageGuidanceStrengthType
                weightApplied
                controlnet_preprocessor_matrix {
                    id
                }
            }
        }
    }
`;

export const GetGenerationPresetDocument = gql`
    query GetGenerationPreset($generationId: uuid!) {
        generations_by_pk(id: $generationId) {
            id
            generation_presets_useds {
                id
                originalPrompt
                presetId
            }
        }
    }
`;

// ============================================================================
// Image Detail Fragments
// ============================================================================

export const RemixImagePartsFragment = gql`
    fragment RemixImageParts on generated_images {
        id
        generation {
            alchemy
            generation_elements {
                id
                lora {
                    akUUID
                }
                weightApplied
            }
            generation_presets_useds {
                id
                originalPrompt
                presetId
            }
            guidanceScale
            highResolution
            id
            imageHeight
            imageWidth
            modelId
            negativePrompt
            photoReal
            photoRealVersion
            prompt
            promptMagic
            sdVersion
            styleUUID
            tiling
            transparency
            ultra
        }
    }
`;

export const ImageUpscalerPartsFragment = gql`
    fragment ImageUpscalerParts on generated_images {
        id
        url
        userId
        image_width
        image_height
        generation {
            alchemy
            ultra
            id
            imageHeight
            imageWidth
            sdVersion
        }
    }
`;

export const GenerationElementsFragment = gql`
    fragment GenerationElements on generations {
        generation_elements {
            id
            lora {
                akUUID
                name
                description
                urlImage
                baseModel
                weightDefault
                weightMin
                weightMax
                elementType
            }
            user_lora {
                id
                name
                urlImage
                dataset {
                    id
                    name
                    dataset_images(limit: 1) {
                        url
                    }
                }
            }
            weightApplied
        }
    }
`;

// ============================================================================
// Image Detail Query
// ============================================================================

export const GetImageDetailsDocument = gql`
    query GetImageDetails($id: uuid!) {
        generated_images_by_pk(id: $id) {
            ...RemixImageParts
            ...ImageUpscalerParts
            id
            url
            createdAt
            public
            user {
                id
                username
            }
            teamId
            motionMP4URL
            motionGIFURL
            nsfw
            image_width
            image_height
            generated_image_moderation {
                generatedImageId
                moderationClassification
            }
            generation {
                contrastRatio
                highResolution
                imageToImage
                coreModel
                inferenceSteps
                seed
                scheduler
                highContrast
                promptMagic
                promptMagicVersion
                imagePromptStrength
                promptMagicStrength
                photoRealStrength
                photoRealVersion
                initStrength
                imageToImage
                imageToVideo
                motion
                motionModel
                motionGenerationResolution
                presetStyle
                source
                nsfw
                id
                ultra
                quantity
                initGeneratedImageId
                controlnetsUsed
                public
                init_image {
                    id
                }
                generated_images {
                    id
                }
                prompt_moderations {
                    moderationClassification
                }
                custom_model {
                    id
                    userId
                    name
                    userId
                    modelHeight
                    modelWidth
                    __typename
                }
                ...GenerationElements
                generation_controlnets(order_by: { controlnetOrder: asc }) {
                    id
                    weightApplied
                    imageGuidanceStrengthType
                    controlnet_definition {
                        akUUID
                        displayName
                        displayDescription
                        controlnetType
                    }
                    controlnet_preprocessor_matrix {
                        id
                        preprocessorName
                    }
                }
                generation_presets_useds {
                    originalPrompt
                }
                generation_context_images {
                    id
                }
                generation_feedbacks {
                    feedbackType
                    generationId
                    id
                    isPositive
                    generation_feedback_reasons {
                        reasonId
                    }
                }
            }
            generated_image_variation_generics(order_by: [{ createdAt: desc }]) {
                url
                id
                status
                transformType
                upscale_details {
                    id
                    alchemyRefinerCreative
                    alchemyRefinerStrength
                    creativityStrength
                    oneClicktype
                    upscaleMultiplier
                    width
                    height
                    optional_metadata(path: "upscalerStyle")
                }
                __typename
            }
        }
    }
    ${RemixImagePartsFragment}
    ${ImageUpscalerPartsFragment}
    ${GenerationElementsFragment}
`;
