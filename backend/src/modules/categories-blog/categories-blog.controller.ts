import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CategoriesBlogService } from './categories-blog.service';
import { CreateCategoriesBlogDto } from './dto/create-categories-blog.dto';
import { UpdateCategoriesBlogDto } from './dto/update-categories-blog.dto';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { Routes } from 'src/common/utils/constants';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

type RequestWithUser = Request & {
  user?: {
    id: string;
    userId?: string;
    role?: string;
  };
};

@Controller(Routes.CATEGORIES_BLOG)
export class CategoriesBlogController {
  constructor(private readonly categoriesBlogService: CategoriesBlogService) {}

  @Post()
  @RequiresPermission(
    PermissionResource.CATEGORY_BLOG,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  create(
    @Body() createCategoriesBlogDto: CreateCategoriesBlogDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesBlogService.create(createCategoriesBlogDto, {
      id: req.user?.id ?? '',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }

  @Get()
  @Public()
  @SkipPermissions()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.categoriesBlogService.findAll(Number(page), Number(limit));
  }

  @Get(':slug')
  @Public()
  @SkipPermissions()
  findOne(@Param('slug') slug: string) {
    return this.categoriesBlogService.findOne(slug);
  }

  @Patch(':slug')
  @RequiresPermission(
    PermissionResource.CATEGORY_BLOG,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  update(
    @Param('slug') slug: string,
    @Body() updateCategoriesBlogDto: UpdateCategoriesBlogDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesBlogService.update(slug, updateCategoriesBlogDto, {
      id: req.user?.id ?? '',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }

  @Delete(':slug')
  @RequiresPermission(
    PermissionResource.CATEGORY_BLOG,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  softDelete(@Param('slug') slug: string, @Req() req: RequestWithUser) {
    return this.categoriesBlogService.softDelete(slug, {
      id: req.user?.id ?? '',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }

  @Delete(':slug/hard')
  @RequiresPermission(
    PermissionResource.CATEGORY_BLOG,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  hardDelete(@Param('slug') slug: string, @Req() req: RequestWithUser) {
    return this.categoriesBlogService.hardDelete(slug, {
      id: req.user?.id ?? '',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }
}
