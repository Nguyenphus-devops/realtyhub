import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { relative } from 'path';

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  private toImageUrl(file?: Express.Multer.File, fallback?: string | null) {
    if (file?.path) {
      return `/${relative(process.cwd(), file.path).replace(/\\/g, '/')}`;
    }
    return fallback || null;
  }

  private getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'AV';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  private validateFeedbackInput(
    dto: Partial<CreateFeedbackDto>,
    files?: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
  ) {
    if (dto.name !== undefined) {
      const nameTrim = dto.name.trim();
      if (!nameTrim) {
        throw new BadRequestException('Tên hội viên không được để trống.');
      }
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        throw new BadRequestException(
          'Tên hội viên không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
        );
      }
      if (nameTrim.length > 100) {
        throw new BadRequestException(
          'Tên hội viên không được vượt quá 100 ký tự.',
        );
      }
    }

    if (dto.comment !== undefined) {
      const commentTrim = dto.comment.trim();
      if (!commentTrim) {
        throw new BadRequestException('Nội dung nhận xét không được để trống.');
      }
    }

    const checkFile = (file?: Express.Multer.File, label: string = 'ảnh') => {
      if (file) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          throw new BadRequestException(
            `File ${label} không đúng định dạng. Chỉ chấp nhận tệp JPG, PNG, GIF, WEBP.`,
          );
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new BadRequestException(
            `Dung lượng file ${label} không được vượt quá 5MB.`,
          );
        }
      }
    };

    checkFile(files?.beforeImage?.[0], 'Before');
    checkFile(files?.afterImage?.[0], 'After');
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByPublicId(publicId: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { publicId },
    });
    if (!feedback) {
      throw new NotFoundException(
        `Feedback with publicId ${publicId} not found`,
      );
    }
    return feedback;
  }

  async create(
    dto: CreateFeedbackDto,
    files?: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
  ): Promise<Feedback> {
    this.validateFeedbackInput(dto, files);

    const beforeFile = files?.beforeImage?.[0];
    const afterFile = files?.afterImage?.[0];

    const feedback = this.feedbackRepository.create({
      ...dto,
      name: dto.name.trim(),
      comment: dto.comment.trim(),
      avatar: dto.avatar?.trim() || this.getInitials(dto.name),
      rating: dto.rating !== undefined ? Number(dto.rating) : 5,
      beforeImage: this.toImageUrl(beforeFile, dto.beforeImage?.trim() || null),
      afterImage: this.toImageUrl(afterFile, dto.afterImage?.trim() || null),
    });

    return this.feedbackRepository.save(feedback);
  }

  async update(
    publicId: string,
    dto: UpdateFeedbackDto,
    files?: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
  ): Promise<Feedback> {
    const feedback = await this.findOneByPublicId(publicId);
    this.validateFeedbackInput(dto, files);

    const beforeFile = files?.beforeImage?.[0];
    const afterFile = files?.afterImage?.[0];

    const updatedData: Partial<Feedback> = {
      ...dto,
    };

    if (dto.name !== undefined) {
      updatedData.name = dto.name.trim();
      updatedData.avatar = dto.avatar?.trim() || this.getInitials(dto.name);
    } else if (dto.avatar !== undefined) {
      updatedData.avatar = dto.avatar.trim() || this.getInitials(feedback.name);
    }

    if (dto.comment !== undefined) {
      updatedData.comment = dto.comment.trim();
    }

    if (dto.rating !== undefined) {
      updatedData.rating = Number(dto.rating);
    }

    if (beforeFile) {
      updatedData.beforeImage = this.toImageUrl(beforeFile);
    } else if (dto.beforeImage !== undefined) {
      updatedData.beforeImage = dto.beforeImage?.trim() || null;
    }

    if (afterFile) {
      updatedData.afterImage = this.toImageUrl(afterFile);
    } else if (dto.afterImage !== undefined) {
      updatedData.afterImage = dto.afterImage?.trim() || null;
    }

    Object.assign(feedback, updatedData);
    return this.feedbackRepository.save(feedback);
  }

  async remove(publicId: string): Promise<{ message: string }> {
    const feedback = await this.findOneByPublicId(publicId);
    await this.feedbackRepository.remove(feedback);
    return {
      message: `Feedback with publicId ${publicId} deleted successfully`,
    };
  }

  async seedSampleData(): Promise<{ message: string; count: number }> {
    const count = await this.feedbackRepository.count();
    if (count > 0) {
      return { message: 'Dữ liệu feedback đã tồn tại, không cần seed.', count };
    }

    const samples = [
      {
        name: 'Alex Turner',
        avatar: 'AT',
        rating: 5,
        comment:
          'X-Gym & Dance hoàn toàn thay đổi hành trình tập luyện của tôi. Các huấn luyện viên cực kỳ chuyên nghiệp và thân thiện!',
        serviceType: 'gym',
        beforeImage: null,
        afterImage: null,
      },
      {
        name: 'Maria Garcia',
        avatar: 'MG',
        rating: 5,
        comment:
          'Phòng nhảy tốt nhất Quận 7! Biên đạo xuất sắc và các giáo viên làm cho mỗi lớp học đều vô cùng hào hứng.',
        serviceType: 'dance',
        beforeImage: null,
        afterImage: null,
      },
      {
        name: 'James Wilson',
        avatar: 'JW',
        rating: 5,
        comment:
          'Bắt đầu tập Boxing tại đây 6 tháng trước và đã giảm được 10kg. Các huấn luyện viên luôn thúc đẩy bạn vượt qua giới hạn.',
        serviceType: 'boxing',
        beforeImage: null,
        afterImage: null,
      },
      {
        name: 'Sophie Chen',
        avatar: 'SC',
        rating: 5,
        comment:
          'Các lớp học Yoga rất bình yên và thư thái. Giảng viên cực kỳ có tâm và chỉnh sửa động tác rất chi tiết cho học viên.',
        serviceType: 'yoga',
        beforeImage: null,
        afterImage: null,
      },
      {
        name: 'Nguyễn Văn Nam',
        avatar: 'NN',
        rating: 5,
        comment:
          'Hành trình lột xác 3 tháng tăng cơ giảm mỡ cùng PT tại X-Gym. Từ 80kg nhiều mỡ thừa xuống còn 72kg cơ bắp săn chắc.',
        serviceType: 'pt',
        beforeImage:
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop',
        afterImage:
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop',
      },
    ];

    let createdCount = 0;
    for (const sample of samples) {
      const item = this.feedbackRepository.create(sample);
      await this.feedbackRepository.save(item);
      createdCount++;
    }

    return {
      message: 'Seed dữ liệu feedback mẫu thành công.',
      count: createdCount,
    };
  }
}
