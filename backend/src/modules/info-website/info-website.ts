import type { InfoWebsite } from './entities/info-website.entity';
import type { UpdateInfoWebsiteDto } from './dto/update-info-website.dto';

export type PublicInfoWebsitePayload = {
  id: string;
  siteTitle: string;
  metaDescription: string;
  faviconUrl: string;
  logoUrl: string;
  ogImageUrl: string;
  companyName: string;
  companySlogan: string;
  taxCode: string;
  phone: string;
  hotline: string;
  email: string;
  address: string;
  addressLine2: string;
  googleMapEmbedUrl: string;
  googleMapLink: string;
  workingHours: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  zaloUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  messengerUrl: string;
  copyrightText: string;
  extraNote: string;
  updatedAt: string;
};

export interface IInfoWebsiteService {
  findPublic(): Promise<PublicInfoWebsitePayload>;
  findForAdmin(): Promise<InfoWebsite>;
  updateForAdmin(dto: UpdateInfoWebsiteDto): Promise<InfoWebsite>;
}
