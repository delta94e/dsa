import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';
import { FeatureFlagService, FeatureFlag } from './feature-flags.service';

@Controller('feature-flags')
export class FeatureFlagsController {
    constructor(private readonly featureFlagService: FeatureFlagService) { }

    // Get all feature flags (admin)
    @Get()
    async getAllFlags(): Promise<FeatureFlag[]> {
        return this.featureFlagService.getAllFlags();
    }

    // Get feature flags for current user
    @Get('user')
    async getFlagsForUser(@Req() req: any): Promise<Record<string, { enabled: boolean; variant?: string }>> {
        const userId = req.user?.id || req.ip || 'anonymous';
        return this.featureFlagService.getFlagsForUser(userId);
    }

    // Check if specific feature is enabled for user
    @Get(':flagId/check')
    async checkFeature(
        @Param('flagId') flagId: string,
        @Req() req: any,
    ): Promise<{ enabled: boolean; variant?: string }> {
        const userId = req.user?.id || req.ip || 'anonymous';
        const enabled = await this.featureFlagService.isFeatureEnabled(flagId, userId);
        const flag = await this.featureFlagService.getFlag(flagId);
        const variant = flag?.variants?.length
            ? await this.featureFlagService.getVariantForUser(flagId, userId)
            : undefined;

        return { enabled, variant: variant || undefined };
    }

    // Toggle feature flag (admin)
    @Post(':flagId/toggle')
    async toggleFlag(@Param('flagId') flagId: string): Promise<FeatureFlag | null> {
        return this.featureFlagService.toggleFlag(flagId);
    }

    // Update feature flag (admin)
    @Patch(':flagId')
    async updateFlag(
        @Param('flagId') flagId: string,
        @Body() updates: Partial<FeatureFlag>,
    ): Promise<FeatureFlag | null> {
        return this.featureFlagService.updateFlag(flagId, updates);
    }

    // Get specific flag details
    @Get(':flagId')
    async getFlag(@Param('flagId') flagId: string): Promise<FeatureFlag | undefined> {
        return this.featureFlagService.getFlag(flagId);
    }
}
