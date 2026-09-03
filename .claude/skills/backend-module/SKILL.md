---
name: backend-module
description: Build or extend a NestJS resource module in backend/ — entity, DTOs, service, controller, module, permissions, audit history. Use whenever the task adds a new API resource (products, warehouses, purchases, sales, customers...) or adds endpoints/fields to an existing one. Covers the registries that are easy to forget (Routes enum, PermissionResource, app.module, HISTORY_ACTIONS).
---

# Backend module (NestJS + TypeORM/Mongo)

Read `CLAUDE.md` first for the global pipeline. This skill is the mechanical
recipe for one resource.

**Before writing anything**, copy the shape of an existing module rather than
inventing one:
- simple CRUD, `publicId` addressing → `graft skeleton backend/src/modules/service-category/service-category.service.ts`
- slug addressing + pagination + audit → `backend/src/modules/blog/`
- contract-file + DI token → `backend/src/modules/roles/`

## Files to create

```
backend/src/modules/<name>/
├── entities/<name>.entity.ts
├── dto/create-<name>.dto.ts
├── dto/update-<name>.dto.ts
├── <name>.ts               # contract: I<Name>Service + shared types (see below)
├── <name>.service.ts
├── <name>.controller.ts
└── <name>.module.ts
```

## 1 · Entity

TypeORM-for-Mongo. Never expose `_id` in URLs — address rows by `publicId`
(UUID) or `slug`.

```ts
@Entity('products')                                   // snake_case plural collection
@Index('idx_products_slug', ['slug'], { unique: true })
export class Product extends EntityHelper {
  @ObjectIdColumn() _id: ObjectId;
  @Column({ unique: true }) publicId: string;
  @Column() name: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: Date }) createdAt: Date;
  @Column({ type: Date }) updatedAt: Date;

  @BeforeInsert() setInsertDefaults(): void {
    if (!this.publicId) this.publicId = randomUUID();
    const now = new Date();
    if (!this.createdAt) this.createdAt = now;
    this.updatedAt = now;
  }
  @BeforeUpdate() touchUpdatedAt(): void { this.updatedAt = new Date(); }
}
```

Entities are auto-discovered by the glob in `DatabaseModule`; there is no
central entity registry to edit. `synchronize` is on outside production, so
schema changes apply on restart — there are **no migrations** in this repo.

Soft delete = an `isDeleted: boolean` column plus filtering in every query, the
way `blog` and `users` do it. Mongo `find` will not exclude it for you.

## 2 · DTOs

`class-validator` + `@ApiProperty`. The global `ValidationPipe` runs with
`whitelist` **and `forbidNonWhitelisted`**, so any field the frontend sends that
is not declared here returns 400. Update the DTO and the frontend model in the
same change.

```ts
export class CreateProductDto {
  @ApiProperty({ example: 'Áo thun nam' })
  @IsString() @IsNotEmpty() @MaxLength(200)
  name: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

`PartialType` comes from `@nestjs/swagger` in this repo (not `@nestjs/mapped-types`).

## 3 · Contract file `<name>.ts`

Holds `I<Name>Service` and shared types (`PaginatedProducts`, `RequestUser`,
action constants). Services `implements` it. Required when another module
injects this service; write it anyway for anything non-trivial — it is where
callers look for the public surface.

```ts
export type PaginatedProducts = {
  products: Product[]; total: number; page: number; limit: number; hasMore: boolean;
};

export interface IProductService {
  create(dto: CreateProductDto, user: RequestUser): Promise<Product>;
  findAll(page: number, limit: number): Promise<PaginatedProducts>;
  findOne(publicId: string): Promise<Product>;
  update(publicId: string, dto: UpdateProductDto): Promise<Product>;
  remove(publicId: string): Promise<{ message: string }>;
}
```

## 4 · Service

`@InjectRepository(X) private readonly repository: MongoRepository<X>`.

- Throw `NotFoundException` / `BadRequestException` / `ConflictException` with
  **Vietnamese messages** — they surface directly in admin toasts.
- Return bare payloads. `TransformInterceptor` adds the envelope; wrapping it
  yourself produces `data.data`.
- Pagination: `skip`/`take` + `count`, returned as the `Paginated*` shape above.
- Seeding defaults on boot: implement `OnModuleInit` (see `ServiceCategoryService`
  and `RolesService`); make it idempotent — it runs on every restart.
- Audited mutations: inject `HistoryService` and log with a constant from
  `HISTORY_ACTIONS`. Add the constant to `src/modules/history/history.ts` first.

## 5 · Controller

```ts
@ApiTags('Products')
@Controller(Routes.PRODUCT)                 // enum value, never a string literal
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get('public')
  @Public() @SkipPermissions()              // BOTH decorators, or it stays locked
  findPublic() { return this.service.findActive(); }

  @Get()
  @RequiresPermission(PermissionResource.PRODUCT, PermissionAction.GET, PermissionResourceTarget.ANY)
  @ApiBearerAuth()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.service.findAll(Number(page), Number(limit));
  }
}
```

Guards are global and opt-out. An endpoint with no decorators requires a valid
JWT **and** a matching permission. Only `@Public()` skips auth; only
`@SkipPermissions()` skips RBAC; anonymous endpoints need both.

Query params arrive as strings — convert explicitly (`Number(page)`,
`flag === 'true'`).

To scope a permission to one row, pass `GetResourceIdFromParams` as the target
instead of `PermissionResourceTarget.ANY`.

## 6 · Module

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
```

Injecting across modules: import the owning module and inject via the `Services`
enum token when the target uses one (`@Inject(Services.ROLES) private rolesService: IRolesService`).

## Registry checklist — the part that gets forgotten

Run `graft grep "SERVICE_CATEGORY"` to see every place one resource is registered,
then mirror it. For a new resource, edit:

- [ ] `src/common/utils/constants.ts` → `Routes` enum (the controller path)
- [ ] `src/modules/permissions/enums/resource-type.enum.ts` → `PermissionResource`
- [ ] `src/app.module.ts` → add the module to `imports`
- [ ] `src/modules/history/history.ts` → `HISTORY_ACTIONS` (only if audited)
- [ ] `src/common/utils/constants.ts` → `Services` enum (only if a DI token is needed)

Adding a `PermissionResource` value grants nothing by itself: `ADMIN` /
`SUPER_ADMIN` hold a wildcard so they get it free, while `STAFF` / `USER` need
an explicit entry in `generateGlobalPermissions()` in
`src/modules/permissions/permissions.helpers.ts`. Permissions are derived from
role per request and cached — `PermissionsCacheService` must be invalidated when
a role changes.

## Verify

```bash
cd backend && npm run lint && npm run build
```

There is no test suite. Smoke-test the route with `/skill:dev-verify`.
