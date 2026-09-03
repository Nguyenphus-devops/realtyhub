import { BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const uploadDirectory = (): string => {
  const now = new Date();
  const target = join(
    process.cwd(),
    'uploads',
    'feedbacks',
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  );

  fs.mkdirSync(target, { recursive: true });
  return target;
};

export const feedbackUploadOptions = {
  storage: diskStorage({
    destination: (_request, _file, callback) => {
      callback(null, uploadDirectory());
    },
    filename: (_request, file, callback) => {
      const extension = extname(file.originalname).toLowerCase();
      callback(
        null,
        `feedback-${Date.now()}-${randomBytes(6).toString('hex')}${extension}`,
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          'Định dạng ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG, GIF và WEBP.',
        ),
        false,
      );
      return;
    }

    callback(null, true);
  },
};
