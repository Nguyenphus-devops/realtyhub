import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { HistoryService } from '../services/history.service';
import type { PaginatedHistoryLogs } from '../models/history.model';

export const useHistoryLogs = (
  page: number,
  limit: number,
  actionFilter: string,
) => {
  const listQuery = useQuery<PaginatedHistoryLogs>({
    queryKey: ['history', 'list', page, limit, actionFilter],
    placeholderData: keepPreviousData,
    queryFn: () =>
      HistoryService.findAll({
        page,
        limit,
        ...(actionFilter.trim() !== '' ? { action: actionFilter.trim() } : {}),
      }),
  });

  return {
    listQuery,
    logs: listQuery.data?.logs ?? [],
    total: listQuery.data?.total ?? 0,
    resolvedPage: listQuery.data?.page ?? page,
    resolvedLimit: listQuery.data?.limit ?? limit,
    hasMore: listQuery.data?.hasMore ?? false,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
  };
};
