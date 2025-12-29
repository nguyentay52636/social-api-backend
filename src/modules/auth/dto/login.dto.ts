import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email, username hoặc số điện thoại',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email, username hoặc số điện thoại là bắt buộc' })
  identifier: string;

  @ApiProperty({
    description: 'Mật khẩu',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}

