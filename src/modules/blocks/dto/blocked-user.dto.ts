// dto/block-user.dto.ts
import { IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockType, BlockSource } from '@/common';

export class BlockUserDto {
    @ApiProperty({
        enum: BlockType,
        description: 'Loại chặn',
        default: BlockType.ALL,
        required: false,
    })
    @IsEnum(BlockType)
    @IsOptional()
    blockType?: BlockType = BlockType.ALL;

    @ApiProperty({
        enum: BlockSource,
        description: 'Nguồn chặn',
        default: BlockSource.USER,
        required: false,
    })
    @IsEnum(BlockSource)
    @IsOptional()
    source?: BlockSource = BlockSource.USER;

    @ApiProperty({
        description: 'Lý do chặn',
        required: false,
        maxLength: 255,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    reason?: string;

    @ApiProperty({
        description: 'Thời gian hết hạn chặn',
        required: false,
        type: Date,
    })
    @IsDateString()
    @IsOptional()
    expiresAt?: Date;
}

export class UnblockUserDto {
    @ApiProperty({
        enum: BlockType,
        description: 'Loại chặn cần bỏ',
    })
    @IsEnum(BlockType)
    blockType: BlockType;
}

export class BlockStatusResponseDto {
    @ApiProperty({ description: 'Mình có chặn họ không' })
    blockedByMe: boolean;

    @ApiProperty({ description: 'Họ có chặn mình không' })
    blockedMe: boolean;

    @ApiProperty({
        enum: BlockType,
        isArray: true,
        description: 'Các loại chặn đang áp dụng',
    })
    blockTypes: BlockType[];
}
