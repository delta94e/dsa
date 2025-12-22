import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface FeatureFlag {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    percentage: number; // For A/B testing (0-100)
    variants?: ABVariant[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ABVariant {
    id: string;
    name: string;
    weight: number; // Percentage weight for this variant
    config?: Record<string, unknown>;
}

export interface UserFeatureAssignment {
    flagId: string;
    variantId?: string;
    enabled: boolean;
}

@Injectable()
export class FeatureFlagService {
    private flags: Map<string, FeatureFlag> = new Map();
    private userAssignments: Map<string, Map<string, UserFeatureAssignment>> = new Map();

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.initializeDefaultFlags();
    }

    private initializeDefaultFlags() {
        const defaultFlags: FeatureFlag[] = [
            {
                id: 'ai_practice',
                name: 'AI Practice Mode',
                description: 'Enable AI-powered conversation practice',
                enabled: true,
                percentage: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'reactions',
                name: 'Emoji Reactions',
                description: 'Allow users to send emoji reactions in rooms',
                enabled: true,
                percentage: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'raise_hand',
                name: 'Raise Hand Feature',
                description: 'Allow users to raise their hand in rooms',
                enabled: true,
                percentage: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'new_room_ui',
                name: 'New Room UI',
                description: 'Test new room interface design',
                enabled: false,
                percentage: 50, // 50% A/B test
                variants: [
                    { id: 'control', name: 'Original UI', weight: 50 },
                    { id: 'variant_a', name: 'New Card Layout', weight: 50 },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'voice_effects',
                name: 'Voice Effects',
                description: 'Enable voice modulation effects',
                enabled: false,
                percentage: 20, // 20% rollout
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        defaultFlags.forEach(flag => this.flags.set(flag.id, flag));
    }

    async getAllFlags(): Promise<FeatureFlag[]> {
        return Array.from(this.flags.values());
    }

    async getFlag(flagId: string): Promise<FeatureFlag | undefined> {
        return this.flags.get(flagId);
    }

    async updateFlag(flagId: string, updates: Partial<FeatureFlag>): Promise<FeatureFlag | null> {
        const flag = this.flags.get(flagId);
        if (!flag) return null;

        const updatedFlag = {
            ...flag,
            ...updates,
            updatedAt: new Date(),
        };
        this.flags.set(flagId, updatedFlag);

        // Invalidate cache for all users
        await this.cacheManager.del(`feature_flags`);

        return updatedFlag;
    }

    async toggleFlag(flagId: string): Promise<FeatureFlag | null> {
        const flag = this.flags.get(flagId);
        if (!flag) return null;

        return this.updateFlag(flagId, { enabled: !flag.enabled });
    }

    // Check if feature is enabled for a specific user (A/B testing)
    async isFeatureEnabled(flagId: string, userId: string): Promise<boolean> {
        const flag = this.flags.get(flagId);
        if (!flag) return false;
        if (!flag.enabled) return false;
        if (flag.percentage === 100) return true;

        // Consistent hashing for A/B testing
        const hash = this.hashUserForFlag(userId, flagId);
        return hash < flag.percentage;
    }

    // Get variant assignment for A/B testing
    async getVariantForUser(flagId: string, userId: string): Promise<string | null> {
        const flag = this.flags.get(flagId);
        if (!flag || !flag.enabled || !flag.variants?.length) return null;

        // Check if user already has an assignment
        const userFlags = this.userAssignments.get(userId);
        if (userFlags?.has(flagId)) {
            return userFlags.get(flagId)?.variantId || null;
        }

        // Assign variant based on consistent hash
        const hash = this.hashUserForFlag(userId, flagId);
        let cumulativeWeight = 0;

        for (const variant of flag.variants) {
            cumulativeWeight += variant.weight;
            if (hash < cumulativeWeight) {
                // Store assignment
                if (!this.userAssignments.has(userId)) {
                    this.userAssignments.set(userId, new Map());
                }
                this.userAssignments.get(userId)!.set(flagId, {
                    flagId,
                    variantId: variant.id,
                    enabled: true,
                });
                return variant.id;
            }
        }

        return flag.variants[0]?.id || null;
    }

    // Get all feature flags status for a user
    async getFlagsForUser(userId: string): Promise<Record<string, { enabled: boolean; variant?: string }>> {
        const result: Record<string, { enabled: boolean; variant?: string }> = {};

        for (const flag of this.flags.values()) {
            const enabled = await this.isFeatureEnabled(flag.id, userId);
            const variant = flag.variants?.length
                ? await this.getVariantForUser(flag.id, userId)
                : undefined;

            result[flag.id] = { enabled, variant: variant ?? undefined };
        }

        return result;
    }

    // Consistent hash function for deterministic A/B assignment
    private hashUserForFlag(userId: string, flagId: string): number {
        const str = `${userId}-${flagId}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash % 100);
    }
}
