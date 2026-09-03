import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: MongoRepository<History>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    const historyLog = this.historyRepository.create({
      ...createHistoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.historyRepository.save(historyLog);
  }

  async findAll(
    page = 1,
    limit = 20,
    action?: string,
  ): Promise<{
    logs: History[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
    const normalizedLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const skip = (normalizedPage - 1) * normalizedLimit;
    const whereCondition: Partial<History> = {};

    if (action) {
      whereCondition.action = action;
    }

    const [logs, total] = await Promise.all([
      this.historyRepository.find({
        where: whereCondition,
        order: { createdAt: 'DESC' },
        skip,
        take: normalizedLimit,
      }),
      this.historyRepository.count({
        where: whereCondition,
      }),
    ]);

    return {
      logs,
      total,
      page: normalizedPage,
      limit: normalizedLimit,
      hasMore: total > skip + logs.length,
    };
  }
}
