import api from '@/config/api';
import { apiRoutes } from "@/config/apiRoutes";
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import type {
  Blog,
  CreateBlogDto,
  PaginatedBlogs,
  UpdateBlogDto,
} from '../models/blog.model';

const API_URL = apiRoutes.BLOG.BASE;

export const BlogService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
    includeHidden?: boolean;
  }): Promise<PaginatedBlogs> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }
    if (params?.includeHidden !== undefined) {
      queryParams.append('includeHidden', String(params.includeHidden));
    }
    const suffix = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`${API_URL}${suffix}`);
    return unwrapApiData<PaginatedBlogs>(response.data);
  },

  getMy: async (params?: {
    page?: number;
    limit?: number;
    includeHidden?: boolean;
  }): Promise<PaginatedBlogs> => {
    const response = await api.get(
      `${apiRoutes.BLOG.GET_MY(params)}`,
    );
    return unwrapApiData(response.data);
  },

  search: async (params: {
    q: string;
    page?: number;
    limit?: number;
    includeHidden?: boolean;
  }): Promise<PaginatedBlogs> => {
    const response = await api.get(
      `${apiRoutes.BLOG.SEARCH(params)}`,
    );
    return unwrapApiData(response.data);
  },

  searchMy: async (params: {
    q: string;
    page?: number;
    limit?: number;
    includeHidden?: boolean;
  }): Promise<PaginatedBlogs> => {
    const response = await api.get(
      `${apiRoutes.BLOG.SEARCH_MY(params)}`,
    );
    return unwrapApiData(response.data);
  },

  getOne: async (slug: string): Promise<Blog> => {
    const response = await api.get(
      `${apiRoutes.BLOG.GET_BY_SLUG(slug)}`,
    );
    return unwrapApiData(response.data);
  },

  create: async (dto: CreateBlogDto): Promise<Blog> => {
    const response = await api.post(API_URL, dto);
    return unwrapApiData(response.data);
  },

  update: async (slug: string, dto: UpdateBlogDto): Promise<Blog> => {
    const response = await api.patch(
      `${API_URL}/${encodeURIComponent(slug)}`,
      dto,
    );
    return unwrapApiData(response.data);
  },

  updateVisibility: async (
    slug: string,
    isHidden: boolean,
  ): Promise<Blog> => {
    const response = await api.patch(
      `${apiRoutes.BLOG.UPDATE_VISIBILITY(slug)}`,
      { isHidden },
    );
    return unwrapApiData(response.data);
  },

  updateStatus: async (
    slug: string,
    status: Blog['status'],
  ): Promise<Blog> => {
    const response = await api.patch(
      `${apiRoutes.BLOG.UPDATE_STATUS(slug)}`,
      { status },
    );
    return unwrapApiData(response.data);
  },

  softDelete: async (slug: string): Promise<{ message: string }> => {
    const response = await api.delete(
      `${API_URL}/${encodeURIComponent(slug)}`,
    );
    return unwrapApiData(response.data);
  },

  hardDelete: async (slug: string): Promise<{ message: string }> => {
    const response = await api.delete(
      `${apiRoutes.BLOG.HARD_DELETE(slug)}`,
    );
    return unwrapApiData(response.data);
  },
};

export default BlogService;
