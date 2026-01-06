import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { PostPrivacy } from '../entities/post.schema';

export class CreatePostDto {
  @ApiProperty({
    description: 'Nội dung bài viết',
    maxLength: 5000,
    example: 'Hôm nay ban dang nghi gi day, ban co the cho toi mot so thong tin ve ban khong?',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  @MaxLength(5000, { message: 'Nội dung không được vượt quá 5000 ký tự' })
  content: string;

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
    default: PostPrivacy.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostPrivacy, { message: 'Quyền riêng tư không hợp lệ' })
  privacy?: PostPrivacy;
}