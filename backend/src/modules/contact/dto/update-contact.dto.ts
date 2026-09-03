import { PartialType } from '@nestjs/swagger';
import { UpdateContactAdminDto } from './update-contact-admin.dto';

export class UpdateContactDto extends PartialType(UpdateContactAdminDto) {}
