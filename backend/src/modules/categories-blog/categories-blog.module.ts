import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesBlogService } from './categories-blog.service';
import { CategoriesBlogController } from './categories-blog.controller';
import { CategoriesBlog } from './entities/categories-blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesBlog])],
  controllers: [CategoriesBlogController],
  providers: [CategoriesBlogService],
  exports: [CategoriesBlogService],
})
export class CategoriesBlogModule {}
