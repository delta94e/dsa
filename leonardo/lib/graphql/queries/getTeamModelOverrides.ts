/**
 * Team Model Overrides GraphQL Query
 *
 * Fetches model overrides for a specific team.
 */

import { gql } from "@apollo/client";
import { TEAM_MODEL_OVERRIDE_FRAGMENT } from "../fragments/teamModelOverrideFragment";

export const GET_TEAM_MODEL_OVERRIDES = gql`
  ${TEAM_MODEL_OVERRIDE_FRAGMENT}
  query GetTeamModelOverrides($teamId: uuid!) {
    team_model_overrides(where: { teamId: { _eq: $teamId } }) {
      ...TeamModelOverrideFragment
    }
  }
`;

export interface GetTeamModelOverridesVariables {
  teamId: string;
}

export interface TeamModelOverrideData {
  __typename?: "team_model_overrides";
  teamId: string;
  modelIdentifier: string;
  isEnabled: boolean;
  createdAt: string;
  updatedByUser?: {
    __typename?: "users";
    id: string;
    username: string;
  };
}

export interface GetTeamModelOverridesData {
  team_model_overrides: TeamModelOverrideData[];
}
