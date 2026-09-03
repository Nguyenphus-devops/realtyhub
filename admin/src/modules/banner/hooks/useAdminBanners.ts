import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AdminBannerService } from '../services/banner.service';
import type {
  AdminCreateBannerInput,
  AdminUpdateBannerInput,
} from '../models/banner.model';

const bannerQueryKey = (placement: string) => ['admin-banners', placement] as const;

export const useAdminBanners = (placement: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: bannerQueryKey(placement),
    queryFn: () => AdminBannerService.list(placement),
    enabled: placement.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (body: AdminCreateBannerInput) =>
      AdminBannerService.create(body),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bannerQueryKey(variables.placement),
      });
      toast.success('Đã thêm banner.');
    },
    onError: () => {
      toast.error('Không thể thêm banner. Kiểm tra dữ liệu và quyền.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: {
      publicId: string;
      body: AdminUpdateBannerInput;
      placement: string;
    }) => AdminBannerService.update(params.publicId, params.body),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bannerQueryKey(variables.placement),
      });
      toast.success('Đã cập nhật banner.');
    },
    onError: () => {
      toast.error('Không thể cập nhật banner.');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (params: { publicId: string; placement: string }) =>
      AdminBannerService.remove(params.publicId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bannerQueryKey(variables.placement),
      });
      toast.success('Đã xóa banner.');
    },
    onError: () => {
      toast.error('Không thể xóa banner.');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (params: {
      placement: string;
      orderedPublicIds: string[];
    }) =>
      AdminBannerService.reorder(
        params.placement,
        params.orderedPublicIds,
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bannerQueryKey(variables.placement),
      });
      toast.success('Đã cập nhật thứ tự.');
    },
    onError: () => {
      toast.error('Không thể sắp xếp lại. Thử lại sau.');
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    reorderMutation,
  };
};
