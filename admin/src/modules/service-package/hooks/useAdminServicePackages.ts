import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AdminServicePackageService } from "../services/service-package.service";
import type {
  AdminCreateServicePackageInput,
  AdminUpdateServicePackageInput,
} from "../models/service-package.model";

const servicePackageQueryKey = (params?: {
  category?: string;
  isActive?: boolean;
}) =>
  [
    "admin-service-packages",
    params?.category ?? "all",
    params?.isActive === undefined ? "all" : String(params.isActive),
  ] as const;

export const useAdminServicePackages = (params?: {
  category?: string;
  isActive?: boolean;
}) => {
  const queryClient = useQueryClient();
  const queryKey = servicePackageQueryKey(params);

  const listQuery = useQuery({
    queryKey,
    queryFn: () => AdminServicePackageService.list(params),
  });

  const invalidateServicePackages = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-service-packages"],
    });
  };

  const createMutation = useMutation({
    mutationFn: (body: AdminCreateServicePackageInput) =>
      AdminServicePackageService.create(body),
    onSuccess: async () => {
      await invalidateServicePackages();
      toast.success("Đã thêm gói dịch vụ.");
    },
    onError: () => {
      toast.error("Không thể thêm gói dịch vụ.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (paramsInput: {
      publicId: string;
      body: AdminUpdateServicePackageInput;
    }) =>
      AdminServicePackageService.update(paramsInput.publicId, paramsInput.body),
    onSuccess: async () => {
      await invalidateServicePackages();
      toast.success("Đã cập nhật gói dịch vụ.");
    },
    onError: () => {
      toast.error("Không thể cập nhật gói dịch vụ.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (publicId: string) => AdminServicePackageService.remove(publicId),
    onSuccess: async () => {
      await invalidateServicePackages();
      toast.success("Đã xóa gói dịch vụ.");
    },
    onError: () => {
      toast.error("Không thể xóa gói dịch vụ.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedPublicIds: string[]) =>
      AdminServicePackageService.reorder(orderedPublicIds),
    onSuccess: async () => {
      await invalidateServicePackages();
      toast.success("Đã cập nhật thứ tự hiển thị.");
    },
    onError: () => {
      toast.error("Không thể sắp xếp lại thứ tự.");
    },
  });

  const seedSampleMutation = useMutation({
    mutationFn: () => AdminServicePackageService.seedSample(),
    onSuccess: async (payload) => {
      await invalidateServicePackages();
      toast.success(
        `${payload.message} Tạo mới ${payload.createdCount}, cập nhật ${payload.updatedCount}.`,
      );
    },
    onError: () => {
      toast.error("Không thể seed dữ liệu mẫu.");
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    reorderMutation,
    seedSampleMutation,
  };
};
