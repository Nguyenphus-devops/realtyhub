import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../auth/users/entities/user.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RolesPaginationQueryDto } from './dtos/roles-pagination-query.dto';
import { IRolesService } from './roles';

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;

@Injectable()
export class RolesService implements IRolesService, OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultRoles();
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private validateRoleData(name?: string, description?: string) {
    if (name !== undefined) {
      const nameTrim = name.trim();
      if (!nameTrim) {
        throw new BadRequestException('Tên quyền không được để trống.');
      }
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        throw new BadRequestException(
          'Tên quyền không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
        );
      }
    }
    if (description !== undefined && description.length > 255) {
      throw new BadRequestException('Mô tả quyền không được vượt quá 255 ký tự.');
    }
  }

  private async seedDefaultRoles() {
    try {
      const adminRole = await this.rolesRepository.findOne({
        where: { name: 'admin' } as any,
      });
      if (!adminRole) {
        const newAdmin = this.rolesRepository.create({
          name: 'admin',
          description: 'Administrator role with full access',
          permissions: [
            {
              resourceType: '*',
              action: '*',
              resourceTarget: '*',
              effect: 'ALLOW',
            },
          ],
          isActive: true,
          isSystem: true,
        });
        await this.rolesRepository.save(newAdmin);
        console.log('Seeded default "admin" role successfully');
      }

      const userRole = await this.rolesRepository.findOne({
        where: { name: 'user' } as any,
      });
      if (!userRole) {
        const newUser = this.rolesRepository.create({
          name: 'user',
          description: 'Standard user role with basic access',
          permissions: [],
          isActive: true,
          isSystem: true,
        });
        await this.rolesRepository.save(newUser);
        console.log('Seeded default "user" role successfully');
      }
    } catch (err) {
      console.error('Error seeding default roles:', err);
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const nameTrim = createRoleDto.name?.trim();
    this.validateRoleData(nameTrim, createRoleDto.description);

    const existingRole = await this.rolesRepository.findOne({
      where: {
        name: { $regex: `^${this.escapeRegex(nameTrim)}$`, $options: 'i' },
      } as any,
    });

    if (existingRole) {
      throw new BadRequestException('Tên quyền đã tồn tại trong hệ thống.');
    }

    const role = this.rolesRepository.create({
      ...createRoleDto,
      name: nameTrim,
      description: createRoleDto.description?.trim(),
      isActive: createRoleDto.isActive ?? true,
      isSystem: false,
    });

    return await this.rolesRepository.save(role);
  }

  async findAll(query: RolesPaginationQueryDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    // Build MongoDB filter
    const filter: any = {};

    // Search filter
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Active filter
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    // Get total count
    const total = await this.rolesRepository.count(filter);

    // Get paginated results
    const roles = await this.rolesRepository.find({
      where: filter,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: roles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } as any });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.rolesRepository.findOne({ where: { name } as any });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new BadRequestException('Không thể chỉnh sửa quyền hệ thống.');
    }

    if (updateRoleDto.name !== undefined) {
      const nameTrim = updateRoleDto.name.trim();
      this.validateRoleData(nameTrim, updateRoleDto.description);

      if (nameTrim.toLowerCase() !== role.name.trim().toLowerCase()) {
        const existingRole = await this.rolesRepository.findOne({
          where: {
            name: { $regex: `^${this.escapeRegex(nameTrim)}$`, $options: 'i' },
          } as any,
        });

        if (existingRole && existingRole.id !== id) {
          throw new BadRequestException('Tên quyền đã tồn tại trong hệ thống.');
        }
      }
      updateRoleDto.name = nameTrim;
    } else if (updateRoleDto.description !== undefined) {
      this.validateRoleData(undefined, updateRoleDto.description);
    }

    if (updateRoleDto.description !== undefined) {
      updateRoleDto.description = updateRoleDto.description.trim();
    }

    Object.assign(role, updateRoleDto);
    return await this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new BadRequestException('Không thể xóa quyền hệ thống.');
    }

    const allUsers = await this.usersRepository.find({
      where: { isDeleted: false } as any,
    });

    const roleIdStr = role.id ? role.id.toString() : '';
    const mongoIdStr = (role as any)._id ? (role as any)._id.toString() : '';
    const roleNameLower = role.name ? role.name.trim().toLowerCase() : '';

    const assignedUsers = allUsers.filter((u) => {
      const userRoleId = u.roleId ? u.roleId.toString() : '';
      const userRole = u.role ? u.role.toString().trim().toLowerCase() : '';

      return (
        (roleIdStr && userRoleId === roleIdStr) ||
        (mongoIdStr && userRoleId === mongoIdStr) ||
        (roleNameLower && userRole === roleNameLower)
      );
    });

    if (assignedUsers.length > 0) {
      throw new BadRequestException(
        `Không thể xóa vì quyền đang được gán cho ${assignedUsers.length} người dùng`,
      );
    }

    await this.rolesRepository.remove(role);
  }

  async assignPermissions(id: string, permissions: any[]): Promise<Role> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new BadRequestException(
        'Cannot modify permissions of system roles',
      );
    }

    role.permissions = permissions;
    return await this.rolesRepository.save(role);
  }

  async getPermissions(id: string): Promise<any[]> {
    const role = await this.findOne(id);
    return role.permissions;
  }
}
