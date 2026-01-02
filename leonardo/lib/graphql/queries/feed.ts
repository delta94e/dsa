import { gql } from '@apollo/client';
import {
    GeneratedImageModerationFragment,
    GeneratedImageMediaFragment,
} from '../fragments/image';
import { GenerationModelIdFragment } from '../fragments/generation';

/**
 * Feed Queries
 *
 * GraphQL queries for feed images and public feeds.
 */

// ============================================================================
// Feed Fragments
// ============================================================================

export const GenerationResolutionDetailsFragment = gql`
    fragment GenerationResolutionDetails on generations {
        imageWidth
        imageHeight
        alchemy
        highResolution
        photoReal
        sdVersion
        photoRealVersion
    }
`;

export const ImageRemixEligibilityFragment = gql`
    fragment ImageRemixEligibility on generated_images {
        id
        generation {
            id
            photoReal
            modelId
            motion
            sdVersion
            custom_model {
                id
                sdVersion
            }
        }
    }
`;

export const FeedPartsPublicFragment = gql`
    fragment FeedPartsPublic on generated_images {
        createdAt
        trendingScore
        likeCount
        id
        url
        nsfw
        image_height
        image_width
        motionMP4URL
        motionGIFURL
        public
        userId
        teamId
        ...GeneratedImageMedia
        ...GeneratedImageModeration
        ...ImageRemixEligibility
        user {
            username
            id
            __typename
        }
        generation {
            ...GenerationModelId
            id
            alchemy
            contrastRatio
            highResolution
            prompt
            negativePrompt
            imageWidth
            imageHeight
            sdVersion
            modelId
            coreModel
            guidanceScale
            inferenceSteps
            seed
            scheduler
            source
            tiling
            highContrast
            promptMagic
            promptMagicVersion
            imagePromptStrength
            prompt_moderations {
                moderationClassification
            }
            custom_model {
                id
                name
                userId
                modelHeight
                modelWidth
                __typename
            }
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
                }
                weightApplied
            }
            generation_controlnets(order_by: { controlnetOrder: asc }) {
                id
                weightApplied
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
            initStrength
            category
            public
            teamId
            nsfw
            photoReal
            imageToImage
            __typename
        }
        generationId
        generated_image_variation_generics(order_by: [{ createdAt: desc }]) {
            url
            id
            status
            transformType
            createdAt
            upscale_details {
                id
                alchemyRefinerCreative
                alchemyRefinerStrength
                oneClicktype
            }
            __typename
        }
        likeCount
        __typename
    }
    ${GeneratedImageMediaFragment}
    ${GeneratedImageModerationFragment}
    ${ImageRemixEligibilityFragment}
    ${GenerationModelIdFragment}
`;

// ============================================================================
// Feed Queries
// ============================================================================

export const GetEmailShareRateLimitDocument = gql`
    query GetEmailShareRateLimit {
        getEmailShareRateLimit {
            isLimited
            resetsAt
        }
    }
`;

export const GetFeedImagesForSelectModalDocument = gql`
    query GetFeedImagesForSelectModal(
        $where: generated_images_bool_exp
        $limit: Int
        $order_by: [generated_images_order_by!] = [{ createdAt: desc }]
        $cursor: String
        $infinite: Boolean
    ) {
        generated_images(where: $where, limit: $limit, order_by: $order_by) {
            createdAt
            id
            url
            motionMP4URL
            motionGIFURL
            user {
                id
                username
                __typename
            }
            image_width
            image_height
            generation {
                id
                prompt
                ...GenerationResolutionDetails
                __typename
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
                    oneClicktype
                    height
                    width
                }
                __typename
            }
            likeCount
            __typename
        }
    }
    ${GenerationResolutionDetailsFragment}
`;

export const GetFeedImagesPublicDocument = gql`
    query GetFeedImagesPublic(
        $where: generated_images_bool_exp
        $limit: Int
        $order_by: [generated_images_order_by!] = [{ createdAt: desc }]
        $offset: Int = 0
    ) @cached(ttl: 300) {
        generated_images(
            where: $where
            limit: $limit
            order_by: $order_by
            offset: $offset
        ) {
            slug @client
            ...FeedPartsPublic
        }
    }
    ${FeedPartsPublicFragment}
`;

// ============================================================================
// Authenticated Feed Fragments
// ============================================================================

export const GenerationImagesLikedByViewerFragment = gql`
    fragment GenerationImagesLikedByViewer on generated_images {
        user_liked_generated_images(limit: 1) {
            generatedImageId
            userId
            __typename
        }
        likeCount
    }
`;

export const GenerationPresetsUsedsFragment = gql`
    fragment GenerationPresetsUseds on generations {
        generation_presets_useds {
            id
            originalPrompt
            presetId
        }
    }
`;

export const GeneratedImageVariationUrlFragment = gql`
    fragment GeneratedImageVariationUrl on generated_image_variation_generic {
        url
    }
`;

