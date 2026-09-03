import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeVietnameseTones } from './utils/image.utils';
import * as fs from 'fs';
import * as path from 'path';
import { Image } from './entities/image.entity';
import { MongoRepository } from 'typeorm';
import { IImageService } from './images';
import { HistoryService } from '../../history/history.service';
import { HISTORY_ACTIONS } from '../../history/history';

export interface PaginatedImages {
  images: Image[];
  total: number;
  hasMore: boolean;
}

@Injectable()
export class ImagesService implements IImageService {
  private static readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'images');

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: MongoRepository<Image>,
    private readonly historyService: HistoryService,
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
      folderPath: path.join(ImagesService.UPLOAD_ROOT, year, month, day),
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

    while (await this.imageRepository.findOneBy({ slug })) {
      slug = `${fallbackSlug}-${count}`;
      count++;
    }

    return slug;
  }

  public async saveImageToDatabase(file: Express.Multer.File): Promise<Image> {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file upload.');
    }

    const now = new Date();
    const { year, month, day } = ImagesService.buildUploadFolderByDate(now);

    const imageUrl = `/uploads/images/${year}/${month}/${day}/${file.filename}`;
    const slug = await this.generateUniqueSlug(file.originalname);
    const image = this.imageRepository.create({
      originalName: file.originalname,
      imageUrl,
      slug,
      alt: file.originalname,
    });

    return this.imageRepository.save(image);
  }

  public async handleSingleFileUpload(
    file: Express.Multer.File,
  ): Promise<Image> {
    return this.saveImageToDatabase(file);
  }

  public async handleMultipleFileUpload(
    files: Express.Multer.File[],
  ): Promise<Image[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có ảnh nào để tải lên.');
    }

    return Promise.all(files.map((file) => this.saveImageToDatabase(file)));
  }

  public async deleteImageBySlug(
    slug: string,
    userId: string,
  ): Promise<{ message: string }> {
    const image = await this.imageRepository.findOneBy({ slug });

    if (!image) {
      throw new NotFoundException(`Không tìm thấy ảnh với slug: ${slug}`);
    }

    const imageUrlParts = image.imageUrl.split('/');
    const year = imageUrlParts[imageUrlParts.length - 4]; // Lấy phần năm
    const month = imageUrlParts[imageUrlParts.length - 3]; // Lấy phần tháng
    const day = imageUrlParts[imageUrlParts.length - 2]; // Lấy phần ngày
    const filename = imageUrlParts[imageUrlParts.length - 1]; // Lấy tên file

    const filePath = path.join(
      ImagesService.UPLOAD_ROOT,
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

    await this.imageRepository.deleteOne({ slug });

    await this.historyService.create({
      action: HISTORY_ACTIONS.IMAGE_DELETED,
      message: `Xóa vĩnh viễn hình ảnh ${slug}`,
      actorId: userId,
      targetType: 'blog',
      targetId: slug,
    });

    return { message: `Đã xóa ảnh: ${filename}` };
  }

  public async getAllImages(
    page: number = 1,
    limit: number = 60,
  ): Promise<PaginatedImages> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
    const normalizedLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 60;
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [images, total] = await Promise.all([
      this.imageRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: normalizedLimit,
      }),
      this.imageRepository.count(),
    ]);

    const hasMore = total > skip + images.length;

    return {
      images,
      total,
      hasMore,
    };
  }
}
