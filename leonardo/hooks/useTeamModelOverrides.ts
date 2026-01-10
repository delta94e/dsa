"use client";

/**
 * useTeamModelOverrides Hook
 *
 * Manages team-level model override settings.
 * Matches module 650566 from Leonardo.ai.
 */

import { useMemo, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useAppSelector } from "@/store/hooks";
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useFlags } from "@/hooks/useFlags";
import { useUser } from "@/hooks/useUser";
import {
  GET_TEAM_MODEL_OVERRIDES,
  type GetTeamModelOverridesData,
  type GetTeamModelOverridesVariables,
  type TeamModelOverrideData,
} from "@/lib/graphql/queries/getTeamModelOverrides";
import {
  UPSERT_TEAM_MODEL_OVERRIDE,
  type UpsertTeamModelOverrideVariables,
  type UpsertTeamModelOverrideData,
} from "@/lib/graphql/mutations/upsertTeamModelOverride";

export interface UseTeamModelOverridesResult {
  modelOverrides: TeamModelOverrideData[] | undefined;
  disabledModels: TeamModelOverrideData[];
  updateModelOverride: (
    teamId: string,
    modelIdentifier: string,
    isEnabled: boolean
  ) => Promise<any>;
  isModelDisabled: (modelId: string) => boolean;
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to manage team model overrides
 * @param teamIdOverride - Optional team ID to override the selected team
 */
export function useTeamModelOverrides(
  teamIdOverride?: string
): UseTeamModelOverridesResult {
  // Get selected team UUID from context
  const { selectedTeamUUID } = useSelectedTeam();

  // Get feature flag
  const { isTeamModelOverridesEnabled } = useFlags();

  // GraphQL mutation for upserting model overrides
  const [upsertMutation] = useMutation<
    UpsertTeamModelOverrideData,
    UpsertTeamModelOverrideVariables
  >(UPSERT_TEAM_MODEL_OVERRIDE);

  // Get user info
  const username = useAppSelector((state) => state.user.username);
  const { id: userId } = useUser();

  // Get model info map from Redux
  const modelInfoMap = useAppSelector(
    (state) => state.generation.modelInfo.modelInfoMap
  );

  // Determine which team ID to use
  const teamId = teamIdOverride || selectedTeamUUID || "";

  // GraphQL query for team model overrides
  const { data, loading, error } = useQuery<
    GetTeamModelOverridesData,
    GetTeamModelOverridesVariables
  >(GET_TEAM_MODEL_OVERRIDES, {
    variables: { teamId },
    skip: !teamId || !isTeamModelOverridesEnabled,
    fetchPolicy: "cache-and-network",
  });

  const modelOverrides = data?.team_model_overrides;

  // Filter to get disabled models only
  const disabledModels = useMemo(
    () => modelOverrides?.filter((override) => !override.isEnabled) || [],
    [modelOverrides]
  );

  /**
   * Check if a model is disabled for the current team
   */
  const isModelDisabled = useCallback(
    (modelId: string): boolean => {
      if (!isTeamModelOverridesEnabled || !teamId) {
        return false;
      }

      const modelInfo = modelInfoMap[modelId];
      const identifier = modelInfo?.sdVersion || modelId;
      return disabledModels.some(
        (override) => override.modelIdentifier === identifier
      );
    },
    [disabledModels, modelInfoMap]
  );

  /**
   * Update model override for a team
   */
  const updateModelOverride = useCallback(
    async (
      overrideTeamId: string,
      modelIdentifier: string,
      isEnabled: boolean
    ) => {
      if (!overrideTeamId) {
        throw new Error("Team ID is required");
      }

      // Find existing override for optimistic response
      const existingOverride = data?.team_model_overrides?.find(
        (o) =>
          o.teamId === overrideTeamId && o.modelIdentifier === modelIdentifier
      );

      // Build optimistic response
      const optimisticResponse: UpsertTeamModelOverrideData = {
        insert_team_model_overrides_one: {
          __typename: "team_model_overrides",
          teamId: overrideTeamId,
          modelIdentifier,
          isEnabled,
          createdAt: existingOverride?.createdAt || new Date().toISOString(),
          updatedByUser: {
            __typename: "users",
            id: existingOverride?.updatedByUser?.id || userId,
            username: existingOverride?.updatedByUser?.username || username,
          },
        },
      };

      return upsertMutation({
        variables: {
          object: {
            teamId: overrideTeamId,
            modelIdentifier,
            isEnabled,
          },
        },
        optimisticResponse,
        update: (cache) => {
          // Read existing data from cache
          const existingData = cache.readQuery<
            GetTeamModelOverridesData,
            GetTeamModelOverridesVariables
          >({
            query: GET_TEAM_MODEL_OVERRIDES,
            variables: { teamId },
          });

          // If the model already exists in cache, Apollo handles the update
          if (
            existingData?.team_model_overrides?.find(
              (o) => o.modelIdentifier === modelIdentifier
            )
          ) {
            return;
          }

          // Add new override to cache
          const updatedOverrides = [
            ...(existingData?.team_model_overrides || []),
            optimisticResponse.insert_team_model_overrides_one,
          ];

          cache.writeQuery<
            GetTeamModelOverridesData,
            GetTeamModelOverridesVariables
          >({
            query: GET_TEAM_MODEL_OVERRIDES,
            variables: { teamId },
            data: { team_model_overrides: updatedOverrides },
          });
        },
      });
    },
    [data, teamId, userId, username, upsertMutation]
  );

  return {
    modelOverrides,
    disabledModels,
    updateModelOverride,
    isModelDisabled,
    loading,
    error,
  };
}

export default useTeamModelOverrides;
