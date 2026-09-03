import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RolesPaginationQueryDto } from './dtos/roles-pagination-query.dto';

export type RolesPaginatedResult = {
  data: Role[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface IRolesService {
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  findAll(query: RolesPaginationQueryDto): Promise<RolesPaginatedResult>;
  findOne(id: string): Promise<Role>;
  findByName(name: string): Promise<Role | null>;
  update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
  remove(id: string): Promise<void>;
  assignPermissions(id: string, permissions: any[]): Promise<Role>;
  getPermissions(id: string): Promise<any[]>;
}
