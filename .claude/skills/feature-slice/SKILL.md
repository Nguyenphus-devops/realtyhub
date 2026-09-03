---
name: feature-slice
description: Deliver one complete vertical slice across backend/ and admin/ — API resource plus the admin screen that drives it, wired end to end. Use for any request phrased as a product feature ("thêm quản lý sản phẩm", "làm màn hình nhập hàng", "cho phép admin sửa kho") rather than a single-file edit. Owns the ordering, the cross-cutting registries, and the definition of done.
---

# Feature slice (backend + admin, end to end)

A feature is not done when the endpoint returns 200. It is done when an admin
can reach the screen from the sidebar, perform the action, and see the result
persist after a reload.

## Order of work

Build backend-first — the DTO is the contract, and the frontend model is derived
from it, never the reverse.

1. **Scope from the graph, not from memory.** One call:
   `graft ask "how does <nearest existing feature> work end to end" --source`.
   Changing an existing symbol? `graft callers <symbol> --depth all` before editing.
2. **Model the data.** Entity + DTOs. Decide the addressing key (`publicId` for
   most resources, `slug` for content) and whether deletes are soft.
3. **Backend module** → `/skill:backend-module`.
4. **Register cross-cutting** (see checklist below) — this is where slices break.
5. **Admin module** → `/skill:admin-module`.
6. **Verify** → `/skill:dev-verify`.

## The seam between the two halves

Three things must agree exactly, and nothing checks them at compile time:

| Backend | Admin | Failure if they drift |
|---|---|---|
| `Routes` enum value | `apiRoutes` path | 404 |
| DTO fields (`forbidNonWhitelisted`) | model / form fields | 400 on save, extra field silently rejected |
| `PermissionResource` value | string passed to `canCreate()`/`canEdit()` | button hidden, or visible then 403 |

Every response is enveloped by `TransformInterceptor`, so the admin side must
`unwrapApiData`. Every route lives under `/v1` (`API_URL_CLIENT` appends it).

## Combined registry checklist

Backend:
- [ ] `Routes` enum — `backend/src/common/utils/constants.ts`
- [ ] `PermissionResource` — `backend/src/modules/permissions/enums/resource-type.enum.ts`
- [ ] module added to `backend/src/app.module.ts` imports
- [ ] `HISTORY_ACTIONS` — `backend/src/modules/history/history.ts` (audited mutations)
- [ ] non-admin roles updated in `permissions.helpers.ts` if STAFF/USER need access

Admin:
- [ ] `apiRoutes` entry — `admin/src/config/apiRoutes.ts`
- [ ] route page — `admin/app/(admin)/<feature>/page.tsx` with `metadata.title`
- [ ] sidebar nav item — `admin/src/common/layout/AppSidebar.tsx`
- [ ] permission gating in the component

## Data-shape conventions to keep consistent across slices

- Money: store minor units as integers (VND has no subunit — store whole đồng as
  `number`), never floats derived from string parsing in the UI.
- Quantities that feed stock math: integers; keep the unit conversion factor on
  the unit record, not inline in the transaction.
- Every transactional document (purchase, sale, transfer, adjustment) carries
  `publicId`, a human `code`/reference, `status`, `warehouseId`, `createdBy`,
  and a `lines[]` array — follow one existing document module once it exists so
  reports can treat them uniformly.
- List endpoints return `{ items, total, page, limit, hasMore }` (name `items`
  after the resource, e.g. `products`, matching `PaginatedBlogs`).

## Definition of done

- `cd backend && npm run lint && npm run build` clean
- `cd admin && npm run lint && npm run build` clean
- endpoint reachable at `/v1/<route>` with a real token, correct 401/403 when not
- screen reachable from the sidebar, create/edit/delete round-trip survives reload
- Vietnamese copy for every user-visible label, toast, and error message

If part of the slice is blocked, finish the rest and say plainly what is missing
— do not silently ship the backend half and call the feature done.
