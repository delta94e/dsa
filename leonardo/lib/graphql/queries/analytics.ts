import { gql } from '@apollo/client';

export const GetModelUsageTimelineDocument = gql`
  query GetModelUsageTimeline($input: UsageTimelineInput!) {
    getUsageTimeline(input: $input) {
      timePeriods {
        timestamp
        modelUsage {
          model {
            name
            thumbnailUrl
            type
          }
          credits
          generations
        }
        totalCredits
        totalGenerations
      }
    }
  }
`;
