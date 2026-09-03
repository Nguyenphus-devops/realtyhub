import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RolesPaginationQueryDto } from './dtos/roles-pagination-query.dto';
import { RequiresPermission } from '../permissions/decorators/permissions.decorator';
import { PermissionResource } from '../permissions/enums/resource-type.enum';
import { PermissionAction } from '../permissions/enums/action.enum';
import { PermissionResourceTarget } from '../permissions/enums/resource-target.enum';
import { Routes, Services } from 'src/common/utils/constants';
import { IRolesService } from './roles';

@Controller(Routes.ROLES)
export class RolesController {
  constructor(
    @Inject(Services.ROLES) private readonly rolesService: IRolesService,
  ) {}

  @Post()
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.CREATE,
    PermissionResourceTarget.ANY,
  )
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  async findAll(@Query() query: RolesPaginationQueryDto) {
    return await this.rolesService.findAll(query);
  }

  @Get(':id')
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.DELETE,
    PermissionResourceTarget.ANY,
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
  }

  @Get(':id/permissions')
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.GET,
    PermissionResourceTarget.ANY,
  )
  async getPermissions(@Param('id') id: string) {
    return await this.rolesService.getPermissions(id);
  }

  @Patch(':id/permissions')
  @RequiresPermission(
    PermissionResource.PERMISSION,
    PermissionAction.EDIT,
    PermissionResourceTarget.ANY,
  )
  async assignPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: any[],
  ) {
    return await this.rolesService.assignPermissions(id, permissions);
  }
}
