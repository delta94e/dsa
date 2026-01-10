"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface FeatureFlags {
  /** Link to affiliates program */
  affiliatesLinkValue: string;
  /** Whether free tier restrictions are enabled */
  isFreeTierRestrictingEnabled: boolean;
  /** Whether free plan has elevated features */
  isFreePlanElevated: boolean;
  /** Enable experimental features */
  enableExperimentalFeatures: boolean;
  /** Enable new UI components */
  enableNewUI: boolean;
  /** Enable Flow State feature */
  enableFlowState: boolean;
  /** Enable Realtime Canvas */
  enableRealtimeCanvas: boolean;
  /** Enable Texture Generation */
  enableTextureGeneration: boolean;
  /** Enable Blueprints */
  enableBlueprints: boolean;
  /** Enable Universal Upscaler */
  enableUniversalUpscaler: boolean;
  /** Enable team name and avatar customization */
  isTeamNameAndAvatarCustomizable: boolean;
  /** Enable team model overrides feature */
  isTeamModelOverridesEnabled: boolean;
  /** Enable shared collections feature */
  isSharedCollectionsEnabled: boolean;
}

// ============================================================================
// Default Flags
// ============================================================================

const defaultFlags: FeatureFlags = {
  affiliatesLinkValue: "https://affiliates.leonardo.ai/signup",
  isFreeTierRestrictingEnabled: false,
  isFreePlanElevated: false,
  enableExperimentalFeatures: false,
  enableNewUI: true,
  enableFlowState: true,
  enableRealtimeCanvas: true,
  enableTextureGeneration: true,
  enableBlueprints: true,
  enableUniversalUpscaler: true,
  isTeamNameAndAvatarCustomizable: true,
  isTeamModelOverridesEnabled: false,
};

// ============================================================================
// Context
// ============================================================================

interface FlagsContextValue {
  flags: FeatureFlags;
}

const FlagsContext = createContext<FlagsContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface FlagsProviderProps {
  children: ReactNode;
  flags?: Partial<FeatureFlags>;
}

/**
 * FlagsProvider
 *
 * Provides feature flags to the application.
 * In production, integrate with LaunchDarkly or similar service.
 */
export function FlagsProvider({
  children,
  flags: customFlags,
}: FlagsProviderProps) {
  const flags = useMemo(
    () => ({
      ...defaultFlags,
      ...customFlags,
    }),
    [customFlags]
  );

  const value = useMemo(() => ({ flags }), [flags]);

  return (
    <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>
  );
}

// ============================================================================
// Hook: useFlagsContext
// ============================================================================

export function useFlagsContext(): FlagsContextValue {
  const context = useContext(FlagsContext);

  if (!context) {
    // Return default if no provider (for SSR/tests)
    return { flags: defaultFlags };
  }

  return context;
}

// ============================================================================
// Hook: useFlags (matches module 814021)
// ============================================================================

/**
 * useFlags Hook
 *
 * Returns feature flag values from context.
 *
 * @returns Feature flags object
 *
 * @example
 * const { isFreePlanElevated, enableNewUI } = useFlags();
 */
export function useFlags(): FeatureFlags {
  const { flags } = useFlagsContext();
  return flags;
}

export default useFlags;
