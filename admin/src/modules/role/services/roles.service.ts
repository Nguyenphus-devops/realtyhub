import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RolesPaginationQuery,
  RolesPaginationResponse,
  RolePermission,
} from '@/modules/permission/types/permissions';

export class RolesService {
  static async create(data: CreateRoleDto): Promise<Role> {
    const response = await api.post('/roles', data);
    return unwrapApiData(response.data);
  }

  static async findAll(query?: RolesPaginationQuery): Promise<RolesPaginationResponse> {
    const response = await api.get('/roles', {
      params: query,
    });
    return unwrapApiData(response.data);
  }

  static async findOne(id: string): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return unwrapApiData(response.data);
  }

  static async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const response = await api.patch(`/roles/${id}`, data);
    return unwrapApiData(response.data);
  }

  static async remove(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }

  static async getPermissions(id: string): Promise<RolePermission[]> {
    const response = await api.get(`/roles/${id}/permissions`);
    return unwrapApiData(response.data);
  }

  static async assignPermissions(id: string, permissions: RolePermission[]): Promise<Role> {
    const response = await api.patch(`/roles/${id}/permissions`, { permissions });
    return unwrapApiData(response.data);
  }
}
