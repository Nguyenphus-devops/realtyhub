import { RolePermission } from '@/modules/permission/types/permissions';

export type AdminUserRole = 'super_admin' | 'admin' | 'staff' | 'user';
export type AdminUserStatus = 'active' | 'inactive';

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  roleId: string | null;
  customPermissions: RolePermission[] | null;

  isBlocked: boolean;
  blockedAt: string | null;
  isDeleted: boolean;
  lastLoginAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type AdminUsersListResponse = {
  data: AdminUser[];
  total: number;
};

export type AdminUsersListParams = {
  page: number;
  limit: number;
  email?: string;
  name?: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
};

export type AdminUpdateUserInput = Partial<{
  email: string | null;
  fullName: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  roleId: string | null;
  customPermissions: RolePermission[] | null;
  password: string;
  isBlocked: boolean;
  isDeleted: boolean;
}>;

export type AdminCreateUserInput = {
  email: string;
  fullName: string;
  password?: string;
  roleId?: string;
  role: AdminUserRole;
};


