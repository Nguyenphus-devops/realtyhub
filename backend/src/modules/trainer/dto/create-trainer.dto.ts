import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SERVICE_PACKAGE_CATEGORIES } from '../../service-package/constants/service-package-categories';

export const TRAINER_GENDERS = ['male', 'female', 'other'] as const;

export class CreateTrainerDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '1995-08-20' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ enum: TRAINER_GENDERS })
  @IsIn(TRAINER_GENDERS)
  gender: (typeof TRAINER_GENDERS)[number];

  @ApiProperty({ example: 'Quan 7, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({ required: false, example: 'data:image/png;base64,iVBORw0KGgoAAA...' })
  @IsOptional()
  @IsString()
  @MaxLength(200000)
  photoUrl?: string;

  @ApiProperty({ example: 'Gym' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  serviceType: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  experience?: number;

  @ApiProperty({ required: false, example: 4.8 })
  @IsOptional()
  rating?: number;

  @ApiProperty({ required: false, example: ['Gym', 'Bodybuilding'] })
  @IsOptional()
  specialties?: string[] | string;

  @ApiProperty({ required: false, example: ['Bằng tốt nghiệp Y học thể thao', 'Chứng chỉ PT NASM'] })
  @IsOptional()
  certificates?: string[] | string;

  @ApiProperty({ required: false, example: 'Huấn luyện viên chuyên nghiệp...' })
  @IsOptional()
  @IsString()
  bio?: string;
}
