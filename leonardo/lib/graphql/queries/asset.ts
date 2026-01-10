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

export interface GetViewerUploadsVariables {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
}

export interface GetViewerUploadsData {
    init_images: {
        id: string;
        url: string;
        createdAt: string;
        generations: {
            imageWidth: number;
            imageHeight: number;
        }[];
    }[];
}
