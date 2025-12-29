import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Địa chỉ email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'URL avatar không hợp lệ' })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Cover photo URL',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'URL ảnh bìa không hợp lệ' })
  coverPhoto?: string;

  @ApiPropertyOptional({
    description: 'Tiểu sử',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Tiểu sử không được vượt quá 500 ký tự' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
