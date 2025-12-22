import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { GameModule } from './game/game.module';

@Module({
    imports: [GameModule, GatewayModule],
})
export class AppModule { }
