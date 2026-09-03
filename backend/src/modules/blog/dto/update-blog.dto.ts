import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  Allow,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { BlogStatus } from '../entities/blog.entity';
import { Transform, Type } from 'class-transformer';
import { BlogFaqDto, BlogAuthorDto } from './create-blog.dto';

const normalizeStringArray = ({ value }: { value: unknown }): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
};

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(normalizeStringArray)
  @IsArray()
  @IsString({ each: true })
  categoryMain?: string[];

  @IsOptional()
  @Transform(normalizeStringArray)
  @IsArray()
  @IsString({ each: true })
  categorySub?: string[];

  @IsOptional()
  @Transform(normalizeStringArray)
  @IsArray()
  @IsString({ each: true })
  relatedSlugs?: string[];

  @IsOptional()
  @Allow()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const faq = item as Record<string, unknown>;
        const question = typeof faq.question === 'string' ? faq.question.trim() : '';
        const answer = typeof faq.answer === 'string' ? faq.answer.trim() : '';

        if (!question || !answer) {
          return null;
        }

        return { question, answer } as BlogFaqDto;
      })
      .filter((item): item is BlogFaqDto => item !== null);
  })
  @IsArray()
  faqs?: BlogFaqDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogAuthorDto)
  author?: BlogAuthorDto;
}

// Re-export BlogSeoDto and BlogAuthorDto for convenience
export { BlogSeoDto, BlogAuthorDto } from './create-blog.dto';
