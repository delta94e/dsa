/**
 * Asset Fragments
 *
 * GraphQL fragments for asset sharing and generation data.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Asset Share Fragments
// ============================================================================

export const AssetShareDataFragment = gql`
    fragment AssetShareData on generated_images {
        id
        slug
        public
        nsfw
        teamId
        userId
    }
`;

export const AssetShareGenerationDataFragment = gql`
    fragment AssetShareGenerationData on generations {
        motion
        source
        imageToImage
        imageToVideo
    }
`;
