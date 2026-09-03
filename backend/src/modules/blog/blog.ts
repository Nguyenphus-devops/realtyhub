import { Blog, BlogStatus } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

export type RequestUser = {
  id: string;
  userId?: string;
  role?: string;
};

export type PaginatedBlogs = {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export interface IBlogService {
  createBlog(createBlogDto: CreateBlogDto, user: RequestUser): Promise<Blog>;
  findAllBlogs(
    page: number,
    limit: number,
    includeHidden: boolean,
  ): Promise<PaginatedBlogs>;
  searchBlogs(
    query: string,
    page: number,
    limit: number,
    includeHidden: boolean,
    userId?: string,
  ): Promise<PaginatedBlogs>;
  getMyBlogs(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedBlogs>;
  findByStatusBlog(
    status: BlogStatus,
    page: number,
    limit: number,
    includeHidden: boolean,
  ): Promise<Blog[]>;
  findOneBlog(slug: string): Promise<Blog>;
  updateBlog(slug: string, dto: UpdateBlogDto): Promise<Blog>;
  updateVisibilityBlog(slug: string, isHidden: boolean): Promise<Blog>;
  updateStatusBlog(slug: string, status: BlogStatus): Promise<Blog>;
  softDeleteBlog(slug: string): Promise<{ message: string }>;
  hardDeleteBlog(slug: string): Promise<{ message: string }>;
}
