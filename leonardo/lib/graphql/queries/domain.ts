/**
 * Domain Queries
 *
 * GraphQL queries for domain management.
 */

import { gql } from '@apollo/client';

/**
 * Get add domain portal URL
 */
export const GetAddDomainPortalUrlDocument = gql`
    query GetAddDomainPortalUrl($input: GetAddDomainPortalUrlInput!) {
        getAddDomainPortalUrl(getAddDomainPortalUrlInput: $input) {
            portalUrl
        }
    }
`;

export const GetClaimedDomainsDocument = gql`
    query GetClaimedDomains($input: GetClaimedDomainsInput!) {
        getClaimedDomains(getClaimedDomainsInput: $input) {
            name
            verificationStatus
            activatedSSO
            txtRecord {
                host
                value
            }
        }
    }
`;

export const GetConfigureIdPPortalUrlDocument = gql`
    query GetConfigureIdPPortalUrl($input: GetConfigureIdPPortalUrlInput!) {
        getConfigureIdPPortalUrl(getConfigureIdPPortalUrlInput: $input) {
            portalUrl
        }
    }
`;

export const GetSSOConfigStatusDocument = gql`
    query GetSSOConfigStatus($input: GetSSOConfigStatusInput!) {
        getSSOConfigStatus(getSSOConfigStatusInput: $input) {
            teamId
            status
        }
    }
`;

