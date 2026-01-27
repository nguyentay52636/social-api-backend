
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Room, RoomSchema } from './entities/room.schema';
import { Message, MessageSchema } from './entities/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from '@/configs';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
        JwtModule.registerAsync(jwtModuleConfig),
    ],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
    exports: [ChatService],
})
export class ChatModule { }
