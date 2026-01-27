
import { Controller, Post, Body, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @ApiOperation({ summary: 'Create or get existing chat room with a friend' })
    @Post('room')
    async createOrGetRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
        return this.chatService.createOrGetRoom(req.user._id, createRoomDto.friendId);
    }

    @ApiOperation({ summary: 'Get all chat rooms for current user' })
    @Get('rooms')
    async getUserRooms(@Request() req) {
        return this.chatService.getUserRooms(req.user._id);
    }

    @ApiOperation({ summary: 'Get messages for a specific room' })
    @Get('room/:roomId/messages')
    async getMessages(
        @Param('roomId') roomId: string,
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
    ) {
        return this.chatService.getMessages(roomId, limit, skip);
    }
}
