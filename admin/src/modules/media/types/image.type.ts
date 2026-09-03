export type ImageResponse = {
  _id: string;
  originalName: string;
  imageUrl: string;
  location: string;
  slug: string;
  alt: string;
  caption?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedImageResponse = {
  images: ImageResponse[];
  total: number;
  hasMore: boolean;
}