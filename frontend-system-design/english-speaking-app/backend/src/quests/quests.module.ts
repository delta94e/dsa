import { Module } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { ProgressModule } from '../progress/progress.module';

@Module({
    imports: [ProgressModule],
    controllers: [QuestsController],
    providers: [QuestsService],
    exports: [QuestsService],
})
export class QuestsModule { }
