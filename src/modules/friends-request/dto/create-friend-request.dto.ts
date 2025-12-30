import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateFriendRequestDto {
  @ApiProperty({
    description: 'ID của người nhận lời mời kết bạn',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'receiverId không được để trống' })
  @IsMongoId({ message: 'receiverId phải là ObjectId hợp lệ' })
  receiverId: string;
}

