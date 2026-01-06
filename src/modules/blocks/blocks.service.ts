import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IBlockedUser } from './entities/blocked-user.schema';
import { BlockUserDto, BlockStatusResponseDto } from './dto/blocked-user.dto';
import { BlockType, BlockSource } from '@/common';

@Injectable()
export class BlocksService {
    constructor(
        @InjectModel('BlockedUser')
        private readonly blockedUserModel: Model<IBlockedUser>,
    ) { }


    async blockUser(
        userId: string,
        blockedUserId: string,
        dto: BlockUserDto,
    ): Promise<IBlockedUser> {
        if (userId === blockedUserId) {
            throw new BadRequestException('Cannot block yourself');
        }

        const { blockType, source, reason, expiresAt } = dto;

        try {
            const block = await this.blockedUserModel.create({
                user: new Types.ObjectId(userId),
                blockedUser: new Types.ObjectId(blockedUserId),
                blockType: blockType || BlockType.ALL,
                source: source || BlockSource.USER,
                reason,
                expiresAt,
                isActive: true,
            });

            return block;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('User is already blocked');
            }
            throw error;
        }
    }

    async unblockUser(userId: string, blockedUserId: string): Promise<void> {
        const result = await this.blockedUserModel.deleteOne({
            user: new Types.ObjectId(userId),
            blockedUser: new Types.ObjectId(blockedUserId),
        });

        if (result.deletedCount === 0) {
            throw new NotFoundException('Block record not found');
        }
    }


    async getBlockedUsers(userId: string): Promise<IBlockedUser[]> {
        return this.blockedUserModel
            .find({ user: new Types.ObjectId(userId) })
            .populate('blockedUser', 'username avatar bio')
            .sort({ createdAt: -1 });
    }


    async getBlockStatus(userId: string, otherUserId: string): Promise<BlockStatusResponseDto> {
        const userObjectId = new Types.ObjectId(userId);
        const otherUserObjectId = new Types.ObjectId(otherUserId);

        const blocks = await this.blockedUserModel.find({
            $or: [
                { user: userObjectId, blockedUser: otherUserObjectId },
                { user: otherUserObjectId, blockedUser: userObjectId },
            ],
            isActive: true,
        });

        const blockedByMe = blocks.some(
            (b) => b.user.toString() === userId && b.blockedUser.toString() === otherUserId,
        );

        const blockedMe = blocks.some(
            (b) => b.user.toString() === otherUserId && b.blockedUser.toString() === userId,
        );

        // Collect effective block types if blockedMe is true?
        // Usually privacy logic checks "blockedMe" to hide content. 
        // We return relevant types.
        const blockTypes = blocks.map(b => b.blockType as BlockType);

        return {
            blockedByMe,
            blockedMe,
            blockTypes: [...new Set(blockTypes)], // unique types
        };
    }
}