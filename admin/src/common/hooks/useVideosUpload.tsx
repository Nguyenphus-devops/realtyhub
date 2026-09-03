'use client'

import { useState } from 'react';
import videoService, { VideoResponse } from '../service/video.service';

export const useVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    hasMore: boolean;
    currentPage: number;
  }>({
    total: 0,
    hasMore: false,
    currentPage: 1,
  });

  /**
   * Upload a single video
   */
  const uploadVideo = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const result = await videoService.uploadVideo(file);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all videos with pagination
   */
  const fetchAllVideos = async (page: number = 1, limit: number = 40) => {
    setLoading(true);
    setError(null);

    try {
      const results = await videoService.getAllVideos(page, limit);
      setVideos(results.videos);
      setPagination({
        total: results.total,
        hasMore: results.hasMore,
        currentPage: page,
      });
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      return {
        videos: [],
        total: 0,
        hasMore: false,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more videos (for pagination)
   */
  const loadMoreVideos = async (limit: number = 40) => {
    if (!pagination.hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = pagination.currentPage + 1;
      const results = await videoService.getAllVideos(nextPage, limit);

      setVideos(prev => [...prev, ...results.videos]);
      setPagination({
        total: results.total,
        hasMore: results.hasMore,
        currentPage: nextPage,
      });

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more videos');
      return {
        videos: [],
        total: 0,
        hasMore: false,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a video by slug
   */
  const deleteVideo = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await videoService.deleteVideo(slug);
      // Update the videos list after deletion
      setVideos(videos.filter(video => video.slug !== slug));
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Reset videos state
   */
  const resetVideos = () => {
    setVideos([]);
    setPagination({
      total: 0,
      hasMore: false,
      currentPage: 1,
    });
    setError(null);
  };

  return {
    loading,
    error,
    videos,
    pagination,
    uploadVideo,
    fetchAllVideos,
    loadMoreVideos,
    deleteVideo,
    clearError,
    resetVideos,
  };
};
