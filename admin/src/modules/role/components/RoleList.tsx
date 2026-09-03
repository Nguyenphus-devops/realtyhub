"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RolesService } from "@/modules/role/services/roles.service";
import {
  Role,
  RolesPaginationQuery,
  PermissionResource,
} from "@/modules/permission/types/permissions";
import { usePermissions } from "@/context/PermissionsContext";
import { toast } from "react-toastify";

const RolesList = () => {
  const router = useRouter();
  const { canView, canCreate, canEdit, canDelete } = usePermissions();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined,
  );

  const canManageRoles = canView(PermissionResource.PERMISSION);
  const showActionColumn =
    canEdit(PermissionResource.PERMISSION) ||
    canDelete(PermissionResource.PERMISSION);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const query: RolesPaginationQuery = {
        page: String(page),
        limit: String(limit),
        search: search || undefined,
        isActive: isActiveFilter,
      };

      const response = await RolesService.findAll(query);
      setRoles(response.data);
      setTotal(response.meta.total);
    } catch (error: unknown) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [page, search, isActiveFilter, limit]);

  useEffect(() => {
    if (!canManageRoles) {
      toast.error("You don't have permission to view roles");
      router.push("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoles();
  }, [canManageRoles, fetchRoles, router]);

  const handleDelete = async (id: string, roleName: string) => {
    if (!canDelete(PermissionResource.PERMISSION)) {
      toast.error("Bạn không có quyền xóa phân quyền");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa quyền "${roleName}"?`)) {
      return;
    }

    try {
      await RolesService.remove(id);
      toast.success("Đã xóa quyền thành công.");
      fetchRoles();
    } catch (error: unknown) {
      console.error("Failed to delete role:", error);
      const typedError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        typedError.response?.data?.message ||
          typedError.message ||
          "Xóa quyền thất bại",
      );
    }
  };

  const handleEdit = (id: string) => {
    if (!canEdit(PermissionResource.PERMISSION)) {
      toast.error("You don't have permission to edit roles");
      return;
    }
    router.push(`/roles/${id}/edit`);
  };

  const handleCreate = () => {
    if (!canCreate(PermissionResource.PERMISSION)) {
      toast.error("You don't have permission to create roles");
      return;
    }
    router.push("/roles/create");
  };

  const totalPages = Math.ceil(total / limit);

  if (!canManageRoles) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phân quyền</h1>
        {canCreate(PermissionResource.PERMISSION) && (
          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Thêm quyền mới
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm quyền..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
        <select
          value={
            isActiveFilter === undefined
              ? "all"
              : isActiveFilter
                ? "active"
                : "inactive"
          }
          onChange={(e) => {
            const value = e.target.value;
            setIsActiveFilter(value === "all" ? undefined : value === "active");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Số lượng quyền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hệ thống
                  </th>
                  {showActionColumn && (
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Hành động
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {roles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showActionColumn ? 6 : 5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy quyền nào
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {role.name}
                      </td>
                      <td className="max-w-xs px-6 py-4 text-sm text-gray-500 break-words" title={role.description || ""}>
                        <div className="line-clamp-2">
                          {role.description || "-"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {role.permissions.length} quyền
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            role.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {role.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {role.isSystem ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                            Hệ thống
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      {showActionColumn && (
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {canEdit(PermissionResource.PERMISSION) && (
                              <button
                                onClick={() => handleEdit(role.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Sửa
                              </button>
                            )}
                            {canDelete(PermissionResource.PERMISSION) &&
                              !role.isSystem && (
                                <button
                                  onClick={() => handleDelete(role.id, role.name)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Xóa
                                </button>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                HIển thị {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RolesList;
