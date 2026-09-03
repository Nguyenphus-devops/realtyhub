import type { Banner } from './entities/banner.entity';
import type { CreateBannerDto } from './dto/create-banner.dto';
import type { UpdateBannerDto } from './dto/update-banner.dto';
import type { ReorderBannersDto } from './dto/reorder-banners.dto';
import type { PublicBannerPayload } from './banner.service';

export type { PublicBannerPayload, PublicBannerItem } from './banner.service';

export interface IBannerService {
  findPublicByPlacement(placement: string): Promise<PublicBannerPayload>;
  create(dto: CreateBannerDto): Promise<Banner>;
  findAllForAdmin(placement?: string): Promise<Banner[]>;
  findOneByPublicId(publicId: string): Promise<Banner>;
  update(publicId: string, dto: UpdateBannerDto): Promise<Banner>;
  remove(publicId: string): Promise<{ message: string }>;
  reorder(placement: string, dto: ReorderBannersDto): Promise<Banner[]>;
}
