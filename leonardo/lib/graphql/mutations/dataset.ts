/**
 * Dataset Mutations
 *
 * GraphQL mutations for dataset and model training operations.
 */

import { gql, TypedDocumentNode } from '@apollo/client';

// ============================================================================
// Types
// ============================================================================

export interface CreateDatasetData {
    insert_datasets_one: {
        id: string;
    };
}

export interface CreateDatasetVariables {
    object: {
        name: string;
        description?: string;
    };
}

export interface UploadDatasetImageData {
    uploadDatasetImage: {
        id: string;
        fields: string;
        key: string;
        url: string;
    };
}

export interface UploadDatasetImageVariables {
    arg1: {
        datasetId: string;
        extension: string;
    };
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new dataset
 */
export const CreateDatasetDocument: TypedDocumentNode<
    CreateDatasetData,
    CreateDatasetVariables
> = gql`
    mutation CreateDataset($object: datasets_insert_input!) {
        insert_datasets_one(object: $object) {
            id
        }
    }
`;

/**
 * Upload dataset image (get presigned URL)
 */
export const CreateDatasetImageDocument: TypedDocumentNode<
    UploadDatasetImageData,
    UploadDatasetImageVariables
> = gql`
    mutation CreateDatasetImage($arg1: DatasetUploadInput!) {
        uploadDatasetImage(arg1: $arg1) {
            id
            fields
            key
            url
        }
    }
`;

/**
 * Update dataset
 */
export const UpdateDatasetDocument = gql`
    mutation UpdateDataset($id: uuid!, $set: datasets_set_input!) {
        update_datasets_by_pk(pk_columns: { id: $id }, _set: $set) {
            id
            name
            description
        }
    }
`;
