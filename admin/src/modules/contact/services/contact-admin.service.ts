import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminContact,
  UpdateAdminContactPayload,
} from '../models/contact.model';

const listUrl = () => `${apiRoutes.CONTACTS.BASE}`;

const byIdUrl = (id: string) =>
  `${apiRoutes.CONTACTS.BY_ID(id)}`;

export const ContactAdminService = {
  findAll: async (): Promise<AdminContact[]> => {
    const response = await api.get<AdminContact[]>(listUrl());
    const data = unwrapApiData<AdminContact[]>(response.data) || [];

    return data.map((item) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  update: async (
    id: string,
    payload: UpdateAdminContactPayload,
  ): Promise<AdminContact> => {
    const response = await api.patch<AdminContact>(
      byIdUrl(id),
      payload,
    );
    const updated = unwrapApiData<AdminContact>(response.data);
    return {
      ...updated,
      id: updated._id || updated.id,
    };
  },
};
