/**
 * Generation Fragments
 *
 * GraphQL fragments for generation-related data.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Generation Prompt & Settings
// ============================================================================

export const GenerationPromptFragment = gql`
    fragment GenerationPrompt on generations {
        prompt
        negativePrompt
        imagePromptStrength
    }
`;

export const GenerationTransparencyFragment = gql`
    fragment GenerationTransparency on generations {
        transparency
    }
`;

export const GenerationMotionFragment = gql`
    fragment GenerationMotion on generations {
        motion
        motionModel
        imageToVideo
        motionGenerationResolution
        motionDurationSeconds
        motionFrameInterpolation
        motionHasAudio
    }
`;

export const GenerationDimensionsFragment = gql`
    fragment GenerationDimensions on generations {
        imageWidth
        imageHeight
    }
`;

export const GenerationIdentifierFragment = gql`
    fragment GenerationIdentifier on generations {
        id
    }
`;

export const GenerationAuthorFragment = gql`
    fragment GenerationAuthor on generations {
        user {
            id
            username
        }
    }
`;

export const GenerationModelFragment = gql`
    fragment GenerationModel on generations {
        modelId
        sdVersion
        custom_model {
            id
            userId
            name
            sdVersion
        }
    }
`;

export const GenerationModelNameFragment = gql`
    fragment GenerationModelName on generations {
        custom_model {
            name
        }
        sdVersion
    }
`;

export const GenerationModelDetailsFragment = gql`
    fragment GenerationModelDetails on generations {
        modelId
        motion
        motionModel
        photoReal
        photoRealVersion
        ...GenerationModelName
    }
    ${gql`
        fragment GenerationModelName on generations {
            custom_model {
                name
            }
            sdVersion
        }
    `}
`;

export const GenerationQualityFragment = gql`
    fragment GenerationQuality on generations {
        ultra
        alchemy
        photoReal
        photoRealVersion
        photoRealStrength
        promptMagic
        promptMagicVersion
        promptMagicStrength
    }
`;

export const GenerationSeedFragment = gql`
    fragment GenerationSeed on generations {
        seed
    }
`;

export const GenerationSchedulerFragment = gql`
    fragment GenerationScheduler on generations {
        scheduler
    }
`;

export const GenerationImageToImageFragment = gql`
    fragment GenerationImageToImage on generations {
        initStrength
        imageToImage
    }
`;

export const GenerationContrastRatioFragment = gql`
    fragment GenerationContrastRatio on generations {
        contrastRatio
    }
`;

export const GenerationInferenceStepsFragment = gql`
    fragment GenerationInferenceSteps on generations {
        inferenceSteps
    }
`;

export const GenerationPresetFragment = gql`
    fragment GenerationPreset on generations {
        presetStyle
        styleUUID
        generation_presets_useds {
            id
            presetId
        }
    }
`;

export const GenerationOwnershipFragment = gql`
    fragment GenerationOwnership on generations {
        userId
        teamId
    }
`;

export const GenerationQuantityFragment = gql`
    fragment GenerationQuantity on generations {
        quantity
    }
`;

export const GenerationGuidanceScaleFragment = gql`
    fragment GenerationGuidanceScale on generations {
        guidanceScale
    }
`;

export const GenerationPublicFragment = gql`
    fragment GenerationPublic on generations {
        public
    }
`;

export const GenerationTilingFragment = gql`
    fragment GenerationTiling on generations {
        tiling
    }
`;

export const GenerationHighContrastFragment = gql`
    fragment GenerationHighContrast on generations {
        highContrast
    }
`;

export const GenerationHighResolutionFragment = gql`
    fragment GenerationHighResolution on generations {
        highResolution
    }
`;

export const GenerationNsfwFragment = gql`
    fragment GenerationNsfw on generations {
        nsfw
    }
`;

export const GenerationCoreModelFragment = gql`
    fragment GenerationCoreModel on generations {
        coreModel
    }
`;

export const GenerationModelIdFragment = gql`
    fragment GenerationModelId on generations {
        id
        modelId
        motionModel
    }
`;

export const GenerationElementsControlsFragment = gql`
    fragment GenerationElementsControls on generations {
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
    }
`;
