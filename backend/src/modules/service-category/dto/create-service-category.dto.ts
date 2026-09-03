import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({ example: 'Gym' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'gym' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug: string;

  @ApiProperty({ example: 'individual', enum: ['individual', 'class'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
