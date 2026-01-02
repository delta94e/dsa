/**
 * Composite Fragments
 *
 * Combined fragments that aggregate multiple smaller fragments for complete data fetching.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Video Upscale Fragments
// ============================================================================

export const VideoUpscaleActionFragment = gql`
    fragment VideoUpscaleAction on generated_images {
        id
        generation {
            id
            coreModel
            motion
            motionModel
            imageToVideo
            motionGenerationResolution
            motionDurationSeconds
            motionFrameInterpolation
            motionHasAudio
        }
    }
`;

// ============================================================================
// Model Resolution Fragments
// ============================================================================

export const GeneratedImageGenerationModelResolutionFragment = gql`
    fragment GeneratedImageGenerationModelResolution on generated_images {
        generation {
            imageWidth
            imageHeight
            modelId
            motion
            motionModel
            photoReal
            photoRealVersion
            custom_model {
                name
            }
            sdVersion
        }
        image_width
        image_height
    }
`;

// ============================================================================
// Generation Shared Specs (Composite)
// ============================================================================

export const GenerationSharedSpecsFragment = gql`
    fragment GenerationSharedSpecs on generations {
        id
        prompt
        negativePrompt
        imagePromptStrength
        user {
            id
            username
        }
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
        ultra
        alchemy
        photoReal
        photoRealVersion
        photoRealStrength
        promptMagic
        promptMagicVersion
        promptMagicStrength
        transparency
        seed
        scheduler
        initStrength
        imageToImage
        contrastRatio
        inferenceSteps
        generation_elements {
            id
            lora {
                akUUID
                name
                elementType
                urlImage
            }
            user_lora {
                id
                name
                urlImage
            }
            weightApplied
        }
        presetStyle
        styleUUID
        generation_presets_useds {
            id
            presetId
        }
        userId
        teamId
        quantity
        guidanceScale
        public
        tiling
        highContrast
        highResolution
        nsfw
    }
`;

// ============================================================================
// Generation Image Specs (Composite)
// ============================================================================

export const GenerationImageSpecsFragment = gql`
    fragment GenerationImageSpecs on generations {
        id
        prompt
        negativePrompt
        imagePromptStrength
        user {
            id
            username
        }
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
        ultra
        alchemy
        photoReal
        photoRealVersion
        photoRealStrength
        promptMagic
        promptMagicVersion
        promptMagicStrength
        transparency
        seed
        scheduler
        initStrength
        imageToImage
        contrastRatio
        inferenceSteps
        presetStyle
        styleUUID
        userId
        teamId
        quantity
        guidanceScale
        public
        tiling
        highContrast
        highResolution
        nsfw
    }
`;

// ============================================================================
// Generation Motion Specs (Composite)
// ============================================================================

export const GenerationMotionSpecsFragment = gql`
    fragment GenerationMotionSpecs on generations {
        id
        prompt
        negativePrompt
        imagePromptStrength
        user {
            id
            username
        }
        imageWidth
        imageHeight
        modelId
        sdVersion
        motion
        motionModel
        imageToVideo
        motionGenerationResolution
        motionDurationSeconds
        motionFrameInterpolation
        motionHasAudio
        ultra
        alchemy
        photoReal
        photoRealVersion
        transparency
        seed
        scheduler
        initStrength
        contrastRatio
        inferenceSteps
        presetStyle
        styleUUID
        userId
        teamId
        quantity
        guidanceScale
        public
        tiling
        highContrast
        highResolution
        nsfw
    }
`;

// ============================================================================
// Asset Generation (Full Composite)
// ============================================================================

export const AssetGenerationFragment = gql`
    fragment AssetGeneration on generations {
        id
        prompt
        negativePrompt
        imagePromptStrength
        user {
            id
            username
        }
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
        ultra
        alchemy
        photoReal
        photoRealVersion
        photoRealStrength
        promptMagic
        promptMagicVersion
        promptMagicStrength
        transparency
        seed
        scheduler
        initStrength
        imageToImage
        contrastRatio
        inferenceSteps
        generation_elements {
            id
            lora {
                akUUID
                name
                elementType
                urlImage
            }
            user_lora {
                id
                name
                urlImage
            }
            weightApplied
        }
        presetStyle
        styleUUID
        generation_presets_useds {
            id
            presetId
        }
        userId
        teamId
        quantity
        guidanceScale
        public
        tiling
        highContrast
        highResolution
        nsfw
        coreModel
        motion
        motionModel
        imageToVideo
        motionGenerationResolution
        motionDurationSeconds
        motionFrameInterpolation
        motionHasAudio
    }
`;

// ============================================================================
// Generated Image With Asset Generation
// ============================================================================

export const GeneratedImageWithAssetGenerationFragment = gql`
    fragment GeneratedImageWithAssetGeneration on generated_images {
        id
        generation {
            id
            prompt
            negativePrompt
            imagePromptStrength
            user {
                id
                username
            }
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
            ultra
            alchemy
            photoReal
            photoRealVersion
            photoRealStrength
            promptMagic
            promptMagicVersion
            promptMagicStrength
            transparency
            seed
            scheduler
            initStrength
            imageToImage
            contrastRatio
            inferenceSteps
            presetStyle
            styleUUID
            userId
            teamId
            quantity
            guidanceScale
            public
            tiling
            highContrast
            highResolution
            nsfw
            coreModel
            motion
            motionModel
            imageToVideo
            motionGenerationResolution
            motionDurationSeconds
            motionFrameInterpolation
            motionHasAudio
        }
    }
`;
