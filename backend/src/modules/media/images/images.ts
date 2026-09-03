import { Image } from './entities/image.entity';
import { PaginatedImages } from './images.service';

export interface IImageService {
  generateUniqueSlug(originalName: string): Promise<string>;
  saveImageToDatabase(file: Express.Multer.File): Promise<Image>;
  handleSingleFileUpload(file: Express.Multer.File): Promise<Image>;
  handleMultipleFileUpload(files: Express.Multer.File[]): Promise<Image[]>;
  deleteImageBySlug(slug: string, userId: string): Promise<{ message: string }>;
  getAllImages(page?: number, limit?: number): Promise<PaginatedImages>;
}
