import api from "@/config/api";
import { unwrapApiData } from "@/common/utils/unwrap-api-data";
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminCreateServicePackageInput,
  AdminServicePackage,
  AdminUpdateServicePackageInput,
} from "../models/service-package.model";

const SERVICE_PACKAGE_ROOT = apiRoutes.SERVICE_PACKAGE.BASE;

export const AdminServicePackageService = {
  list: async (params?: {
    category?: string;
    isActive?: boolean;
  }): Promise<AdminServicePackage[]> => {
    const response = await api.get<AdminServicePackage[]>(
      `${apiRoutes.SERVICE_PACKAGE.LIST(params)}`,
    );
    return unwrapApiData(response.data);
  },

  create: async (
    body: AdminCreateServicePackageInput,
  ): Promise<AdminServicePackage> => {
    const response = await api.post<AdminServicePackage>(
      SERVICE_PACKAGE_ROOT,
      body,
    );
    return unwrapApiData(response.data);
  },

  update: async (
    publicId: string,
    body: AdminUpdateServicePackageInput,
  ): Promise<AdminServicePackage> => {
    const response = await api.patch<AdminServicePackage>(
      `${apiRoutes.SERVICE_PACKAGE.UPDATE(publicId)}`,
      body,
    );
    return unwrapApiData(response.data);
  },

  remove: async (publicId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `${apiRoutes.SERVICE_PACKAGE.DELETE(publicId)}`,
    );
    return unwrapApiData(response.data);
  },

  reorder: async (orderedPublicIds: string[]): Promise<AdminServicePackage[]> => {
    const response = await api.patch<AdminServicePackage[]>(
      `${apiRoutes.SERVICE_PACKAGE.REORDER}`,
      { orderedPublicIds },
    );
    return unwrapApiData(response.data);
  },

  seedSample: async (): Promise<{
    message: string;
    totalSeedItems: number;
    createdCount: number;
    updatedCount: number;
  }> => {
    const response = await api.post(
      `${apiRoutes.SERVICE_PACKAGE.SEED_SAMPLE}`,
      {},
    );
    return unwrapApiData(response.data);
  },
};
