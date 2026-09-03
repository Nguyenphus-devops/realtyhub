import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/utils/constants';
import { PermissionAction, PermissionResource, PermissionResourceTarget, RequiresPermission } from '../permissions/decorators/permissions.decorator';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';

@ApiTags('ServiceCategories')
@Controller(Routes.SERVICE_CATEGORY)
export class ServiceCategoryController {
  constructor(private readonly service: ServiceCategoryService) {}

  @Get('public')
  @Public()
  @SkipPermissions()
  @ApiOperation({ summary: 'Danh sách loại dịch vụ công khai' })
  findPublic() {
    return this.service.findActive();
  }

  @Get()
  @RequiresPermission(PermissionResource.SERVICE_CATEGORY, PermissionAction.GET, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách loại dịch vụ (admin)' })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @RequiresPermission(PermissionResource.SERVICE_CATEGORY, PermissionAction.CREATE, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo loại dịch vụ' })
  create(@Body() dto: CreateServiceCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':publicId')
  @RequiresPermission(PermissionResource.SERVICE_CATEGORY, PermissionAction.EDIT, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật loại dịch vụ' })
  update(@Param('publicId') publicId: string, @Body() dto: UpdateServiceCategoryDto) {
    return this.service.update(publicId, dto);
  }

  @Delete(':publicId')
  @RequiresPermission(PermissionResource.SERVICE_CATEGORY, PermissionAction.DELETE, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa loại dịch vụ' })
  remove(@Param('publicId') publicId: string) {
    return this.service.remove(publicId);
  }
}
