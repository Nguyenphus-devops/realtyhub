import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { ServicePackage } from './entities/service-package.entity';
import { ReorderServicePackagesDto } from './dto/reorder-service-packages.dto';
import { SERVICE_PACKAGE_SEED_DATA } from './constants/service-package-seed-data';

@Injectable()
export class ServicePackageService {
  constructor(
    @InjectRepository(ServicePackage)
    private readonly servicePackageRepository: MongoRepository<ServicePackage>,
  ) {}

  private ensureValidGuestRange(
    minGuests?: number | null,
    maxGuests?: number | null,
  ): void {
    if (
      minGuests !== undefined &&
      minGuests !== null &&
      maxGuests !== undefined &&
      maxGuests !== null &&
      maxGuests < minGuests
    ) {
      throw new BadRequestException(
        'maxGuests phải lớn hơn hoặc bằng minGuests.',
      );
    }
  }

  private ensurePricing(
    basePrice?: number | null,
    priceLabel?: string | null,
  ): void {
    const hasBasePrice = basePrice !== undefined && basePrice !== null;
    const hasPriceLabel = Boolean(priceLabel?.trim());
    if (!hasBasePrice && !hasPriceLabel) {
      throw new BadRequestException(
        'Cần cung cấp basePrice hoặc priceLabel cho gói dịch vụ.',
      );
    }
  }

  private async checkClassroomConflict(
    category: string,
    classroom?: string | null,
    classDays?: string[] | null,
    classTime?: string | null,
    currentPublicId?: string,
  ): Promise<void> {
    const classCategories = ['yoga', 'dance', 'kickboxing', 'dance_kid'];
    if (!classCategories.includes(category) || !classroom?.trim() || !classDays?.length || !classTime?.trim()) {
      return;
    }

    const startEnd = classTime.split('-').map((t) => t.trim());
    if (startEnd.length !== 2) {
      return;
    }

    const [startStr, endStr] = startEnd;
    const toMinutes = (timeStr: string) => {
      const parts = timeStr.split(':').map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) return 0;
      return parts[0] * 60 + parts[1];
    };
    const s1 = toMinutes(startStr);
    const e1 = toMinutes(endStr);

    const activeFitnessClasses = await this.servicePackageRepository.find({
      where: {
        category: { $in: classCategories } as any,
        isActive: true,
      },
    });

