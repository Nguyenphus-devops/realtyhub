import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AdminServiceCategoryService } from "../services/service-category.service";
import type {
  AdminCreateServiceCategoryInput,
  AdminUpdateServiceCategoryInput,
} from "../models/service-category.model";

const getErrorMessage = (err: any, fallbackMessage: string): string => {
  const msg = err?.response?.data?.message || err?.message;
  if (Array.isArray(msg)) {
    return msg.join(", ");
  }
  if (typeof msg === "string" && msg.trim()) {
    return msg;
  }
  return fallbackMessage;
};

export const useAdminServiceCategories = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["admin-service-categories"],
    queryFn: () => AdminServiceCategoryService.list(),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-service-categories"] });
  };

  const createMutation = useMutation({
    mutationFn: (body: AdminCreateServiceCategoryInput) =>
      AdminServiceCategoryService.create(body),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã thêm loại dịch vụ.");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Không thể thêm loại dịch vụ.")),
  });

  const updateMutation = useMutation({
    mutationFn: (params: { publicId: string; body: AdminUpdateServiceCategoryInput }) =>
      AdminServiceCategoryService.update(params.publicId, params.body),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã cập nhật loại dịch vụ.");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Không thể cập nhật loại dịch vụ.")),
  });

  const removeMutation = useMutation({
    mutationFn: (publicId: string) => AdminServiceCategoryService.remove(publicId),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã xóa loại dịch vụ.");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Không thể xóa loại dịch vụ.")),
  });

  return { listQuery, createMutation, updateMutation, removeMutation };
};

