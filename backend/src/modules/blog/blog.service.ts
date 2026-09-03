import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { MongoRepository } from 'typeorm';
import { BlogStatus } from './entities/blog.entity';
import type { IBlogService, PaginatedBlogs, RequestUser } from './blog';
import { HistoryService } from '../history/history.service';
import { HISTORY_ACTIONS } from '../history/history';
import { generateUniqueSlug } from 'src/common/utils/slug.utils';
import type { ObjectId } from 'mongodb';

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: MongoRepository<Blog>,
    private readonly historyService: HistoryService,
  ) {}

  private async resolveUniqueSlug(
    source: string,
    excludeId?: ObjectId,
  ): Promise<string> {
    try {
      return await generateUniqueSlug(
        source,
        this.blogRepository,
        excludeId ? { excludeId } : undefined,
      );
    } catch {
      throw new BadRequestException(
        'Slug không hợp lệ hoặc không thể tạo từ tiêu đề.',
      );
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private normalizePaging(
    page: number,
    limit: number,
  ): {
    page: number;
    limit: number;
    skip: number;
  } {
    const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
    const normalizedLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;

    return {
      page: normalizedPage,
      limit: normalizedLimit,
      skip: (normalizedPage - 1) * normalizedLimit,
    };
  }

  public async createBlog(
    createBlogDto: CreateBlogDto,
    user: RequestUser,
  ): Promise<Blog> {
    const userId = user.userId ?? user.id;
    if (!userId) {
      throw new BadRequestException(
        'Thiếu thông tin người dùng để tạo bài viết.',
      );
    }

    const preferredSlug = createBlogDto.slug?.trim().toLowerCase();
    let slug = '';
    if (preferredSlug && preferredSlug.length > 0) {
      const existing = await this.blogRepository.findOneBy({
        slug: preferredSlug,
        isDeleted: false,
      });
      if (existing) {
        throw new BadRequestException('Slug đã tồn tại trong hệ thống.');
      }
      slug = preferredSlug;
    } else {
      slug = await this.resolveUniqueSlug(createBlogDto.title.trim());
    }
    const blog = this.blogRepository.create({
      userId,
      slug,
      title: createBlogDto.title.trim(),
      excerpt: createBlogDto.excerpt.trim(),
      blogData: createBlogDto.blogData,
      thumbnail: createBlogDto.thumbnail,
      isFeatured: createBlogDto.isFeatured ?? false,
      showBMI: createBlogDto.showBMI ?? false,
      showTDEE: createBlogDto.showTDEE ?? false,
      showBMR: createBlogDto.showBMR ?? false,
      showRMR: createBlogDto.showRMR ?? false,
      showProtein: createBlogDto.showProtein ?? false,
      showBodyFat: createBlogDto.showBodyFat ?? false,
      category: createBlogDto.category || {
        main: createBlogDto.categoryMain ?? [],
        sub: createBlogDto.categorySub ?? []
      },
      seo: createBlogDto.seo
        ? {
            metaTitle: createBlogDto.seo.metaTitle,
            metaDescription: createBlogDto.seo.metaDescription,
            metaKeywords: createBlogDto.seo.metaKeywords,
            ogImage: createBlogDto.seo.ogImage,
          }
        : undefined,
      relatedSlugs: createBlogDto.relatedSlugs ?? [],
      faqs: createBlogDto.faqs?.map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      })) ?? [],
      author: createBlogDto.author,
      status: BlogStatus.Draft,
      isHidden: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedBlog = await this.blogRepository.save(blog);
    await this.historyService.create({
      action: HISTORY_ACTIONS.BLOG_CREATED,
      message: `Tạo bài viết ${savedBlog.slug}`,
      actorId: userId,
      targetType: 'blog',
      targetId: savedBlog.slug,
      metadata: {
        title: savedBlog.title,
        status: savedBlog.status,
      },
    });

    return savedBlog;
  }

  public async findAllBlogs(
    page: number,
    limit: number,
    includeHidden: boolean,
  ): Promise<PaginatedBlogs> {
    const paging = this.normalizePaging(page, limit);
    const whereCondition: Partial<Blog> = {
      isDeleted: false,
    };

    if (!includeHidden) {
      whereCondition.isHidden = false;
    }

    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        where: whereCondition,
        order: { createdAt: 'DESC' },
        skip: paging.skip,
        take: paging.limit,
      }),
      this.blogRepository.count(whereCondition as any),
    ]);

    return {
      blogs,
      total,
      page: paging.page,
      limit: paging.limit,
      hasMore: total > paging.skip + blogs.length,
    };
  }

  public async searchBlogs(
    query: string,
    page: number,
    limit: number,
    includeHidden: boolean,
    userId?: string,
  ): Promise<PaginatedBlogs> {
    const trimmed = query.trim();
    if (!trimmed) {
      if (userId !== undefined && userId.length > 0) {
        return this.getMyBlogs(userId, page, limit, includeHidden);
      }
      return this.findAllBlogs(page, limit, includeHidden);
    }

    const paging = this.normalizePaging(page, limit);
    const escaped = this.escapeRegex(trimmed);

    const mongoWhere: Record<string, unknown> = {
      isDeleted: false,
      $or: [
        { title: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
        { excerpt: { $regex: escaped, $options: 'i' } },
      ],
    };

    if (userId !== undefined && userId.length > 0) {
      mongoWhere.userId = userId;
    }
    if (!includeHidden) {
      mongoWhere.isHidden = false;
    }

    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        where: mongoWhere as never,
        order: { createdAt: 'DESC' },
        skip: paging.skip,
        take: paging.limit,
      }),
      this.blogRepository.count(mongoWhere as any),
    ]);

    return {
      blogs,
      total,
      page: paging.page,
      limit: paging.limit,
      hasMore: total > paging.skip + blogs.length,
    };
  }

  public async getMyBlogs(
    userId: string,
    page: number,
    limit: number,
    includeHidden: boolean = true,
  ): Promise<PaginatedBlogs> {
    const paging = this.normalizePaging(page, limit);
    const whereCondition: Partial<Blog> = {
      userId,
      isDeleted: false,
    };

    if (!includeHidden) {
      whereCondition.isHidden = false;
    }

    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        where: whereCondition,
        order: { createdAt: 'DESC' },
        skip: paging.skip,
        take: paging.limit,
      }),
      this.blogRepository.count(whereCondition as any),
    ]);

    return {
      blogs,
      total,
      page: paging.page,
      limit: paging.limit,
      hasMore: total > paging.skip + blogs.length,
    };
  }

  public async findByStatusBlog(
    status: BlogStatus,
    page: number,
    limit: number,
    includeHidden: boolean,
  ): Promise<Blog[]> {
    const paging = this.normalizePaging(page, limit);
    const whereCondition: Partial<Blog> = {
      status,
      isDeleted: false,
    };

    if (!includeHidden) {
      whereCondition.isHidden = false;
    }

    return this.blogRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: paging.skip,
      take: paging.limit,
    });
  }

  public async findOneBlog(slug: string): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({
      slug,
      isDeleted: false,
    });

    if (!blog) {
      throw new NotFoundException(`Không tìm thấy bài viết với slug: ${slug}`);
    }

    return blog;
  }

  public async updateBlog(slug: string, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOneBlog(slug);
    const originalTitle = blog.title;

    blog.title = dto.title?.trim() ?? blog.title;
    blog.excerpt = dto.excerpt?.trim() ?? blog.excerpt;
    blog.blogData = dto.blogData ?? blog.blogData;

    if (dto.thumbnail !== undefined) {
      blog.thumbnail = dto.thumbnail;
    }

    if (dto.category !== undefined) {
      blog.category = dto.category;
    } else if (dto.categoryMain !== undefined || dto.categorySub !== undefined) {
      blog.category = {
        main: dto.categoryMain ?? [],
        sub: dto.categorySub ?? []
      };
    }

    if (dto.seo !== undefined) {
      blog.seo = {
        metaTitle: dto.seo.metaTitle,
        metaDescription: dto.seo.metaDescription,
        metaKeywords: dto.seo.metaKeywords,
        ogImage: dto.seo.ogImage,
      };
    }

    if (dto.relatedSlugs !== undefined) {
      blog.relatedSlugs = dto.relatedSlugs;
    }

    if (dto.faqs !== undefined) {
      blog.faqs = dto.faqs.map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }));
    }

    if (dto.author !== undefined) {
      blog.author = dto.author;
    }

    if (typeof dto.showBMI === 'boolean') {
      blog.showBMI = dto.showBMI;
    }
    if (typeof dto.showTDEE === 'boolean') {
      blog.showTDEE = dto.showTDEE;
    }
    if (typeof dto.showBMR === 'boolean') {
      blog.showBMR = dto.showBMR;
    }
    if (typeof dto.showRMR === 'boolean') {
      blog.showRMR = dto.showRMR;
    }
    if (typeof dto.showProtein === 'boolean') {
      blog.showProtein = dto.showProtein;
    }
    if (typeof dto.showBodyFat === 'boolean') {
      blog.showBodyFat = dto.showBodyFat;
    }

    if (dto.status) {
      blog.status = dto.status;
    }

    if (typeof dto.isHidden === 'boolean') {
      blog.isHidden = dto.isHidden;
    }

    if (typeof dto.isFeatured === 'boolean') {
      blog.isFeatured = dto.isFeatured;
    }

    const titleChanged =
      dto.title !== undefined && dto.title.trim() !== originalTitle;

    if (dto.slug !== undefined) {
      const preferred = dto.slug.trim().toLowerCase();
      if (preferred.length > 0 && preferred !== blog.slug) {
        const existing = await this.blogRepository.findOneBy({
          slug: preferred,
          isDeleted: false,
        });
        if (existing && existing._id.toString() !== blog._id.toString()) {
          throw new BadRequestException('Slug đã tồn tại trong hệ thống.');
        }
        blog.slug = preferred;
      } else if (preferred.length === 0 && titleChanged && dto.title !== undefined) {
        blog.slug = await this.resolveUniqueSlug(dto.title.trim(), blog._id);
      }
    } else if (titleChanged && dto.title !== undefined) {
      blog.slug = await this.resolveUniqueSlug(dto.title.trim(), blog._id);
    }

    blog.updatedAt = new Date();
    const savedBlog = await this.blogRepository.save(blog);
    await this.historyService.create({
      action: HISTORY_ACTIONS.BLOG_UPDATED,
      message: `Cập nhật bài viết ${savedBlog.slug}`,
      actorId: savedBlog.userId,
      targetType: 'blog',
      targetId: savedBlog.slug,
      metadata: {
        status: savedBlog.status,
      },
    });

    return savedBlog;
  }

  public async updateVisibilityBlog(
    slug: string,
    isHidden: boolean,
  ): Promise<Blog> {
    const blog = await this.findOneBlog(slug);
    blog.isHidden = isHidden;
    blog.updatedAt = new Date();

    return this.blogRepository.save(blog);
  }

  public async updateStatusBlog(
    slug: string,
    status: BlogStatus,
  ): Promise<Blog> {
    const blog = await this.findOneBlog(slug);
    blog.status = status;
    blog.updatedAt = new Date();

    return this.blogRepository.save(blog);
  }

  public async softDeleteBlog(slug: string): Promise<{ message: string }> {
    const blog = await this.findOneBlog(slug);
    blog.isDeleted = true;
    blog.updatedAt = new Date();
    await this.blogRepository.save(blog);
    await this.historyService.create({
      action: HISTORY_ACTIONS.BLOG_SOFT_DELETED,
      message: `Xóa mềm bài viết ${slug}`,
      actorId: blog.userId,
      targetType: 'blog',
      targetId: slug,
    });

    return { message: `Đã ẩn bài viết ${slug}` };
  }

  public async hardDeleteBlog(slug: string): Promise<{ message: string }> {
    const blog = await this.findOneBlog(slug);
    await this.blogRepository.deleteOne({ _id: blog._id });
    await this.historyService.create({
      action: HISTORY_ACTIONS.BLOG_HARD_DELETED,
      message: `Xóa vĩnh viễn bài viết ${slug}`,
      actorId: blog.userId,
      targetType: 'blog',
      targetId: slug,
    });

    return { message: `Đã xóa bài viết ${slug}` };
  }

  public async getPublicBlogs(
    page: number,
    limit: number,
  ): Promise<PaginatedBlogs> {
    const paging = this.normalizePaging(page, limit);

    // Use MongoDB native query for better compatibility
    const mongoWhere = {
      status: 'approved',
      isHidden: false,
      isDeleted: false,
    };

    console.log('getPublicBlogs query:', mongoWhere);

    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        where: mongoWhere as any,
        order: { createdAt: 'DESC' },
        skip: paging.skip,
        take: paging.limit,
      }),
      this.blogRepository.count(mongoWhere as any),
    ]);

    console.log('getPublicBlogs result:', { blogsCount: blogs.length, total });

    return {
      blogs,
      total,
      page: paging.page,
      limit: paging.limit,
      hasMore: total > paging.skip + blogs.length,
    };
  }

  public async getCategories(): Promise<{ main: string[]; sub: string[] }> {
    try {
      const blogs = await this.blogRepository.find({
        where: { isDeleted: false },
        select: { category: true },
      });

      const mainSet = new Set<string>();

      blogs.forEach((blog: any) => {
        if (blog.category) {
          if (typeof blog.category === 'string') {
            mainSet.add(blog.category);
          } else if ((blog.category as any).main) {
            (blog.category as any).main.forEach((cat: string) => mainSet.add(cat));
          }
        }
      });

      return {
        main: Array.from(mainSet).sort(),
        sub: [],
      };
    } catch (error) {
      console.error('getCategories error:', error);
      throw error;
    }
  }
}
