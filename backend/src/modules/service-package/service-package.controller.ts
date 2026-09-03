import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { ServicePackageService } from './service-package.service';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { ReorderServicePackagesDto } from './dto/reorder-service-packages.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';

@ApiTags('ServicePackage')
@Controller(Routes.SERVICE_PACKAGE)
export class ServicePackageController {
  constructor(private readonly servicePackageService: ServicePackageService) {}

  @Get('public')
  @Public()
  @SkipPermissions()
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Lọc theo danh mục gói dịch vụ',
  })
  @ApiOperation({ summary: 'Danh sách gói dịch vụ hiển thị công khai' })
  findPublic(@Query('category') category?: string) {
    return this.servicePackageService.findPublicList(category);
  }

  @Get('public/featured')
  @Public()
  @SkipPermissions()
  @ApiOperation({ summary: 'Danh sách gói dịch vụ nổi bật công khai' })
  findFeaturedPublic() {
    return this.servicePackageService.findFeaturedPublic();
  }

  @Post()
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo gói dịch vụ (admin)' })
  create(@Body() createServicePackageDto: CreateServicePackageDto) {
    return this.servicePackageService.create(createServicePackageDto);
  }

  @Post('seed-sample')
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed 6 gói dịch vụ mẫu (admin)' })
  seedSampleData() {
    return this.servicePackageService.seedSampleData();
  }

  @Get()
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Lọc theo danh mục gói dịch vụ',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Lọc theo trạng thái hiển thị',
  })
  @ApiOperation({ summary: 'Danh sách gói dịch vụ (admin)' })
  findAllAdmin(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const parsedIsActive =
      isActive === undefined ? undefined : isActive === 'true';
    return this.servicePackageService.findAllForAdmin(category, parsedIsActive);
  }

  @Get(':publicId')
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết gói dịch vụ (admin)' })
  findOne(@Param('publicId') publicId: string) {
    return this.servicePackageService.findOneByPublicId(publicId);
  }

  @Patch('reorder')
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sắp xếp thứ tự hiển thị gói dịch vụ (admin)' })
  reorder(@Body() reorderDto: ReorderServicePackagesDto) {
    return this.servicePackageService.reorder(reorderDto);
  }

  @Patch(':publicId')
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật gói dịch vụ (admin)' })
  update(
    @Param('publicId') publicId: string,
    @Body() updateServicePackageDto: UpdateServicePackageDto,
  ) {
    return this.servicePackageService.update(publicId, updateServicePackageDto);
  }

  @Delete(':publicId')
  @RequiresPermission(
    PermissionResource.SERVICE_PACKAGE,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa gói dịch vụ (admin)' })
  remove(@Param('publicId') publicId: string) {
    return this.servicePackageService.remove(publicId);
  }
}
