import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { removeVietnameseTones } from 'src/common/utils/slug.utils';

const SLUG_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
const SYSTEM_SERVICE_SLUGS = new Set([
  'membership',
  'groupx',
  'dance_kid',
  'dance',
  'pt',
  'massage',
  'kickboxing',
  'yoga',
  'gym',
]);
const isSystemServiceSlug = (slug?: string) =>
  SYSTEM_SERVICE_SLUGS.has((slug || '').trim().toLowerCase());

@Injectable()
export class ServiceCategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly repository: MongoRepository<ServiceCategory>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  async seedDefaultCategories() {
    const defaultCategories = [
      { name: 'Membership', slug: 'membership', type: 'individual' },
      { name: 'Gym Training', slug: 'gym', type: 'individual' },
      { name: 'Yoga', slug: 'yoga', type: 'class' },
      { name: 'Kickboxing', slug: 'kickboxing', type: 'class' },
      { name: 'Sport Massage', slug: 'massage', type: 'individual' },
      { name: 'PT 1-1', slug: 'pt', type: 'individual' },
      { name: 'Dance', slug: 'dance', type: 'class' },
      { name: 'Dance for Kids', slug: 'dance_kid', type: 'class' },
      { name: 'GroupX', slug: 'groupx', type: 'class' },
    ];

    for (const cat of defaultCategories) {
      const existing = await this.repository.findOneBy({ slug: cat.slug });
      if (!existing) {
        const entity = this.repository.create({
          name: cat.name,
          slug: cat.slug,
          type: cat.type,
          isActive: true,
        });
        await this.repository.save(entity);
      } else if (!existing.type) {
        existing.type = cat.type;
        await this.repository.save(existing);
      }
    }
  }

  async findAll() {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findActive() {
    return this.repository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  async findOneByPublicId(publicId: string) {
    const item = await this.repository.findOneBy({ publicId });
    if (!item) throw new NotFoundException(`Không tìm thấy loại dịch vụ ${publicId}`);
    return item;
  }

  async create(dto: CreateServiceCategoryDto) {
    const nameTrim = dto.name?.trim();
    if (!nameTrim) {
      throw new BadRequestException('Tên loại dịch vụ không được để trống.');
    }

    if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
      throw new BadRequestException(
        'Tên loại dịch vụ không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
      );
    }

    const cleanName = removeVietnameseTones(nameTrim);
    if (!cleanName) {
      throw new BadRequestException('Tên loại dịch vụ không được để trống hoặc chỉ chứa ký tự đặc biệt.');
    }

    const rawSlugSource = dto.slug?.trim() ? dto.slug.trim() : nameTrim;
    const slugTrim = removeVietnameseTones(rawSlugSource).toLowerCase();
    if (!slugTrim || !SLUG_REGEX.test(slugTrim)) {
      throw new BadRequestException('Slug không hợp lệ. Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang/dưới.');
    }

    const allCategories = await this.repository.find();

    const isDuplicateName = allCategories.some(
      (cat) => (cat.name || '').trim().toLowerCase() === nameTrim.toLowerCase(),
    );
    if (isDuplicateName) {
      throw new BadRequestException('Tên loại dịch vụ đã tồn tại trong hệ thống.');
    }

    const isDuplicateSlug = allCategories.some(
      (cat) => (cat.slug || '').trim().toLowerCase() === slugTrim,
    );
    if (isDuplicateSlug) {
      throw new BadRequestException('Slug loại dịch vụ đã tồn tại trong hệ thống.');
    }

    const entity = this.repository.create({
      name: nameTrim,
      slug: slugTrim,
      type: dto.type || 'individual',
      isActive: dto.isActive ?? true,
    });
    return this.repository.save(entity);
  }

  async update(publicId: string, dto: UpdateServiceCategoryDto) {
    const item = await this.findOneByPublicId(publicId);
    const allCategories = await this.repository.find();

    const nameTrim = dto.name !== undefined ? dto.name.trim() : item.name;
    if (dto.name !== undefined) {
      if (!nameTrim) {
        throw new BadRequestException('Tên loại dịch vụ không được để trống.');
      }
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        throw new BadRequestException(
          'Tên loại dịch vụ không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
        );
      }
      const cleanName = removeVietnameseTones(nameTrim);
      if (!cleanName) {
        throw new BadRequestException('Tên loại dịch vụ không được để trống hoặc chỉ chứa ký tự đặc biệt.');
      }

      const isDuplicateName = allCategories.some(
        (cat) =>
          cat.publicId !== publicId &&
          (cat.name || '').trim().toLowerCase() === nameTrim.toLowerCase(),
      );
      if (isDuplicateName) {
        throw new BadRequestException('Tên loại dịch vụ đã tồn tại trong hệ thống.');
      }
    }

    let slugTrim = item.slug;
    if (dto.slug !== undefined) {
      const rawSlug = dto.slug.trim() ? dto.slug.trim() : nameTrim;
      slugTrim = removeVietnameseTones(rawSlug).toLowerCase();
      if (!slugTrim || !SLUG_REGEX.test(slugTrim)) {
        throw new BadRequestException('Slug không hợp lệ. Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang/dưới.');
      }

      if (isSystemServiceSlug(item.slug) && slugTrim !== item.slug) {
        throw new BadRequestException('Không thể thay đổi slug của dịch vụ hệ thống.');
      }

      const isDuplicateSlug = allCategories.some(
        (cat) =>
          cat.publicId !== publicId &&
          (cat.slug || '').trim().toLowerCase() === slugTrim,
      );
      if (isDuplicateSlug) {
        throw new BadRequestException('Slug loại dịch vụ đã tồn tại trong hệ thống.');
      }
    }

    Object.assign(item, {
      name: nameTrim,
      slug: slugTrim,
      type: dto.type ?? item.type,
      isActive: dto.isActive ?? item.isActive,
    });
    return this.repository.save(item);
  }

  async remove(publicId: string) {
    const item = await this.findOneByPublicId(publicId);
    if (isSystemServiceSlug(item.slug)) {
      throw new BadRequestException(
        'Dịch vụ hệ thống là cố định và không thể xóa. Bạn có thể chuyển dịch vụ sang trạng thái ẩn.',
      );
    }
    await this.repository.deleteOne({ publicId });
    return { message: 'Đã xóa loại dịch vụ.' };
  }
}

