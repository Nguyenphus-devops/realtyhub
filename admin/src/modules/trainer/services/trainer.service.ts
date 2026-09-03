import api from "@/config/api";
import { unwrapApiData } from "@/common/utils/unwrap-api-data";
import { apiRoutes } from "@/config/apiRoutes";
import type {
  AdminCreateTrainerInput,
  AdminTrainer,
  AdminUpdateTrainerInput,
} from "../models/trainer.model";

const TRAINER_ROOT = apiRoutes.TRAINER.BASE;

const toTrainerFormData = (body: AdminCreateTrainerInput | AdminUpdateTrainerInput) => {
  const formData = new FormData();
  const hasFile = Boolean(body.photoFile);

  if (body.name !== undefined) formData.append("name", body.name);
  if (body.birthDate !== undefined) formData.append("birthDate", body.birthDate);
  if (body.gender !== undefined) formData.append("gender", body.gender);
  if (body.address !== undefined) formData.append("address", body.address);
  if (body.serviceType !== undefined) formData.append("serviceType", body.serviceType);
  if (body.phone !== undefined) formData.append("phone", body.phone);
  if (body.experience !== undefined) formData.append("experience", String(body.experience));
  if (body.bio !== undefined) formData.append("bio", body.bio);
  
  if (body.specialties !== undefined) {
    if (Array.isArray(body.specialties)) {
      formData.append("specialties", body.specialties.join(", "));
    } else {
      formData.append("specialties", body.specialties);
    }
  }

  if (body.certificates !== undefined) {
    if (Array.isArray(body.certificates)) {
      formData.append("certificates", body.certificates.join(", "));
    } else {
      formData.append("certificates", body.certificates);
    }
  }

  if (!hasFile && body.photoUrl !== undefined && body.photoUrl !== null && body.photoUrl !== "") {
    formData.append("photoUrl", body.photoUrl);
  }
  if (body.photoFile) {
    formData.append("photo", body.photoFile);
  }

  return formData;
};

export const AdminTrainerService = {
  list: async (): Promise<AdminTrainer[]> => {
    const response = await api.get<AdminTrainer[]>(TRAINER_ROOT);
    return unwrapApiData(response.data);
  },

  create: async (body: AdminCreateTrainerInput): Promise<AdminTrainer> => {
    const response = await api.post<AdminTrainer>(TRAINER_ROOT, toTrainerFormData(body), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapApiData(response.data);
  },

  update: async (
    publicId: string,
    body: AdminUpdateTrainerInput,
  ): Promise<AdminTrainer> => {
    const response = await api.patch<AdminTrainer>(
      apiRoutes.TRAINER.UPDATE(publicId),
      toTrainerFormData(body),
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
      apiRoutes.TRAINER.DELETE(publicId),
    );
    return unwrapApiData(response.data);
  },

  seedSample: async (): Promise<{ message: string; count: number }> => {
    const response = await api.post<{ message: string; count: number }>(
      apiRoutes.TRAINER.SEED_SAMPLE,
    );
    return unwrapApiData(response.data);
  },
};
