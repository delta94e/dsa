/**
 * Universal Upscaler Queries
 *
 * GraphQL queries for the universal upscaler feature.
 */

import { gql } from '@apollo/client';
import { UpscaleDetailsFragment } from './variation';

// ============================================================================
// Upscaler Drawer
// ============================================================================

export const GetUniversalUpscalerDrawerItemsDocument = gql`
    query GetUniversalUpscalerDrawerItems(
        $input: UniversalUpscalerDrawerInput!
    ) {
        getUniversalUpscalerDrawer(arg1: $input) {
            items {
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
        }
    }
`;

// ============================================================================
// Upscaler Generated Image
// ============================================================================

export const GetUniversalUpscalerGeneratedImageDocument = gql`
    query GetUniversalUpscalerGeneratedImage($id: uuid!) {
        generated_image_variation_generic_by_pk(id: $id) {
            ...UpscaleDetails
        }
    }
    ${UpscaleDetailsFragment}
`;

// ============================================================================
// Upscaler Styles
// ============================================================================

export const GetUniversalUpscalerStylesDocument = gql`
    query GetUniversalUpscalerStyles($arg1: UniversalUpscalerStylesInput) {
        universalUpscalerStyles: getListOfActiveUniversalUpscalerStyles(
            arg1: $arg1
        ) {
            styles
        }
    }
`;
