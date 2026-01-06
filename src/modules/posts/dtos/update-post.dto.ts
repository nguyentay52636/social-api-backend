import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { PostPrivacy } from '../entities/post.schema';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Nội dung bài viết',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Nội dung không được vượt quá 5000 ký tự' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Danh sách URL hình ảnh',
    type: [String],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Tối đa 10 hình ảnh' })
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Quyền riêng tư',
    enum: PostPrivacy,
  })
  @IsOptional()
  @IsEnum(PostPrivacy, { message: 'Quyền riêng tư không hợp lệ' })
  privacy?: PostPrivacy;
}