/**
 * Miscellaneous Queries
 *
 * GraphQL queries for various utility and legal data.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Terms of Service
// ============================================================================

export const GetLatestTermsOfServiceDocument = gql`
    query GetLatestTermsOfService {
        terms_of_services(limit: 1, order_by: { publishedAt: desc }) {
            id
            summary
            tosHash
            publishedAt
        }
    }
`;

// ============================================================================
// Username Utilities
// ============================================================================

export const GetRandomUsernameDocument = gql`
    query GetRandomUsername($username: String = "") {
        getRandomUsername(
            getRandomUsernameInput: { username: $username, usernameCount: 4 }
        ) {
            usernames
        }
    }
`;

// ============================================================================
// Pose Detection
// ============================================================================

export const GetReposeDataPointsDocument = gql`
    query getReposeDataPoints($imageUrl: String!) {
        reposeDataPoints(imageUrl: $imageUrl) {
            keypoints {
                confidence
                type
                x
                y
                __typename
            }
            __typename
        }
    }
`;

// ============================================================================
// Schemas
// ============================================================================

export const GetSchemasDocument = gql`
    query GetSchemas @cached(ttl: 300) {
        schemas(where: { releasedVersionNumber: { _is_null: false } }) {
            __typename
            id
            releasedVersionNumber
            releasedVersionRef {
                __typename
                schemaData
                schemaId
                versionNumber
            }
        }
    }
`;

