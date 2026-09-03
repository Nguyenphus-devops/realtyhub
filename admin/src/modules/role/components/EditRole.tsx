"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { RolesService } from "@/modules/role/services/roles.service";
import {
  Role,
  UpdateRoleDto,
  RolePermission,
  PermissionResource,
  PermissionAction,
  PermissionEffect,
  PermissionResourceTarget,
} from "@/modules/permission/types/permissions";
import { usePermissions } from "@/context/PermissionsContext";
import { toast } from "react-toastify";

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;

const resourceLabels: Record<string, string> = {
  "*": "Tất cả",
  banners: "Banner",
  blogs: "Bài viết",
  "categories-blog": "Danh mục bài viết",
  contacts: "Liên hệ",
  histories: "Lịch sử",
  images: "Hình ảnh",
  "info-websites": "Thông tin website",
  menus: "Menu",
  permissions: "Phân quyền",
  "service-packages": "Gói dịch vụ",
  "service-categories": "Loại dịch vụ",
  users: "Người dùng",
};

const actionLabels: Record<string, string> = {
  "*": "Tất cả",
  create: "Tạo mới",
  delete: "Xóa",
  edit: "Chỉnh sửa",
  get: "Xem",
};

const EditRole = () => {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;
  const { canEdit } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<RolePermission[]>([]);

  const nameError = useMemo(() => {
    const trimmed = formData.name.trim();
    if (!trimmed) return "Tên quyền không được để trống.";
    if (INVALID_NAME_CHARS_REGEX.test(trimmed)) {
      return "Tên quyền không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).";
    }
    return "";
  }, [formData.name]);

  const canEditRole = canEdit(PermissionResource.PERMISSION);

  const fetchRole = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RolesService.findOne(roleId);
      setRole(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        isActive: data.isActive,
      });
      setSelectedPermissions(data.permissions);
    } catch (error: unknown) {
      console.error("Failed to fetch role:", error);
      toast.error("Không thể tải thông tin quyền");
      router.push("/roles");
    } finally {
      setLoading(false);
    }
  }, [roleId, router]);

  useEffect(() => {
    if (!canEditRole) {
      toast.error("Bạn không có quyền chỉnh sửa phân quyền");
      router.push("/roles");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRole();
  }, [canEditRole, fetchRole, router]);

  const resources = Object.values(PermissionResource);
  const actions = Object.values(PermissionAction).filter((action) => action !== PermissionAction.ANY);
  const nonMasterResources: PermissionResource[] = resources.filter(
    (resource) => resource !== PermissionResource.ANY,
  );
  const childActions: PermissionAction[] = actions;
  const allChildPermissionsSelected = nonMasterResources.every((currentResource) =>
    childActions.every((currentAction) =>
      selectedPermissions.some(
        (p) => p.resourceType === currentResource && p.action === currentAction,
      ),
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameError) {
      toast.error(nameError);
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Vui lòng chọn ít nhất một quyền.");
      return;
    }

    try {
      setSaving(true);
      const dto: UpdateRoleDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        permissions: selectedPermissions,
        isActive: formData.isActive,
      };

      await RolesService.update(roleId, dto);
      toast.success("Role updated successfully");
      router.push("/roles");
    } catch (error: unknown) {
      console.error("Failed to update role:", error);
      const typedError = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(typedError.response?.data?.message || typedError.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (resource: string, action: string) => {
    if (resource === PermissionResource.ANY && action === PermissionAction.ANY) {
      if (allChildPermissionsSelected) {
        setSelectedPermissions(
          selectedPermissions.filter(
            (p) =>
              !(
                nonMasterResources.includes(p.resourceType as PermissionResource) &&
                childActions.includes(p.action as PermissionAction)
              ),
          ),
        );
        return;
      }

      const nextPermissions = selectedPermissions.filter(
        (p) =>
          !(
            nonMasterResources.includes(p.resourceType as PermissionResource) &&
            childActions.includes(p.action as PermissionAction)
          ),
      );

      nonMasterResources.forEach((currentResource) => {
        childActions.forEach((currentAction) => {
          nextPermissions.push({
            resourceType: currentResource,
            action: currentAction,
            resourceTarget: PermissionResourceTarget.ANY,
            effect: PermissionEffect.ALLOW,
          });
        });
      });

      setSelectedPermissions(nextPermissions);
      return;
    }

    if (action === PermissionAction.ANY) {
      const allSelected = childActions.every((currentAction) =>
        hasPermission(resource, currentAction),
      );

      if (allSelected) {
        setSelectedPermissions(
          selectedPermissions.filter(
            (p) =>
              !(
                p.resourceType === resource &&
                childActions.includes(p.action as PermissionAction)
              ),
          ),
        );
        return;
      }

      const nextPermissions = selectedPermissions.filter(
        (p) =>
          !(
            p.resourceType === resource &&
            childActions.includes(p.action as PermissionAction)
          ),
      );

      childActions.forEach((currentAction) => {
        nextPermissions.push({
          resourceType: resource,
          action: currentAction,
          resourceTarget: PermissionResourceTarget.ANY,
          effect: PermissionEffect.ALLOW,
        });
      });

      setSelectedPermissions(nextPermissions);
      return;
    }

    const exists = selectedPermissions.find(
      (p) => p.resourceType === resource && p.action === action
    );

    if (exists) {
      setSelectedPermissions(
        selectedPermissions.filter(
          (p) => !(p.resourceType === resource && p.action === action)
        )
      );
    } else {
      setSelectedPermissions([
        ...selectedPermissions,
        {
          resourceType: resource,
          action: action,
          resourceTarget: PermissionResourceTarget.ANY,
          effect: PermissionEffect.ALLOW,
        },
      ]);
    }
  };

  const hasPermission = (resource: string, action: string) => {
    if (resource === PermissionResource.ANY && action === PermissionAction.ANY) {
      return allChildPermissionsSelected;
    }

    if (resource === PermissionResource.ANY) {
      return nonMasterResources.every((currentResource) =>
        selectedPermissions.some(
          (p) => p.resourceType === currentResource && p.action === action,
        ),
      );
    }

    if (action === PermissionAction.ANY) {
      return childActions.every((currentAction) =>
        selectedPermissions.some(
          (p) => p.resourceType === resource && p.action === currentAction,
        ),
      );
    }

    return selectedPermissions.some(
      (p) => p.resourceType === resource && p.action === action
    );
  };

  const selectAllForResource = (resource: string) => {
    if (resource === PermissionResource.ANY) {
      togglePermission(PermissionResource.ANY, PermissionAction.ANY);
      return;
    }

    const allSelected = childActions.every((action) => hasPermission(resource, action));

    if (allSelected) {
      setSelectedPermissions(
        selectedPermissions.filter(
          (p) =>
            !(
              p.resourceType === resource &&
              childActions.includes(p.action as PermissionAction)
            ),
        )
      );
    } else {
      const newPermissions = selectedPermissions.filter(
        (p) =>
          !(
            p.resourceType === resource &&
            childActions.includes(p.action as PermissionAction)
          ),
      );
      childActions.forEach((action) => {
        if (!hasPermission(resource, action)) {
          newPermissions.push({
            resourceType: resource,
            action: action,
            resourceTarget: PermissionResourceTarget.ANY,
            effect: PermissionEffect.ALLOW,
          });
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!role || !canEditRole) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa quyền</h1>
        {role.isSystem && (
          <div className="mt-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
            Đây là quyền mặc định của hệ thống và không chỉnh sửa được.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên quyền <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={role.isSystem}
                className={`mt-1 block w-full rounded-lg border px-4 py-2 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  formData.name.trim() && nameError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Ví dụ: Quản lý bài viết"
                required
              />
              {formData.name.trim() && nameError ? (
                <p className="mt-1 text-xs font-medium text-red-500">{nameError}</p>
              ) : null}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <span className="text-xs text-gray-400">
                  {formData.description.length}/255 ký tự
                </span>
              </div>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 255) })}
                disabled={role.isSystem}
                maxLength={255}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Mô tả mục đích và vai trò của quyền này"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={role.isSystem}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Kích hoạt
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Các quyền <span className="text-red-500">*</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nhóm
                  </th>
                  {actions.map((action) => (
                    <th
                      key={action}
                      className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {actionLabels[action] ?? action}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tất cả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {resources.map((resource) => (
                  <tr key={resource} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {resourceLabels[resource] ?? resource}
                    </td>
                    {actions.map((action) => (
                      <td key={action} className="whitespace-nowrap px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={hasPermission(resource, action)}
                          onChange={() => togglePermission(resource, action)}
                          disabled={role.isSystem}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={childActions.every((action) => hasPermission(resource, action))}
                        onChange={() => selectAllForResource(resource)}
                        disabled={role.isSystem}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Đã chọn: {selectedPermissions.length} quyền
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/roles")}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          {!role.isSystem && (
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditRole;
