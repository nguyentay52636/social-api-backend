// dto/block-user.dto.ts
import { IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { BlockType, BlockSource } from '../entities';

export class BlockUserDto {
    @IsEnum(BlockType)
    @IsOptional()
    blockType?: BlockType = BlockType.ALL;

    @IsEnum(BlockSource)
    @IsOptional()
    source?: BlockSource = BlockSource.USER;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    reason?: string;

    @IsDateString()
    @IsOptional()
    expiresAt?: Date;
}

export class UnblockUserDto {
    @IsEnum(BlockType)
    blockType: BlockType;
}
