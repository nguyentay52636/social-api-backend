import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument, RoleName, RoleStatus } from './entities/roles.schema';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(dto: CreateRoleDto): Promise<RoleDocument> {
    const roleData = {
      name: dto.name || RoleName.USER,
      description: dto.description || '',
      status: RoleStatus.ACTIVE,
    };

    const existed = await this.roleModel.findOne({ name: roleData.name });

    if (existed) {
      throw new ConflictException('Role đã tồn tại');
    }

    return this.roleModel.create(roleData);
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }

    return role;
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name: name.toLowerCase() });
  }

  async findActiveRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find({ status: RoleStatus.ACTIVE });
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleDocument> {
    // Kiểm tra nếu name được cập nhật và đã tồn tại
    if (dto.name) {
      const existingRole = await this.roleModel.findOne({
        name: dto.name,
        _id: { $ne: id },
      });

      if (existingRole) {
        throw new ConflictException('Tên role đã tồn tại');
      }
    }

    const role = await this.roleModel.findByIdAndUpdate(id, dto, { new: true });

    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }

    return role;
  }

  async delete(id: string): Promise<void> {
    const result = await this.roleModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Không tìm thấy role');
    }
  }

  async activate(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findByIdAndUpdate(
      id,
      { status: RoleStatus.ACTIVE },
      { new: true },
    );

    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }

    return role;
  }

  async deactivate(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findByIdAndUpdate(
      id,
      { status: RoleStatus.INACTIVE },
      { new: true },
    );

    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }

    return role;
  }

  // Tạo các role mặc định khi khởi động app
  async seedDefaultRoles(): Promise<void> {
    const defaultRoles = [
      { name: RoleName.USER, description: 'Người dùng thông thường' },
      { name: RoleName.ADMIN, description: 'Quản trị viên' },
      { name: RoleName.MANAGER, description: 'Quản lý' },
    ];

    for (const roleData of defaultRoles) {
      const exists = await this.roleModel.findOne({ name: roleData.name });
      if (!exists) {
        await this.roleModel.create({
          ...roleData,
          status: RoleStatus.ACTIVE,
        });
      }
    }
  }
}
