import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoWebsite } from './entities/info-website.entity';
import { InfoWebsiteController } from './info-website.controller';
import { InfoWebsiteService } from './info-website.service';

@Module({
  imports: [TypeOrmModule.forFeature([InfoWebsite])],
  controllers: [InfoWebsiteController],
  providers: [InfoWebsiteService],
  exports: [InfoWebsiteService],
})
export class InfoWebsiteModule {}
