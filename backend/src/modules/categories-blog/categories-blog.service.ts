import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriesBlogDto } from './dto/create-categories-blog.dto';
import { UpdateCategoriesBlogDto } from './dto/update-categories-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import type {
  CategoriesBlogRequestUser,
  ICategoriesBlogService,
  PaginatedCategories,
} from './categories-blog';
import { CategoriesBlog } from './entities/categories-blog.entity';
import { generateUniqueSlug, removeVietnameseTones } from 'src/common/utils/slug.utils';
import { HistoryService } from '../history/history.service';
import { HISTORY_ACTIONS } from '../history/history';

const SLUG_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;

@Injectable()
export class CategoriesBlogService implements ICategoriesBlogService {
  constructor(
    @InjectRepository(CategoriesBlog)
    private readonly categoriesRepository: MongoRepository<CategoriesBlog>,
    private readonly historyService: HistoryService,
  ) {}

  private resolveActorId(user: CategoriesBlogRequestUser): string | undefined {
    const raw = user.userId ?? user.id;
    const trimmed = String(raw).trim();
    return trimmed !== '' ? trimmed : undefined;
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
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;

    return {
      page: normalizedPage,
      limit: normalizedLimit,
      skip: (normalizedPage - 1) * normalizedLimit,
    };
  }

  public async create(
    createCategoriesBlogDto: CreateCategoriesBlogDto,
    user: CategoriesBlogRequestUser,
  ): Promise<CategoriesBlog> {
    const nameTrim = createCategoriesBlogDto.name?.trim();
    if (!nameTrim) {
      throw new BadRequestException('Tên danh mục không được để trống.');
    }

    if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
      throw new BadRequestException(
        'Tên danh mục không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
      );
    }

    const cleanName = removeVietnameseTones(nameTrim);
    if (!cleanName) {
      throw new BadRequestException(
        'Tên danh mục không được để trống hoặc chỉ chứa ký tự đặc biệt.',
      );
    }

    const preferredSlug = createCategoriesBlogDto.slug?.trim();
    const targetSlug = (
      preferredSlug && preferredSlug.length > 0 ? preferredSlug : cleanName
    ).toLowerCase();

    if (!SLUG_REGEX.test(targetSlug)) {
      throw new BadRequestException(
        'Slug không hợp lệ. Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang.',
      );
    }

    const activeCategories = await this.categoriesRepository.find({
      where: { isDeleted: false },
    });

    const isDuplicateName = activeCategories.some(
      (cat) => cat.name.trim().toLowerCase() === nameTrim.toLowerCase(),
    );
    if (isDuplicateName) {
      throw new BadRequestException('Tên danh mục đã tồn tại trong hệ thống.');
    }

    const isDuplicateSlug = activeCategories.some(
      (cat) => cat.slug.trim().toLowerCase() === targetSlug,
    );
    if (isDuplicateSlug) {
      throw new BadRequestException('Slug danh mục đã tồn tại trong hệ thống.');
    }

    const parentSlug = createCategoriesBlogDto.parentSlug?.trim();
    let parent: CategoriesBlog | null = null;

    if (parentSlug) {
      parent = await this.categoriesRepository.findOneBy({
        slug: parentSlug,
        isDeleted: false,
      });
      if (!parent) {
        throw new BadRequestException(
          `Không tìm thấy danh mục cha với slug: ${parentSlug}`,
        );
      }
    }

