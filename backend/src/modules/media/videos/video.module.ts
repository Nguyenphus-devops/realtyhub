import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './video.service';
import { VideosController } from './video.controller';
import { Video } from './entities/video.entity';
import { VideoProgressService } from './video-progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [VideosController],
  providers: [VideosService, VideoProgressService],
  exports: [VideosService, VideoProgressService],
})
export class VideosModule {}
