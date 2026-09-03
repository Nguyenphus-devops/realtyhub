export type BannerMediaType = 'video' | 'image';

export type AdminBanner = {
  publicId: string;
  placement: string;
  sortOrder: number;
  isActive: boolean;
  mediaType: BannerMediaType;
  src: string;
  posterUrl: string;
  thumbnailUrl: string;
  alt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminCreateBannerInput = {
  placement: string;
  mediaType: BannerMediaType;
  src: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  alt?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type AdminUpdateBannerInput = Partial<
  Omit<AdminCreateBannerInput, 'placement'>
>;
