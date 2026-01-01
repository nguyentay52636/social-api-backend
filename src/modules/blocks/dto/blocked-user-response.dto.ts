// dto/blocked-user.response.dto.ts
import { BlockType, BlockSource } from '../entities';

export class BlockedUserResponseDto {
    id: string;
    userId: string;
    blockedUserId: string;

    blockType: BlockType;
    source: BlockSource;

    reason?: string;
    isActive: boolean;
    expiresAt?: Date;

    createdAt: Date;
}
