import { PartialType } from '@nestjs/swagger';
import { CreateInfoWebsiteDto } from './create-info-website.dto';

export class UpdateInfoWebsiteDto extends PartialType(CreateInfoWebsiteDto) {}
