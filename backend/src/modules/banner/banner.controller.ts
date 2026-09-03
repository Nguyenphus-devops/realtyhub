import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ReorderBannersDto } from './dto/reorder-banners.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';

@ApiTags('Banner')
@Controller(Routes.BANNER)
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('public/:placement')
  @Public()
  @SkipPermissions()
  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 300, ttl: 60000 } })
  @Header('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
  @ApiOperation({ summary: 'Slides/banner công khai theo placement (web)' })
  @ApiParam({ name: 'placement', example: 'home_hero' })
  findPublicByPlacement(@Param('placement') placement: string) {
    return this.bannerService.findPublicByPlacement(placement);
  }

  @Post()
  @RequiresPermission(
    PermissionResource.BANNER,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo banner (admin)' })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.BANNER,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiQuery({
    name: 'placement',
    required: false,
    description: 'Lọc theo placement',
  })
  @ApiOperation({ summary: 'Danh sách banner (admin)' })
  findAllAdmin(@Query('placement') placement?: string) {
    return this.bannerService.findAllForAdmin(placement);
  }

  @Patch('placement/:placement/reorder')
  @RequiresPermission(
    PermissionResource.BANNER,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sắp xếp lại toàn bộ banner của một placement (admin)',
  })
  reorder(
    @Param('placement') placement: string,
    @Body() reorderDto: ReorderBannersDto,
  ) {
    return this.bannerService.reorder(placement, reorderDto);
  }

  @Patch(':publicId')
  @RequiresPermission(
    PermissionResource.BANNER,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật banner (admin)' })
  update(
    @Param('publicId') publicId: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.update(publicId, updateBannerDto);
  }

  @Delete(':publicId')
  @RequiresPermission(
    PermissionResource.BANNER,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa banner (admin)' })
  remove(@Param('publicId') publicId: string) {
    return this.bannerService.remove(publicId);
  }
}
