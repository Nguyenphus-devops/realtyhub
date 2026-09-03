import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesBlogDto } from './create-categories-blog.dto';

export class UpdateCategoriesBlogDto extends PartialType(
  CreateCategoriesBlogDto,
) {}
