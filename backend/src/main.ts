import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/config/logger.config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';
import { CompositeLogger } from './common/logger/composite-logger.service';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  try {
    const winstonLogger = WinstonModule.createLogger(winstonConfig);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: new CompositeLogger(winstonLogger),
    });
    const configService = app.get(ConfigService);
    const RATE_LIMIT =
      configService.get<number>('RATE_LIMIT') || 15 * 60 * 1000; // Default to 15 minutes for 1000 requests
    const RATE_LIMIT_MAX_REQUESTS =
      configService.get<number>('RATE_LIMIT_MAX_REQUESTS') || 1000;
    const ALLOWED_ORIGINS = configService.get<string>('ALLOWED_ORIGINS') || '*';
    const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
    const PORT = configService.get<number>('PORT') || 8080;
    const MEDIA_LOCAL_DIR =
      configService.get<string>('MEDIA_LOCAL_DIR') || 'uploads';
    // Trust proxy settings
    app.set('trust proxy', 1);

    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
    app.use(cookieParser());
    // Security headers
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
      }),
    );

    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new MetricsInterceptor(),
      new TimeoutInterceptor(),
      new TransformInterceptor(),
    );

    // CORS configuration
    app.enableCors({
      origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : true,
      credentials: true,
      methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-Key',
        'X-Webhook-Signature',
        'Accept',
        'Cache-Control',
      ],
      exposedHeaders: [
        'Content-Type',
        'Cache-Control',
        'Connection',
        'X-Accel-Buffering',
      ],
    });

    // Logging
    app.use(
      morgan('combined', {
        skip: () => NODE_ENV === 'test',
      }),
    );

    // Body parser
    app.use(
      express.json({
        limit: '10mb',
        verify: (req: any, res: any, buf: Buffer) => {
          req.rawBody = buf;
        },
      }),
    );
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Serve local uploaded media files
    app.use(
      `/${MEDIA_LOCAL_DIR}`,
      express.static(join(process.cwd(), MEDIA_LOCAL_DIR)),
    );

    // app.setGlobalPrefix('api', { exclude: ['/'] });

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(PORT);

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads',
    });

    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`API Allows Using: ${ALLOWED_ORIGINS}`);

    // Graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`${signal} received, shutting down gracefully`);
        await app.close();
        console.log('Process terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

void bootstrap();
