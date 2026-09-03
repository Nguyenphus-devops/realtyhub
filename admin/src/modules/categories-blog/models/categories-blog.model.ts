export type CategoriesBlog = {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentSlug: string | null;
  childrenSlugs: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedCategoriesBlog = {
  categories: CategoriesBlog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type CreateCategoriesBlogDto = {
  name: string;
  slug?: string;
  parentSlug?: string;
};

export type UpdateCategoriesBlogDto = {
  name?: string;
  slug?: string;
  parentSlug?: string;
};