export const GeneratedImageVariationFragment = gql`
    fragment GeneratedImageVariation on generated_image_variation_generic {
        createdAt
        id
        image_height
        image_width
        status
        transformType
        upscale_details {
            alchemyRefinerCreative
            alchemyRefinerStrength
            creativityStrength
            height
            id
            isOneClick
            oneClicktype
            optional_metadata(path: "upscalerStyle")
            upscaleMultiplier
            variationId
            width
        }
        ...GeneratedImageVariationUrl
        __typename
    }
    ${GeneratedImageVariationUrlFragment}
`;

export const GeneratedImageVariationsFragment = gql`
    fragment GeneratedImageVariations on generated_images {
        generated_image_variation_generics(order_by: [{ createdAt: desc }]) {
            ...GeneratedImageVariation
        }
    }
    ${GeneratedImageVariationFragment}
`;

export const FeedPartsFragment = gql`
    fragment FeedParts on generated_images {
        createdAt
        trendingScore
        likeCount
        id
        url
        nsfw
        image_height
        image_width
        motionMP4URL
        motionGIFURL
        public
        userId
        teamId
        ... @include(if: $isLoggedIn) {
            ...GenerationImagesLikedByViewer
        }
        ...GeneratedImageMedia
        ...GeneratedImageModeration
        ...ImageRemixEligibility
        user {
            username
            id
            __typename
        }
        generation {
            ...GenerationModelId
            id
            alchemy
            ultra
            contrastRatio
            highResolution
            prompt
            negativePrompt
            imageWidth
            imageHeight
            sdVersion
            modelId
            coreModel
            guidanceScale
            inferenceSteps
            seed
            scheduler
            source
            tiling
            highContrast
            promptMagic
            promptMagicVersion
            promptMagicStrength
            imagePromptStrength
            quantity
            prompt_moderations {
                moderationClassification
            }
            custom_model {
                id
                name
                userId
                modelHeight
                modelWidth
                sdVersion
                __typename
            }
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
                }
                weightApplied
            }
            generation_controlnets(order_by: { controlnetOrder: asc }) {
                id
                weightApplied
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
            ...GenerationPresetsUseds
            initStrength
            category
            public
            teamId
            nsfw
            photoReal
            photoRealVersion
            photoRealStrength
            imageToImage
            motion
            motionModel
            motionGenerationResolution
            motionDurationSeconds
            imageToVideo
            __typename
        }
        generationId
        collection_images {
            id
            collectionId
            generatedImageId
        }
        ...GeneratedImageVariations
        likeCount
        __typename
    }
    ${GenerationImagesLikedByViewerFragment}
    ${GeneratedImageMediaFragment}
    ${GeneratedImageModerationFragment}
    ${ImageRemixEligibilityFragment}
    ${GenerationModelIdFragment}
    ${GenerationPresetsUsedsFragment}
    ${GeneratedImageVariationsFragment}
`;

// ============================================================================
// Authenticated Feed Queries
// ============================================================================

export const GetFeedImagesDocument = gql`
    query GetFeedImages(
        $where: generated_images_bool_exp
        $limit: Int
        $userId: uuid
        $isLoggedIn: Boolean!
        $order_by: [generated_images_order_by!] = [{ createdAt: desc }]
        $cursor: String
        $infinite: Boolean
    ) {
        generated_images(where: $where, limit: $limit, order_by: $order_by) {
            slug @client
            ...FeedParts
        }
    }
    ${FeedPartsFragment}
`;

export const GetFeedImagesWithSearchDocument = gql`
    query GetFeedImagesWithSearch(
        $where: generated_images_bool_exp
        $limit: Int
        $userId: uuid
        $isLoggedIn: Boolean!
        $order_by: [generated_images_order_by!] = [{ createdAt: desc }]
        $cursor: String
        $infinite: Boolean
        $search: String
    ) {
        generated_images: search_generated_images(
            args: { prompt_search: $search }
            where: $where
            limit: $limit
            order_by: $order_by
        ) {
            slug @client
            ...FeedParts
        }
    }
    ${FeedPartsFragment}
`;

export const GetFeedModelsDocument = gql`
    query GetFeedModels(
        $order_by: [custom_models_order_by!] = [{ createdAt: desc }]
        $where: custom_models_bool_exp
        $generationsWhere: generations_bool_exp
        $userId: uuid!
        $limit: Int
        $offset: Int
    ) {
        custom_models(
            order_by: $order_by
            where: $where
            limit: $limit
            offset: $offset
        ) {
            id
            name
            description
            instancePrompt
            modelHeight
            modelWidth
            coreModel
            createdAt
            sdVersion
            type
            nsfw
            motion
            public
            trainingStrength
            user {
                id
                username
            }
            generated_image {
                url
                id
            }
            imageCount
            teamId
            user_favourite_custom_models(where: { userId: { _eq: $userId } }) {
                userId
            }
        }
    }
`;

