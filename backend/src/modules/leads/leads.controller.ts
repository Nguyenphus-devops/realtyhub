import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Routes } from 'src/common/utils/constants';
import {
  RequiresPermission,
  PermissionAction,
  PermissionResource,
  PermissionResourceTarget,
} from '../permissions/decorators/permissions.decorator';
import { LeadsService } from './leads.service';
import { CreateLeadPublicDto } from './dto/create-lead.dto';
import { QueryLeadDto, UpdateLeadStatusDto } from './dto/query-lead.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipPermissions } from '../permissions/decorators/skip-permissions.decorator';

@ApiTags('Leads')
@Controller(Routes.LEADS)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Public()
  @SkipPermissions()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 10, ttl: 60000 } })
  createPublic(@Body() createLeadDto: CreateLeadPublicDto) {
    return this.leadsService.createPublicLead(createLeadDto);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.LEAD,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  findAll(@Query() query: QueryLeadDto) {
    return this.leadsService.getLeads(query);
  }

  @Get('stats')
  @RequiresPermission(
    PermissionResource.LEAD,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  getStats() {
    return this.leadsService.getLeadStats();
  }

  @Get(':id')
  @RequiresPermission(
    PermissionResource.LEAD,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Patch(':id')
  @RequiresPermission(
    PermissionResource.LEAD,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateLeadStatus(id, updateDto);
  }

  @Delete(':id')
  @RequiresPermission(
    PermissionResource.LEAD,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.leadsService.deleteLead(id);
  }
}
