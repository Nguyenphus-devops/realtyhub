export interface AdminFeedback {
  id?: string;
  publicId: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  serviceType: string;
  beforeImage: string | null;
  afterImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateFeedbackInput {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  serviceType: string;
  beforeImageFile?: File | null;
  afterImageFile?: File | null;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface AdminUpdateFeedbackInput extends Partial<AdminCreateFeedbackInput> {}