    const category = this.categoriesRepository.create({
      name: nameTrim,
      slug: targetSlug,
      level: parent ? parent.level + 1 : 0,
      parentSlug: parent?.slug ?? null,
      childrenSlugs: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedCategory = await this.categoriesRepository.save(category);

    if (parent) {
      parent.childrenSlugs = Array.from(
        new Set([...(parent.childrenSlugs ?? []), savedCategory.slug]),
      );
      parent.updatedAt = new Date();
      await this.categoriesRepository.save(parent);
    }

    const actorId = this.resolveActorId(user);
    await this.historyService.create({
      action: HISTORY_ACTIONS.CATEGORIES_BLOG_CREATED,
      message: `Tạo danh mục blog "${savedCategory.name}" (${savedCategory.slug})`,
      ...(actorId !== undefined ? { actorId } : {}),
      targetType: 'categories-blog',
      targetId: savedCategory.slug,
      metadata: {
        name: savedCategory.name,
        slug: savedCategory.slug,
        level: savedCategory.level,
        parentSlug: savedCategory.parentSlug,
      },
    });

    return savedCategory;
  }

  public async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedCategories> {
    const paging = this.normalizePaging(page, limit);
    const whereCondition: Partial<CategoriesBlog> = {
      isDeleted: false,
    };

    const [categories, total] = await Promise.all([
      this.categoriesRepository.find({
        where: whereCondition,
        order: {
          level: 'ASC',
          createdAt: 'DESC',
        },
        skip: paging.skip,
        take: paging.limit,
      }),
      this.categoriesRepository.count({ where: whereCondition }),
    ]);

    return {
      categories,
      total,
      page: paging.page,
      limit: paging.limit,
      hasMore: total > paging.skip + categories.length,
    };
  }

  public async findOne(slug: string): Promise<CategoriesBlog> {
    const category = await this.categoriesRepository.findOneBy({
      slug,
      isDeleted: false,
    });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với slug: ${slug}`);
    }
    return category;
  }

  public async update(
    slug: string,
    updateCategoriesBlogDto: UpdateCategoriesBlogDto,
    user: CategoriesBlogRequestUser,
  ): Promise<CategoriesBlog> {
    const category = await this.findOne(slug);
    const activeCategories = await this.categoriesRepository.find({
      where: { isDeleted: false },
    });

    if (updateCategoriesBlogDto.name !== undefined) {
      const nameTrim = updateCategoriesBlogDto.name.trim();
      if (!nameTrim) {
        throw new BadRequestException('Tên danh mục không được để trống.');
      }
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        throw new BadRequestException(
          'Tên danh mục không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
        );
      }
      const cleanName = removeVietnameseTones(nameTrim);
      if (!cleanName) {
        throw new BadRequestException(
          'Tên danh mục không được để trống hoặc chỉ chứa ký tự đặc biệt.',
        );
      }

      const isDuplicateName = activeCategories.some(
        (cat) =>
          cat.slug !== category.slug &&
          cat.name.trim().toLowerCase() === nameTrim.toLowerCase(),
      );
      if (isDuplicateName) {
        throw new BadRequestException('Tên danh mục đã tồn tại trong hệ thống.');
      }
      category.name = nameTrim;
    }

    if (updateCategoriesBlogDto.slug !== undefined) {
      const trimmed = updateCategoriesBlogDto.slug.trim().toLowerCase();
      if (trimmed.length > 0 && trimmed !== category.slug) {
        if (!SLUG_REGEX.test(trimmed)) {
          throw new BadRequestException(
            'Slug không hợp lệ. Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang.',
          );
        }

        const isDuplicateSlug = activeCategories.some(
          (cat) =>
            cat.slug !== category.slug &&
            cat.slug.trim().toLowerCase() === trimmed,
        );
        if (isDuplicateSlug) {
          throw new BadRequestException('Slug đã tồn tại trong hệ thống.');
        }

        await this.applyCategoriesBlogSlugRename(category, trimmed);
      }
    }

    if (updateCategoriesBlogDto.parentSlug !== undefined) {
      const raw = updateCategoriesBlogDto.parentSlug;
      const normalizedParentSlug =
        typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : null;
      await this.moveCategoriesBlogToParent(category, normalizedParentSlug);
    }

    category.updatedAt = new Date();
    const saved = await this.categoriesRepository.save(category);
    const actorId = this.resolveActorId(user);
    await this.historyService.create({
      action: HISTORY_ACTIONS.CATEGORIES_BLOG_UPDATED,
      message: `Cập nhật danh mục blog "${saved.name}" (${saved.slug})`,
      ...(actorId !== undefined ? { actorId } : {}),
      targetType: 'categories-blog',
      targetId: saved.slug,
      metadata: {
        name: saved.name,
        slug: saved.slug,
        level: saved.level,
        parentSlug: saved.parentSlug,
      },
    });
    return saved;
  }

  private collectDescendantSlugsFromRoot(
    root: CategoriesBlog,
    bySlug: Map<string, CategoriesBlog>,
  ): Set<string> {
    const out = new Set<string>();
    const stack = [...(root.childrenSlugs ?? [])];
    while (stack.length) {
      const childSlug = stack.pop();
      if (!childSlug || out.has(childSlug)) {
        continue;
      }
      out.add(childSlug);
      const node = bySlug.get(childSlug);
      if (node?.childrenSlugs?.length) {
        stack.push(...node.childrenSlugs);
      }
    }
    return out;
  }

  private async applyCategoriesBlogSlugRename(
    category: CategoriesBlog,
    newSlug: string,
  ): Promise<void> {
    const previousSlug = category.slug;
    if (previousSlug === newSlug) {
      return;
    }

    const parentSlug = category.parentSlug ?? null;
    if (parentSlug) {
      const parent = await this.categoriesRepository.findOneBy({
        slug: parentSlug,
        isDeleted: false,
      });
      if (parent) {
        parent.childrenSlugs = (parent.childrenSlugs ?? []).map((childSlug) =>
          childSlug === previousSlug ? newSlug : childSlug,
        );
        parent.updatedAt = new Date();
        await this.categoriesRepository.save(parent);
      }
    }

    const directChildren = await this.categoriesRepository.find({
      where: { parentSlug: previousSlug, isDeleted: false },
    });
    await Promise.all(
      directChildren.map(async (child) => {
        child.parentSlug = newSlug;
        child.updatedAt = new Date();
        return this.categoriesRepository.save(child);
      }),
    );

    category.slug = newSlug;
    await this.categoriesRepository.save(category);
  }

  private async shiftCategoriesBlogDescendantLevels(
    root: CategoriesBlog,
    levelDelta: number,
    bySlug: Map<string, CategoriesBlog>,
  ): Promise<void> {
    if (levelDelta === 0) {
      return;
    }
    if (!root.childrenSlugs?.length) {
      return;
    }
    const toPersist: CategoriesBlog[] = [];
    const stack = [...(root.childrenSlugs ?? [])];
    const seen = new Set<string>();
    while (stack.length) {
      const childSlug = stack.pop();
      if (!childSlug || seen.has(childSlug)) {
        continue;
      }
      seen.add(childSlug);
      const node = bySlug.get(childSlug);
      if (!node) {
        continue;
      }
      node.level = node.level + levelDelta;
      node.updatedAt = new Date();
      toPersist.push(node);
      if (node.childrenSlugs?.length) {
        stack.push(...node.childrenSlugs);
      }
    }
    await Promise.all(
      toPersist.map((doc) => this.categoriesRepository.save(doc)),
    );
  }

  private async moveCategoriesBlogToParent(
    category: CategoriesBlog,
    newParentSlug: string | null,
  ): Promise<void> {
    const currentParentSlug = category.parentSlug ?? null;
    if (newParentSlug === currentParentSlug) {
      return;
    }

    const all = await this.categoriesRepository.find({
      where: { isDeleted: false },
    });
    const bySlug = new Map(all.map((item) => [item.slug, item]));

    const descendantSlugs = this.collectDescendantSlugsFromRoot(
      category,
      bySlug,
    );
    if (
      newParentSlug &&
      (newParentSlug === category.slug || descendantSlugs.has(newParentSlug))
    ) {
      throw new BadRequestException(
        'Không thể đặt danh mục cha là chính nó hoặc một danh mục con.',
      );
    }

    if (currentParentSlug) {
      const oldParent = bySlug.get(currentParentSlug);
      if (oldParent) {
        oldParent.childrenSlugs = (oldParent.childrenSlugs ?? []).filter(
          (childSlug) => childSlug !== category.slug,
        );
        oldParent.updatedAt = new Date();
        await this.categoriesRepository.save(oldParent);
      }
    }

    let newParent: CategoriesBlog | null = null;
    if (newParentSlug) {
      newParent = bySlug.get(newParentSlug) ?? null;
      if (!newParent) {
        throw new BadRequestException(
          `Không tìm thấy danh mục cha với slug: ${newParentSlug}`,
        );
      }
      newParent.childrenSlugs = Array.from(
        new Set([...(newParent.childrenSlugs ?? []), category.slug]),
      );
      newParent.updatedAt = new Date();
      await this.categoriesRepository.save(newParent);
    }

    const previousLevel = category.level;
    category.parentSlug = newParentSlug;
    category.level = newParent ? newParent.level + 1 : 0;
    const levelDelta = category.level - previousLevel;
    await this.shiftCategoriesBlogDescendantLevels(
      category,
      levelDelta,
      bySlug,
    );
  }

  public async softDelete(
    slug: string,
    user: CategoriesBlogRequestUser,
  ): Promise<{ message: string }> {
    const category = await this.findOne(slug);
    const all = await this.categoriesRepository.find({
      where: { isDeleted: false },
    });
    const bySlug = new Map(all.map((item) => [item.slug, item]));
    const descendantSlugs = this.collectDescendantSlugsFromRoot(
      category,
      bySlug,
    );

    category.isDeleted = true;
    category.updatedAt = new Date();
    await this.categoriesRepository.save(category);

    for (const childSlug of descendantSlugs) {
      const childNode = bySlug.get(childSlug);
      if (childNode) {
        childNode.isDeleted = true;
        childNode.updatedAt = new Date();
        await this.categoriesRepository.save(childNode);
      }
    }

    const actorId = this.resolveActorId(user);
    await this.historyService.create({
      action: HISTORY_ACTIONS.CATEGORIES_BLOG_SOFT_DELETED,
      message: `Ẩn danh mục blog "${category.name}" (${category.slug})`,
      ...(actorId !== undefined ? { actorId } : {}),
      targetType: 'categories-blog',
      targetId: category.slug,
      metadata: {
        name: category.name,
        slug: category.slug,
      },
    });

    return { message: `Đã soft delete danh mục ${slug}` };
  }

  public async hardDelete(
    slug: string,
    user: CategoriesBlogRequestUser,
  ): Promise<{ message: string }> {
    const category = await this.findOne(slug);
    const all = await this.categoriesRepository.find({
      where: { isDeleted: false },
    });
    const bySlug = new Map(all.map((item) => [item.slug, item]));
    const descendantSlugs = this.collectDescendantSlugsFromRoot(
      category,
      bySlug,
    );

    for (const childSlug of descendantSlugs) {
      const childNode = bySlug.get(childSlug);
      if (childNode) {
        await this.categoriesRepository.deleteOne({ _id: childNode._id });
      }
    }

    const actorId = this.resolveActorId(user);
    await this.historyService.create({
      action: HISTORY_ACTIONS.CATEGORIES_BLOG_HARD_DELETED,
      message: `Xóa vĩnh viễn danh mục blog "${category.name}" (${category.slug})`,
      ...(actorId !== undefined ? { actorId } : {}),
      targetType: 'categories-blog',
      targetId: category.slug,
      metadata: {
        name: category.name,
        slug: category.slug,
      },
    });
    await this.categoriesRepository.deleteOne({ _id: category._id });

    return { message: `Đã hard delete danh mục ${slug}` };
  }
}
