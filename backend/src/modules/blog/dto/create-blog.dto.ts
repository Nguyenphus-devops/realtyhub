import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  Allow,
  ValidateNested,
} from 'class-validator';

const normalizeStringArray = ({ value }: { value: unknown }): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
};

export class BlogSeoDto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;
}

export class BlogFaqDto {
  @Allow()
  @IsString()
  @IsNotEmpty()
  question!: string;

  @Allow()
  @IsString()
  @IsNotEmpty()
  answer!: string;
}

const normalizeFaqArray = ({ value }: { value: unknown }): BlogFaqDto[] => {
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

      const dto = new BlogFaqDto();
      dto.question = question;
      dto.answer = answer;
      return dto;
    })
    .filter((item): item is BlogFaqDto => item !== null);
};

export class BlogAuthorDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBlogDto {
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showBMI?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showTDEE?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showBMR?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showRMR?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showProtein?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  showBodyFat?: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @IsString()
  @IsNotEmpty()
  blogData!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

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
  @IsObject()
  @ValidateNested()
  @Type(() => BlogSeoDto)
  seo?: BlogSeoDto;

  @IsOptional()
  @Transform(normalizeStringArray)
  @IsArray()
  @IsString({ each: true })
  relatedSlugs?: string[];

  @IsOptional()
  @Allow()
  @Transform(normalizeFaqArray)
  @IsArray()
  faqs?: BlogFaqDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogAuthorDto)
  author?: BlogAuthorDto;
}
