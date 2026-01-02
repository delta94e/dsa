import { gql } from '@apollo/client';

/**
 * Asset Queries
 *
 * GraphQL queries for asset details and management.
 */

// Import fragments
import {
    GeneratedImageCreatedAtFragment,
    GeneratedImageDimensionsFragment,
    GeneratedImageGenerationIdFragment,
    GeneratedImageIdentifierFragment,
    GeneratedImageLikeCountFragment,
    GeneratedImageMediaFragment,
    GeneratedImageNsfwFragment,
    GeneratedImagePathFragment,
    GeneratedImageUserFragment,
    GenerationImagesLikedByViewerFragment,
    GenerationPrivacyFragment,
    GeneratedImageGenerationSourceFragment,
    GeneratedImageOwnershipFragment,
} from '../fragments/image';

import { AssetGenerationFragment } from '../fragments/composite';

import { GenerationModelIdFragment } from '../fragments/generation';

import {
    GeneratedImageVariationsFragment,
    GeneratedImageVariationMotionsFragment,
} from '../fragments/variation';

export const GetAssetDetailsByIdDocument = gql`
    query GetAssetDetailsById($id: uuid!, $isLoggedIn: Boolean = false) {
        generated_images_by_pk(id: $id) {
            slug @client
            ...GeneratedImageCreatedAt
            ...GeneratedImageDimensions
            ...GeneratedImageGenerationId
            ...GeneratedImageIdentifier
            ...GeneratedImageLikeCount
            ...GeneratedImageMedia
            ...GeneratedImageNsfw
            ...GeneratedImagePath
            ...GeneratedImageUser
            ...GenerationImagesLikedByViewer
            ...GenerationPrivacy
            ...GeneratedImageGenerationSource
            generation {
                ...AssetGeneration
                ...GenerationModelId
                generated_images {
                    id
                }
            }
            ...GeneratedImageVariations
            ...GeneratedImageVariationMotions
            ...GeneratedImageOwnership
        }
    }
    ${GeneratedImageCreatedAtFragment}
    ${GeneratedImageDimensionsFragment}
    ${GeneratedImageGenerationIdFragment}
    ${GeneratedImageIdentifierFragment}
    ${GeneratedImageLikeCountFragment}
    ${GeneratedImageMediaFragment}
    ${GeneratedImageNsfwFragment}
    ${GeneratedImagePathFragment}
    ${GeneratedImageUserFragment}
    ${GenerationImagesLikedByViewerFragment}
    ${GenerationPrivacyFragment}
    ${GeneratedImageGenerationSourceFragment}
    ${AssetGenerationFragment}
    ${GenerationModelIdFragment}
    ${GeneratedImageVariationsFragment}
    ${GeneratedImageVariationMotionsFragment}
    ${GeneratedImageOwnershipFragment}
`;

export const PollAssetVariationsStatusesDocument = gql`
    query PollAssetVariationsStatuses($id: uuid!) {
        generated_images_by_pk(id: $id) {
            ...GeneratedImageVariations
            ...GeneratedImageVariationMotions
        }
    }
    ${GeneratedImageVariationsFragment}
    ${GeneratedImageVariationMotionsFragment}
`;
