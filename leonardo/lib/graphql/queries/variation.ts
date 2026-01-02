/**
 * Variation Queries
 *
 * GraphQL queries for image variations.
 */

import { gql } from '@apollo/client';
import {
    RemixImagePartsFragment,
    ImageUpscalerPartsFragment,
} from './generation';

/**
 * Get AI image variation by primary key
 */
export const GetAiImageVariationByPkDocument = gql`
    query GetAiImageVariationByPk($id: uuid!) {
        generated_image_variation_generic_by_pk(id: $id) {
            id
            status
            transformType
            url
        }
    }
`;

/**
 * Get AI image variations poll (for status updates)
 */
export const GetAiImageVariationsPollDocument = gql`
    query GetAiImageVariationsPoll(
        $where: generated_image_variation_generic_bool_exp
        $motionWhere: generated_image_variation_motion_bool_exp
    ) {
        generated_image_variation_generic(where: $where) {
            status
            generatedImageId
            id
            url
            transformType
            upscale_details {
                id
                alchemyRefinerStrength
                alchemyRefinerCreative
                oneClicktype
                height
                width
            }
        }
        generated_image_variation_motion(where: $motionWhere) {
            akUUID
            id
            status
            generatedImageId
            mediaHeight
            mediaWidth
            motionTransformType
            resolution
            url
        }
    }
`;

/**
 * Get AI image variations for a specific generated image
 */
export const GetAiImageVariationsDocument = gql`
    query GetAiImageVariations($generatedImageId: uuid!) {
        generated_image_variation_generic(
            where: { generatedImageId: { _eq: $generatedImageId } }
        ) {
            id
            status
            url
            createdAt
            transformType
            upscale_details {
                id
                alchemyRefinerStrength
                alchemyRefinerCreative
                oneClicktype
                height
                width
            }
        }
        generated_image_variation_motion(
            where: { generatedImageId: { _eq: $generatedImageId } }
        ) {
            akUUID
            id
            generatedImageId
            mediaHeight
            mediaWidth
            motionTransformType
            resolution
            status
            tokenCost
            url
        }
    }
`;

// ============================================================================
// Motion Variation Queries
// ============================================================================

export const GetImageMotionVariationsDocument = gql`
    query GetImageMotionVariations($generatedImageId: uuid!) {
        generated_image_variation_motion(
            where: { generatedImageId: { _eq: $generatedImageId } }
        ) {
            id
            generatedImageId
            mediaHeight
            mediaWidth
            motionTransformType
            resolution
            status
            tokenCost
            url
        }
    }
`;

// ============================================================================
// Image Remix & Upscaler Queries
// ============================================================================
// Fragments imported from ./generation



export const GetImageRemixDocument = gql`
    query GetImageRemix($id: uuid!) {
        generated_images_by_pk(id: $id) {
            ...RemixImageParts
        }
    }
    ${RemixImagePartsFragment}
`;

export const GetImageUpscalerDocument = gql`
    query GetImageUpscaler($id: uuid!) {
        generated_images_by_pk(id: $id) {
            ...ImageUpscalerParts
        }
    }
    ${ImageUpscalerPartsFragment}
`;

// ============================================================================
// Upscale Details Fragment & Queries
// ============================================================================

// Local fragment for UpscaleDetails (not exported to avoid conflict with feed.ts)
const VariationGenerationResolutionDetailsFragment = gql`
    fragment VariationGenerationResolutionDetails on generations {
        imageWidth
        imageHeight
        alchemy
        highResolution
        photoReal
        sdVersion
        photoRealVersion
    }
`;

export const UpscaleDetailsFragment = gql`
    fragment UpscaleDetails on generated_image_variation_generic {
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
                ...VariationGenerationResolutionDetails
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
    ${VariationGenerationResolutionDetailsFragment}
`;

export const GetImageVariationByFkDocument = gql`
    query GetImageVariationByFk($id: uuid!) {
        generated_image_variation_generic_by_pk(id: $id) {
            ...UpscaleDetails
        }
    }
    ${UpscaleDetailsFragment}
`;

export const GetImageVariationGenericDocument = gql`
    query GetImageVariationGeneric(
        $where: generated_image_variation_generic_bool_exp
        $order_by: [generated_image_variation_generic_order_by!]
        $limit: Int
        $offset: Int
    ) {
        generated_image_variation_generic(
            where: $where
            order_by: $order_by
            limit: $limit
            offset: $offset
        ) {
            ...UpscaleDetails
        }
    }
    ${UpscaleDetailsFragment}
`;

// ============================================================================
// Image Aggregate & Init Image Queries
// ============================================================================

export const GetImagesAggregateDocument = gql`
    query GetImagesAggregate($generationId: uuid!) {
        generated_images_aggregate(
            where: { generationId: { _eq: $generationId } }
        ) {
            aggregate {
                count
            }
        }
    }
`;

export const GetInitImageModerationDocument = gql`
    query GetInitImageModeration($akUUID: uuid!) {
        init_image_moderation(where: { akUUID: { _eq: $akUUID } }) {
            akUUID
            initImageId
            checkStatus
        }
    }
`;

export const GetInitImageSourceDocument = gql`
    query GetInitImageSource($initImageId: uuid!) {
        init_images_by_pk(id: $initImageId) {
            id
            url
        }
    }
`;

export const GetInitImageSourcesDocument = gql`
    query GetInitImageSources($ids: [uuid!]!) {
        init_images(where: { id: { _in: $ids } }) {
            id
            url
            __typename
        }
    }
`;

export const GetViewerUploadsDocument = gql`
    query GetViewerUploads(
        $where: init_images_bool_exp
        $limit: Int
        $offset: Int
    ) {
        init_images(
            where: $where
            order_by: [{ createdAt: desc }]
            limit: $limit
            offset: $offset
        ) {
            id
            url
            createdAt
            generations {
                imageWidth
                imageHeight
            }
        }
    }
`;

// ============================================================================
// Image Variations for Generated Image
// ============================================================================

import { GenerationResolutionDetailsFragment } from './feed';

export const GetVariationsForGenerationImageDocument = gql`
    query GetVariationsForGenerationImage(
        $generationImageId: uuid!
        $variationWhere: generated_image_variation_generic_bool_exp
    ) {
        generated_images_by_pk(id: $generationImageId) {
            id
            image_width
            image_height
            generation {
                id
                ...GenerationResolutionDetails
            }
            generated_image_variation_generics(
                order_by: [{ createdAt: desc }]
                where: $variationWhere
            ) {
                id
                status
                url
                createdAt
                transformType
                upscale_details {
                    id
                    variationId
                    alchemyRefinerStrength
                    alchemyRefinerCreative
                    oneClicktype
                    isOneClick
                    width
                    height
                }
                image_width
                image_height
            }
        }
    }
    ${GenerationResolutionDetailsFragment}
`;

// ============================================================================
// Video Remix
// ============================================================================

export const RemixVideoPartsFragment = gql`
    fragment RemixVideoParts on generated_images {
        id
        generation {
            generation_elements {
                id
                lora {
                    akUUID
                    name
                    urlImage
                    elementType
                }
                weightApplied
            }
            highResolution
            id
            imageHeight
            imageWidth
            motion
            motionModel
            motionStrength
            negativePrompt
            motionDurationSeconds
            prompt
            styles {
                styleUUID
            }
        }
    }
`;

export const GetVideoRemixDocument = gql`
    query GetVideoRemix($id: uuid!) {
        generated_images_by_pk(id: $id) {
            id
            ...RemixVideoParts
        }
    }
    ${RemixVideoPartsFragment}
`;
