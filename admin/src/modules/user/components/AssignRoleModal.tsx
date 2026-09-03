"use client";

import React, { useState, useEffect } from "react";
import { AdminUser } from "../models/user.model";
import { AdminUserService } from "../services/user.service";
import { RolesService } from "@/modules/role/services/roles.service";
import {
  Role,
  RolePermission,
  PermissionResource,
  PermissionAction,
  PermissionEffect,
  PermissionResourceTarget,
} from "@/modules/permission/types/permissions";
import { toast } from "react-toastify";

interface AssignRoleModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(user.roleId || "");
  const [useCustomPermissions, setUseCustomPermissions] = useState(
    user.customPermissions && user.customPermissions.length > 0 ? true : false
  );
  const [customPermissions, setCustomPermissions] = useState<RolePermission[]>(
    user.customPermissions || []
  );

  const resources = Object.values(PermissionResource);
  const actions = Object.values(PermissionAction).filter((action) => action !== PermissionAction.ANY);
  const nonMasterResources: PermissionResource[] = resources.filter(
    (resource) => resource !== PermissionResource.ANY,
  );
  const childActions: PermissionAction[] = actions;
  const allChildPermissionsSelected = nonMasterResources.every((currentResource) =>
    childActions.every((currentAction) =>
      customPermissions.some(
        (p) => p.resourceType === currentResource && p.action === currentAction,
      ),
    ),
  );

  useEffect(() => {
    const fetchRoles = async (): Promise<void> => {
      try {
        const response = await RolesService.findAll({ page: "1", limit: "100" });
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to load roles:", error);
        toast.error("Failed to load roles");
      }
    };

    void fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (useCustomPermissions) {
        if (customPermissions.length === 0) {
          toast.error("Please add at least one custom permission");
          return;
        }
        await AdminUserService.removeRole(user.id);
        await AdminUserService.assignCustomPermissions(user.id, customPermissions);
      } else {
        if (!selectedRoleId) {
          toast.error("Please select a role");
          return;
        }
        await AdminUserService.removeCustomPermissions(user.id);
        const res = await AdminUserService.assignRole(user.id, selectedRoleId);
        console.log("AssignRole API response:", res);
      }

      toast.success("User permissions updated successfully");
      await onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Failed to update user permissions:", error);

      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const errorMessage =
        axiosError.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to update permissions");

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (resource: string, action: string) => {
    if (resource === PermissionResource.ANY && action === PermissionAction.ANY) {
      if (allChildPermissionsSelected) {
        setCustomPermissions(
          customPermissions.filter(
            (p) =>
              !(
                nonMasterResources.includes(p.resourceType as PermissionResource) &&
                childActions.includes(p.action as PermissionAction)
              ),
          ),
        );
        return;
      }

      const nextPermissions = customPermissions.filter(
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

      setCustomPermissions(nextPermissions);
      return;
    }

    if (action === PermissionAction.ANY) {
      const allSelected = childActions.every((currentAction) =>
        hasPermission(resource, currentAction),
      );

      if (allSelected) {
        setCustomPermissions(
          customPermissions.filter(
            (p) =>
              !(
                p.resourceType === resource &&
                childActions.includes(p.action as PermissionAction)
              ),
          ),
        );
        return;
      }

      const nextPermissions = customPermissions.filter(
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

      setCustomPermissions(nextPermissions);
      return;
    }

    const exists = customPermissions.find(
      (p) => p.resourceType === resource && p.action === action
    );

    if (exists) {
      setCustomPermissions(
        customPermissions.filter(
          (p) => !(p.resourceType === resource && p.action === action)
        )
      );
    } else {
      setCustomPermissions([
        ...customPermissions,
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
        customPermissions.some(
          (p) => p.resourceType === currentResource && p.action === action,
        ),
      );
    }

    if (action === PermissionAction.ANY) {
      return childActions.every((currentAction) =>
        customPermissions.some(
          (p) => p.resourceType === resource && p.action === currentAction,
        ),
      );
    }

    return customPermissions.some(
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
      setCustomPermissions(
        customPermissions.filter(
          (p) =>
            !(
              p.resourceType === resource &&
              childActions.includes(p.action as PermissionAction)
            ),
        )
      );
    } else {
      const newPermissions = customPermissions.filter(
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
      setCustomPermissions(newPermissions);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Assign Role/Permissions - {user.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!useCustomPermissions}
                onChange={() => setUseCustomPermissions(false)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Assign Role</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={useCustomPermissions}
                onChange={() => setUseCustomPermissions(true)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Custom Permissions
              </span>
            </label>
          </div>

          {!useCustomPermissions ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Select a role --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} {role.description ? `- ${role.description}` : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Custom Permissions
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Resource
                      </th>
                      {actions.map((action) => (
                        <th
                          key={action}
                          className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500"
                        >
                          {action}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">
                        All
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {resources.map((resource) => (
                      <tr key={resource} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {resource}
                        </td>
                        {actions.map((action) => (
                          <td key={action} className="whitespace-nowrap px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={hasPermission(resource, action)}
                          onChange={() => togglePermission(resource, action)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={childActions.every((action) => hasPermission(resource, action))}
                        onChange={() => selectAllForResource(resource)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {customPermissions.length} permission(s)
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;
