import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Lead, LeadStatus, LeadPromoType, LeadSource } from './entities/lead.entity';
import { CreateLeadPublicDto } from './dto/create-lead.dto';
import { QueryLeadDto, UpdateLeadStatusDto } from './dto/query-lead.dto';

export interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ILeadService {
  createPublicLead(dto: CreateLeadPublicDto): Promise<Lead>;
  getLeads(query: QueryLeadDto): Promise<PaginatedLeads>;
  getLeadById(id: string): Promise<Lead>;
  updateLeadStatus(id: string, dto: UpdateLeadStatusDto): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  getLeadStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  }>;
}

@Injectable()
export class LeadsService implements ILeadService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async createPublicLead(dto: CreateLeadPublicDto): Promise<Lead> {
    const lead = this.leadRepository.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      note: dto.note,
      promoType: dto.promoType as LeadPromoType || LeadPromoType.None,
      source: dto.source as LeadSource || LeadSource.Website,
      sourceDetail: dto.sourceDetail,
      status: LeadStatus.New,
    });

    return this.leadRepository.save(lead);
  }

  async getLeads(query: QueryLeadDto): Promise<PaginatedLeads> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.promoType) {
      filter.promoType = query.promoType;
    }
    if (query.source) {
      filter.source = query.source;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.dateFrom || query.dateTo) {
      filter.createdAt = {};
      if (query.dateFrom) {
        (filter.createdAt as Record<string, Date>).$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (filter.createdAt as Record<string, Date>).$lte = new Date(query.dateTo);
      }
    }

    const sortField = query.sortBy || 'createdAt';
    const sortDir = query.sortOrder === 'ASC' ? 1 : -1;

    const [leads, total] = await this.leadRepository.findAndCount({
      where: filter,
      order: { [sortField]: sortDir },
      skip,
      take: limit,
    });

    return {
      data: leads,
      total,
      page,
      limit,
      hasMore: total > skip + leads.length,
    };
  }
  async getLeadById(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { _id: new ObjectId(id) as any } });
    if (!lead) {
      throw new Error('Không tìm thấy lead');
    }
    return lead;
  }

  async updateLeadStatus(id: string, dto: UpdateLeadStatusDto): Promise<Lead> {
    const lead = await this.getLeadById(id);

    if (dto.status) {
      lead.status = dto.status as LeadStatus;
      if (dto.status === LeadStatus.Contacted && !lead.contactAt) {
        lead.contactAt = new Date();
      }
      if (dto.status === LeadStatus.Converted && !lead.convertedAt) {
        lead.convertedAt = new Date();
      }
    }

    if (dto.staffNote !== undefined) {
      lead.staffNote = dto.staffNote;
    }
    if (dto.lostReason !== undefined) {
      lead.lostReason = dto.lostReason;
    }

    return this.leadRepository.save(lead);
  }

  async deleteLead(id: string): Promise<void> {
    const lead = await this.getLeadById(id);
    await this.leadRepository.remove(lead);
  }

  async getLeadStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  }> {
    const [total, newCount, contactedCount, qualifiedCount, convertedCount, lostCount] = await Promise.all([
      this.leadRepository.count(),
      this.leadRepository.count({ where: { status: LeadStatus.New } }),
      this.leadRepository.count({ where: { status: LeadStatus.Contacted } }),
      this.leadRepository.count({ where: { status: LeadStatus.Qualified } }),
      this.leadRepository.count({ where: { status: LeadStatus.Converted } }),
      this.leadRepository.count({ where: { status: LeadStatus.Lost } }),
    ]);

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      qualified: qualifiedCount,
      converted: convertedCount,
      lost: lostCount,
    };
  }
}