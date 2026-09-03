export const TRAINER_GENDERS = ["male", "female", "other"] as const;

export type TrainerGender = (typeof TRAINER_GENDERS)[number];

export type AdminTrainer = {
  publicId: string;
  name: string;
  birthDate: string;
  gender: TrainerGender;
  address: string;
  photoUrl: string | null;
  serviceType: string;
  phone?: string;
  experience?: number;
  specialties?: string[];
  certificates?: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminCreateTrainerInput = {
  name: string;
  birthDate: string;
  gender: TrainerGender;
  address: string;
  photoUrl?: string;
  photoFile?: File | null;
  serviceType: string;
  phone?: string;
  experience?: number;
  specialties?: string[] | string;
  certificates?: string[] | string;
  bio?: string;
};

export type AdminUpdateTrainerInput = Partial<AdminCreateTrainerInput>;
