import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './video.service';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../../permissions/decorators/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { extname } from 'path';
import * as fs from 'fs';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { removeVietnameseTones } from './utils/video.utils';
import { randomBytes } from 'crypto';
import { Routes } from 'src/common/utils/constants';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { VideoProgressService } from './video-progress.service';

@Controller(Routes.VIDEO)
export class VideosController {
  private static readonly ALLOWED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
    'video/webm',
  ] as const;
  private static readonly MAX_FILE_SIZE_IN_BYTES = 0.5 * 1024 * 1024 * 1024; // 512MB

  constructor(
    private readonly videosService: VideosService,
    private readonly videoProgressService: VideoProgressService,
  ) { }

  private static createUploadPath(): string {
    const uploadPath = VideosService.buildUploadFolderByDate(
      new Date(),
    ).folderPath;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
  }

  private static buildSafeFilename(originalName: string): string {
    const originalBaseName = originalName.split('.').slice(0, -1).join('.');
    const sanitizedFileName = removeVietnameseTones(originalBaseName)
      .replace(/^-+|-+$/g, '')
      .slice(0, 120);
    const fileExtension = extname(originalName).toLowerCase();
    const randomString = randomBytes(6).toString('hex');

    return `${sanitizedFileName || 'video'}-${randomString}${fileExtension}`;
  }

  private static validateMimetype(
    file: { mimetype: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void {
    if (
      !VideosController.ALLOWED_VIDEO_MIME_TYPES.includes(
        file.mimetype as never,
      )
    ) {
      callback(
        new BadRequestException(
          'Định dạng video không hợp lệ. Chỉ hỗ trợ mp4, mov, avi, mkv, webm.',
        ),
        false,
      );
      return;
    }

    callback(null, true);
  }

  @Post('upload')
  @HttpCode(200)
  @RequiresPermission(
    PermissionResource.VIDEO,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (request, file, callback) => {
          callback(null, VideosController.createUploadPath());
        },
        filename: (request, file, callback) => {
          callback(null, VideosController.buildSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: VideosController.MAX_FILE_SIZE_IN_BYTES,
        files: 1,
      },
      fileFilter: (request, file, callback) => {
        VideosController.validateMimetype(file, callback);
      },
    }),
  )
  public async uploadFile(
    @Req() req: Request,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
    @Query('uploadId') uploadId?: string,
  ) {
    const file = uploadedFiles?.[0];

    if (!file) {
      throw new BadRequestException(
        'Thiếu file upload trong multipart form-data.',
      );
    }

    const finalUploadId = uploadId || uuidv4();

    await new ParseFilePipeBuilder()
      .addMaxSizeValidator({
        maxSize: VideosController.MAX_FILE_SIZE_IN_BYTES,
      })
      .build({ fileIsRequired: true })
      .transform(file);

    const uploadedVideo = await this.videosService.handleSingleFileUpload(file, finalUploadId);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const normalizedVideoUrl = uploadedVideo.videoUrl.startsWith('http')
      ? uploadedVideo.videoUrl
      : `${baseUrl}${uploadedVideo.videoUrl}`;

    return {
      result: [
        {
          url: normalizedVideoUrl,
          name: uploadedVideo.originalName,
          size: file.size,
        },
      ],
      ...uploadedVideo,
      videoUrl: normalizedVideoUrl,
    };
  }

  @Post('upload-multiple')
  @RequiresPermission(
    PermissionResource.VIDEO,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (request, file, callback) => {
          callback(null, VideosController.createUploadPath());
        },
        filename: (request, file, callback) => {
          callback(null, VideosController.buildSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: VideosController.MAX_FILE_SIZE_IN_BYTES,
      },
      fileFilter: (request, file, callback) => {
        VideosController.validateMimetype(file, callback);
      },
    }),
  )
  public async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.videosService.handleMultipleFileUpload(files);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.VIDEO,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async getAllVideos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '60',
  ) {
    return this.videosService.getAllVideos(+page, +limit);
  }

  @Delete(':slug')
  @RequiresPermission(
    PermissionResource.VIDEO,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async deleteVideo(@Param('slug') slug: string, @Req() req: Request) {
    const userId =
      (req as Request & { user?: { userId?: string } }).user?.userId ??
      'abcdef';
    return this.videosService.deleteVideoBySlug(slug, userId);
  }

  @Get('progress/:uploadId')
  @RequiresPermission(
    PermissionResource.VIDEO,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async getUploadProgress(
    @Param('uploadId') uploadId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const progressObservable = this.videoProgressService.getProgressObservable(uploadId);

    const subscription = progressObservable.subscribe({
      next: (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      complete: () => {
        res.end();
      },
      error: (error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      },
    });

    req.on('close', () => {
      subscription.unsubscribe();
      res.end();
    });
  }
}
