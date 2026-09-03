import React from 'react';
import { UploadProgressEvent } from '../service/video.service';

interface VideoUploadProgressProps {
  progress: UploadProgressEvent | null;
  fileName?: string;
  showDetails?: boolean;
  className?: string;
}

/**
 * Component hiển thị progress bar cho video upload
 *
 * @example
 * ```tsx
 * <VideoUploadProgress
 *   progress={progress}
 *   fileName="video.mp4"
 *   showDetails={true}
 * />
 * ```
 */
export const VideoUploadProgress: React.FC<VideoUploadProgressProps> = ({
  progress,
  fileName,
  showDetails = true,
  className = '',
}) => {
  if (!progress) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-gray-400';
      case 'uploading':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Đang chuẩn bị...';
      case 'uploading':
        return 'Đang tải lên...';
      case 'completed':
        return 'Hoàn thành';
      case 'failed':
        return 'Thất bại';
      default:
        return '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {fileName && (
        <div className="mb-2 text-sm font-medium text-gray-700 truncate">
          {fileName}
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getStatusColor(progress.status)}`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {showDetails && (
        <div className="mt-2 flex justify-between items-center text-xs text-gray-600">
          <span className="font-medium">{getStatusText(progress.status)}</span>
          <span>{progress.progress}%</span>
        </div>
      )}

      {showDetails && progress.totalBytes > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {formatBytes(progress.uploadedBytes)} / {formatBytes(progress.totalBytes)}
        </div>
      )}

      {progress.status === 'failed' && progress.error && (
        <div className="mt-2 text-xs text-red-600">
          Lỗi: {progress.error}
        </div>
      )}

      {progress.status === 'completed' && progress.videoId && (
        <div className="mt-2 text-xs text-green-600">
          Video ID: {progress.videoId}
        </div>
      )}
    </div>
  );
};

/**
 * Component hiển thị danh sách progress cho nhiều video
 */
interface MultipleVideoUploadProgressProps {
  progresses: Map<string, UploadProgressEvent>;
  fileNames?: Map<string, string>;
  className?: string;
}

export const MultipleVideoUploadProgress: React.FC<MultipleVideoUploadProgressProps> = ({
  progresses,
  fileNames,
  className = '',
}) => {
  if (progresses.size === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from(progresses.entries()).map(([uploadId, progress]) => (
        <VideoUploadProgress
          key={uploadId}
          progress={progress}
          fileName={fileNames?.get(uploadId)}
          showDetails={true}
        />
      ))}
    </div>
  );
};

/**
 * Component upload video với progress bar tích hợp
 */
interface VideoUploadWithProgressProps {
  onSuccess?: (video: any) => void;
  onError?: (error: Error) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  buttonText?: string;
  buttonClassName?: string;
}

export const VideoUploadWithProgress: React.FC<VideoUploadWithProgressProps> = ({
  onSuccess,
  onError,
  accept = 'video/mp4,video/webm,video/ogg,video/avi,video/mov',
  maxSize = 0.5 * 1024 * 1024 * 1024, // 512MB
  className = '',
  buttonText = 'Chọn video',
  buttonClassName = '',
}) => {
  const [progress, setProgress] = React.useState<UploadProgressEvent | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setProgress(null);

    try {
      const videoService = (await import('../service/video.service')).default;

      const validation = videoService.validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const uploadId = crypto.randomUUID();

      const result = await videoService.uploadVideo(file, {
        uploadId,
        onProgress: (event) => {
          setProgress(event);
        },
      });

      setIsUploading(false);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload thất bại');
      setIsUploading(false);
      onError?.(error);
      setProgress({
        uploadId: '',
        progress: 0,
        uploadedBytes: 0,
        totalBytes: 0,
        status: 'failed',
        error: error.message,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="video-upload-input"
      />
      <label
        htmlFor="video-upload-input"
        className={`inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? 'Đang tải lên...' : buttonText}
      </label>

      {progress && (
        <div className="mt-4">
          <VideoUploadProgress
            progress={progress}
            fileName={fileName}
            showDetails={true}
          />
        </div>
      )}
    </div>
  );
};
