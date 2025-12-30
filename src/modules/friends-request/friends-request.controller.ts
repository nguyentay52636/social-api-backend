import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FriendRequestService } from './friends-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ResponseUtil } from '../../common/utils';

@ApiTags('Friend Requests')
@ApiBearerAuth()
@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Gửi lời mời kết bạn' })
  @ApiResponse({
    status: 201,
    description: 'Gửi lời mời thành công',
  })
  @ApiResponse({ status: 400, description: 'Không thể gửi cho chính mình' })
  @ApiResponse({ status: 409, description: 'Đã có lời mời tồn tại' })
  async sendFriendRequest(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateFriendRequestDto,
  ) {
    const request = await this.friendRequestService.sendFriendRequest(
      userId,
      dto,
    );
    return ResponseUtil.created('Gửi lời mời kết bạn thành công', request);
  }

  @Get('received')
  @ApiOperation({ summary: 'Lấy danh sách lời mời đã nhận' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách lời mời đã nhận thành công',
  })
  async getReceivedRequests(@CurrentUser('_id') userId: string) {
    const requests =
      await this.friendRequestService.getReceivedRequests(userId);
    return ResponseUtil.list('Lấy danh sách lời mời đã nhận thành công', requests);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Lấy danh sách lời mời đã gửi' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách lời mời đã gửi thành công',
  })
  async getSentRequests(@CurrentUser('_id') userId: string) {
    const requests = await this.friendRequestService.getSentRequests(userId);
    return ResponseUtil.list('Lấy danh sách lời mời đã gửi thành công', requests);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lời mời kết bạn' })
  @ApiParam({ name: 'id', description: 'Friend Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin lời mời thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lời mời' })
  async getFriendRequest(@Param('id') requestId: string) {
    const request =
      await this.friendRequestService.getFriendRequestById(requestId);
    return ResponseUtil.success('Lấy thông tin lời mời thành công', request);
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chấp nhận lời mời kết bạn' })
  @ApiParam({ name: 'id', description: 'Friend Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Chấp nhận lời mời thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lời mời' })
  async acceptFriendRequest(
    @CurrentUser('_id') userId: string,
    @Param('id') requestId: string,
  ) {
    const request = await this.friendRequestService.acceptFriendRequest(
      userId,
      requestId,
    );
    return ResponseUtil.success('Chấp nhận lời mời kết bạn thành công', request);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Từ chối lời mời kết bạn' })
  @ApiParam({ name: 'id', description: 'Friend Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Từ chối lời mời thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lời mời' })
  async rejectFriendRequest(
    @CurrentUser('_id') userId: string,
    @Param('id') requestId: string,
  ) {
    await this.friendRequestService.rejectFriendRequest(userId, requestId);
    return ResponseUtil.success('Từ chối lời mời kết bạn thành công');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Huỷ lời mời kết bạn đã gửi' })
  @ApiParam({ name: 'id', description: 'Friend Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Huỷ lời mời thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lời mời' })
  async cancelFriendRequest(
    @CurrentUser('_id') userId: string,
    @Param('id') requestId: string,
  ) {
    await this.friendRequestService.cancelFriendRequest(userId, requestId);
    return ResponseUtil.deleted('Huỷ lời mời kết bạn thành công');
  }
}
