import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestController } from './friends-request.controller';
import { FriendRequestService } from './friends-request.service';
import { FriendsModule } from '../friends/friends.module';
import {
  FriendRequest,
  FriendRequestSchema,
} from './entities/friends-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    FriendsModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule { }

