/**
 * Blueprint & Collection Fragments
 *
 * GraphQL fragments for blueprints and collections.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Blueprint Fragments
// ============================================================================

export const BlueprintLikesFragment = gql`
    fragment BlueprintLikes on Blueprint {
        likes @client
        liked @client
    }
`;

export const BlueprintLoadedFragment = gql`
    fragment BlueprintLoaded on Blueprint {
        akUUID
    }
`;

export const BlueprintSlugFragment = gql`
    fragment BlueprintSlug on Blueprint {
        slug @client
    }
`;

// ============================================================================
// Collection Fragments
// ============================================================================

export const CollectionThumbnailFragment = gql`
    fragment CollectionThumbnail on collection {
        collection_images(limit: 4) {
            id
            collectionId
            generatedImageId
            generated_image {
                id
                url
            }
        }
    }
`;

// ============================================================================
// Blueprint Execution Fragments
// ============================================================================

export const BlueprintExecutionsGenerationFragment = gql`
    fragment BlueprintExecutionsGeneration on generations {
        blueprintExecution @client {
            akUUID
            blueprintVersion {
                blueprint {
                    akUUID
                    description
                    name
                }
            }
            inputs
            status
            public
            user {
                id
                username
            }
        }
        failedReason @client {
            message
            type
        }
        id
        imageWidth
        imageHeight
        modelId
        sdVersion
        custom_model {
            id
            userId
            name
            sdVersion
        }
        nsfw
        prompt
        negativePrompt
        imagePromptStrength
        public
        transparency
        user {
            id
            username
        }
        createdAt
        motion
        notes {
            id
            notePayload
            noteType
        }
        source
        generated_images(order_by: [{ url: desc }]) {
            slug @client
            collection_images {
                collectionId
                id
                generatedImageId
            }
            createdAt
            generationId
            id
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
            generated_image_moderation {
                generatedImageId
                moderationClassification
            }
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
            __typename
        }
        quantity
        status
    }
`;
