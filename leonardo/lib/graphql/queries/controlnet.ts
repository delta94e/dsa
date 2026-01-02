import { gql } from '@apollo/client';

/**
 * ControlNet Queries
 *
 * GraphQL queries for ControlNet preprocessors and definitions.
 */

export const GetControlNetPreprocessorsDocument = gql`
    query GetControlNetPreprocessors(
        $offset: Int
        $limit: Int
        $where: controlnet_definition_bool_exp
    ) {
        controlnet_definition(offset: $offset, limit: $limit, where: $where) {
            akUUID
            baseModel
            displayDescription
            weightMin
            weightMax
            weightDefault
            tokenCost
            thumbnailURL
            thumbnailResultURL
            controlnetType
            displayName
            preprocessors {
                id
                preprocessorName
                availableToPlan
                preprocessorBaseModel
            }
        }
    }
`;
