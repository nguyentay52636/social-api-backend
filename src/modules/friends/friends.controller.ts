import {
  Controller,
  Get,
  Delete,
  Param,
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
import { FriendsService } from './friends.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ResponseUtil } from '../../common/utils';

@ApiTags('Friends')
@ApiBearerAuth()
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bạn bè' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách bạn bè thành công',
  })
  async getFriends(@CurrentUser('_id') userId: string) {
    const friends = await this.friendsService.getFriends(userId);

    const friendsData = friends.map((f) => {
      const friendInfo =
        (f.userId as any)._id?.toString() === userId ? f.friendId : f.userId;
      return {
        _id: f._id,
        friend: friendInfo,
        createdAt: (f as any).createdAt,
      };
    });

    return ResponseUtil.list('Lấy danh sách bạn bè thành công', friendsData);
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xoá bạn bè' })
  @ApiParam({ name: 'friendId', description: 'ID của bạn bè cần xoá' })
  @ApiResponse({
    status: 200,
    description: 'Xoá bạn bè thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quan hệ bạn bè' })
  async removeFriend(
    @CurrentUser('_id') userId: string,
    @Param('friendId') friendId: string,
  ) {
    await this.friendsService.removeFriend(userId, friendId);
    return ResponseUtil.deleted('Xoá bạn bè thành công');
  }

//   @Get('mutual/:targetUserId')
//   @ApiOperation({ summary: 'Lấy danh sách bạn chung với một user khác' })
//   @ApiParam({ name: 'targetUserId', description: 'ID của user cần tìm bạn chung' })
//   @ApiResponse({
//     status: 200,
//     description: 'Lấy danh sách bạn chung thành công',
//   })
//   @ApiResponse({ status: 400, description: 'Không thể lấy bạn chung với chính mình' })
//   async getMutualFriends(
//     @CurrentUser('_id') userId: string,
//     @Param('targetUserId') targetUserId: string,
//   ) {
//     const result = await this.friendsService.getMutualFriends(userId, targetUserId);
//     return ResponseUtil.success('Lấy danh sách bạn chung thành công', result);
//   }
}

