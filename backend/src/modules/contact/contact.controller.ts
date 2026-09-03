import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { ContactService } from './contact.service';
import { CreateContactPublicDto } from './dto/create-contact-public.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';

type RequestWithUser = Request & {
  user?: { id: string; userId?: string; email?: string; role?: string };
};

@ApiTags('Contacts')
@Controller(Routes.CONTACTS)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Public()
  @SkipPermissions()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 30, ttl: 60000 } })
  createPublic(@Body() createContactDto: CreateContactPublicDto) {
    return this.contactService.createPublic(createContactDto);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.CONTACT,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  findAllAdmin() {
    return this.contactService.findAllForAdmin();
  }

  @Get(':id')
  @RequiresPermission(
    PermissionResource.CONTACT,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  findOneAdmin(@Param('id') id: string) {
    return this.contactService.findOneForAdmin(id);
  }

  @Patch(':id')
  @RequiresPermission(
    PermissionResource.CONTACT,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  updateAdmin(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    const actorId = user?.userId ?? user?.id;
    return this.contactService.updateForAdmin(id, updateContactDto, {
      id: actorId ?? '',
      email: user?.email,
    });
  }
}
