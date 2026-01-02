import { gql } from '@apollo/client';

/**
 * Changelog Queries
 *
 * GraphQL queries for changelog content, likes, and versions.
 */

export const GetChangelogContentDocument = gql`
    query GetChangelogContent(
        $where: changelog_content_bool_exp
        $limit: Int
        $offset: Int
        $order_by: [changelog_content_order_by!]
    ) {
        changelog_content(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $order_by
        ) {
            changes
            changelogId
            contentType
            createdAt
            imageUrls
            introCallToActionLink
            introCallToActionModal
            introCallToActionText
            introHeading
            introSubheading
            modifiedAt
            videoUrls
        }
    }
`;

export const GetChangelogLikesDocument = gql`
    query GetChangelogLikes($changelogId: bigint!) {
        user_liked_changelog_aggregate(
            where: { changelogId: { _eq: $changelogId } }
        ) {
            aggregate {
                count
            }
        }
    }
`;

export const GetChangelogVersionsDocument = gql`
    query GetChangelogVersions(
        $where: changelog_bool_exp
        $limit: Int
        $offset: Int
        $order_by: [changelog_order_by!]
    ) {
        changelog(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $order_by
        ) {
            createdAt
            id
            isActive
            releaseDate
            showModal
            userTarget
            version
        }
    }
`;
