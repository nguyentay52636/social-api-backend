import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoleName } from '../entities/roles.schema';

export class CreateRoleDto {
  @ApiPropertyOptional({
    description: 'Tên role',
    enum: RoleName,
    default: RoleName.USER,
  })
  @IsOptional()
  @IsEnum(RoleName, { message: 'Role phải là user, admin hoặc manager' })
  name?: RoleName;

  @ApiPropertyOptional({
    description: 'Mô tả role',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Mô tả không được vượt quá 200 ký tự' })
  description?: string;
}
