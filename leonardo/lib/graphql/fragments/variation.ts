/**
 * Variation Fragments
 *
 * GraphQL fragments for image variations (upscales, motion, etc.).
 */

import { gql } from '@apollo/client';

// ============================================================================
// Generic Variations
// ============================================================================

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
    ${gql`
        fragment GeneratedImageVariationUrl on generated_image_variation_generic {
            url
        }
    `}
`;

export const GeneratedImageVariationsFragment = gql`
    fragment GeneratedImageVariations on generated_images {
        generated_image_variation_generics(order_by: [{ createdAt: desc }]) {
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
            url
            __typename
        }
    }
`;

// ============================================================================
// Motion Variations
// ============================================================================

export const GeneratedImageVariationMotionUrlFragment = gql`
    fragment GeneratedImageVariationMotionUrl on generated_image_variation_motion {
        url
    }
`;

export const GeneratedImageVariationMotionFragment = gql`
    fragment GeneratedImageVariationMotion on generated_image_variation_motion {
        akUUID
        id
        generatedImageId
        mediaHeight
        mediaWidth
        motionTransformType
        resolution
        status
        tokenCost
        ...GeneratedImageVariationMotionUrl
        __typename
    }
    ${gql`
        fragment GeneratedImageVariationMotionUrl on generated_image_variation_motion {
            url
        }
    `}
`;

export const GeneratedImageVariationMotionsFragment = gql`
    fragment GeneratedImageVariationMotions on generated_images {
        generated_image_variation_motion {
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
            __typename
        }
    }
`;

// ============================================================================
// Upscale Drawer Item
// ============================================================================

export const UpscaleDrawerItemFragment = gql`
    fragment UpscaleDrawerItem on UniversalUpscalerDrawerItem {
        id
        alchemy
        alchemyRefinerCreative
        alchemyRefinerStrength
        createdAt
        creativityStrength
        width
        variationId
        variationUrl
        sourceUrl
        transformType
        upscaleMultiplier
        status
        sdVersion
        imageHeight
        imageWidth
        isOneClick
        oneClicktype
        optional_metadata
        photoReal
        photoRealVersion
        highResolution
        height
        generationId
        generatedImageId
    }
`;
