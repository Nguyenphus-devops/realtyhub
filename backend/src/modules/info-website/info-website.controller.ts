import {
  Body,
  Controller,
  Get,
  Header,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { UpdateInfoWebsiteDto } from './dto/update-info-website.dto';
import { InfoWebsiteService } from './info-website.service';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Info website')
@Controller(Routes.INFO_WEBSITE)
export class InfoWebsiteController {
  constructor(private readonly infoWebsiteService: InfoWebsiteService) {}

  @Get('public')
  @Public()
  @SkipPermissions()
  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 300, ttl: 60000 } })
  @Header('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
  @ApiOperation({
    summary: 'Thông tin website công khai (favicon, logo, liên hệ, MXH…)',
  })
  findPublic() {
    return this.infoWebsiteService.findPublic();
  }

  @Get()
  @RequiresPermission(
    PermissionResource.INFO_WEBSITE,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy cấu hình website (admin)' })
  findForAdmin() {
    return this.infoWebsiteService.findForAdmin();
  }

  @Patch()
  @RequiresPermission(
    PermissionResource.INFO_WEBSITE,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật cấu hình website (admin, một bản ghi)' })
  updateForAdmin(@Body() updateInfoWebsiteDto: UpdateInfoWebsiteDto) {
    return this.infoWebsiteService.updateForAdmin(updateInfoWebsiteDto);
  }
}
