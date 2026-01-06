// dto/blocked-user.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BlockType, BlockSource } from '@/common';

// Helper class for info of the blocked user
class BlockedUserInfo {
    @ApiProperty({ description: 'User ID' })
    _id: string;

    @ApiProperty({ description: 'Username' })
    username: string;

    @ApiProperty({ description: 'Avatar URL' })
    avatar: string;

    @ApiProperty({ description: 'Bio' })
    bio: string;
}

export class BlockedUserResponseDto {
    @ApiProperty({ description: 'ID' })
    _id: string;

    @ApiProperty({ description: 'ID người thực hiện chặn' })
    user: string;

    @ApiProperty({ description: 'Thông tin người bị chặn', type: BlockedUserInfo })
    blockedUser: BlockedUserInfo;

    @ApiProperty({
        description: 'Loại chặn',
        enum: BlockType,
        example: BlockType.MESSAGE
    })
    blockType: BlockType;

    @ApiProperty({
        description: 'Nguồn chặn',
        enum: BlockSource,
        example: BlockSource.USER
    })
    source: BlockSource;

    @ApiProperty({ description: 'Lý do chặn', required: false })
    reason?: string;

    @ApiProperty({ description: 'Trạng thái hoạt động' })
    isActive: boolean;

    @ApiProperty({ description: 'Thời gian hết hạn', required: false })
    expiresAt?: Date;

    @ApiProperty({ description: 'Thời gian tạo' })
    createdAt: Date;
}
