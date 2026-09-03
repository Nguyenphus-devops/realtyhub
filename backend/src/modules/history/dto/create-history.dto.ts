import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  action!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  actorEmail?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
