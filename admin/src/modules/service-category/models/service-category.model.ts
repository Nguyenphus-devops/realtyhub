export type AdminServiceCategory = {
  publicId: string;
  name: string;
  slug: string;
  type: 'individual' | 'class';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminCreateServiceCategoryInput = {
  name: string;
  slug: string;
  type: 'individual' | 'class';
  isActive?: boolean;
};

export type AdminUpdateServiceCategoryInput = Partial<AdminCreateServiceCategoryInput>;
