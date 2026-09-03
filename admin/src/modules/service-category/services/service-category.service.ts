import api from "@/config/api";
import { unwrapApiData } from "@/common/utils/unwrap-api-data";
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminCreateServiceCategoryInput,
  AdminServiceCategory,
  AdminUpdateServiceCategoryInput,
} from "../models/service-category.model";

const ROOT = apiRoutes.SERVICE_CATEGORY.BASE;

export const AdminServiceCategoryService = {
  list: async (): Promise<AdminServiceCategory[]> => {
    const response = await api.get<AdminServiceCategory[]>(ROOT);
    return unwrapApiData(response.data);
  },
  create: async (body: AdminCreateServiceCategoryInput): Promise<AdminServiceCategory> => {
    const response = await api.post<AdminServiceCategory>(ROOT, body);
    return unwrapApiData(response.data);
  },
  update: async (publicId: string, body: AdminUpdateServiceCategoryInput): Promise<AdminServiceCategory> => {
    const response = await api.patch<AdminServiceCategory>(apiRoutes.SERVICE_CATEGORY.UPDATE(publicId), body);
    return unwrapApiData(response.data);
  },
  remove: async (publicId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(apiRoutes.SERVICE_CATEGORY.DELETE(publicId));
    return unwrapApiData(response.data);
  },
};
