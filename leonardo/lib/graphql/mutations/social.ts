/**
 * Social Mutations
 *
 * GraphQL mutations for likes, follows, and favorites.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Likes
// ============================================================================

export const CreateLikeImageDocument = gql`
    mutation CreateLikeImage($object: user_liked_generated_images_insert_input!) {
        insert_user_liked_generated_images_one(object: $object) {
            userId
            generatedImageId
        }
    }
`;

export const CreateLikeChangelogDocument = gql`
    mutation CreateLikeChangelog($object: user_liked_changelog_insert_input!) {
        insert_user_liked_changelog_one(object: $object) {
            changelogId
            userId
        }
    }
`;

// ============================================================================
// Follows
// ============================================================================

export const CreateFollowDocument = gql`
    mutation CreateFollow($object: follows_insert_input!) {
        insert_follows_one(object: $object) {
            followerId
        }
    }
`;

// ============================================================================
// Favorite Models
// ============================================================================

export const CreateFavouriteModelDocument = gql`
    mutation CreateFavouriteModel($object: user_favourite_custom_models_insert_input!) {
        insert_user_favourite_custom_models_one(object: $object) {
            userId
        }
    }
`;
