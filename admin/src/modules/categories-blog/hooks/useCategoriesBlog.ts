import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import CategoriesBlogService from '../services/categories-blog.service';
import type {
  CategoriesBlog,
  CreateCategoriesBlogDto,
  PaginatedCategoriesBlog,
  UpdateCategoriesBlogDto,
} from '../models/categories-blog.model';

export const useCategoriesBlogOne = (
  slug: string,
): UseQueryResult<CategoriesBlog> => {
  return useQuery<CategoriesBlog>({
    queryKey: ['categories-blog', slug],
    queryFn: () => CategoriesBlogService.getOne(slug),
    enabled: Boolean(slug),
  });
};

export const useCategoriesBlogs = (page = 1, limit = 20) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<PaginatedCategoriesBlog>({
    queryKey: ['categories-blog', 'list', page, limit],
    placeholderData: keepPreviousData,
    queryFn: () => CategoriesBlogService.findAll({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoriesBlogDto) =>
      CategoriesBlogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-blog'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { slug: string; data: UpdateCategoriesBlogDto }) =>
      CategoriesBlogService.update(params.slug, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-blog'] });
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: (slug: string) => CategoriesBlogService.softDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-blog'] });
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (slug: string) => CategoriesBlogService.hardDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-blog'] });
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    softDeleteMutation,
    hardDeleteMutation,
    categories: listQuery.data?.categories ?? [],
    total: listQuery.data?.total ?? 0,
    page: listQuery.data?.page ?? page,
    limit: listQuery.data?.limit ?? limit,
    hasMore: listQuery.data?.hasMore ?? false,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
  };
};
