import api from '@/config/api';
import { apiRoutes } from "@/config/apiRoutes";

export interface VideoResponse {
  _id: string;
  originalName: string;
  videoUrl: string;
  location: string;
  slug: string;
  alt: string;
  caption: string;
  description: string;
  uploadId?: string;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';
  fileSize?: number;
  uploadedBytes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgressEvent {
  uploadId: string;
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  videoId?: string;
  error?: string;
}

export type ProgressCallback = (event: UploadProgressEvent) => void;

// Cấu hình mặc định cho việc xử lý video
const videoConfig = {
  maxFileSize: 0.5 * 1024 * 1024 * 1024, // 512MB
  supportedFormats: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  chunkSize: 3, // Số lượng video upload cùng lúc
  timeout: 6000000, // 10 phút timeout cho video upload
};

const videoService = {
  /**
   * Kiểm tra file video hợp lệ
   */
  validateVideoFile: (file: File): { isValid: boolean; error?: string } => {
    // Kiểm tra kích thước file
    if (file.size > videoConfig.maxFileSize) {
      return {
        isValid: false,
        error: `Kích thước file quá lớn (tối đa ${(videoConfig.maxFileSize / 1024 / 1024 / 1024).toFixed(2)}GB)`
      };
    }

    // Kiểm tra định dạng file
    if (!videoConfig.supportedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `Định dạng file không được hỗ trợ. Hỗ trợ: ${videoConfig.supportedFormats.join(', ')}`
      };
    }

    return { isValid: true };
  },

  /**
   * Theo dõi tiến trình upload qua SSE
   */
  trackUploadProgress: (uploadId: string, onProgress: ProgressCallback): () => void => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${baseUrl}${apiRoutes.VIDEOS.PROGRESS(uploadId)}`;

    let aborted = false;
    const abortController = new AbortController();

    // Sử dụng fetch với SSE để có thể gửi credentials (cookies)
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      credentials: 'include', // Gửi cookies
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        while (!aborted) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: UploadProgressEvent = JSON.parse(line.substring(6));
                onProgress(data);

                // Tự động đóng kết nối khi hoàn thành hoặc thất bại
                if (data.status === 'completed' || data.status === 'failed') {
                  aborted = true;
                  abortController.abort();
                  break;
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return; // Normal abort, không cần log
        }
        console.error('SSE connection error:', error);
        if (!aborted) {
          onProgress({
            uploadId,
            progress: 0,
            uploadedBytes: 0,
            totalBytes: 0,
            status: 'failed',
            error: 'Mất kết nối với server'
          });
        }
      });

    // Trả về hàm cleanup để đóng kết nối
    return () => {
      aborted = true;
      abortController.abort();
    };
  },

  /**
   * Upload a single video file với progress tracking
   */
  uploadVideo: async (
    file: File,
    opts?: {
      uploadId?: string;
      onProgress?: ProgressCallback;
    }
  ): Promise<VideoResponse> => {
    const formData = new FormData();

    try {
      // Kiểm tra file trước khi upload
      const validation = videoService.validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Tạo uploadId nếu chưa có
      const uploadId = opts?.uploadId || crypto.randomUUID();

      // Bắt đầu theo dõi progress TRƯỚC KHI upload
      let cleanupProgress: (() => void) | undefined;
      if (opts?.onProgress) {
        cleanupProgress = videoService.trackUploadProgress(uploadId, opts.onProgress);
        // Đợi một chút để SSE connection được thiết lập
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      formData.append('file', file);

      // Tạo URL với uploadId query parameter
      const uploadUrl = `${apiRoutes.VIDEOS.UPLOAD}?uploadId=${encodeURIComponent(uploadId)}`;

      const response = await api.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: videoConfig.timeout,
      });

      // Cleanup SSE connection sau khi hoàn thành
      if (cleanupProgress) {
        setTimeout(() => cleanupProgress?.(), 2000);
      }

      return response.data;
    } catch (error: any) {
      console.error("Lỗi upload video:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get all videos with pagination
   */
  getAllVideos: async (page: number = 1, limit: number = 40): Promise<{
    videos: VideoResponse[];
    total: number;
    hasMore: boolean;
  }> => {
    try {
      const response = await api.get(apiRoutes.VIDEOS.GET_ALL(page, limit));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  /**
   * Delete a video by slug
   */
  deleteVideo: async (slug: string): Promise<any> => {
    try {
      const response = await api.delete(apiRoutes.VIDEOS.DELETE(slug));
      return response.data;
    } catch (error: any) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },
};

export default videoService;