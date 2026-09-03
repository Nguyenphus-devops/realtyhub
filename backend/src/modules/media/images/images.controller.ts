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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
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
import { removeVietnameseTones } from './utils/image.utils';
import { randomBytes } from 'crypto';
import { Routes } from 'src/common/utils/constants';
import type { Request } from 'express';

@Controller(Routes.IMAGE)
export class ImagesController {
  private static readonly ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as const;
  private static readonly MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024;

  constructor(private readonly imagesService: ImagesService) {}

  private static createUploadPath(): string {
    const uploadPath = ImagesService.buildUploadFolderByDate(
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

    return `${sanitizedFileName || 'image'}-${randomString}${fileExtension}`;
  }

  private static validateMimetype(
    file: { mimetype: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void {
    if (
      !ImagesController.ALLOWED_IMAGE_MIME_TYPES.includes(
        file.mimetype as never,
      )
    ) {
      callback(
        new BadRequestException(
          'Định dạng ảnh không hợp lệ. Chỉ hỗ trợ jpg, png, webp, gif.',
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
    PermissionResource.IMAGE,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (request, file, callback) => {
          callback(null, ImagesController.createUploadPath());
        },
        filename: (request, file, callback) => {
          callback(null, ImagesController.buildSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: ImagesController.MAX_FILE_SIZE_IN_BYTES,
        files: 1,
      },
      fileFilter: (request, file, callback) => {
        ImagesController.validateMimetype(file, callback);
      },
    }),
  )
  public async uploadFile(
    @Req() req: Request,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
  ) {
    const file = uploadedFiles?.[0];

    if (!file) {
      throw new BadRequestException(
        'Thiếu file upload trong multipart form-data.',
      );
    }

    await new ParseFilePipeBuilder()
      .addMaxSizeValidator({
        maxSize: ImagesController.MAX_FILE_SIZE_IN_BYTES,
      })
      .build({ fileIsRequired: true })
      .transform(file);

    const uploadedImage = await this.imagesService.handleSingleFileUpload(file);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const normalizedImageUrl = uploadedImage.imageUrl.startsWith('http')
      ? uploadedImage.imageUrl
      : `${baseUrl}${uploadedImage.imageUrl}`;

    return {
      result: [
        {
          url: normalizedImageUrl,
          name: uploadedImage.originalName,
          size: file.size,
        },
      ],
      ...uploadedImage,
      imageUrl: normalizedImageUrl,
    };
  }

  @Post('sunEditor')
  @HttpCode(200)
  @RequiresPermission(
    PermissionResource.IMAGE,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (request, file, callback) => {
          callback(null, ImagesController.createUploadPath());
        },
        filename: (request, file, callback) => {
          callback(null, ImagesController.buildSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: ImagesController.MAX_FILE_SIZE_IN_BYTES,
        files: 1,
      },
      fileFilter: (request, file, callback) => {
        ImagesController.validateMimetype(file, callback);
      },
    }),
  )
  public async uploadEditorFile(
    @Req() req: Request,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
  ) {
    return this.uploadFile(req, uploadedFiles);
  }

  @Post('upload-multiple')
  @RequiresPermission(
    PermissionResource.IMAGE,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (request, file, callback) => {
          callback(null, ImagesController.createUploadPath());
        },
        filename: (request, file, callback) => {
          callback(null, ImagesController.buildSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: ImagesController.MAX_FILE_SIZE_IN_BYTES,
      },
      fileFilter: (request, file, callback) => {
        ImagesController.validateMimetype(file, callback);
      },
    }),
  )
  public async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesService.handleMultipleFileUpload(files);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.IMAGE,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async getAllImages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '60',
  ) {
    return this.imagesService.getAllImages(+page, +limit);
  }

  @Delete(':slug')
  @RequiresPermission(
    PermissionResource.IMAGE,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  public async deleteImage(@Param('slug') slug: string, @Req() req: Request) {
    const userId =
      (req as Request & { user?: { userId?: string } }).user?.userId ??
      'abcdef';
    return this.imagesService.deleteImageBySlug(slug, userId);
  }
}
