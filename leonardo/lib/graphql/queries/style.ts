/**
 * Style Queries
 *
 * GraphQL queries for generation styles.
 */

import { gql } from '@apollo/client';

/**
 * Get styles with filtering and pagination
 */
export const GetStylesDocument = gql`
    query GetStyles(
        $where: style_bool_exp
        $limit: Int
        $offset: Int
        $order_by: [style_order_by!]
    ) {
        style(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $order_by
        ) {
            aesthetics
            akUUID
            createdAt
            creatorUserId
            description
            id
            isPublic
            name
            ownerType
            teamId
            thumbnailURL
        }
    }
`;
