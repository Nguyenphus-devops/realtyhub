"use client";

import { useState, useCallback, useEffect } from "react";
import { VideoResponse } from "@/common/service/video.service";
import { VideoUploadProgress } from "@/common/components/VideoUploadProgress";
import { useMultipleVideoUpload, useVideoUpload } from "@/common/hooks/useVideos";
import { useVideos } from "@/common/hooks/useVideosUpload";

export default function VideoUploadDemo() {
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");
  const [uploadedVideos, setUploadedVideos] = useState<VideoResponse[]>([]);

  // Single upload
  const {
    uploadVideo,
    progress: singleProgress,
    isUploading: isSingleUploading,
    error: singleError,
    reset: resetSingle,
    cancelUpload,
  } = useVideoUpload({
    onSuccess: (video) => {
      setUploadedVideos((prev) => [video, ...prev]);
      console.log("Upload thành công:", video);
    },
    onError: (error) => {
      console.error("Upload thất bại:", error);
    },
  });

  // Multiple upload
  const {
    uploadVideos,
    progresses: multipleProgresses,
    isUploading: isMultipleUploading,
    errors: multipleErrors,
    reset: resetMultiple,
  } = useMultipleVideoUpload({
    onSuccess: (videos) => {
      setUploadedVideos((prev) => [...videos, ...prev]);
      console.log("Upload nhiều video thành công:", videos);
    },
    onError: (errors) => {
      console.error("Có lỗi khi upload:", errors);
    },
  });

  // Fetch existing videos
  const {
    videos,
    loading: isLoadingVideos,
    error: videosError,
    fetchAllVideos,
  } = useVideos();

  // Fetch videos on mount
  useEffect(() => {
    fetchAllVideos();
  }, []);

  const handleSingleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await uploadVideo(file);
        event.target.value = ""; // Reset input
      }
    },
    [uploadVideo]
  );

  const handleMultipleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        await uploadVideos(files);
        event.target.value = ""; // Reset input
      }
    },
    [uploadVideos]
  );

  const handleCancel = useCallback(() => {
    cancelUpload();
    resetSingle();
  }, [cancelUpload, resetSingle]);

  const allVideos = [...uploadedVideos, ...(videos || [])];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demo Upload Video
        </h1>
        <p className="text-gray-600">
          Trang demo để test chức năng upload video với progress tracking
        </p>
      </div>

      {/* Upload Mode Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Chế độ upload</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setUploadMode("single")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${uploadMode === "single"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Upload đơn
          </button>
          <button
            onClick={() => setUploadMode("multiple")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${uploadMode === "multiple"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Upload nhiều video
          </button>
        </div>
      </div>

      {/* Single Upload Section */}
      {uploadMode === "single" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upload video đơn</h2>

          <div className="space-y-4">
            <div>
              <input
                type="file"
                id="single-video-upload"
                className="hidden"
                accept="video/*"
                onChange={handleSingleFileChange}
                disabled={isSingleUploading}
              />
              <label
                htmlFor="single-video-upload"
                className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${isSingleUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                {isSingleUploading ? "Đang upload..." : "Chọn video"}
              </label>
            </div>

            {/* Progress */}
            {singleProgress && (
              <div className="space-y-2">
                <VideoUploadProgress
                  progress={singleProgress}
                  showDetails={true}
                />
                {isSingleUploading && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Hủy upload
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {singleError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">Lỗi upload:</p>
                <p className="text-red-600">{singleError.message}</p>
                <button
                  onClick={resetSingle}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multiple Upload Section */}
      {uploadMode === "multiple" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upload nhiều video</h2>

          <div className="space-y-4">
            <div>
              <input
                type="file"
                id="multiple-video-upload"
                className="hidden"
                accept="video/*"
                multiple
                onChange={handleMultipleFileChange}
                disabled={isMultipleUploading}
              />
              <label
                htmlFor="multiple-video-upload"
                className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${isMultipleUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                {isMultipleUploading ? "Đang upload..." : "Chọn nhiều video"}
              </label>
            </div>

            {/* Multiple Progress */}
            {multipleProgresses.size > 0 && (
              <div className="space-y-3">
                {Array.from(multipleProgresses.entries()).map(([uploadId, progress], index) => (
                  <VideoUploadProgress
                    key={uploadId + index}
                    progress={progress}
                    showDetails={true}
                  />
                ))}
              </div>
            )}

            {/* Multiple Errors */}
            {multipleErrors.size > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium mb-2">
                  Có {multipleErrors.size} video upload thất bại:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {Array.from(multipleErrors.entries()).map(([uploadId, error]) => (
                    <li key={uploadId} className="text-red-600">
                      {error.message}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={resetMultiple}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Xóa lỗi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Danh sách video ({allVideos.length})
        </h2>

        {isLoadingVideos && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {videosError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Không thể tải danh sách video: {videosError}</p>
          </div>
        )}

        {!isLoadingVideos && !videosError && allVideos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có video nào
          </div>
        )}

        {!isLoadingVideos && !videosError && allVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allVideos.map((video) => (
              <div
                key={video._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-100">
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900 truncate">
                    {video.originalName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {video.fileSize != null
                      ? `${(video.fileSize / 1024 / 1024).toFixed(2)} MB`
                      : "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {video.uploadStatus}
                  </p>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                      {video.videoUrl}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Thông tin:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
          <li>Hỗ trợ các định dạng: MP4, WebM, MOV, AVI, MKV</li>
          <li>Kích thước tối đa: 500MB</li>
          <li>Thời lượng tối đa: 30 phút</li>
          <li>Upload có progress tracking real-time</li>
          <li>Hỗ trợ upload nhiều video cùng lúc</li>
        </ul>
      </div>
    </div>
  );
}
