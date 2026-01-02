/**
 * Auth Mutations
 *
 * GraphQL mutations for authentication and TOS operations.
 */

import { gql, TypedDocumentNode } from '@apollo/client';

// ============================================================================
// Types
// ============================================================================

export interface AcceptTOSData {
    acceptTOS: {
        acceptedAt: string;
        tosHash: string;
        userId: string;
    };
}

export interface AcceptTOSVariables {
    hash: string;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Accept Terms of Service
 */
export const AcceptTOSDocument: TypedDocumentNode<AcceptTOSData, AcceptTOSVariables> = gql`
    mutation AcceptTOS($hash: String!) {
        acceptTOS(hash: $hash) {
            acceptedAt
            tosHash
            userId
        }
    }
`;
