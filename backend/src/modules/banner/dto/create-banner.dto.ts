import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const MEDIA_TYPES = ['video', 'image'] as const;

export class CreateBannerDto {
  @ApiProperty({
    example: 'home_hero',
    description: 'Vị trí hiển thị (slug), ví dụ home_hero',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'placement chỉ gồm chữ thường, số và dấu gạch dưới',
  })
  placement: string;

  @ApiProperty({ enum: MEDIA_TYPES })
  @IsString()
  @IsIn(MEDIA_TYPES)
  mediaType: (typeof MEDIA_TYPES)[number];

  @ApiProperty({
    description: 'URL đầy đủ hoặc đường dẫn /uploads/... từ media server',
    example: 'https://example.com/hero.mp4',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  src: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  alt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
