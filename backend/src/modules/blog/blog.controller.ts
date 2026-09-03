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
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { BlogStatus } from './entities/blog.entity';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';

type RequestWithUser = Request & {
  user?: {
    id: string;
    userId?: string;
    role?: string;
  };
};

@Controller(Routes.BLOG)
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async create(@Body() dto: CreateBlogDto, @Req() req: RequestWithUser) {
    return this.blogService.createBlog(dto, {
      id: req.user?.id ?? '',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }

  @Get()
  @Public()
  @SkipPermissions()
  public findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('includeHidden') includeHidden: string = 'false',
  ) {
    return this.blogService.findAllBlogs(
      Number(page),
      Number(limit),
      includeHidden === 'true',
    );
  }

  @Get('public')
  @Public()
  @SkipPermissions()
  public getPublicBlogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {

    console.log("123456u4")
    return this.blogService.getPublicBlogs(Number(page), Number(limit));
  }

  @Get('categories')
  @Public()
  @SkipPermissions()
  public getCategories() {
    return this.blogService.getCategories();
  }

  @Get('my')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public getMyBlogs(
    @Req() req: RequestWithUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('includeHidden') includeHidden: string = 'true',
  ) {
    const userId = req.user?.userId ?? req.user?.id ?? '';
    return this.blogService.getMyBlogs(
      userId,
      Number(page),
      Number(limit),
      includeHidden === 'true',
    );
  }

  @Get('my/search')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public searchMyBlogs(
    @Req() req: RequestWithUser,
    @Query('q') q: string = '',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('includeHidden') includeHidden: string = 'false',
  ) {
    const userId = req.user?.userId ?? req.user?.id ?? '';
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.blogService.searchBlogs(
      q,
      Number(page),
      Number(limit),
      includeHidden === 'true',
      userId,
    );
  }

  @Get('search')
  @Public()
  @SkipPermissions()
  public searchBlogs(
    @Query('q') q: string = '',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('includeHidden') includeHidden: string = 'false',
  ) {
    return this.blogService.searchBlogs(
      q,
      Number(page),
      Number(limit),
      includeHidden === 'true',
      undefined,
    );
  }

  @Get('status/:status')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public findByStatus(
    @Param('status') status: BlogStatus,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('includeHidden') includeHidden: string = 'false',
  ) {
    return this.blogService.findByStatusBlog(
      status,
      Number(page),
      Number(limit),
      includeHidden === 'true',
    );
  }

  @Get(':slug')
  @Public()
  @SkipPermissions()
  public findOne(@Param('slug') slug: string) {
    return this.blogService.findOneBlog(slug);
  }

  @Patch(':slug')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public update(
    @Param('slug') slug: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(slug, updateBlogDto);
  }

  @Patch(':slug/visibility')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public updateVisibility(
    @Param('slug') slug: string,
    @Body('isHidden') isHidden: boolean,
  ) {
    return this.blogService.updateVisibilityBlog(slug, isHidden);
  }

  @Patch(':slug/status')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public updateStatus(
    @Param('slug') slug: string,
    @Body('status') status: BlogStatus,
  ) {
    return this.blogService.updateStatusBlog(slug, status);
  }

  @Delete(':slug')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public remove(@Param('slug') slug: string) {
    return this.blogService.hardDeleteBlog(slug);
  }

  @Delete(':slug/hard')
  @RequiresPermission(
    PermissionResource.BLOG,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public hardDelete(@Param('slug') slug: string) {
    return this.blogService.hardDeleteBlog(slug);
  }
}
