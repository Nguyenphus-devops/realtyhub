import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactProcessingStatus } from '../entities/contact.entity';

export class UpdateContactAdminDto {
  @IsOptional()
  @IsEnum(ContactProcessingStatus)
  status?: ContactProcessingStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  internalNote?: string;
}
