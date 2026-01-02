/**
 * ControlNet & References Fragments
 *
 * GraphQL fragments for controlnet, lora, and generation references.
 */

import { gql } from '@apollo/client';

// ============================================================================
// ControlNet Fragments
// ============================================================================

export const GetControlnetModelFragment = gql`
    fragment GetControlnetModel on controlnet_preprocessor_matrix {
        preprocessorBaseModel
        preprocessorName
        availableToPlan
    }
`;

// ============================================================================
// Lora / Element Fragments
// ============================================================================

export const GetElementModelFragment = gql`
    fragment GetElementModel on loras {
        baseModel
    }
`;

export const GetLoraDetailsFragment = gql`
    fragment GetLoraDetails on loras {
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
`;

// ============================================================================
// Generation References Fragment
// ============================================================================

export const GenerationReferencesFragment = gql`
    fragment GenerationReferences on generations {
        id
        imageToVideo
        imageToImage
        status
        generation_controlnets(order_by: { controlnetOrder: asc }) {
            id
            imageGuidanceStrengthType
            initImageId
            initGeneratedImageId
            influence
            weightApplied
            controlnet_definition {
                akUUID
                displayName
                displayDescription
                controlnetType
            }
            generated_image {
                id
                url
            }
            init_image {
                id
                url
            }
            controlnet_preprocessor_matrix {
                id
                preprocessorName
                __typename
            }
        }
        controlnetsUsed
        generation_context_images {
            id
            initGeneratedImageId
            initImageId
            endGeneratedImageId
            endImageId
            __typename
        }
        generated_image {
            id
            url
        }
        init_image {
            id
            url
        }
        initGeneratedImageId
        imageToVideo
        initStrength
    }
`;

// ============================================================================
// Generation Context Images Fragment
// ============================================================================

export const GenerationContextImagesFragment = gql`
    fragment GenerationContextImages on generations {
        generation_context_images {
            id
            initGeneratedImageId
            initImageId
            endGeneratedImageId
            endImageId
            __typename
        }
    }
`;

// ============================================================================
// ControlNet Details Fragment
// ============================================================================

export const ControlNetDetailsFragment = gql`
    fragment ControlNetDetails on generation_controlnets {
        id
        imageGuidanceStrengthType
        initImageId
        initGeneratedImageId
        influence
        weightApplied
        controlnet_definition {
            akUUID
            displayName
            displayDescription
            controlnetType
        }
        generated_image {
            id
            url
        }
        init_image {
            id
            url
        }
        controlnet_preprocessor_matrix {
            id
            preprocessorName
            __typename
        }
    }
`;
