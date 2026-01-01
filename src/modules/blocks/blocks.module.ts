import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { BlockedUserSchema } from './entities/blocked-user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'BlockedUser', schema: BlockedUserSchema },
        ]),
    ],
    controllers: [BlocksController],
    providers: [BlocksService],
    exports: [BlocksService],
})
export class BlocksModule { }
