import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
    imports: [TeachersModule],
    controllers: [AdminController],
})
export class AdminModule { }
