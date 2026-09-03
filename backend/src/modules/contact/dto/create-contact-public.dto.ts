import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

const toOptionalBoolean = ({
  value,
}: {
  value: unknown;
}): boolean | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
};

const trimLowerEmail = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed.toLowerCase();
};

export class CreateContactPublicDto {
  @IsIn(['general', 'table', 'consultation'])
  requestType!: 'general' | 'table' | 'consultation';

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  phoneNumber!: string;

  @IsOptional()
  @Transform(trimLowerEmail)
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @Transform(trimLowerEmail)
  @IsEmail()
  email?: string;

  @ValidateIf(
    (object: CreateContactPublicDto) => object.requestType === 'general',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  content?: string;

  @ValidateIf(
    (object: CreateContactPublicDto) => object.requestType === 'table',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  preferredDate?: string;

  @ValidateIf(
    (object: CreateContactPublicDto) => object.requestType === 'table',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  preferredTime?: string;

  @ValidateIf(
    (object: CreateContactPublicDto) => object.requestType === 'table',
  )
  @IsInt()
  @Min(1)
  @Max(500)
  guests?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  eventType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  specialRequests?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  sendNotificationToAdmin?: boolean;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  sendConfirmationToCustomer?: boolean;
}
