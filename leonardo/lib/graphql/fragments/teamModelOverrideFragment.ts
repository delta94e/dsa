/**
 * Team Model Override Fragment
 *
 * Shared fragment for team model override data.
 */

import { gql } from "@apollo/client";

export const TEAM_MODEL_OVERRIDE_FRAGMENT = gql`
  fragment TeamModelOverrideFragment on team_model_overrides {
    teamId
    modelIdentifier
    isEnabled
    createdAt
    updatedByUser {
      id
      username
    }
  }
`;
