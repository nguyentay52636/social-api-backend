import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend, FriendDocument } from './entities/friends.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
  ) {}

  async getFriends(userId: string): Promise<FriendDocument[]> {
    const userObjectId = new Types.ObjectId(userId);

    const friends = await this.friendModel
      .find({
        $or: [{ userId: userObjectId }, { friendId: userObjectId }],
      })
      .populate('userId', 'username avatar bio')
      .populate('friendId', 'username avatar bio')
      .sort({ createdAt: -1 });

    return friends;
  }
  async removeFriend(userId: string, friendId: string): Promise<void> {
    if (userId === friendId) {
      throw new BadRequestException('Không thể tự xoá chính mình khỏi danh sách bạn bè');
    }

    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const result = await this.friendModel.deleteMany({
      $or: [
        { userId: userObjectId, friendId: friendObjectId },
        { userId: friendObjectId, friendId: userObjectId },
      ],
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Không tìm thấy quan hệ bạn bè');
    }
  }


  // async getMutualFriends(
  //   userId: string,
  //   targetUserId: string,
  // ): Promise<{ mutualFriends: any[]; count: number }> {
  //   if (userId === targetUserId) {
  //     throw new BadRequestException('Không thể lấy bạn chung với chính mình');
  //   }

  //   const userObjectId = new Types.ObjectId(userId);
  //   const targetUserObjectId = new Types.ObjectId(targetUserId);

  //   // Lấy danh sách bạn bè của user hiện tại
  //   const userFriends = await this.friendModel.find({
  //     $or: [{ userId: userObjectId }, { friendId: userObjectId }],
  //   });

  //   const userFriendIds = userFriends.map((f) =>
  //     f.userId.toString() === userId ? f.friendId.toString() : f.userId.toString(),
  //   );

  //   // Lấy danh sách bạn bè của target user
  //   const targetFriends = await this.friendModel.find({
  //     $or: [{ userId: targetUserObjectId }, { friendId: targetUserObjectId }],
  //   });

  //   const targetFriendIds = targetFriends.map((f) =>
  //     f.userId.toString() === targetUserId
  //       ? f.friendId.toString()
  //       : f.userId.toString(),
  //   );

  //   // Tìm bạn chung
  //   const mutualFriendIds = userFriendIds.filter((id) =>
  //     targetFriendIds.includes(id),
  //   );

  //   // Populate thông tin bạn chung
  //   const mutualFriends = await this.friendModel
  //     .find({
  //       $or: [
  //         {
  //           userId: userObjectId,
  //           friendId: { $in: mutualFriendIds.map((id) => new Types.ObjectId(id)) },
  //         },
  //         {
  //           friendId: userObjectId,
  //           userId: { $in: mutualFriendIds.map((id) => new Types.ObjectId(id)) },
  //         },
  //       ],
  //     })
  //     .populate('userId', 'username avatar bio')
  //     .populate('friendId', 'username avatar bio');

  //   // Extract thông tin user từ kết quả
  //   const mutualFriendsData = mutualFriends.map((f) => {
  //     const friendData = f.userId.toString() === userId ? f.friendId : f.userId;
  //     return friendData;
  //   });

  //   return {
  //     mutualFriends: mutualFriendsData,
  //     count: mutualFriendsData.length,
  //   };
  // }


  async areFriends(userId: string, friendId: string): Promise<boolean> {
    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const friendship = await this.friendModel.findOne({
      $or: [
        { userId: userObjectId, friendId: friendObjectId },
        { userId: friendObjectId, friendId: userObjectId },
      ],
    });

    return !!friendship;
  }

  /**
   * Thêm bạn bè (sử dụng khi accept friend request)
   */
  async addFriend(userId: string, friendId: string): Promise<FriendDocument> {
    if (userId === friendId) {
      throw new BadRequestException('Không thể kết bạn với chính mình');
    }

    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    // Kiểm tra xem đã là bạn bè chưa
    const existingFriendship = await this.friendModel.findOne({
      $or: [
        { userId: userObjectId, friendId: friendObjectId },
        { userId: friendObjectId, friendId: userObjectId },
      ],
    });

    if (existingFriendship) {
      throw new BadRequestException('Đã là bạn bè');
    }

    // Tạo quan hệ bạn bè
    const friendship = await this.friendModel.create({
      userId: userObjectId,
      friendId: friendObjectId,
    });

    return friendship;
  }
}

