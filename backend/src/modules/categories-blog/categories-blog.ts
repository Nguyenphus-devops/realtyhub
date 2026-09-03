import { CreateCategoriesBlogDto } from './dto/create-categories-blog.dto';
import { UpdateCategoriesBlogDto } from './dto/update-categories-blog.dto';
import { CategoriesBlog } from './entities/categories-blog.entity';

export type CategoriesBlogRequestUser = {
  id: string;
  userId?: string;
  role?: string;
};

export type PaginatedCategories = {
  categories: CategoriesBlog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export interface ICategoriesBlogService {
  create(
    dto: CreateCategoriesBlogDto,
    user: CategoriesBlogRequestUser,
  ): Promise<CategoriesBlog>;
  findAll(page: number, limit: number): Promise<PaginatedCategories>;
  findOne(slug: string): Promise<CategoriesBlog>;
  update(
    slug: string,
    updateCategoriesBlogDto: UpdateCategoriesBlogDto,
    user: CategoriesBlogRequestUser,
  ): Promise<CategoriesBlog>;
  softDelete(
    slug: string,
    user: CategoriesBlogRequestUser,
  ): Promise<{ message: string }>;
  hardDelete(
    slug: string,
    user: CategoriesBlogRequestUser,
  ): Promise<{ message: string }>;
}
