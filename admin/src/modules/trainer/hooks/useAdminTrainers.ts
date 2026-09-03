import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AdminTrainerService } from "../services/trainer.service";
import type {
  AdminCreateTrainerInput,
  AdminUpdateTrainerInput,
} from "../models/trainer.model";

export const useAdminTrainers = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["admin-trainers"],
    queryFn: () => AdminTrainerService.list(),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-trainers"] });
  };

  const createMutation = useMutation({
    mutationFn: (body: AdminCreateTrainerInput) =>
      AdminTrainerService.create(body),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã thêm huấn luyện viên.");
    },
    onError: () => toast.error("Không thể thêm huấn luyện viên."),
  });

  const updateMutation = useMutation({
    mutationFn: (params: { publicId: string; body: AdminUpdateTrainerInput }) =>
      AdminTrainerService.update(params.publicId, params.body),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã cập nhật huấn luyện viên.");
    },
    onError: () => toast.error("Không thể cập nhật huấn luyện viên."),
  });

  const removeMutation = useMutation({
    mutationFn: (publicId: string) => AdminTrainerService.remove(publicId),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã xóa huấn luyện viên.");
    },
    onError: () => toast.error("Không thể xóa huấn luyện viên."),
  });

  const seedSampleMutation = useMutation({
    mutationFn: () => AdminTrainerService.seedSample(),
    onSuccess: async () => {
      await invalidate();
      toast.success("Đã seed dữ liệu huấn luyện viên mẫu.");
    },
    onError: () => toast.error("Không thể seed dữ liệu huấn luyện viên mẫu."),
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    seedSampleMutation,
  };
};
