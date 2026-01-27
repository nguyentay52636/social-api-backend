import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Users')
@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
  })
  @ApiResponse({ status: 409, description: 'Người dùng đã tồn tại' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return {
      message: 'Tạo người dùng thành công',
      data: user,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
  })
  async findAll() {
    const users = await this.usersService.getAllUsers();
    return {
      message: 'Lấy danh sách người dùng thành công',
      data: users,
      statusCode: HttpStatus.OK,
      total: users.length,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng' })
  @ApiQuery({
    name: 'q',
    description: 'Từ khóa tìm kiếm (username, email, phone)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Tìm kiếm thành công',
  })
  async search(@Query('q') query: string) {
    const users = await this.usersService.searchUsers(query || '');
    return {
      message: 'Tìm kiếm thành công',
      data: users,
      statusCode: HttpStatus.OK,
      total: users.length,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
  })
  async getMe(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.getUserById(userId);
    return {
      message: 'Lấy thông tin thành công',
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return {
      message: 'Lấy thông tin người dùng thành công',
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, dto);
    return {
      message: 'Cập nhật thành công',
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  @Put('me/update')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
  })
  async updateMe(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUser(userId, dto);
    return {
      message: 'Cập nhật thành công',
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa người dùng thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async remove(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return {
      message: 'Xóa người dùng thành công',
      statusCode: HttpStatus.OK,
    };
  }
}
