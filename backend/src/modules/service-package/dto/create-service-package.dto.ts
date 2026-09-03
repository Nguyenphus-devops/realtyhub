import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SERVICE_PACKAGE_CATEGORIES } from '../constants/service-package-categories';

export class CreateServicePackageDto {
  @ApiProperty({ example: 'Tiệc cưới cao cấp' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @ApiProperty({
    example: 'Gói tiệc cưới trọn gói gồm trang trí, âm thanh và menu cao cấp.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  description: string;

  @ApiPropertyOptional({
    example: 'Liên hệ báo giá',
    description: 'Nhãn hiển thị giá linh hoạt khi không dùng số tiền cố định',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  priceLabel?: string;

  @ApiPropertyOptional({
    example: 25000000,
    description: 'Giá cơ bản theo VND',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice?: number;

  @ApiProperty({
    example: 'https://cdn.example.com/service-package/wedding-premium.jpg',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  imageUrl: string;

  @ApiProperty({ example: 'gym' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Trang tri san khau', 'MC chuyen nghiep', 'Am thanh anh sang'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(40)
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  features?: string[];

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  minGuests?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGuests?: number;

  @ApiPropertyOptional({ example: '3 tieng' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  serviceDuration?: string;

  @ApiPropertyOptional({ example: 'Sanh A, phong VIP, khu vuon ngoai troi' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  venueScope?: string;

  @ApiPropertyOptional({ example: 'Menu wedding standard 2026' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  defaultMenu?: string;

  @ApiPropertyOptional({ type: [String], example: ['Thứ 2', 'Thứ 4', 'Thứ 6'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classDays?: string[];

  @ApiPropertyOptional({ example: '18:30 - 19:30' })
  @IsOptional()
  @IsString()
  classTime?: string;

  @ApiPropertyOptional({ example: 'HLV Marcus Johnson' })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiPropertyOptional({ example: 'Phòng Yoga Studio 1' })
  @IsOptional()
  @IsString()
  classroom?: string;


  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
