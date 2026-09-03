import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Video } from './entities/video.entity';
import { Subject } from 'rxjs';

export interface UploadProgressEvent {
  uploadId: string;
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  videoId?: string;
  error?: string;
}

@Injectable()
export class VideoProgressService {
  private progressSubjects = new Map<string, Subject<UploadProgressEvent>>();

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: MongoRepository<Video>,
  ) {}

  public getProgressObservable(uploadId: string): Subject<UploadProgressEvent> {
    if (!this.progressSubjects.has(uploadId)) {
      this.progressSubjects.set(uploadId, new Subject<UploadProgressEvent>());
    }
    return this.progressSubjects.get(uploadId)!;
  }

  public async updateProgress(
    uploadId: string,
    uploadedBytes: number,
    totalBytes: number,
    status: 'pending' | 'uploading' | 'completed' | 'failed',
    videoId?: string,
    error?: string,
  ): Promise<void> {
    const progress = totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0;

    const event: UploadProgressEvent = {
      uploadId,
      progress,
      uploadedBytes,
      totalBytes,
      status,
      videoId,
      error,
    };

    const subject = this.getProgressObservable(uploadId);
    subject.next(event);

    if (videoId) {
      await this.videoRepository.updateOne(
        { slug: videoId },
        {
          $set: {
            uploadProgress: progress,
            uploadedBytes,
            uploadStatus: status,
            updatedAt: new Date(),
          },
        },
      );
    }

    if (status === 'completed' || status === 'failed') {
      setTimeout(() => {
        subject.complete();
        this.progressSubjects.delete(uploadId);
      }, 1000);
    }
  }

  public async initializeUpload(
    uploadId: string,
    totalBytes: number,
  ): Promise<void> {
    await this.updateProgress(uploadId, 0, totalBytes, 'pending');
  }

  public async completeUpload(uploadId: string, videoId: string): Promise<void> {
    const video = await this.videoRepository.findOneBy({ slug: videoId });
    if (video && video.fileSize) {
      await this.updateProgress(
        uploadId,
        video.fileSize,
        video.fileSize,
        'completed',
        videoId,
      );
    }
  }

  public async failUpload(uploadId: string, error: string): Promise<void> {
    await this.updateProgress(uploadId, 0, 0, 'failed', undefined, error);
  }
}
