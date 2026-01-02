import { gql } from '@apollo/client';

export const GetAllDataSetsDocument = gql`
  query GetAllDataSets(
    $limit: Int
    $order_by: [datasets_order_by!]
    $where: datasets_bool_exp
  ) {
    datasets(limit: $limit, order_by: $order_by, where: $where) {
      id
      name
      description
      createdAt
      dataset_images {
        createdAt
        id
        url
        moderation_result
      }
    }
  }
`;

export const GetDatasetsDocument = gql`
    query GetDatasets($where: datasets_bool_exp) {
        datasets(where: $where) {
            name
            description
            team {
                akUUID
            }
            dataset_images(order_by: [{ createdAt: desc }]) {
                createdAt
                id
                url
                moderation_result
            }
        }
    }
`;
