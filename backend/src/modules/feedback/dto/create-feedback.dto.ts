import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'Alex Turner' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ required: false, example: 'AT' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  avatar?: string;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'Không gian tập luyện vô cùng tuyệt vời...' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 'gym' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  serviceType: string;

  @ApiProperty({
    required: false,
    example: '/uploads/feedbacks/2026/07/29/before.webp',
  })
  @IsOptional()
  @IsString()
  beforeImage?: string;

  @ApiProperty({
    required: false,
    example: '/uploads/feedbacks/2026/07/29/after.webp',
  })
  @IsOptional()
  @IsString()
  afterImage?: string;
}
