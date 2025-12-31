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

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
  ) {}


  async sendFriendRequest(
    senderId: string,
    dto: CreateFriendRequestDto,
  ): Promise<FriendRequestDocument> {
    const { receiverId } = dto;

    if (senderId === receiverId) {
      throw new BadRequestException('Không thể gửi lời mời kết bạn cho chính mình');
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
    senderId: string,
    requestId: string,
  ): Promise<void> {
    const request = await this.friendRequestModel.findOne({
      _id: new Types.ObjectId(requestId),
      sender: new Types.ObjectId(senderId),
      status: FriendRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    request.status = FriendRequestStatus.CANCELLED;
    await request.save();
  }


  async rejectFriendRequest(
    receiverId: string,
    requestId: string,
  ): Promise<void> {
    const request = await this.friendRequestModel.findOne({
      _id: new Types.ObjectId(requestId),
      receiver: new Types.ObjectId(receiverId),
      status: FriendRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    request.status = FriendRequestStatus.REJECTED;
    await request.save();
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

