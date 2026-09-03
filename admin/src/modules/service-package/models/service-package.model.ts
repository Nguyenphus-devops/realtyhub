export const SERVICE_PACKAGE_CATEGORIES = [
  "gym",
  "yoga",
  "massage",
  "pt",
  "dance",
  "kickboxing",
  "dance_kid",
  "membership",
] as const;

export type ServicePackageCategory = string;

export type AdminServicePackage = {
  publicId: string;
  name: string;
  description: string;
  priceLabel: string;
  basePrice: number | null;
  imageUrl: string;
  category: ServicePackageCategory;
  features: string[];
  minGuests: number | null;
  maxGuests: number | null;
  serviceDuration: string;
  venueScope: string;
  defaultMenu: string;
  classDays: string[] | null;
  classTime: string | null;
  instructor: string | null;
  classroom: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCreateServicePackageInput = {
  name: string;
  description: string;
  priceLabel?: string;
  basePrice?: number;
  imageUrl: string;
  category: ServicePackageCategory;
  features?: string[];
  minGuests?: number;
  maxGuests?: number;
  serviceDuration?: string;
  venueScope?: string;
  defaultMenu?: string;
  classDays?: string[];
  classTime?: string;
  instructor?: string;
  classroom?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
};

export type AdminUpdateServicePackageInput = Partial<
  AdminCreateServicePackageInput
>;
