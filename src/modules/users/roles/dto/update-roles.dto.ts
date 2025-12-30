import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoleName, RoleStatus } from '../entities/roles.schema';

export class UpdateRoleDto {
  @ApiPropertyOptional({
    description: 'Tên role',
    enum: RoleName,
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

  @ApiPropertyOptional({
    description: 'Trạng thái role',
    enum: RoleStatus,
  })
  @IsOptional()
  @IsEnum(RoleStatus, { message: 'Status phải là active hoặc inactive' })
  status?: RoleStatus;
}
