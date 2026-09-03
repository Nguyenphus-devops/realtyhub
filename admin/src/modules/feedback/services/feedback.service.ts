import api from "@/config/api";
import { unwrapApiData } from "@/common/utils/unwrap-api-data";
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminCreateFeedbackInput,
  AdminFeedback,
  AdminUpdateFeedbackInput,
} from "../models/feedback.model";

const FEEDBACK_ROOT = apiRoutes.FEEDBACK.BASE;

const toFeedbackFormData = (body: AdminCreateFeedbackInput | AdminUpdateFeedbackInput) => {
  const formData = new FormData();

  if (body.name !== undefined) formData.append("name", body.name);
  if (body.avatar !== undefined) formData.append("avatar", body.avatar);
  if (body.rating !== undefined) formData.append("rating", String(body.rating));
  if (body.comment !== undefined) formData.append("comment", body.comment);
  if (body.serviceType !== undefined) formData.append("serviceType", body.serviceType);

  // Before Image
  if (body.beforeImageFile) {
    formData.append("beforeImage", body.beforeImageFile);
  } else if (body.beforeImageUrl !== undefined) {
    formData.append("beforeImage", body.beforeImageUrl || "");
  }

  // After Image
  if (body.afterImageFile) {
    formData.append("afterImage", body.afterImageFile);
  } else if (body.afterImageUrl !== undefined) {
    formData.append("afterImage", body.afterImageUrl || "");
  }

  return formData;
};

export const AdminFeedbackService = {
  list: async (): Promise<AdminFeedback[]> => {
    const response = await api.get<AdminFeedback[]>(FEEDBACK_ROOT);
    return unwrapApiData(response.data);
  },

  create: async (body: AdminCreateFeedbackInput): Promise<AdminFeedback> => {
    const response = await api.post<AdminFeedback>(FEEDBACK_ROOT, toFeedbackFormData(body), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapApiData(response.data);
  },

  update: async (
    publicId: string,
    body: AdminUpdateFeedbackInput,
  ): Promise<AdminFeedback> => {
    const response = await api.patch<AdminFeedback>(
      apiRoutes.FEEDBACK.UPDATE(publicId),
      toFeedbackFormData(body),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return unwrapApiData(response.data);
  },

  remove: async (publicId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      apiRoutes.FEEDBACK.DELETE(publicId),
    );
    return unwrapApiData(response.data);
  },

  seedSample: async (): Promise<{ message: string; count: number }> => {
    const response = await api.post<{ message: string; count: number }>(
      apiRoutes.FEEDBACK.SEED_SAMPLE,
    );
    return unwrapApiData(response.data);
  },
};
