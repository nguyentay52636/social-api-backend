import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existed = await this.userModel.findOne({
      $or: [{ phone: dto.phone }, { username: dto.username }],
    });

    if (existed) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }
  async  getAllUsers() { 
   try {
    const users =await this.userModel.find();
    return {
      message: 'Users fetched successfully',
      data: users,
      statusCode: 200,
      date: new Date(),
    };
   }catch(error) {
    throw new InternalServerErrorException(error);
   }
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      dto,
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
