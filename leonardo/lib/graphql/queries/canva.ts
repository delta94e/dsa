import { gql } from '@apollo/client';

/**
 * Canva Queries
 *
 * GraphQL queries for Canva integration.
 */

export const GetCanvaUserDetailsDocument = gql`
    query GetCanvaUserDetails($userId: String!) {
        getCanvaUserDetails(input: { userId: $userId }) {
            canvaBenefitLevel
            canvaBenefitPermitted
            createdAt
            notificationConfiguration
            updatedAt
        }
    }
`;
