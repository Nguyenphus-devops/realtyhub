import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PermissionEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export class RolePermissionDto {
  @IsString()
  @IsNotEmpty()
  resourceType!: string;

  @IsString()
  @IsNotEmpty()
  action!: string;

  @IsString()
  @IsNotEmpty()
  resourceTarget!: string;

  @IsNotEmpty()
  @IsEnum(PermissionEffect)
  effect!: PermissionEffect;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionDto)
  permissions!: RolePermissionDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
