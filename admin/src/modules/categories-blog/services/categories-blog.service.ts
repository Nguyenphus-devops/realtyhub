import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import { apiRoutes } from '@/config/apiRoutes';
import type {
  CategoriesBlog,
  CreateCategoriesBlogDto,
  PaginatedCategoriesBlog,
  UpdateCategoriesBlogDto,
} from '../models/categories-blog.model';

const baseUrl = () => apiRoutes.CATEGORIES_BLOG.BASE;

export const CategoriesBlogService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedCategoriesBlog> => {
    const response = await api.get<PaginatedCategoriesBlog>(
      `${apiRoutes.CATEGORIES_BLOG.GET_ALL(params)}`,
    );
    return unwrapApiData(response.data);
  },

  getOne: async (slug: string): Promise<CategoriesBlog> => {
    const response = await api.get<CategoriesBlog>(
      `${apiRoutes.CATEGORIES_BLOG.GET_BY_SLUG(slug)}`,
    );
    return unwrapApiData(response.data);
  },

  create: async (dto: CreateCategoriesBlogDto): Promise<CategoriesBlog> => {
    const response = await api.post<CategoriesBlog>(
      baseUrl(),
      {
        name: dto.name.trim(),
        ...(dto.slug?.trim() ? { slug: dto.slug.trim() } : {}),
        ...(dto.parentSlug?.trim()
          ? { parentSlug: dto.parentSlug.trim() }
          : {}),
      },
    );
    return unwrapApiData(response.data);
  },

  update: async (
    slug: string,
    dto: UpdateCategoriesBlogDto,
  ): Promise<CategoriesBlog> => {
    const response = await api.patch<CategoriesBlog>(
      `${apiRoutes.CATEGORIES_BLOG.UPDATE(slug)}`,
      dto,
    );
    return unwrapApiData(response.data);
  },

  softDelete: async (slug: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `${apiRoutes.CATEGORIES_BLOG.DELETE(slug)}`,
    );
    return unwrapApiData(response.data);
  },

  hardDelete: async (slug: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `${apiRoutes.CATEGORIES_BLOG.HARD_DELETE(slug)}`,
    );
    return unwrapApiData(response.data);
  },
};

export default CategoriesBlogService;
