import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlockUserDto, BlockStatusResponseDto } from './dto/blocked-user.dto';
import { BlockedUserResponseDto } from './dto/blocked-user-response.dto';
import { ResponseUtil } from '../../common/utils';

@ApiTags('Blocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blocks')
export class BlocksController {
    constructor(private readonly blocksService: BlocksService) { }

    @Post(':userId')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Chặn người dùng' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng cần chặn' })
    @ApiBody({ type: BlockUserDto })
    @ApiResponse({
        status: 201,
        description: 'Chặn người dùng thành công',
        type: BlockedUserResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Người dùng đã bị chặn' })
    async blockUser(
        @CurrentUser('userId') currentUserId: string,
        @Param('userId') blockedUserId: string,
        @Body() dto: BlockUserDto,
    ) {
        const block = await this.blocksService.blockUser(
            currentUserId,
            blockedUserId,
            dto,
        );
        return ResponseUtil.created('Chặn người dùng thành công', block);
    }

    @Delete(':userId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Bỏ chặn người dùng' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng cần bỏ chặn' })
    @ApiResponse({
        status: 200,
        description: 'Bỏ chặn người dùng thành công',
    })
    @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin chặn' })
    async unblockUser(
        @CurrentUser('userId') currentUserId: string,
        @Param('userId') blockedUserId: string,
    ) {
        await this.blocksService.unblockUser(currentUserId, blockedUserId);
        return ResponseUtil.success('Bỏ chặn người dùng thành công');
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách người dùng đã bị chặn' })
    @ApiResponse({
        status: 200,
        description: 'Lấy danh sách thành công',
        type: [BlockedUserResponseDto],
    })
    async getBlockedUsers(@CurrentUser('userId') currentUserId: string) {
        const blocks = await this.blocksService.getBlockedUsers(currentUserId);
        return ResponseUtil.list('Lấy danh sách chặn thành công', blocks);
    }

    @Get('list/:userId')
    @ApiOperation({ summary: 'Lấy danh sách chặn theo userId' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng cần lấy danh sách chặn' })
    @ApiResponse({
        status: 200,
        description: 'Lấy danh sách thành công',
        type: [BlockedUserResponseDto],
    })
    async getBlockedUsersByUserId(@Param('userId') userId: string) {
        const blocks = await this.blocksService.getBlockedUsers(userId);
        return ResponseUtil.list('Lấy danh sách chặn thành công', blocks);
    }

    @Get(':userId/status')
    @ApiOperation({ summary: 'Kiểm tra trạng thái chặn với người dùng khác' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng cần kiểm tra' })
    @ApiResponse({
        status: 200,
        description: 'Lấy trạng thái thành công',
        type: BlockStatusResponseDto,
    })
    async checkBlockStatus(
        @CurrentUser('userId') currentUserId: string,
        @Param('userId') otherUserId: string,
    ) {
        const status = await this.blocksService.getBlockStatus(
            currentUserId,
            otherUserId,
        );
        return ResponseUtil.success('Lấy trạng thái chặn thành công', status);
    }
}
