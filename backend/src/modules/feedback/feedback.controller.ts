import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common/utils/constants';
import {
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
  RequiresPermission,
} from '../permissions/decorators/permissions.decorator';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';
import { feedbackUploadOptions } from './feedback-upload.config';

@ApiTags('Feedbacks')
@Controller(Routes.FEEDBACK)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách feedback (admin)' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get('public')
  @Public()
  @SkipPermissions()
  @ApiOperation({ summary: 'Danh sách feedback công khai (frontend)' })
  findPublic() {
    return this.feedbackService.findAll();
  }

  @Post('seed-sample')
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed dữ liệu feedback mẫu (admin)' })
  seedSampleData() {
    return this.feedbackService.seedSampleData();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'beforeImage', maxCount: 1 },
        { name: 'afterImage', maxCount: 1 },
      ],
      feedbackUploadOptions,
    ),
  )
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo feedback' })
  create(
    @Body() dto: CreateFeedbackDto,
    @UploadedFiles()
    files?: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
  ) {
    return this.feedbackService.create(dto, files);
  }

  @Patch(':publicId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'beforeImage', maxCount: 1 },
        { name: 'afterImage', maxCount: 1 },
      ],
      feedbackUploadOptions,
    ),
  )
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật feedback' })
  update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateFeedbackDto,
    @UploadedFiles()
    files?: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
  ) {
    return this.feedbackService.update(publicId, dto, files);
  }

  @Delete(':publicId')
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa feedback' })
  remove(@Param('publicId') publicId: string) {
    return this.feedbackService.remove(publicId);
  }

  @Get(':publicId')
  @RequiresPermission(
    PermissionResource.FEEDBACK,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết feedback (admin)' })
  findOne(@Param('publicId') publicId: string) {
    return this.feedbackService.findOneByPublicId(publicId);
  }
}
