/**
 * Preset Queries
 *
 * GraphQL queries for generation presets.
 */

import { gql } from '@apollo/client';

/**
 * Get presets with filtering and pagination
 */
export const GetPresetsDocument = gql`
    query GetPresets(
        $where: preset_bool_exp
        $limit: Int
        $offset: Int
        $order_by: [preset_order_by!]
    ) {
        preset(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $order_by
        ) {
            akUUID
            brandMappingImgURL
            createdAt
            creatorUserId
            description
            id
            isPremium
            isPublic
            isFeatured
            modelId
            name
            ownerType
            payload
            presetType
            teamId
            thumbnailURL
        }
    }
`;

// ============================================================================
// Video Preset
// ============================================================================

export const GetVideoPresetDocument = gql`
    query GetVideoPreset($where: preset_bool_exp) {
        preset(where: $where) {
            id
            payload
        }
    }
`;

