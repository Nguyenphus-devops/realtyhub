import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UpdateInfoWebsiteDto } from './dto/update-info-website.dto';
import {
  INFO_WEBSITE_SINGLETON_KEY,
  InfoWebsite,
} from './entities/info-website.entity';
import type {
  IInfoWebsiteService,
  PublicInfoWebsitePayload,
} from './info-website';

@Injectable()
export class InfoWebsiteService implements IInfoWebsiteService {
  constructor(
    @InjectRepository(InfoWebsite)
    private readonly infoWebsiteRepository: MongoRepository<InfoWebsite>,
  ) {}

  private async ensureSingleton(): Promise<InfoWebsite> {
    const existing = await this.infoWebsiteRepository.findOne({
      where: { singletonKey: INFO_WEBSITE_SINGLETON_KEY },
    });
    if (existing) {
      return existing;
    }
    const created = this.infoWebsiteRepository.create({
      singletonKey: INFO_WEBSITE_SINGLETON_KEY,
    });
    return this.infoWebsiteRepository.save(created);
  }

  private toPublicPayload(row: InfoWebsite): PublicInfoWebsitePayload {
    return {
      id: row.publicId,
      siteTitle: row.siteTitle,
      metaDescription: row.metaDescription,
      faviconUrl: row.faviconUrl,
      logoUrl: row.logoUrl,
      ogImageUrl: row.ogImageUrl,
      companyName: row.companyName,
      companySlogan: row.companySlogan,
      taxCode: row.taxCode,
      phone: row.phone,
      hotline: row.hotline,
      email: row.email,
      address: row.address,
      addressLine2: row.addressLine2,
      googleMapEmbedUrl: row.googleMapEmbedUrl,
      googleMapLink: row.googleMapLink,
      workingHours: row.workingHours,
      facebookUrl: row.facebookUrl,
      youtubeUrl: row.youtubeUrl,
      instagramUrl: row.instagramUrl,
      zaloUrl: row.zaloUrl,
      tiktokUrl: row.tiktokUrl,
      linkedinUrl: row.linkedinUrl,
      twitterUrl: row.twitterUrl,
      messengerUrl: row.messengerUrl,
      copyrightText: row.copyrightText,
      extraNote: row.extraNote,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async findPublic(): Promise<PublicInfoWebsitePayload> {
    const row = await this.ensureSingleton();
    return this.toPublicPayload(row);
  }

  async findForAdmin(): Promise<InfoWebsite> {
    return this.ensureSingleton();
  }

  async updateForAdmin(dto: UpdateInfoWebsiteDto): Promise<InfoWebsite> {
    const row = await this.ensureSingleton();
    const entries = Object.entries(dto).filter(
      (entry): entry is [keyof InfoWebsite, string] => {
        const [, value] = entry;
        return value !== undefined;
      },
    );
    for (const [key, value] of entries) {
      if (
        key in row &&
        key !== '_id' &&
        key !== 'publicId' &&
        key !== 'singletonKey'
      ) {
        (row as unknown as Record<string, unknown>)[key] = value;
      }
    }
    return this.infoWebsiteRepository.save(row);
  }
}
