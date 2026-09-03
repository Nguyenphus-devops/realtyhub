---
name: realestate-domain
description: Domain model and build roadmap for the real-estate sales platform this repo is being built into — dự án, chủ đầu tư, khu vực, loại hình, căn hộ, so sánh, yêu thích, tin tức, sự kiện. Use when planning what to build next, naming entities and fields, or when a request mentions a real-estate concept (dự án, phân khu, căn hộ, chủ đầu tư, mở bán, môi giới, tư vấn).
---

# Real-estate platform domain

The product is a Vietnamese **real-estate sales support platform**: a public site
where buyers browse projects, plus an admin panel where staff manage the
catalogue. It is **not** a POS/inventory system — if you find guidance in this
repo assuming products/stock/purchases, it is stale.

Build our own implementation and our own UI. Reference the target site for
*what features exist and how the workflow behaves*; never copy its markup, CSS,
images, or marketing text into the repo.

## Apps

| App | Port (dev) | Role |
|---|---|---|
| `web/` | 3000 | public site — project browsing, news, comparison |
| `admin/` | 3001 | back office — manages everything `web/` displays |
| `backend/` | 8010 | one NestJS API serving both |

Public endpoints need `@Public()` **and** `@SkipPermissions()`; admin endpoints
stay guarded. That split is the main thing to get right per resource.

## Core entities

Repo convention: `publicId` UUID for addressing, `slug` for public URLs,
`isActive`/`isDeleted`, `createdAt`/`updatedAt` via `@BeforeInsert`.

**Catalogue**
- `Project` (dự án) — name, slug, tagline, description, address, `segment`
  (`cao-tang` | `thap-tang`), `status` (`dang-mo-ban` | `sap-mo-ban` |
  `da-ban-giao`), `propertyType`, `developerId`, `regionId`, thumbnail, gallery,
  coordinates, scale (diện tích, số toà, số căn), legal status, handover date,
  `priceFrom`, amenities, `isHot`, SEO block
- `Developer` (chủ đầu tư) — name, slug, logo, description, website
- `Region` (khu vực) — tree via `parentId`: tỉnh/thành → quận/huyện → phường/xã
- `PropertyType` (loại hình) — căn hộ, biệt thự, nhà phố, shophouse, đất nền.
  Start as an enum; promote to a table only when admins must edit the list.
- `ProjectPhase` (phân khu / toà) — a project splits into blocks before units
  make sense

**Inventory of units** — needed for "so sánh căn hộ"
- `Unit` (căn hộ) — `projectId`, `phaseId`, code, floor, area, bedrooms,
  bathrooms, direction, view, price, `status` (còn hàng | giữ chỗ | đã bán),
  floor-plan image
- `Comparison` — a saved set of unit/project ids for side-by-side view

**Engagement**
- `Favorite` — `(userId, projectId)`; the heart on each card. Anonymous users
  keep it in localStorage until login, then merge.
- `Lead` (đăng ký tư vấn) — reuse the existing `leads` module; add `projectId`
- `Article` / news — reuse `blog` + `categories-blog`; categories seen in the
  reference: *Tin tức dự án*, *Phân tích - Nhận định*
- `Event` (sự kiện) — mở bán, lễ ra quân: title, date, location, projectId
- `Guide` (hướng dẫn sử dụng) — static content, likely just `blog` with a category

**People**
- reuse `User` + `Role` + `permissions`. Expect an **agent/môi giới** role that
  sees leads assigned to them and nothing else — design `PermissionResourceTarget`
  usage with that in mind rather than retrofitting later.

## Invariants

1. **Public list endpoints must be cheap and cacheable.** `web/` hits them on
   every visit. Project lists return a projection (card fields only), never the
   full description + gallery.
2. **Slug is the public key, `publicId` the admin key.** `/du-an/<slug>` for
   SEO; admin mutations address `publicId`. Slugs are unique and immutable once
   published — changing one breaks inbound links, so keep a redirect table if it
   must change.
3. **Filters must be indexed fields.** `developerId`, `regionId`,
   `propertyType`, `status`, `segment` all appear in one query; add compound
   indexes before the data grows.
4. **Search is diacritic-insensitive.** Vietnamese users type "ha long" for
   "Hạ Long". `backend/src/common/utils/normalizeForSearch.ts` already exists —
   store a normalized copy of searchable text and query against it.
5. **Region is a tree.** Filtering by a province must include all its districts.
   Decide now: store `regionPath` on the project (denormalized ancestor ids) so
   one equality match covers the subtree.
6. **Price is display-sensitive.** Store VND as an integer; `priceFrom` may be
   null ("liên hệ"). Never format money in the API — format in the UI with
   `Intl.NumberFormat('vi-VN')`.

## Build order

1. **Foundations** — Developer, Region (tree), PropertyType. Small admin CRUD
   slices; every project references them.
2. **Project** — entity + admin CRUD + public list/detail endpoints. The largest
   single module; do it before anything that decorates it.
3. **Public project pages** — list (done in `web/`, currently on mock data) and
   detail. Swap `web/src/modules/project/services/project.service.ts` from mock
   to axios; nothing else in `web/` should change.
4. **News** — wire the existing `blog` module to the public site.
5. **Engagement** — favorites, lead capture from a project page.
6. **Units + comparison** — phases, units, so sánh căn hộ.
7. **Events, guides, agent role, reports.**

## Naming

`Routes` enum + `PermissionResource` use kebab-case plurals matching the admin
path: `projects`, `developers`, `regions`, `project-units`. Mongo collections
are snake_case plurals: `projects`, `project_units`. Public `web/` routes are
Vietnamese: `/du-an`, `/tin-tuc`, `/su-kien`, `/so-sanh-can-ho`.

## What already exists and should be reused

`images` / `videos` (project galleries), `blog` + `categories-blog` (news),
`leads` + `contact` (consultation requests), `banner` (homepage hero),
`history` (audit trail), `permissions` + `roles`, `info-website` (footer/contact
settings).

Gym-specific leftovers — `trainer`, `service-package`, `service-category`,
`feedback` — are not part of this product. They are still the best worked
examples of the repo's conventions, so leave them until asked; ask before
deleting.

Deliver one slice at a time with `/skill:feature-slice`.
