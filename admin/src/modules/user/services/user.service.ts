import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import { apiRoutes } from "@/config/apiRoutes";
import { RolePermission } from '@/modules/permission/types/permissions';

import type {
  AdminUpdateUserInput,
  AdminCreateUserInput,
  AdminUsersListParams,
  AdminUsersListResponse,
  AdminUser,
} from '../models/user.model';

export const AdminUserService = {
  create: async (body: AdminCreateUserInput): Promise<AdminUser> => {
    const response = await api.post<AdminUser>(
      `${apiRoutes.USERS.BASE}`,
      body,
    );
    return unwrapApiData(response.data);
  },

  list: async (params: AdminUsersListParams): Promise<AdminUsersListResponse> => {
    const response = await api.get<AdminUsersListResponse>(
      `${apiRoutes.USERS.LIST(params)}`,
    );
    return unwrapApiData(response.data);
  },

  update: async (id: string, body: AdminUpdateUserInput): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(
      `${apiRoutes.USERS.UPDATE(id)}`,
      body,
    );
    return unwrapApiData(response.data);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`${apiRoutes.USERS.DELETE(id)}`);
  },

  assignRole: async (id: string, roleId: string): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(
      `${apiRoutes.USERS.BASE}/${id}/role`,
      { roleId },
    );
    return unwrapApiData(response.data);
  },

  removeRole: async (id: string): Promise<void> => {
    await api.delete(`${apiRoutes.USERS.BASE}/${id}/role`);
  },

  assignCustomPermissions: async (id: string, permissions: RolePermission[]): Promise<AdminUser> => {
    const response = await api.post<AdminUser>(
      `${apiRoutes.USERS.BASE}/${id}/permissions`,
      permissions,
    );
    return unwrapApiData(response.data);
  },

  removeCustomPermissions: async (id: string): Promise<void> => {
    await api.delete(`${apiRoutes.USERS.BASE}/${id}/permissions`);
  },
};

