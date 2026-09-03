import { Video } from './entities/video.entity';
import { PaginatedVideos } from './video.service';

export interface IVideoService {
  generateUniqueSlug(originalName: string): Promise<string>;
  saveVideoToDatabase(file: Express.Multer.File, uploadId?: string): Promise<Video>;
  handleSingleFileUpload(file: Express.Multer.File, uploadId: string): Promise<Video>;
  handleMultipleFileUpload(files: Express.Multer.File[]): Promise<Video[]>;
  deleteVideoBySlug(slug: string, userId: string): Promise<{ message: string }>;
  getAllVideos(page?: number, limit?: number): Promise<PaginatedVideos>;
}
