/**
 * Collection Mutations
 *
 * GraphQL mutations for collection operations.
 */

import { gql, TypedDocumentNode } from '@apollo/client';

// ============================================================================
// Types
// ============================================================================

export interface CreateCollectionData {
    createCollection: {
        id: number;
        akUUID: string;
        teamId?: number | null;
        collectionName: string;
        createdAt: string;
    };
}

export interface CreateCollectionVariables {
    arg1: {
        collectionName: string;
        teamId?: number;
    };
}

export interface CollectionImageInput {
    collectionId: number;
    generatedImageId: string;
}

export interface CreateCollectionImagesData {
    insert_collection_image: {
        affected_rows: number;
        returning: Array<{
            id: number;
            collectionId: number;
            generatedImageId: string;
            generated_image: {
                id: string;
                url: string;
            };
        }>;
    };
}

export interface CreateCollectionImagesVariables {
    objects: CollectionImageInput[];
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new collection
 */
export const CreateCollectionDocument: TypedDocumentNode<
    CreateCollectionData,
    CreateCollectionVariables
> = gql`
    mutation CreateCollection($arg1: CreateCollectionInput!) {
        createCollection(arg1: $arg1) {
            id
            akUUID
            teamId
            collectionName
            createdAt
        }
    }
`;

/**
 * Add images to a collection
 */
export const CreateCollectionImagesDocument: TypedDocumentNode<
    CreateCollectionImagesData,
    CreateCollectionImagesVariables
> = gql`
    mutation CreateCollectionImages($objects: [collection_image_insert_input!]!) {
        insert_collection_image(objects: $objects) {
            affected_rows
            returning {
                id
                collectionId
                generatedImageId
                generated_image {
                    id
                    url
                }
            }
        }
    }
`;

/**
 * Delete collection images
 */
export const DeleteCollectionImagesDocument = gql`
    mutation DeleteCollectionImages($where: collection_image_bool_exp!) {
        delete_collection_image(where: $where) {
            affected_rows
        }
    }
`;

/**
 * Update collection
 */
export const UpdateCollectionDocument = gql`
    mutation UpdateCollection($id: Int!, $set: collection_set_input!) {
        update_collection_by_pk(pk_columns: { id: $id }, _set: $set) {
            id
            collectionName
        }
    }
`;

/**
 * Set collection sharing permissions
 */
export const SetCollectionSharingDocument = gql`
    mutation SetCollectionSharing($input: SetCollectionSharingInput!) {
        setCollectionSharing(input: $input) {
            collectionMembers {
                collectionId
                email
                permission
                inTeam
                userId
                isInherited
                username
                sharedAt
            }
            collectionTeams {
                collectionId
                teamId
                permission
                teamName
                isInherited
                numMembers
                teamLogoUrl
            }
        }
    }
`;

/**
 * Update collection name
 */
export const UpdateCollectionNameDocument = gql`
    mutation UpdateCollectionName($id: bigint!, $collectionName: String) {
        update_collection_by_pk(
            pk_columns: { id: $id }
            _set: { collectionName: $collectionName }
        ) {
            akUUID
            collectionName
            createdAt
            id
        }
    }
`;

/**
 * Batch update collections
 */
export const UpdateCollectionsDocument = gql`
    mutation UpdateCollections($arg1: UpdateCollectionsInput!) {
        updateCollections(arg1: $arg1) {
            count
        }
    }
`;

/**
 * Update custom model
 */
export const UpdateCustomModelDocument = gql`
    mutation UpdateCustomModel(
        $pk_columns: custom_models_pk_columns_input!
        $_set: custom_models_set_input
    ) {
        update_custom_models_by_pk(pk_columns: $pk_columns, _set: $_set) {
            id
            name
            description
            nsfw
            type
            generated_image {
                id
                url
            }
        }
    }
`;
