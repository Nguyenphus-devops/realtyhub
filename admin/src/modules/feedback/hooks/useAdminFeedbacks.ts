"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminFeedbackService } from "../services/feedback.service";
import type {
  AdminFeedback,
  AdminCreateFeedbackInput,
  AdminUpdateFeedbackInput,
} from "../models/feedback.model";

export const useAdminFeedbacks = () => {
  const queryClient = useQueryClient();

  const {
    data: feedbacks = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<AdminFeedback[]>({
    queryKey: ["feedbacks"],
    queryFn: () => AdminFeedbackService.list(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation<AdminFeedback, Error, AdminCreateFeedbackInput>({
    mutationFn: (data) => AdminFeedbackService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  const updateMutation = useMutation<
    AdminFeedback,
    Error,
    { publicId: string; data: AdminUpdateFeedbackInput }
  >({
    mutationFn: ({ publicId, data }) => AdminFeedbackService.update(publicId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  const deleteMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (publicId) => AdminFeedbackService.remove(publicId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  const seedMutation = useMutation<{ message: string; count: number }, Error, void>({
    mutationFn: () => AdminFeedbackService.seedSample(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  return {
    feedbacks,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    seedMutation,
  };
};
