import { useState, useCallback, useRef } from 'react';
import videoService, { VideoResponse, UploadProgressEvent } from '../service/video.service';

interface UseVideoUploadOptions {
  onSuccess?: (video: VideoResponse) => void;
  onError?: (error: Error) => void;
  onProgress?: (event: UploadProgressEvent) => void;
}

interface UseVideoUploadReturn {
  uploadVideo: (file: File) => Promise<VideoResponse | null>;
  progress: UploadProgressEvent | null;
  isUploading: boolean;
  error: Error | null;
  reset: () => void;
  cancelUpload: () => void;
}

/**
 * Hook để upload video với progress tracking
 *
 * @example
 * ```tsx
 * const { uploadVideo, progress, isUploading, error } = useVideoUpload({
 *   onSuccess: (video) => console.log('Upload thành công:', video),
 *   onError: (error) => console.error('Upload thất bại:', error),
 * });
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     await uploadVideo(file);
 *   }
 * };
 *
 * return (
 *   <div>
 *     <input type="file" accept="video/*" onChange={handleFileChange} />
 *     {isUploading && <div>Đang upload: {progress?.progress}%</div>}
 *     {error && <div>Lỗi: {error.message}</div>}
 *   </div>
 * );
 * ```
 */
export function useVideoUpload(options?: UseVideoUploadOptions): UseVideoUploadReturn {
  const [progress, setProgress] = useState<UploadProgressEvent | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const reset = useCallback(() => {
    setProgress(null);
    setIsUploading(false);
    setError(null);
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  const cancelUpload = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setIsUploading(false);
    setError(new Error('Upload đã bị hủy'));
  }, []);

  const uploadVideo = useCallback(async (file: File): Promise<VideoResponse | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(null);

      // Validate file trước
      const validation = videoService.validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const uploadId = crypto.randomUUID();

      // Upload với progress tracking
      const result = await videoService.uploadVideo(file, {
        uploadId,
        onProgress: (event) => {
          setProgress(event);
          options?.onProgress?.(event);
        },
      });

      setIsUploading(false);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload thất bại');
      setError(error);
      setIsUploading(false);
      options?.onError?.(error);
      return null;
    }
  }, [options]);

  return {
    uploadVideo,
    progress,
    isUploading,
    error,
    reset,
    cancelUpload,
  };
}

/**
 * Hook để upload nhiều video cùng lúc với progress tracking
 */
interface UseMultipleVideoUploadReturn {
  uploadVideos: (files: File[]) => Promise<VideoResponse[]>;
  progresses: Map<string, UploadProgressEvent>;
  isUploading: boolean;
  errors: Map<string, Error>;
  reset: () => void;
}

export function useMultipleVideoUpload(options?: {
  onSuccess?: (videos: VideoResponse[]) => void;
  onError?: (errors: Map<string, Error>) => void;
  onProgress?: (uploadId: string, event: UploadProgressEvent) => void;
}): UseMultipleVideoUploadReturn {
  const [progresses, setProgresses] = useState<Map<string, UploadProgressEvent>>(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Map<string, Error>>(new Map());

  const reset = useCallback(() => {
    setProgresses(new Map());
    setIsUploading(false);
    setErrors(new Map());
  }, []);

  const uploadVideos = useCallback(async (files: File[]): Promise<VideoResponse[]> => {
    try {
      setIsUploading(true);
      setErrors(new Map());
      setProgresses(new Map());

      const uploadPromises = files.map(async (file) => {
        const uploadId = crypto.randomUUID();

        try {
          const result = await videoService.uploadVideo(file, {
            uploadId,
            onProgress: (event) => {
              setProgresses((prev) => new Map(prev).set(uploadId, event));
              options?.onProgress?.(uploadId, event);
            },
          });
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Upload thất bại');
          setErrors((prev) => new Map(prev).set(uploadId, error));
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((r): r is PromiseFulfilledResult<VideoResponse> => r.status === 'fulfilled')
        .map((r) => r.value);

      setIsUploading(false);

      if (errors.size > 0) {
        options?.onError?.(errors);
      }

      if (successfulUploads.length > 0) {
        options?.onSuccess?.(successfulUploads);
      }

      return successfulUploads;
    } catch (err) {
      setIsUploading(false);
      return [];
    }
  }, [errors.size, options]);

  return {
    uploadVideos,
    progresses,
    isUploading,
    errors,
    reset,
  };
}
