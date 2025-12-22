import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flags.service';
import { FeatureFlagsController } from './feature-flags.controller';

@Module({
    controllers: [FeatureFlagsController],
    providers: [FeatureFlagService],
    exports: [FeatureFlagService],
})
export class FeatureFlagsModule { }
