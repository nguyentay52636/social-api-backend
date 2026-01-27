import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    const existed = await this.userModel.findOne({
      $or: [
        { phone: dto.phone },
        { username: dto.username },
        ...(dto.email ? [{ email: dto.email }] : []),
      ],
    });

    if (existed) {
      if (existed.username === dto.username) {
        throw new ConflictException('Username đã tồn tại');
      }
      if (existed.phone === dto.phone) {
        throw new ConflictException('Số điện thoại đã được đăng ký');
      }
      if (dto.email && existed.email === dto.email) {
        throw new ConflictException('Email đã được đăng ký');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password');
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId);

    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
  }

  async searchUsers(keyword: string) {
    if (!keyword) return [];

    const isPhone = /^[0-9]{8,15}$/.test(keyword);

    const query = isPhone
      ? { phone: keyword }
      : {
        username: {
          $regex: keyword,
          $options: 'i',
        },
      };

    return this.userModel
      .find(query)
      .select('-password')
      .limit(20)
      .exec();
  }
}
