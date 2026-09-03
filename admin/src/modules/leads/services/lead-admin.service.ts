import api from '@/config/api';
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminLead,
  UpdateAdminLeadPayload,
} from '../models/lead.model';

const listUrl = () => `${apiRoutes.LEADS.BASE}`;
const byIdUrl = (id: string) => `${apiRoutes.LEADS.BY_ID(id)}`;

export const LeadAdminService = {
  findAll: async (): Promise<AdminLead[]> => {
    const response = await api.get<any>(listUrl());
    const raw = response.data;

    let list: AdminLead[] = [];

    if (raw?.data && typeof raw.data === 'object' && 'data' in raw.data) {
      list = Array.isArray(raw.data.data) ? raw.data.data : [];
    } else if (Array.isArray(raw?.data)) {
      list = raw.data;
    } else {
      console.warn('Unexpected leads response format:', raw);
      return [];
    }

    return list.map((item) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  update: async (
    id: string,
    payload: UpdateAdminLeadPayload,
  ): Promise<AdminLead> => {
    const response = await api.patch<any>(byIdUrl(id), payload);
    const raw = response.data;

    let updatedLead: AdminLead;

    if (raw && typeof raw === 'object' && '_id' in raw) {
      updatedLead = raw;
    } else if (raw?.data && typeof raw.data === 'object' && '_id' in raw.data) {
      updatedLead = raw.data;
    } else {
      throw new Error('Invalid response from update');
    }

    return {
      ...updatedLead,
      id: updatedLead._id || updatedLead.id,
    };
  },
};