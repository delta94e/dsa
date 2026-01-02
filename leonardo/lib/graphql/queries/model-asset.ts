/**
 * 3D Model Asset Queries
 *
 * GraphQL queries for 3D model assets and textures.
 */

import { gql } from '@apollo/client';

/**
 * Get 3D model asset by primary key with texture generations
 */
export const GetObjectByPkDocument = gql`
    query GetObjectByPk($id: uuid!) {
        model_assets_by_pk(id: $id) {
            id
            meshUrl
            thumbnailUrl
            name
            updatedAt
            userId
            createdAt
            model_asset_texture_generations(order_by: { createdAt: desc }) {
                id
                createdAt
                prompt
                status
                negativePrompt
                seed
                model_asset_texture_images {
                    id
                    type
                    url
                }
            }
        }
    }
`;

/**
 * Get 3D model assets list with pagination
 */
export const GetObjectsDocument = gql`
    query GetObjects(
        $where: model_assets_bool_exp
        $offset: Int
        $limit: Int
        $order_by: [model_assets_order_by!] = [{ createdAt: desc }]
    ) {
        model_assets(
            where: $where
            offset: $offset
            limit: $limit
            order_by: $order_by
        ) {
            id
            meshUrl
            createdAt
            name
            thumbnailUrl
            updatedAt
            teamId
            userId
        }
    }
`;
