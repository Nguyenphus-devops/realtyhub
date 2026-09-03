import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ReorderBannersDto } from './dto/reorder-banners.dto';

export type PublicBannerItem = {
  id: string;
  mediaType: 'video' | 'image';
  src: string;
  posterUrl: string;
  thumbnailUrl: string;
  alt: string;
  sortOrder: number;
};

export type PublicBannerPayload = {
  placement: string;
  items: PublicBannerItem[];
  updatedAt: string;
};

const MAX_BANNERS_PER_PLACEMENT = 24;

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: MongoRepository<Banner>,
  ) {}

  private toPublicItem(banner: Banner): PublicBannerItem {
    return {
      id: banner.publicId,
      mediaType: banner.mediaType,
      src: banner.src,
      posterUrl: banner.posterUrl,
      thumbnailUrl: banner.thumbnailUrl,
      alt: banner.alt,
      sortOrder: banner.sortOrder,
    };
  }

  async findPublicByPlacement(placement: string): Promise<PublicBannerPayload> {
    const rows = await this.bannerRepository.find({
      where: { placement, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    const updatedAt =
      rows.length === 0
        ? new Date(0).toISOString()
        : rows
            .reduce(
              (latest, row) =>
                row.updatedAt > latest ? row.updatedAt : latest,
              rows[0].updatedAt,
            )
            .toISOString();

    return {
      placement,
      items: rows.map((row) => this.toPublicItem(row)),
      updatedAt,
    };
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const count = await this.bannerRepository.count({
      where: { placement: dto.placement },
    });
    if (count >= MAX_BANNERS_PER_PLACEMENT) {
      throw new BadRequestException(
        `Tối đa ${MAX_BANNERS_PER_PLACEMENT} banner cho mỗi placement.`,
      );
    }

    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const last = await this.bannerRepository.find({
        where: { placement: dto.placement },
        order: { sortOrder: 'DESC' },
        take: 1,
      });
      sortOrder = (last[0]?.sortOrder ?? -1) + 1;
    }

    const entity = this.bannerRepository.create({
      placement: dto.placement,
      mediaType: dto.mediaType,
      src: dto.src,
      posterUrl: dto.posterUrl ?? '',
      thumbnailUrl: dto.thumbnailUrl ?? '',
      alt: dto.alt ?? '',
      sortOrder,
      isActive: dto.isActive ?? true,
    });

    return this.bannerRepository.save(entity);
  }

  async findAllForAdmin(placement?: string): Promise<Banner[]> {
    const where = placement ? { placement } : {};
    return this.bannerRepository.find({
      where,
      order: { placement: 'ASC', sortOrder: 'ASC' },
    });
  }

  async findOneByPublicId(publicId: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOneBy({ publicId });
    if (!banner) {
      throw new NotFoundException(`Không tìm thấy banner ${publicId}`);
    }
    return banner;
  }

  async update(publicId: string, dto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.findOneByPublicId(publicId);
    Object.assign(banner, dto);
    return this.bannerRepository.save(banner);
  }

  async remove(publicId: string): Promise<{ message: string }> {
    await this.findOneByPublicId(publicId);
    await this.bannerRepository.deleteOne({ publicId });
    return { message: 'Đã xóa banner.' };
  }

  async reorder(placement: string, dto: ReorderBannersDto): Promise<Banner[]> {
    const existing = await this.bannerRepository.find({
      where: { placement },
      order: { sortOrder: 'ASC' },
    });

    if (existing.length !== dto.orderedPublicIds.length) {
      throw new BadRequestException(
        'orderedPublicIds phải liệt kê đủ mọi banner của placement theo thứ tự mới.',
      );
    }

    const byId = new Map(existing.map((b) => [b.publicId, b]));
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
      const banner = byId.get(id) as Banner;
      banner.sortOrder = index;
      return banner;
    });

    await this.bannerRepository.save(updates);
    return this.bannerRepository.find({
      where: { placement },
      order: { sortOrder: 'ASC' },
    });
  }
}
