import { Permission } from '../modules/permissions/types/permission.type';

declare global {
  namespace Express {
    interface User {
      id: string;
      sessionId: string;
      email?: string;
      role?: string;
      permissions?: string[];
    }

    interface Request {
      user?: User;
      permissionsContext?: {
        allowedResourcesIds: string[] | null;
        deniedResourcesIds: string[] | null;
        grantedPermissions: Permission[];
      };
    }
  }
}
