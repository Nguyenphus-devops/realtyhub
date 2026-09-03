---
name: admin-module
description: Build or extend a feature module in admin/ (Next.js App Router) — apiRoutes entry, service, TanStack Query hooks, models, components, route page, sidebar entry, permission gating. Use whenever the task adds or changes an admin screen, a table/form, or any call to the backend from the admin panel.
---

# Admin feature module (Next.js 16 + TanStack Query)

Read `CLAUDE.md` first. This skill is the mechanical recipe for one screen.

Copy an existing module instead of inventing structure:
- small CRUD + toasts → `admin/src/modules/banner/`
- list + pagination + create/edit pages → `admin/src/modules/blog/`

## The layered flow — do not shortcut it

```
src/config/apiRoutes.ts     URL builders (single source of endpoint strings)
        ↓
src/modules/<f>/services/   axios via `@/config/api`, unwrapped with unwrapApiData
        ↓
src/modules/<f>/hooks/      useQuery / useMutation, explicit queryKey, toasts
        ↓
src/modules/<f>/components/ presentation
        ↓
app/(admin)/<f>/page.tsx    thin route that renders the component
```

A component never calls `api` or `fetch` directly, and a service never contains
React state. `@/*` resolves to `admin/src/*` — note `app/` is a **sibling** of
`src/`, not inside it.

## Files

```
admin/src/modules/<feature>/
├── models/<feature>.model.ts     # types mirroring backend DTOs/entities
├── services/<feature>.service.ts
├── hooks/use<Feature>.ts
└── components/<Feature>Page.tsx  # + Form / List / Modal as needed
admin/app/(admin)/<feature>/page.tsx
```

## 1 · apiRoutes entry

`src/config/apiRoutes.ts`. Plain paths for fixed routes, builder functions when
there are params or query strings. `API_URL_CLIENT` already appends `/v1`, so
routes here start at the resource: `/products`, not `/v1/products`.

```ts
PRODUCT: {
  BASE: '/products',
  GET_ALL: (params?: { page?: number; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.page !== undefined) sp.append('page', String(params.page));
    if (params?.limit !== undefined) sp.append('limit', String(params.limit));
    const qs = sp.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  },
  UPDATE: (publicId: string) => `/products/${publicId}`,
  DELETE: (publicId: string) => `/products/${publicId}`,
},
```

## 2 · Model

Mirror the backend entity/DTO field-for-field. Dates arrive as ISO **strings**,
not `Date`. Keep create/update input types separate from the read type:

```ts
export type Product = { publicId: string; name: string; isActive: boolean; createdAt: string; updatedAt: string };
export type CreateProductInput = { name: string; isActive?: boolean };
export type UpdateProductInput = Partial<CreateProductInput>;
export type PaginatedProducts = { products: Product[]; total: number; page: number; limit: number; hasMore: boolean };
```

Any field added here must also exist in the backend DTO — `forbidNonWhitelisted`
turns an extra field into a 400.

## 3 · Service

```ts
import api from '@/config/api';
import { unwrapApiData } from '@/common/utils/unwrap-api-data';
import { apiRoutes } from '@/config/apiRoutes';

export const ProductService = {
  list: async (params?: { page?: number; limit?: number }): Promise<PaginatedProducts> => {
    const res = await api.get(apiRoutes.PRODUCT.GET_ALL(params));
    return unwrapApiData<PaginatedProducts>(res.data);
  },
  create: async (body: CreateProductInput): Promise<Product> => {
    const res = await api.post(apiRoutes.PRODUCT.BASE, body);
    return unwrapApiData<Product>(res.data);
  },
};
```

Always `unwrapApiData` — every backend response is wrapped in
`{ success, statusCode, data, ... }`. Never build a second axios instance: the
shared one in `src/config/api.ts` owns token attach and the single-flight 401
refresh.

## 4 · Hook

One hook module per feature, exporting a query hook and a mutations hook.
Rules that keep the cache coherent:

- Declare the key once (`const key = (p: number) => ['products', p] as const`)
  and reuse it in both the query and the invalidations.
- Invalidate the list key in `onSuccess`; use
  `invalidateQueries({ queryKey: ['product'], refetchType: 'inactive' })` for
  detail keys so an open editor is not reset mid-edit (see `useBlogMutations`).
- Toast in the hook, not the component: `toast.success` / `toast.error` with
  Vietnamese copy. Prefer surfacing the backend message on error.
- `placeholderData: keepPreviousData` for paginated tables.
- `enabled: Boolean(id)` for detail queries.

## 5 · Component + route page

The route file stays thin and owns the tab title:

```tsx
import ProductsAdminPage from '@/modules/product/components/ProductsAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sản phẩm' };
export default function ProductsRoutePage() { return <ProductsAdminPage />; }
```

Components that use hooks/context need `"use client"`. Forms use
`react-hook-form`; tables reuse `@/common/components/tables/Pagination`; rich
text uses the `SunEditor` wrapper in `@/common/components`; charts use
`react-apexcharts` (dynamic import, `ssr: false`).

Styling is Tailwind 4 utility classes with dark-mode variants — match the
neighbouring screens, and reuse `@/common/components/ui/*` (Badge, Dropdown)
instead of new one-off components.

## 6 · Permission gating

```tsx
const { canCreate, canEdit, canDelete } = usePermissions();
{canCreate('products') && <button>Thêm mới</button>}
```

The resource string must equal the backend `PermissionResource` value
(`'products'`, `'service-categories'`, …). This only hides UI — the server guard
is the real boundary, so never rely on it for safety.

## Registry checklist

- [ ] `src/config/apiRoutes.ts` → route entry
- [ ] `admin/app/(admin)/<feature>/page.tsx` → route + `metadata.title`
- [ ] `src/common/layout/AppSidebar.tsx` → nav item (`name`, `path`, icon) or the
      screen is unreachable
- [ ] permission gating in the component

## Auth invariants — do not break these

`AuthProvider` is the sole owner of session verification; `app/layout.tsx` seeds
it server-side from the `token` cookie via `GET /auth/status`. Do not add
verify/refresh calls in guards, pages, or hooks — that reintroduces the
duplicate-refresh loop the comments in `AdminGuard.tsx` warn about.

## Companion skills

This skill owns the **data flow**. For the screen itself, load alongside it:
- `/skill:ui-design-system` — tokens, page shell, control classes (before any JSX)
- `/skill:admin-table` — list screens
- `/skill:admin-form` — create/edit forms and modals
- `/skill:nextjs-patterns` — routes, server/client boundary, images, charts

## Verify

```bash
cd admin && npm run lint && npm run build
```

`NEXT_PUBLIC_API_URL` must be set or both commands throw at config load.
