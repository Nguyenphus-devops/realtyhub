import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeVietnameseTones } from './utils/video.utils';
import * as fs from 'fs';
import * as path from 'path';
import { Video } from './entities/video.entity';
import { MongoRepository } from 'typeorm';
import { IVideoService } from './video';
import { HistoryService } from '../../history/history.service';
import { HISTORY_ACTIONS } from '../../history/history';
import { VideoProgressService } from './video-progress.service';

export interface PaginatedVideos {
  videos: Video[];
  total: number;
  hasMore: boolean;
}

@Injectable()
export class VideosService implements IVideoService {
  private static readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'videos');

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: MongoRepository<Video>,
    private readonly historyService: HistoryService,
    private readonly videoProgressService: VideoProgressService,
  ) {}

  public static buildUploadFolderByDate(baseDate: Date): {
    year: string;
    month: string;
    day: string;
    folderPath: string;
  } {
    const year = baseDate.getFullYear().toString();
    const month = String(baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(baseDate.getDate()).padStart(2, '0');

    return {
      year,
      month,
      day,
      folderPath: path.join(VideosService.UPLOAD_ROOT, year, month, day),
    };
  }

  public ensureUploadFolder(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  public async generateUniqueSlug(originalName: string): Promise<string> {
    const baseSlug = removeVietnameseTones(
      originalName.split('.').slice(0, -1).join('-'),
    );
    const fallbackSlug = baseSlug || 'image';

    let count = 1;
    let slug = fallbackSlug;

    while (await this.videoRepository.findOneBy({ slug })) {
      slug = `${fallbackSlug}-${count}`;
      count++;
    }

    return slug;
  }

  public async saveVideoToDatabase(file: Express.Multer.File, uploadId?: string): Promise<Video> {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file upload.');
    }

    const now = new Date();
    const { year, month, day } = VideosService.buildUploadFolderByDate(now);

    const videoUrl = `/uploads/videos/${year}/${month}/${day}/${file.filename}`;
    const slug = await this.generateUniqueSlug(file.originalname);
    const video = this.videoRepository.create({
      originalName: file.originalname,
      videoUrl,
      slug,
      alt: file.originalname,
      uploadId,
      fileSize: file.size,
      uploadedBytes: file.size,
      uploadProgress: 100,
      uploadStatus: 'completed',
    });

    return this.videoRepository.save(video);
  }

  public async handleSingleFileUpload(
    file: Express.Multer.File,
    uploadId: string
  ): Promise<Video> {
    try {
      // Emit initial progress events
      await this.videoProgressService.initializeUpload(uploadId, file.size);

      // Simulate progress for already uploaded file (multer already wrote it)
      const steps = [25, 50, 75, 90];
      for (const progress of steps) {
        await this.videoProgressService.updateProgress(
          uploadId,
          Math.floor((file.size * progress) / 100),
          file.size,
          'uploading',
        );
        // Small delay to allow SSE to catch up
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const video = await this.saveVideoToDatabase(file, uploadId);

      await this.videoProgressService.completeUpload(uploadId, video.slug);

      return video;
    } catch (error) {
      await this.videoProgressService.failUpload(
        uploadId,
        error instanceof Error ? error.message : 'Upload failed',
      );
      throw error;
    }
  }

  public async handleMultipleFileUpload(
    files: Express.Multer.File[],
  ): Promise<Video[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có video nào để tải lên.');
    }

    return Promise.all(files.map((file) => this.saveVideoToDatabase(file)));
  }

  public async deleteVideoBySlug(
    slug: string,
    userId: string,
  ): Promise<{ message: string }> {
    const video = await this.videoRepository.findOneBy({ slug });

    if (!video) {
      throw new NotFoundException(`Không tìm thấy video với slug: ${slug}`);
    }

    const videoUrlParts = video.videoUrl.split('/');
    const year = videoUrlParts[videoUrlParts.length - 4]; // Lấy phần năm
    const month = videoUrlParts[videoUrlParts.length - 3]; // Lấy phần tháng
    const day = videoUrlParts[videoUrlParts.length - 2]; // Lấy phần ngày
    const filename = videoUrlParts[videoUrlParts.length - 1]; // Lấy tên file

    const filePath = path.join(
      VideosService.UPLOAD_ROOT,
      year,
      month,
      day,
      filename,
    );

    try {
      await fs.promises.access(filePath, fs.constants.F_OK); // Kiểm tra file tồn tại
      await fs.promises.unlink(filePath);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err as NodeJS.ErrnoException).code !== 'ENOENT'
      ) {
        throw new InternalServerErrorException(
          `Lỗi khi xóa file vật lý: ${err.message}`,
        );
      }
    }

    await this.videoRepository.deleteOne({ slug });

    await this.historyService.create({
      action: HISTORY_ACTIONS.VIDEO_DELETED,
      message: `Xóa vĩnh viễn video ${slug}`,
      actorId: userId,
      targetType: 'blog',
      targetId: slug,
    });

    return { message: `Đã xóa video: ${filename}` };
  }

  public async getAllVideos(
    page: number = 1,
    limit: number = 60,
  ): Promise<PaginatedVideos> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
    const normalizedLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 60;
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [videos, total] = await Promise.all([
      this.videoRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: normalizedLimit,
      }),
      this.videoRepository.count(),
    ]);

    const hasMore = total > skip + videos.length;

    return {
      videos,
      total,
      hasMore,
    };
  }
}
