import { gql } from '@apollo/client';

/**
 * Element Queries
 *
 * GraphQL queries for loras/elements (style and character elements).
 */

export const GetElementMetaByIdDocument = gql`
    query GetElementMetaById($where: loras_bool_exp) {
        loras(where: $where) {
            akUUID
            name
            description
            urlImage
            baseModel
            weightDefault
            weightMin
            weightMax
            elementType
        }
    }
`;

export const GetElementMetaByTypeDocument = gql`
    query GetElementMetaByType($where: loras_bool_exp) {
        loras(where: $where) {
            akUUID
            name
            description
            urlImage
            baseModel
            weightDefault
            weightMin
            weightMax
        }
    }
`;

export const GetElementsForModalDocument = gql`
    query GetElementsForModal(
        $offset: Int
        $limit: Int
        $where: loras_bool_exp
    ) {
        loras(
            offset: $offset
            limit: $limit
            where: $where
            order_by: [{ createdAt: desc }]
        ) {
            akUUID
            baseModel
            creatorName
            description
            name
            urlImage
            weightDefault
            weightMax
            weightMin
            videoUrl
        }
    }
`;

// ============================================================================
// Video Elements
// ============================================================================

export const GetVideoElementsDocument = gql`
    query GetVideoElements(
        $where: loras_bool_exp
        $orderBy: [loras_order_by!]
    ) {
        loras(where: $where, order_by: $orderBy) {
            akUUID
            elementType
            name
            urlImage
            videoUrl
            weightDefault
        }
    }
`;

