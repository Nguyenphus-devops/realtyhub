import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MailsModule } from './modules/mails/mails.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { AuthGoogleModule } from './modules/auth/auth-google/auth-google.module';
import { ForgotPasswordModule } from './modules/auth/forgot-password/forgot-password.module';
import { ImagesModule } from './modules/media/images/images.module';
import { BannerModule } from './modules/banner/banner.module';
import { CategoriesBlogModule } from './modules/categories-blog/categories-blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { HistoryModule } from './modules/history/history.module';
import { InfoWebsiteModule } from './modules/info-website/info-website.module';
import { BlogModule } from './modules/blog/blog.module';
import { JwtAuthCoreModule } from './modules/auth/jwt-auth-core/jwt-auth-core.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import googleConfig from './config/google.config';
import mailerConfig from './config/mailer.config';
import { UsersModule } from './modules/auth/users/users.module';
import { ServicePackageModule } from './modules/service-package/service-package.module';
import { TrainerModule } from './modules/trainer/trainer.module';
import { ServiceCategoryModule } from './modules/service-category/service-category.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/auth-local/guards/jwt-auth.guard';
import { PermissionsGuard } from './modules/permissions/guards/permissions.guard';
import { VideosModule } from './modules/media/videos/video.module';
import { LeadsModule } from './modules/leads/leads.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, authConfig, googleConfig, mailerConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 1000,
      },
    ]),

    ScheduleModule.forRoot(),
    JwtAuthCoreModule,
    DatabaseModule,
    PermissionsModule,
    RolesModule,
    AuthGoogleModule,
    ForgotPasswordModule,
    MailsModule,
    MailerModule,
    ImagesModule,
    VideosModule,
    BannerModule,
    CategoriesBlogModule,
    ContactModule,
    HistoryModule,
    InfoWebsiteModule,
    UsersModule,
    BlogModule,
    ServicePackageModule,
    ServiceCategoryModule,
    TrainerModule,
    LeadsModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
