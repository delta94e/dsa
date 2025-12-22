import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
    imports: [RoomsModule],
    providers: [RoomGateway],
})
export class GatewayModule { }
