import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/utils/constants';
import {
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
  RequiresPermission,
} from '../permissions/decorators/permissions.decorator';
import { TrainerService } from './trainer.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';
import { trainerUploadOptions } from './trainer-upload.config';

@ApiTags('Trainers')
@Controller(Routes.TRAINER)
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.GET, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách huấn luyện viên (admin)' })
  findAll() {
    return this.trainerService.findAll();
  }

  @Get('public')
  @Public()
  @SkipPermissions()
  @ApiOperation({ summary: 'Danh sách huấn luyện viên công khai (frontend)' })
  findPublic() {
    return this.trainerService.findAll();
  }

  @Post('seed-sample')
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.CREATE, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed dữ liệu huấn luyện viên mẫu (admin)' })
  seedSampleData() {
    return this.trainerService.seedSampleData();
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', trainerUploadOptions))
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.CREATE, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo huấn luyện viên' })
  create(@Body() dto: CreateTrainerDto, @UploadedFile() photo?: Express.Multer.File) {
    return this.trainerService.create(dto, photo);
  }

  @Patch(':publicId')
  @UseInterceptors(FileInterceptor('photo', trainerUploadOptions))
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.EDIT, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật huấn luyện viên' })
  update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateTrainerDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.trainerService.update(publicId, dto, photo);
  }

  @Delete(':publicId')
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.DELETE, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa huấn luyện viên' })
  remove(@Param('publicId') publicId: string) {
    return this.trainerService.remove(publicId);
  }

  @Get(':publicId')
  @RequiresPermission(PermissionResource.TRAINER, PermissionAction.GET, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết huấn luyện viên (admin)' })
  findOne(@Param('publicId') publicId: string) {
    return this.trainerService.findOneByPublicId(publicId);
  }
}
