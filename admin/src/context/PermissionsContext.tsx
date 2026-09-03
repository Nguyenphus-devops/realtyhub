"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  Permission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
  PermissionEffect,
} from "@/modules/permission/types/permissions";

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (
    resource: PermissionResource | string,
    action: PermissionAction | string,
    target?: PermissionResourceTarget | string
  ) => boolean;
  canCreate: (resource: PermissionResource | string) => boolean;
  canEdit: (resource: PermissionResource | string, targetId?: string) => boolean;
  canDelete: (resource: PermissionResource | string, targetId?: string) => boolean;
  canView: (resource: PermissionResource | string, targetId?: string) => boolean;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { user, isAuthenticated } = useAuth();

  const permissions = useMemo<Permission[]>(() => {
    if (!isAuthenticated || !user) {
      return [];
    }

    return user.permissions || [];
  }, [user, isAuthenticated]);

  const isLoading = useMemo(() => isAuthenticated && !user, [isAuthenticated, user]);

  const hasPermission = useCallback(
    (
      resource: PermissionResource | string,
      action: PermissionAction | string,
      target: PermissionResourceTarget | string = PermissionResourceTarget.ANY
    ): boolean => {
      if (!isAuthenticated || !user) {
        return false;
      }

      // Super admin has all permissions
      if (user.role === "super_admin" || user.role === "admin") {
        return true;
      }

      // Check for wildcard permissions
      const hasWildcardResource = permissions.some(
        (p) =>
          (p.resourceType === PermissionResource.ANY || p.resourceType === "*") &&
          (p.action === action || p.action === PermissionAction.ANY || p.action === "*") &&
          p.effect === PermissionEffect.ALLOW
      );

      if (hasWildcardResource) {
        return true;
      }

      const hasWildcardAction = permissions.some(
        (p) =>
          p.resourceType === resource &&
          (p.action === PermissionAction.ANY || p.action === "*") &&
          p.effect === PermissionEffect.ALLOW
      );

      if (hasWildcardAction) {
        return true;
      }

      // Check for specific permission
      const hasSpecificPermission = permissions.some(
        (p) =>
          p.resourceType === resource &&
          p.action === action &&
          (p.resourceTarget === target ||
            p.resourceTarget === PermissionResourceTarget.ANY ||
            p.resourceTarget === "*") &&
          p.effect === PermissionEffect.ALLOW
      );

      if (hasSpecificPermission) {
        return true;
      }

      // Check for deny permissions (deny takes precedence)
      const hasDenyPermission = permissions.some(
        (p) =>
          p.resourceType === resource &&
          p.action === action &&
          (p.resourceTarget === target ||
            p.resourceTarget === PermissionResourceTarget.ANY ||
            p.resourceTarget === "*") &&
          p.effect === PermissionEffect.DENY
      );

      if (hasDenyPermission) {
        return false;
      }

      return false;
    },
    [permissions, isAuthenticated, user]
  );

  const canCreate = useCallback(
    (resource: PermissionResource | string): boolean => {
      return hasPermission(resource, PermissionAction.CREATE);
    },
    [hasPermission]
  );

  const canEdit = useCallback(
    (resource: PermissionResource | string, targetId?: string): boolean => {
      return hasPermission(
        resource,
        PermissionAction.EDIT,
        targetId || PermissionResourceTarget.ANY
      );
    },
    [hasPermission]
  );

  const canDelete = useCallback(
    (resource: PermissionResource | string, targetId?: string): boolean => {
      return hasPermission(
        resource,
        PermissionAction.DELETE,
        targetId || PermissionResourceTarget.ANY
      );
    },
    [hasPermission]
  );

  const canView = useCallback(
    (resource: PermissionResource | string, targetId?: string): boolean => {
      return hasPermission(
        resource,
        PermissionAction.GET,
        targetId || PermissionResourceTarget.ANY
      );
    },
    [hasPermission]
  );

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        hasPermission,
        canCreate,
        canEdit,
        canDelete,
        canView,
        isLoading,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
