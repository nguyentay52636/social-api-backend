import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Roles')
@Public() // TODO: Tạm thời bỏ xác thực để test - xóa sau khi test xong
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo role mới (mặc định: name=user, status=active)' })
  @ApiResponse({
    status: 201,
    description: 'Tạo role thành công',
  })
  @ApiResponse({ status: 409, description: 'Role đã tồn tại' })
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.create(dto);
    return {
      message: 'Tạo role thành công',
      data: role,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả roles' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách roles thành công',
  })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      message: 'Lấy danh sách roles thành công',
      data: roles,
      statusCode: HttpStatus.OK,
      total: roles.length,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách roles đang hoạt động' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách roles active thành công',
  })
  async findActive() {
    const roles = await this.rolesService.findActiveRoles();
    return {
      message: 'Lấy danh sách roles active thành công',
      data: roles,
      statusCode: HttpStatus.OK,
      total: roles.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin role theo ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin role thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy role' })
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findById(id);
    return {
      message: 'Lấy thông tin role thành công',
      data: role,
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật role thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy role' })
  @ApiResponse({ status: 409, description: 'Tên role đã tồn tại' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const role = await this.rolesService.update(id, dto);
    return {
      message: 'Cập nhật role thành công',
      data: role,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa role thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy role' })
  async remove(@Param('id') id: string) {
    await this.rolesService.delete(id);
    return {
      message: 'Xóa role thành công',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Kích hoạt role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Kích hoạt role thành công',
  })
  async activate(@Param('id') id: string) {
    const role = await this.rolesService.activate(id);
    return {
      message: 'Kích hoạt role thành công',
      data: role,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Vô hiệu hóa role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Vô hiệu hóa role thành công',
  })
  async deactivate(@Param('id') id: string) {
    const role = await this.rolesService.deactivate(id);
    return {
      message: 'Vô hiệu hóa role thành công',
      data: role,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Tạo các role mặc định (user, admin, manager)' })
  @ApiResponse({
    status: 201,
    description: 'Tạo roles mặc định thành công',
  })
  async seedRoles() {
    await this.rolesService.seedDefaultRoles();
    return {
      message: 'Tạo roles mặc định thành công',
      statusCode: HttpStatus.CREATED,
    };
  }
}
