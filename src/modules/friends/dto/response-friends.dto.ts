import { ApiProperty } from '@nestjs/swagger';

export class FriendUserDto {
  @ApiProperty({ description: 'ID của user' })
  _id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Tiểu sử', required: false })
  bio?: string;
}

export class FriendResponseDto {
  @ApiProperty({ description: 'ID của quan hệ bạn bè' })
  _id: string;

  @ApiProperty({ description: 'Thông tin bạn bè', type: FriendUserDto })
  friend: FriendUserDto;

  @ApiProperty({ description: 'Ngày kết bạn' })
  createdAt: Date;
}

export class MutualFriendsResponseDto {
  @ApiProperty({ description: 'Danh sách bạn chung', type: [FriendUserDto] })
  mutualFriends: FriendUserDto[];

  @ApiProperty({ description: 'Số lượng bạn chung' })
  count: number;
}