    for (const item of activeFitnessClasses) {
      if (currentPublicId && item.publicId === currentPublicId) {
        continue;
      }

      if (item.classroom?.trim().toLowerCase() !== classroom.trim().toLowerCase()) {
        continue;
      }

      const days1 = new Set(classDays.map((d) => d.trim().toLowerCase()));
      const hasOverlapDay = (item.classDays ?? []).some((d) =>
        days1.has(d.trim().toLowerCase()),
      );
      if (!hasOverlapDay) {
        continue;
      }

      if (!item.classTime) {
        continue;
      }
      const itemStartEnd = item.classTime.split('-').map((t) => t.trim());
      if (itemStartEnd.length !== 2) {
        continue;
      }
      const s2 = toMinutes(itemStartEnd[0]);
      const e2 = toMinutes(itemStartEnd[1]);

      if (s1 < e2 && s2 < e1) {
        const conflictDays = (item.classDays ?? []).join(', ');
        throw new BadRequestException(
          `Trùng lịch học: Phòng '${classroom}' đã được xếp cho lớp '${item.name}' vào [${conflictDays}] lúc ${item.classTime}.`,
        );
      }
    }
  }

  private toPublicPayload(servicePackage: ServicePackage) {
    return {
      id: servicePackage.publicId,
      name: servicePackage.name,
      description: servicePackage.description,
      priceLabel: servicePackage.priceLabel,
      basePrice: servicePackage.basePrice,
      imageUrl: servicePackage.imageUrl,
      category: servicePackage.category,
      features: servicePackage.features,
      minGuests: servicePackage.minGuests,
      maxGuests: servicePackage.maxGuests,
      serviceDuration: servicePackage.serviceDuration,
      venueScope: servicePackage.venueScope,
      defaultMenu: servicePackage.defaultMenu,
      classDays: servicePackage.classDays,
      classTime: servicePackage.classTime,
      instructor: servicePackage.instructor,
      classroom: servicePackage.classroom,
      isFeatured: servicePackage.isFeatured,
      sortOrder: servicePackage.sortOrder,
    };
  }

  async create(dto: CreateServicePackageDto): Promise<ServicePackage> {
    this.ensureValidGuestRange(dto.minGuests, dto.maxGuests);
    this.ensurePricing(dto.basePrice, dto.priceLabel);

    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const last = await this.servicePackageRepository.find({
        order: { sortOrder: 'DESC' },
        take: 1,
      });
      sortOrder = (last[0]?.sortOrder ?? -1) + 1;
    }

    const entity = this.servicePackageRepository.create({
      name: dto.name,
      description: dto.description,
      priceLabel: dto.priceLabel?.trim() ?? '',
      basePrice: dto.basePrice ?? null,
      imageUrl: dto.imageUrl,
      category: dto.category,
      features: dto.features ?? [],
      minGuests: dto.minGuests ?? null,
      maxGuests: dto.maxGuests ?? null,
      serviceDuration: dto.serviceDuration?.trim() ?? '',
      venueScope: dto.venueScope?.trim() ?? '',
      defaultMenu: dto.defaultMenu?.trim() ?? '',
      classDays: dto.classDays ?? null,
      classTime: dto.classTime?.trim() ?? null,
      instructor: dto.instructor?.trim() ?? null,
      classroom: dto.classroom?.trim() ?? null,
      isFeatured: dto.isFeatured ?? false,
      isActive: dto.isActive ?? true,
      sortOrder,
    });

    await this.checkClassroomConflict(
      entity.category,
      entity.classroom,
      entity.classDays,
      entity.classTime,
    );

    return this.servicePackageRepository.save(entity);
  }

  async seedSampleData() {
    let createdCount = 0;
    let updatedCount = 0;

    for (const seedItem of SERVICE_PACKAGE_SEED_DATA) {
      this.ensureValidGuestRange(seedItem.minGuests, seedItem.maxGuests);
      this.ensurePricing(seedItem.basePrice, seedItem.priceLabel);

      const existing = await this.servicePackageRepository.findOneBy({
        name: seedItem.name,
      });

      if (existing) {
        Object.assign(existing, {
          name: seedItem.name,
          description: seedItem.description,
          priceLabel: seedItem.priceLabel?.trim() ?? '',
          basePrice: seedItem.basePrice ?? null,
          imageUrl: seedItem.imageUrl,
          category: seedItem.category,
          features: seedItem.features ?? [],
          minGuests: seedItem.minGuests ?? null,
          maxGuests: seedItem.maxGuests ?? null,
          serviceDuration: seedItem.serviceDuration?.trim() ?? '',
          venueScope: seedItem.venueScope?.trim() ?? '',
          defaultMenu: seedItem.defaultMenu?.trim() ?? '',
          classDays: seedItem.classDays ?? null,
          classTime: seedItem.classTime?.trim() ?? null,
          instructor: seedItem.instructor?.trim() ?? null,
          classroom: seedItem.classroom?.trim() ?? null,
          isFeatured: seedItem.isFeatured ?? false,
          isActive: seedItem.isActive ?? true,
          sortOrder: seedItem.sortOrder ?? existing.sortOrder,
        });
        await this.servicePackageRepository.save(existing);
        updatedCount += 1;
        continue;
      }

      const entity = this.servicePackageRepository.create({
        name: seedItem.name,
        description: seedItem.description,
        priceLabel: seedItem.priceLabel?.trim() ?? '',
        basePrice: seedItem.basePrice ?? null,
        imageUrl: seedItem.imageUrl,
        category: seedItem.category,
        features: seedItem.features ?? [],
        minGuests: seedItem.minGuests ?? null,
        maxGuests: seedItem.maxGuests ?? null,
        serviceDuration: seedItem.serviceDuration?.trim() ?? '',
        venueScope: seedItem.venueScope?.trim() ?? '',
        defaultMenu: seedItem.defaultMenu?.trim() ?? '',
        classDays: seedItem.classDays ?? null,
        classTime: seedItem.classTime?.trim() ?? null,
        instructor: seedItem.instructor?.trim() ?? null,
        classroom: seedItem.classroom?.trim() ?? null,
        isFeatured: seedItem.isFeatured ?? false,
        isActive: seedItem.isActive ?? true,
        sortOrder: seedItem.sortOrder ?? createdCount,
      });
      await this.servicePackageRepository.save(entity);
      createdCount += 1;
    }

    return {
      message: 'Seed dữ liệu gói dịch vụ thành công.',
      totalSeedItems: SERVICE_PACKAGE_SEED_DATA.length,
      createdCount,
      updatedCount,
    };
  }

  async findPublicList(category?: string) {
    const where = category ? { category, isActive: true } : { isActive: true };
    const rows = await this.servicePackageRepository.find({
      where,
      order: { isFeatured: 'DESC', sortOrder: 'ASC' },
    });
    return rows.map((row) => this.toPublicPayload(row));
  }

  async findFeaturedPublic(limit = 6) {
    const featuredRows = await this.servicePackageRepository.find({
      where: { isActive: true, isFeatured: true },
      order: { sortOrder: 'ASC' },
      take: limit,
    });
    return featuredRows.map((row) => this.toPublicPayload(row));
  }

  async findAllForAdmin(category?: string, isActive?: boolean) {
    let where: { category?: string; isActive?: boolean } = {};
    if (category) {
      where = { ...where, category };
    }
    if (isActive !== undefined) {
      where = { ...where, isActive };
    }
    return this.servicePackageRepository.find({
      where,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOneByPublicId(publicId: string): Promise<ServicePackage> {
    const servicePackage = await this.servicePackageRepository.findOneBy({
      publicId,
    });
    if (!servicePackage) {
      throw new NotFoundException(`Không tìm thấy gói dịch vụ ${publicId}`);
    }
    return servicePackage;
  }

  async update(
    publicId: string,
    dto: UpdateServicePackageDto,
  ): Promise<ServicePackage> {
    const servicePackage = await this.findOneByPublicId(publicId);

    const nextMinGuests = dto.minGuests ?? servicePackage.minGuests;
    const nextMaxGuests = dto.maxGuests ?? servicePackage.maxGuests;
    this.ensureValidGuestRange(nextMinGuests, nextMaxGuests);

    const nextBasePrice =
      dto.basePrice === undefined ? servicePackage.basePrice : dto.basePrice;
    const nextPriceLabel =
      dto.priceLabel === undefined ? servicePackage.priceLabel : dto.priceLabel;
    this.ensurePricing(nextBasePrice, nextPriceLabel);

    const nextCategory = dto.category ?? servicePackage.category;
    const nextClassroom = dto.classroom !== undefined ? dto.classroom : servicePackage.classroom;
    const nextClassDays = dto.classDays !== undefined ? dto.classDays : servicePackage.classDays;
    const nextClassTime = dto.classTime !== undefined ? dto.classTime : servicePackage.classTime;

    await this.checkClassroomConflict(
      nextCategory,
      nextClassroom,
      nextClassDays,
      nextClassTime,
      publicId,
    );

    Object.assign(servicePackage, {
      ...dto,
      priceLabel: dto.priceLabel?.trim() ?? nextPriceLabel ?? '',
      serviceDuration:
        dto.serviceDuration?.trim() ?? servicePackage.serviceDuration,
      venueScope: dto.venueScope?.trim() ?? servicePackage.venueScope,
      defaultMenu: dto.defaultMenu?.trim() ?? servicePackage.defaultMenu,
      features: dto.features ?? servicePackage.features,
      classDays: dto.classDays !== undefined ? dto.classDays : servicePackage.classDays,
      classTime: dto.classTime !== undefined ? (dto.classTime?.trim() || null) : servicePackage.classTime,
      instructor: dto.instructor !== undefined ? (dto.instructor?.trim() || null) : servicePackage.instructor,
      classroom: dto.classroom !== undefined ? (dto.classroom?.trim() || null) : servicePackage.classroom,
    });

    return this.servicePackageRepository.save(servicePackage);
  }

  async reorder(dto: ReorderServicePackagesDto): Promise<ServicePackage[]> {
    const existing = await this.servicePackageRepository.find({
      order: { sortOrder: 'ASC' },
    });

    if (existing.length !== dto.orderedPublicIds.length) {
      throw new BadRequestException(
        'orderedPublicIds phải liệt kê đủ mọi gói dịch vụ theo thứ tự mới.',
      );
    }

    const byId = new Map(existing.map((item) => [item.publicId, item]));
    for (const id of dto.orderedPublicIds) {
      if (!byId.has(id)) {
        throw new BadRequestException(`publicId không hợp lệ: ${id}`);
      }
    }

    const orderedSet = new Set(dto.orderedPublicIds);
    if (orderedSet.size !== dto.orderedPublicIds.length) {
      throw new BadRequestException('orderedPublicIds không được trùng lặp.');
    }

    const updates = dto.orderedPublicIds.map((id, index) => {
      const servicePackage = byId.get(id) as ServicePackage;
      servicePackage.sortOrder = index;
      return servicePackage;
    });

    await this.servicePackageRepository.save(updates);
    return this.servicePackageRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async remove(publicId: string): Promise<{ message: string }> {
    await this.findOneByPublicId(publicId);
    await this.servicePackageRepository.deleteOne({ publicId });
    return { message: 'Đã xóa gói dịch vụ.' };
  }
}
