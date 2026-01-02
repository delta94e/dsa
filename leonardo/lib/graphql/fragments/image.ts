/**
 * Generated Image Fragments
 *
 * GraphQL fragments for generated images.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Image Identifiers & Paths
// ============================================================================

export const GeneratedImageIdentifierFragment = gql`
    fragment GeneratedImageIdentifier on generated_images {
        id
    }
`;

export const GeneratedImagePathFragment = gql`
    fragment GeneratedImagePath on generated_images {
        url
        motionMP4URL
        motionGIFURL
    }
`;

export const GeneratedImageSlugFragment = gql`
    fragment GeneratedImageSlug on generated_images {
        slug
    }
`;

export const GeneratedImageDimensionsFragment = gql`
    fragment GeneratedImageDimensions on generated_images {
        image_width
        image_height
    }
`;

// ============================================================================
// Image Properties
// ============================================================================

export const GeneratedImageGenerationIdFragment = gql`
    fragment GeneratedImageGenerationId on generated_images {
        generationId
    }
`;

export const GeneratedImageUserFragment = gql`
    fragment GeneratedImageUser on generated_images {
        user {
            id
            username
        }
    }
`;

export const GeneratedImageOwnershipFragment = gql`
    fragment GeneratedImageOwnership on generated_images {
        userId
        teamId
        public
        nsfw
    }
`;

export const GeneratedImageLikeCountFragment = gql`
    fragment GeneratedImageLikeCount on generated_images {
        likeCount
    }
`;

export const GeneratedImageCreatedAtFragment = gql`
    fragment GeneratedImageCreatedAt on generated_images {
        createdAt
    }
`;

export const GeneratedImageNsfwFragment = gql`
    fragment GeneratedImageNsfw on generated_images {
        nsfw
    }
`;

export const GenerationPrivacyFragment = gql`
    fragment GenerationPrivacy on generated_images {
        public
    }
`;

export const GeneratedImageModerationFragment = gql`
    fragment GeneratedImageModeration on generated_images {
        generated_image_moderation {
            generatedImageId
            moderationClassification
        }
    }
`;

// ============================================================================
// Image with Generation Data
// ============================================================================

export const GeneratedImageMediaFragment = gql`
    fragment GeneratedImageMedia on generated_images {
        generation {
            id
            imageHeight
            imageWidth
            motion
            prompt
            motionGenerationResolution
        }
        id
        image_height
        image_width
        motionMP4URL
        public
        url
    }
`;

export const GeneratedImagesGenerationFragment = gql`
    fragment GeneratedImagesGeneration on generated_images {
        id
        generation {
            id
        }
    }
`;

export const GeneratedImageGenerationSourceFragment = gql`
    fragment GeneratedImageGenerationSource on generated_images {
        generation {
            source
        }
    }
`;

export const GeneratedImageGenerationTypeFragment = gql`
    fragment GeneratedImageGenerationType on generated_images {
        generation {
            motion
        }
    }
`;

export const GeneratedImageGenerationSdVersionFragment = gql`
    fragment GeneratedImageGenerationSdVersion on generated_images {
        generation {
            sdVersion
        }
    }
`;

export const GeneratedImageCreateVideoFragment = gql`
    fragment GeneratedImageCreateVideo on generated_images {
        id
        url
        image_width
        image_height
        generation {
            id
            imageWidth
            imageHeight
            prompt
            motion
        }
    }
`;

// ============================================================================
// Likes & Interactions
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

// ============================================================================
// Remix & Upscale
// ============================================================================

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

// ============================================================================
// Selectable & Cache
// ============================================================================

export const HasSelectableImageInCacheFragment = gql`
    fragment HasSelectableImageInCache on generated_images {
        id
    }
`;

export const SelectableImageFragment = gql`
    fragment SelectableImage on generated_images {
        id
        isPublic: public
        teamId
        userId
        url
        motionMp4Url: motionMP4URL
        motionGifUrl: motionGIFURL
        collection_images {
            id
            collectionId
            generatedImageId
        }
    }
`;
