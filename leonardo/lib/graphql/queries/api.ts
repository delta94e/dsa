import { gql } from '@apollo/client';

export const GetApiKeysDocument = gql`
  query GetApiKeys($where: api_keys_bool_exp) {
    api_keys(where: $where) {
      id
      name
      createdAt
      webhookCallbackUrl
    }
  }
`;
