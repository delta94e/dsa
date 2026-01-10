/**
 * Upsert Team Model Override Mutation
 *
 * Creates or updates a model override for a team.
 */

import { gql } from "@apollo/client";
import { TEAM_MODEL_OVERRIDE_FRAGMENT } from "../fragments/teamModelOverrideFragment";
import type { TeamModelOverrideData } from "../queries/getTeamModelOverrides";

export const UPSERT_TEAM_MODEL_OVERRIDE = gql`
  ${TEAM_MODEL_OVERRIDE_FRAGMENT}
  mutation UpsertTeamModelOverride($object: team_model_overrides_insert_input!) {
    insert_team_model_overrides_one(
      object: $object
      on_conflict: {
        constraint: team_model_overrides_pkey
        update_columns: [isEnabled]
      }
    ) {
      ...TeamModelOverrideFragment
    }
  }
`;

export interface UpsertTeamModelOverrideVariables {
  object: {
    teamId: string;
    modelIdentifier: string;
    isEnabled: boolean;
  };
}

export interface UpsertTeamModelOverrideData {
  insert_team_model_overrides_one: TeamModelOverrideData;
}
