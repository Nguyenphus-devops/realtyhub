import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { relative } from 'path';

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
const PHONE_REGEX = /^0[0-9]{9}$/;

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: MongoRepository<Trainer>,
  ) {}

  private toPhotoUrl(photo?: Express.Multer.File, fallback?: string | null) {
    if (photo?.path) {
      return `/${relative(process.cwd(), photo.path).replace(/\\/g, '/')}`;
    }
    return fallback ?? null;
  }

  private async validateTrainerFields(
    dto: Partial<CreateTrainerDto>,
    currentPublicId?: string,
  ) {
    if (dto.name !== undefined) {
      const nameTrim = dto.name.trim();
      if (!nameTrim) {
        throw new BadRequestException('Tên huấn luyện viên không được để trống.');
      }
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        throw new BadRequestException(
          'Tên huấn luyện viên không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).',
        );
      }
    }

    if (dto.phone !== undefined) {
      const phoneClean = dto.phone.replace(/[\s-]/g, '').trim();
      if (!phoneClean) {
        throw new BadRequestException('Số điện thoại không được để trống.');
      }
      if (!PHONE_REGEX.test(phoneClean)) {
        throw new BadRequestException(
          'Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và gồm 10 chữ số).',
        );
      }
    }

    if (dto.birthDate !== undefined) {
      if (!dto.birthDate) {
        throw new BadRequestException('Ngày sinh không được để trống.');
      }
      const birth = new Date(dto.birthDate);
      if (isNaN(birth.getTime())) {
        throw new BadRequestException('Ngày sinh không hợp lệ.');
      }
      const now = new Date();
      const age = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) {
        throw new BadRequestException('Huấn luyện viên phải từ 18 tuổi trở lên (ngày sinh không hợp lệ).');
      }
    }

    if (dto.address !== undefined) {
      if (!dto.address.trim()) {
        throw new BadRequestException('Địa chỉ không được để trống.');
      }
    }

    if (dto.experience !== undefined && dto.experience !== null) {
      const expNum = Number(dto.experience);
      if (isNaN(expNum) || expNum < 0 || expNum > 60) {
        throw new BadRequestException('Kinh nghiệm thực tế phải là số từ 0 đến 60 năm.');
      }
    }
  }

  async create(dto: CreateTrainerDto, photo?: Express.Multer.File): Promise<Trainer> {
    await this.validateTrainerFields(dto);

    const specialties = Array.isArray(dto.specialties)
      ? dto.specialties
      : typeof dto.specialties === 'string'
        ? dto.specialties.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    const certificates = Array.isArray(dto.certificates)
      ? dto.certificates
      : typeof dto.certificates === 'string'
        ? dto.certificates.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

    const entity = this.trainerRepository.create({
      name: dto.name.trim(),
      birthDate: new Date(dto.birthDate),
      gender: dto.gender,
      address: dto.address.trim(),
      photoUrl: this.toPhotoUrl(photo, dto.photoUrl?.trim() || null),
      serviceType: dto.serviceType.trim(),
      phone: dto.phone?.trim() || '',
      experience: dto.experience !== undefined ? Number(dto.experience) : 0,
      rating: dto.rating ? Number(dto.rating) : 5.0,
      specialties,
      certificates,
      bio: dto.bio?.trim() || '',
    });
    return this.trainerRepository.save(entity);
  }

  async findAll() {
    return this.trainerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByPublicId(publicId: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findOneBy({ publicId });
    if (!trainer) {
      throw new NotFoundException(`Không tìm thấy huấn luyện viên ${publicId}`);
    }
    return trainer;
  }

  async update(
    publicId: string,
    dto: UpdateTrainerDto,
    photo?: Express.Multer.File,
  ): Promise<Trainer> {
    const trainer = await this.findOneByPublicId(publicId);
    await this.validateTrainerFields(dto, publicId);

    let specialties = trainer.specialties;
    if (dto.specialties !== undefined) {
      specialties = Array.isArray(dto.specialties)
        ? dto.specialties
        : typeof dto.specialties === 'string'
          ? dto.specialties.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
    }

    let certificates = trainer.certificates;
    if (dto.certificates !== undefined) {
      certificates = Array.isArray(dto.certificates)
        ? dto.certificates
        : typeof dto.certificates === 'string'
          ? dto.certificates.split(',').map((c) => c.trim()).filter(Boolean)
          : [];
    }

    Object.assign(trainer, {
      ...dto,
      name: dto.name?.trim() ?? trainer.name,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : trainer.birthDate,
      address: dto.address?.trim() ?? trainer.address,
      photoUrl:
        photo?.path
          ? this.toPhotoUrl(photo)
          : dto.photoUrl !== undefined
            ? (dto.photoUrl?.trim() || null)
            : trainer.photoUrl,
      serviceType: dto.serviceType?.trim() ?? trainer.serviceType,
      phone: dto.phone !== undefined ? (dto.phone?.trim() || '') : trainer.phone,
      experience: dto.experience !== undefined ? Number(dto.experience) : trainer.experience,
      rating: dto.rating !== undefined ? Number(dto.rating) : trainer.rating,
      specialties,
      certificates,
      bio: dto.bio !== undefined ? (dto.bio?.trim() || '') : trainer.bio,
    });
    return this.trainerRepository.save(trainer);
  }

  async remove(publicId: string): Promise<{ message: string }> {
    await this.findOneByPublicId(publicId);
    await this.trainerRepository.deleteOne({ publicId });
    return { message: 'Đã xóa huấn luyện viên.' };
  }

  async seedSampleData(): Promise<{ message: string; count: number }> {
    await this.trainerRepository.clear();

    const sampleTrainers = [
      {
        name: 'Nguyễn Hoàng Nam',
        birthDate: new Date('1994-06-15'),
        gender: 'male' as const,
        address: 'Quận 7, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&crop=face',
        serviceType: 'gym',
        phone: '0987 654 321',
        experience: 12,
        rating: 4.9,
        specialties: ['Gym', 'Thể hình'],
        certificates: ['Bằng HLV Gym Quốc tế (NASM-CPT)', 'Chứng nhận Dinh dưỡng Thể hình Quốc gia'],
        bio: 'Cựu vận động viên thể hình chuyên nghiệp với nhiều giải thưởng. Chuyên sâu về huấn luyện sức mạnh và phát triển cơ bắp.',
      },
      {
        name: 'Lê Thị Hoài',
        birthDate: new Date('1998-08-20'),
        gender: 'female' as const,
        address: 'Quận 1, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face',
        serviceType: 'gym',
        phone: '0912 345 678',
        experience: 8,
        rating: 4.8,
        specialties: ['Gym', 'HIIT'],
        certificates: ['Chứng nhận Huấn luyện viên thể hình chức năng (Functional Training)', 'Chứng chỉ sơ cứu chấn thương thể thao'],
        bio: 'Huấn luyện viên cá nhân được chứng nhận, tập trung vào các bài tập cường độ cao và thể hình chức năng.',
      },
      {
        name: 'Nguyễn Minh Ánh',
        birthDate: new Date('1998-04-12'),
        gender: 'female' as const,
        address: 'Quận 2, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1544062894-ec11a5947f12?w=400&h=400&fit=crop&crop=face',
        serviceType: 'yoga',
        phone: '0987 654 321',
        experience: 8,
        rating: 4.9,
        specialties: ['Yoga', 'Thiền định'],
        certificates: ['Bằng RYT-500 Yoga Alliance Quốc tế', 'Chứng nhận giảng dạy Thiền định và Hơi thở nâng cao'],
        bio: 'Chứng chỉ RYT-500 với 8 năm kinh nghiệm. Chuyên gia về các phong cách năng động và thiền định.',
      },
      {
        name: 'Lê Thanh Hà',
        birthDate: new Date('2000-05-18'),
        gender: 'female' as const,
        address: 'Quận Bình Thạnh, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
        serviceType: 'yoga',
        phone: '0912 345 678',
        experience: 6,
        rating: 4.8,
        specialties: ['Hatha Yoga', 'Yin Yoga'],
        certificates: ['Bằng RYT-200 Yoga Alliance Quốc tế', 'Chứng chỉ Yoga phục hồi và trị liệu cột sống'],
        bio: 'Chứng chỉ RYT-200, chuyên về yoga phục hồi và giảm stress. Phong cách giảng dạy nhẹ nhàng, tỉ mỉ.',
      },
      {
        name: 'Nguyễn Văn Hùng',
        birthDate: new Date('1998-11-05'),
        gender: 'male' as const,
        address: 'Quận 7, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        serviceType: 'pt',
        phone: '0987 654 321',
        experience: 8,
        rating: 4.9,
        specialties: ['Tăng cơ', 'Giảm mỡ chuyên sâu'],
        certificates: ['Chứng nhận PT chuyên nghiệp NASM', 'Bằng tốt nghiệp Y học thể thao'],
        bio: 'Chứng nhận huấn luyện viên cá nhân NASM quốc tế. Đồng hành hỗ trợ xây dựng lộ trình nâng tạ tăng cơ và giảm cân khoa học.',
      },
      {
        name: 'Trần Thị Mai',
        birthDate: new Date('2000-02-14'),
        gender: 'female' as const,
        address: 'Quận Phú Nhuận, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop&crop=face',
        serviceType: 'pt',
        phone: '0912 345 678',
        experience: 6,
        rating: 4.8,
        specialties: ['Phục hồi', 'Tập Functional'],
        certificates: ['Chứng chỉ căng cơ phục hồi trị liệu chuyên sâu', 'Chứng nhận đào tạo Functional Trainer'],
        bio: 'Chuyên gia phục hồi cơ xương khớp sau chấn thương, kết hợp căng cơ phục hồi cơ bắp và hỗ trợ lấy lại thể lực dẻo dai.',
      },
      {
        name: 'Phạm Minh Tuấn',
        birthDate: new Date('1994-10-15'),
        gender: 'male' as const,
        address: 'Quận 4, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        serviceType: 'massage',
        phone: '0987 654 321',
        experience: 12,
        rating: 4.9,
        specialties: ['Deep Tissue', 'Trị liệu thể thao'],
        certificates: ['Chứng chỉ Kỹ thuật viên Xoa bóp bấm huyệt Vật lý trị liệu của Bộ Y tế', 'Bằng Trị liệu Thể thao chuyên nghiệp'],
        bio: 'Kỹ thuật viên trị liệu massage chuyên sâu phục hồi cơ xương khớp và giảm căng mỏi mệt cho hội viên.',
      },
      {
        name: 'Vũ Thị Hương',
        birthDate: new Date('1997-03-25'),
        gender: 'female' as const,
        address: 'Quận 3, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        serviceType: 'massage',
        phone: '0912 345 678',
        experience: 9,
        rating: 4.8,
        specialties: ['Aromatherapy', 'Thư giãn'],
        certificates: ['Chứng chỉ Kỹ thuật viên Massage Thụy Điển & Aroma Therapy', 'Chứng nhận trị liệu tâm lý giấc ngủ'],
        bio: 'Chuyên viên chăm sóc sức khỏe toàn diện tập trung vào trị liệu tinh thần, giảm stress và lo âu sâu sắc.',
      },
      {
        name: 'Nguyễn Hồng Hạnh',
        birthDate: new Date('1996-09-18'),
        gender: 'female' as const,
        address: 'Phú Nhuận, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        serviceType: 'dance',
        phone: '0987 654 321',
        experience: 10,
        rating: 4.9,
        specialties: ['Đương đại', 'Jazz', 'Latin'],
        certificates: ['Bằng cử nhân Biên đạo múa - Đại học Sân khấu Điện ảnh', 'Chứng chỉ hoàn thành khóa huấn luyện Dance Sport chuyên nghiệp'],
        bio: 'Vũ công chuyên nghiệp với nền tảng vững chắc trong các phong cách Latin, Hip-Hop và Đương đại.',
      },
      {
        name: 'Trần Quốc Bảo',
        birthDate: new Date('1999-01-30'),
        gender: 'male' as const,
        address: 'Quận 10, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        serviceType: 'dance',
        phone: '0912 345 678',
        experience: 7,
        rating: 4.7,
        specialties: ['Breaking', 'Hip-Hop'],
        certificates: ['Giải nhất Breaking quốc gia năm 2018', 'Chứng nhận hoàn thành khóa kỹ năng sư phạm múa trẻ em'],
        bio: 'Vũ công breaking cấp độ thi đấu và biên đạo múa. Mang lại năng lượng và sự sáng tạo không giới hạn vào mỗi buổi học.',
      },
      {
        name: 'Phạm Minh Quân',
        birthDate: new Date('1991-12-05'),
        gender: 'male' as const,
        address: 'Quận 4, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
        serviceType: 'kickboxing',
        phone: '0987 654 321',
        experience: 15,
        rating: 5.0,
        specialties: ['Kick Boxing', 'Thi đấu'],
        certificates: ['Kiện tướng Kickboxing quốc gia', 'Chứng chỉ HLV Võ thuật và Thể lực của Liên đoàn Võ thuật'],
        bio: 'Cựu vận động viên kick boxing chuyên nghiệp với bề dày kinh nghiệm huấn luyện võ sĩ thi đấu.',
      },
      {
        name: 'Đỗ Hoàng Long',
        birthDate: new Date('1997-07-22'),
        gender: 'male' as const,
        address: 'Quận Tân Bình, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&h=400&fit=crop&crop=face',
        serviceType: 'kickboxing',
        phone: '0912 345 678',
        experience: 9,
        rating: 4.8,
        specialties: ['Võ thuật thể lực', 'Giảm cân'],
        certificates: ['Bằng cử nhân Giáo dục Thể chất - Đại học Sư phạm TDTT', 'Chứng chỉ HLV Kickboxing hạng B'],
        bio: 'Chuyên sâu về fitness kick boxing, giảm cân đốt mỡ và rèn luyện sức bền cường độ cao.',
      },
      {
        name: 'Cô Mỹ Linh',
        birthDate: new Date('2000-06-10'),
        gender: 'female' as const,
        address: 'Phú Nhuận, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop&crop=face',
        serviceType: 'dance_kid',
        phone: '0987 654 321',
        experience: 6,
        rating: 4.9,
        specialties: ['Múa Ballet trẻ em', 'Baby Dance', 'Nhảy hiện đại'],
        certificates: ['Bằng cử nhân nghệ thuật múa chính quy', 'Chứng chỉ tâm lý học trẻ em cấp tiểu học và mầm non'],
        bio: 'Tốt nghiệp học viện nghệ thuật múa chuyên nghiệp. Hơn 6 năm kinh nghiệm dạy nhảy trẻ em, kiên nhẫn và tràn đầy năng lượng tích cực.',
      },
      {
        name: 'Thầy Tuấn Anh',
        birthDate: new Date('2001-09-05'),
        gender: 'male' as const,
        address: 'Quận Bình Thạnh, TP.HCM',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
        serviceType: 'dance_kid',
        phone: '0912 345 678',
        experience: 5,
        rating: 4.8,
        specialties: ['Kids Hip-Hop', 'Breaking', 'Thể chất'],
        certificates: ['Chứng chỉ Biên đạo Hip-hop Kids', 'Giải ba cuộc thi nhảy đường phố trẻ'],
        bio: 'Biên đạo nhảy đường phố chuyên nghiệp dành cho trẻ em. Sáng tạo các bài nhảy vui nhộn giúp kích thích tư duy thể chất của các bé.',
      },
    ];

    const entities = sampleTrainers.map((t) => this.trainerRepository.create(t));
    await this.trainerRepository.save(entities);

    return { message: 'Đã seed dữ liệu huấn luyện viên mẫu.', count: entities.length };
  }
}
