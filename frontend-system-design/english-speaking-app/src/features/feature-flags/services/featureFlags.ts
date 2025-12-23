/**
 * Feature Flag Constants
 * 
 * This file contains all available feature flag IDs.
 * Use these constants to ensure type safety and IDE autocomplete.
 * 
 * @example
 * import { FLAGS } from '@/lib/featureFlags';
 * const flags = useFlags();
 * if (flags.ai_practice.enabled) { ... }
 */

// All available feature flags
export const FLAGS = {
    // AI Features
    AI_PRACTICE: 'ai_practice',

    // Room Features  
    REACTIONS: 'reactions',
    RAISE_HAND: 'raise_hand',
    VOICE_EFFECTS: 'voice_effects',

    // UI Experiments
    NEW_ROOM_UI: 'new_room_ui',
} as const;

// Type for flag IDs
export type FlagId = typeof FLAGS[keyof typeof FLAGS];

// Feature flag value type
export interface FlagValue {
    enabled: boolean;
    variant?: string;
}

// 🎯 TYPED MAP - This provides TypeScript autocomplete!
export type FeatureFlagsMap = {
    [K in FlagId]: FlagValue;
};

// Flag descriptions for documentation
export const FLAG_DESCRIPTIONS: Record<FlagId, string> = {
    [FLAGS.AI_PRACTICE]: 'Enable AI-powered conversation practice',
    [FLAGS.REACTIONS]: 'Allow users to send emoji reactions in rooms',
    [FLAGS.RAISE_HAND]: 'Allow users to raise their hand in rooms',
    [FLAGS.VOICE_EFFECTS]: 'Enable voice modulation effects',
    [FLAGS.NEW_ROOM_UI]: 'Test new room interface design (A/B test)',
};

// Default export for convenience
export default FLAGS;
