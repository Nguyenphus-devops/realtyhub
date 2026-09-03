import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import { apiRoutes } from '@/config/apiRoutes';
import type { PaginatedHistoryLogs } from '../models/history.model';

export const HistoryService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
  }): Promise<PaginatedHistoryLogs> => {
    const response = await api.get<PaginatedHistoryLogs>(
      `${apiRoutes.HISTORY.GET_ALL(params)}`,
    );
    return unwrapApiData(response.data);
  },
};
