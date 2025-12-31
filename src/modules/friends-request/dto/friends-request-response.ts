import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '../entities/friends-request.schema';

class UserShortInfoDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    _id: string;

    @ApiProperty({ example: 'johndoe' })
    username: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg' })
    avatar: string;

    @ApiProperty({ example: 'Fullstack Developer' })
    bio?: string;
}

export class FriendRequestResponseDto {
    @ApiProperty({ example: 'string _id' })
    _id: string;

    @ApiProperty({ type: UserShortInfoDto })
    sender: UserShortInfoDto;

    @ApiProperty({ type: UserShortInfoDto })
    receiver: UserShortInfoDto;

    @ApiProperty({ enum: FriendRequestStatus, example: FriendRequestStatus.PENDING })
    status: FriendRequestStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
