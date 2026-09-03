import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimValue = ({ value }: { value: unknown }): string | undefined => {
  if (typeof value !== 'string') {
    return value as string;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export class CreateLeadPublicDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @Transform(trimValue)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Transform(trimValue)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(trimValue)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  note?: string;

  @IsOptional()
  @IsIn(['free_trial', 'discount', 'consultation', 'none'])
  promoType?: 'free_trial' | 'discount' | 'consultation' | 'none';

  @IsOptional()
  @IsIn(['website', 'facebook', 'google', 'hotline', 'walk_in', 'referral', 'other'])
  source?: 'website' | 'facebook' | 'google' | 'hotline' | 'walk_in' | 'referral' | 'other';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourceDetail?: string;
}
