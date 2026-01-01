import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
  FriendRequestStatus,
} from './entities/friends-request.schema';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { FriendsService } from '../friends/friends.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
    private readonly friendsService: FriendsService,
  ) { }


  async sendFriendRequest(
    senderId: string,
    dto: CreateFriendRequestDto,
  ): Promise<FriendRequestDocument> {
    const { receiverId } = dto;

    if (senderId === receiverId) {
      throw new BadRequestException('Không thể gửi lời mời kết bạn cho chính mình');
    }

    if (await this.friendsService.areFriends(senderId, receiverId)) {
      throw new BadRequestException('Hai người đã là bạn bè');
    }

    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    const existingRequest = await this.friendRequestModel.findOne({
      $or: [
        { sender: senderObjectId, receiver: receiverObjectId },
        { sender: receiverObjectId, receiver: senderObjectId },
      ],
      status: FriendRequestStatus.PENDING,
    });

    if (existingRequest) {
      if (existingRequest.sender.toString() === senderId) {
        throw new ConflictException('Bạn đã gửi lời mời kết bạn cho người này rồi');
      }
      throw new ConflictException(
        'Người này đã gửi lời mời kết bạn cho bạn. Hãy chấp nhận lời mời đó!',
      );
    }

    const friendRequest = await this.friendRequestModel.create({
      sender: senderObjectId,
      receiver: receiverObjectId,
      status: FriendRequestStatus.PENDING,
    });

    await friendRequest.populate([
      { path: 'sender', select: 'username avatar bio' },
      { path: 'receiver', select: 'username avatar bio' },
    ]);

    return friendRequest;
  }


  async getReceivedRequests(userId: string): Promise<FriendRequestDocument[]> {
    return this.friendRequestModel
      .find({
        receiver: new Types.ObjectId(userId),
        status: FriendRequestStatus.PENDING,
      })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 });
  }

  /**
   * Lấy danh sách lời mời kết bạn đã gửi (pending)
   */
  async getSentRequests(userId: string): Promise<FriendRequestDocument[]> {
    return this.friendRequestModel
      .find({
        sender: new Types.ObjectId(userId),
        status: FriendRequestStatus.PENDING,
      })
      .populate('receiver', 'username avatar')
      .sort({ createdAt: -1 });
  }


  async cancelFriendRequest(
    userId: string,
    id: string,
  ): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const idObjectId = new Types.ObjectId(id);

    const request = await this.friendRequestModel.findOne({
      $and: [
        { status: FriendRequestStatus.PENDING },
        {
          $or: [
            {
              _id: idObjectId,
              $or: [{ sender: userObjectId }, { receiver: userObjectId }],
            },
            { sender: userObjectId, receiver: idObjectId },
            { receiver: userObjectId, sender: idObjectId },
          ],
        },
      ],
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    await this.friendRequestModel.deleteOne({ _id: request._id });
  }


  async rejectFriendRequest(
    receiverId: string,
    id: string,
  ): Promise<void> {
    const receiverObjectId = new Types.ObjectId(receiverId);
    const idObjectId = new Types.ObjectId(id);

    const request = await this.friendRequestModel.findOne({
      $or: [
        { _id: idObjectId },
        { sender: idObjectId },
      ],
      receiver: receiverObjectId,
      status: FriendRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    await this.friendRequestModel.deleteOne({ _id: request._id });
  }

  /**
   * Chấp nhận lời mời kết bạn
   */
  async acceptFriendRequest(
    receiverId: string,
    requestId: string,
  ): Promise<FriendRequestDocument> {
    const request = await this.friendRequestModel.findOne({
      _id: new Types.ObjectId(requestId),
      receiver: new Types.ObjectId(receiverId),
      status: FriendRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    await this.friendsService.addFriend(
      request.sender.toString(),
      request.receiver.toString(),
    );

    await this.friendRequestModel.deleteOne({ _id: request._id });

    return request;
  }

  async getFriendRequestById(
    requestId: string,
  ): Promise<FriendRequestDocument> {
    const request = await this.friendRequestModel
      .findById(requestId)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    return request;
  }
}

