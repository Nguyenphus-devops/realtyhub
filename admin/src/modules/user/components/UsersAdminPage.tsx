"use client";

import { Fragment, useMemo, useState } from 'react';
import { UserIcon } from '@/icons/index';
import Pagination from '@/common/components/tables/Pagination';
import { usePermissions } from '@/context/PermissionsContext';
import { PermissionResource } from '@/modules/permission/types/permissions';
import { useAuth } from '@/context/AuthContext';

import { useAdminUsers } from '../hooks/useAdminUsers';
import type { AdminUser, AdminUsersListParams } from '../models/user.model';
import AssignRoleModal from './AssignRoleModal';
import CreateUserModal from './CreateUserModal';

const DEFAULT_LIMIT = 20;

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString('vi-VN');
};

const badgeClass = (variant: 'neutral' | 'good' | 'warn' | 'bad'): string => {
  switch (variant) {
    case 'good':
      return 'bg-green-50 text-green-700 ring-green-600/20';
    case 'warn':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    case 'bad':
      return 'bg-red-50 text-red-700 ring-red-600/20';
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-600/20';
  }
};

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  user: 'User',
};

const statusLabel: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const UsersAdminPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isBlocked, setIsBlocked] = useState<'all' | 'true' | 'false'>('all');
  const [isDeleted, setIsDeleted] = useState<'all' | 'true' | 'false'>('false');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { canEdit, canDelete } = usePermissions();
  const { user: currentAuthUser, verifyToken } = useAuth();
  const canAssignRole = canEdit(PermissionResource.USER);
  const canToggleBlock = canEdit(PermissionResource.USER);
  const canToggleDelete = canDelete(PermissionResource.USER);
  const showActionColumn = canAssignRole || canToggleBlock || canToggleDelete;

  const params: AdminUsersListParams = useMemo(() => {
    const mapped: AdminUsersListParams = {
      page,
      limit,
    };
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (trimmedEmail) {
      mapped.email = trimmedEmail;
    }
    if (trimmedName) {
      mapped.name = trimmedName;
    }
    if (isBlocked !== 'all') {
      mapped.isBlocked = isBlocked === 'true';
    }
    if (isDeleted !== 'all') {
      mapped.isDeleted = isDeleted === 'true';
    }
    return mapped;
  }, [email, isBlocked, isDeleted, limit, name, page]);

  const { listQuery, updateMutation, removeMutation } = useAdminUsers(params);

  const data = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const toggleBlock = (user: AdminUser) => {
    updateMutation.mutate({
      id: user.id,
      body: {
        isBlocked: !user.isBlocked,
      },
    });
  };

  const toggleDelete = (user: AdminUser) => {
    const ok = window.confirm(
      user.isDeleted
        ? 'Khôi phục trạng thái xóa mềm cho user này?'
        : 'Xóa mềm user này? User sẽ không đăng nhập được nữa.',
    );
    if (!ok) {
      return;
    }
    if (user.isDeleted) {
      updateMutation.mutate({
        id: user.id,
        body: { isDeleted: false },
      });
      return;
    }
    removeMutation.mutate({ id: user.id });
  };

  const showInitialSpinner = listQuery.isLoading && data.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <UserIcon className="h-6 w-6" />
          </span>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Người dùng
            </h1>
            {canEdit(PermissionResource.USER) && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Thêm người dùng
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Email</span>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setPage(1);
              }}
              placeholder="gmail"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-900"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Tên</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPage(1);
              }}
              placeholder="Nguyễn"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-900"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Blocked</span>
            <select
              value={isBlocked}
              onChange={(e) => {
                setIsBlocked(e.target.value as typeof isBlocked);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-900"
            >
              <option value="all">Tất cả</option>
              <option value="false">Không</option>
              <option value="true">Có</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Deleted</span>
            <select
              value={isDeleted}
              onChange={(e) => {
                setIsDeleted(e.target.value as typeof isDeleted);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-900"
            >
              <option value="false">Chưa xóa</option>
              <option value="true">Đã xóa</option>
              <option value="all">Tất cả</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold">{total.toLocaleString('vi-VN')}</span>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </div>

        {showInitialSpinner ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500" />
          </div>
        ) : listQuery.isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            Không tải được danh sách user. Kiểm tra đăng nhập hoặc API.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    User
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Role / Status
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Block / Delete
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Last login
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Created
                  </th>
                  {showActionColumn && (
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Thao tác
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((user) => (
                  <Fragment key={user.id}>
                    <tr className="align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {user.fullName ?? '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email ?? '—'}
                        </div>
                        {/* <div className="mt-1 text-xs text-gray-400">
                          ID: {user.id}
                        </div> */}
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass(
                              'neutral',
                            )}`}
                          >
                            {roleLabel[user.role] ?? user.role}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass(
                              user.status === 'active' ? 'good' : 'warn',
                            )}`}
                          >
                            {statusLabel[user.status] ?? user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass(
                              user.isBlocked ? 'bad' : 'good',
                            )}`}
                          >
                            Blocked: {user.isBlocked ? 'Yes' : 'No'}
                          </span>
                          <span
                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass(
                              user.isDeleted ? 'bad' : 'neutral',
                            )}`}
                          >
                            Deleted: {user.isDeleted ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDateTime(user.lastLoginAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDateTime(user.createdAt)}
                      </td>
                      {showActionColumn && (
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {canAssignRole && (
                              <button
                                type="button"
                                onClick={() => setSelectedUser(user)}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-theme-xs hover:bg-blue-100"
                              >
                                Assign Role
                              </button>
                            )}
                            {canToggleBlock && (
                              <button
                                type="button"
                                onClick={() => toggleBlock(user)}
                                disabled={updateMutation.isPending || user.isDeleted}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50"
                              >
                                {user.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            )}
                            {canToggleDelete && (
                              <button
                                type="button"
                                onClick={() => toggleDelete(user)}
                                disabled={removeMutation.isPending || updateMutation.isPending}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-theme-xs hover:bg-red-100 disabled:opacity-50"
                              >
                                {user.isDeleted ? 'Restore' : 'Delete'}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  </Fragment>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={showActionColumn ? 6 : 5}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      Không có user phù hợp bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <AssignRoleModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={async () => {
            listQuery.refetch();
            if (currentAuthUser?.id === selectedUser.id) {
              await verifyToken();
            }
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async () => {
            await listQuery.refetch();
          }}
        />
      )}
    </div>
  );
};

export default UsersAdminPage;

