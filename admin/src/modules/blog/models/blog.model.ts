export type BlogStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: T;
};

export type BlogCategory = {
  main: string[];
  sub: string[];
};

export type BlogSeo = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogAuthor = {
  avatar?: string;
  name?: string;
  position?: string;
  description?: string;
};

export type Blog = {
  _id: string;
  userId: string;
  slug: string;
  title: string;
  excerpt: string;
  blogData: string;
  thumbnail?: string;
  category?: BlogCategory;
  seo?: BlogSeo;
  faqs?: BlogFaq[];
  author?: BlogAuthor;
  status: BlogStatus;
  isHidden: boolean;
  isFeatured?: boolean;
  isDeleted: boolean;
  showBMI?: boolean;
  showTDEE?: boolean;
  showBMR?: boolean;
  showRMR?: boolean;
  showProtein?: boolean;
  showBodyFat?: boolean;
  relatedSlugs?: string[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedBlogs = {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type CreateBlogDto = {
  title: string;
  excerpt: string;
  blogData: string;
  slug?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  showBMI?: boolean;
  showTDEE?: boolean;
  showBMR?: boolean;
  showRMR?: boolean;
  showProtein?: boolean;
  showBodyFat?: boolean;
  categoryMain?: string[];
  categorySub?: string[];
  seo?: BlogSeo;
  faqs?: BlogFaq[];
  author?: BlogAuthor;
  relatedSlugs?: string[];
};

export type UpdateBlogDto = Partial<CreateBlogDto> & {
  isHidden?: boolean;
  status?: BlogStatus;
};
