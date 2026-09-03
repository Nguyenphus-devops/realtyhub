import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class QueryLeadDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

  @IsOptional()
  @IsIn(['free_trial', 'discount', 'consultation', 'none'])
  promoType?: 'free_trial' | 'discount' | 'consultation' | 'none';

  @IsOptional()
  @IsIn(['website', 'facebook', 'google', 'hotline', 'walk_in', 'referral', 'other'])
  source?: 'website' | 'facebook' | 'google' | 'hotline' | 'walk_in' | 'referral' | 'other';

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'name', 'phone'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class UpdateLeadStatusDto {
  @IsOptional()
  @IsIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  staffNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  lostReason?: string;
}
