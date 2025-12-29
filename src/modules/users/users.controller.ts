import { Controller, Post, Body, Put, Param, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseWrapperDto } from '@/common/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ResponseWrapperDto> {
    const user = await this.usersService.createUser(dto);

    return {
      message: 'User created successfully',
      data: user,
      statusCode: HttpStatus.CREATED,
      date: new Date(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseWrapperDto> {
    const user = await this.usersService.updateUser(id, dto);

    return {
      message: 'User updated successfully',
      data: user,
      statusCode: HttpStatus.OK,
      date: new Date(),
    };
  }
}
