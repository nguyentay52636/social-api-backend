
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
    @ApiProperty({ example: '64b0f...', description: 'ID of the friend to chat with' })
    @IsNotEmpty()
    @IsString()
    friendId: string;
}
