import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import BlogService from '../services/blog.service';
import type {
  Blog,
  CreateBlogDto,
  PaginatedBlogs,
  UpdateBlogDto,
} from '../models/blog.model';

export const useBlogOne = (slug: string): UseQueryResult<Blog> => {
  return useQuery<Blog>({
    queryKey: ['blog', slug],
    queryFn: () => BlogService.getOne(slug),
    enabled: Boolean(slug),
  });
};

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateBlogDto) => BlogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { slug: string; data: UpdateBlogDto }) =>
      BlogService.update(params.slug, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      // Mark cached detail pages stale, but do not refetch/reset the active
      // editor immediately after save. It will fetch fresh data next mount.
      queryClient.invalidateQueries({
        queryKey: ['blog'],
        refetchType: 'inactive',
      });
    },
  });

  return { createMutation, updateMutation };
};

export const useBlogs = (
  page = 1,
  limit = 10,
  includeHidden = true,
  scope: 'all' | 'my' = 'all',
  searchQuery = '',
) => {
  const queryClient = useQueryClient();
  const trimmedSearch = searchQuery.trim();

  const listQuery = useQuery<PaginatedBlogs>({
    queryKey: ['blogs', page, limit, includeHidden, scope, trimmedSearch],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (trimmedSearch.length > 0) {
        if (scope === 'my') {
          return BlogService.searchMy({
            q: trimmedSearch,
            page,
            limit,
            includeHidden,
          });
        }
        return BlogService.search({
          q: trimmedSearch,
          page,
          limit,
          includeHidden,
        });
      }
      if (scope === 'my') {
        return BlogService.getMy({ page, limit, includeHidden });
      }
      return BlogService.findAll({ page, limit, includeHidden });
    },
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: (params: { slug: string; isHidden: boolean }) =>
      BlogService.updateVisibility(params.slug, params.isHidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (params: { slug: string; status: Blog['status'] }) =>
      BlogService.updateStatus(params.slug, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: (slug: string) => BlogService.softDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (slug: string) => BlogService.hardDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    listQuery,
    updateVisibilityMutation,
    updateStatusMutation,
    softDeleteMutation,
    hardDeleteMutation,
    blogs: listQuery.data?.blogs ?? [],
    total: listQuery.data?.total ?? 0,
    hasMore: listQuery.data?.hasMore ?? false,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
  };
};
