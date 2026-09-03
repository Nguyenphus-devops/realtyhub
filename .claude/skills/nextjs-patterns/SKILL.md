---
name: nextjs-patterns
description: Next.js 16 App Router mechanics for admin/ — server vs client component boundary, route files and metadata, dynamic imports, images and the uploads proxy, SVG imports, and the auth/hydration rules specific to this app. Use when adding a route, hitting a hydration or "use client" error, rendering images or charts, or touching app/layout.tsx.
---

# Next.js App Router patterns

Next.js 16, React 19, App Router. `admin/app/` holds routing only; all real
code lives in `admin/src/` (`@/*`). Note `app/` is a **sibling** of `src/`.

## Server / client boundary

Almost everything here is a client component, because the whole panel runs on
TanStack Query + context. The exceptions matter:

- `app/layout.tsx` is a **server component** and must stay one — it reads the
  `token` cookie via `cookies()` and calls `GET /auth/status` server-side to
  seed `AuthProvider`. Adding `"use client"` to it breaks first-paint auth.
- Route pages (`app/(admin)/*/page.tsx`) are server components that export
  `metadata` and render one client component. Keep them at ~5 lines.
- Anything using hooks, context, or browser APIs needs `"use client"` at the top
  of **its own file** — the directive does not inherit through imports.

`localStorage` and `window` are unavailable during render. Guard with
`typeof window !== 'undefined'` or read them inside `useEffect`; the axios
instance already does this.

## Route files

```
app/(admin)/products/page.tsx            → /products
app/(admin)/products/[publicId]/page.tsx → /products/:publicId
```

Two route groups exist: `(admin)` (sidebar chrome, `AdminGuard`-protected) and
`(auth)` (login, forgot/reset password). Group names never appear in the URL.

```tsx
export const metadata: Metadata = { title: 'Sản phẩm' };
```

Dynamic route params are a **Promise** in Next 16:
```tsx
export default async function Page({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  return <ProductEdit publicId={publicId} />;
}
```

There are no `loading.tsx` or `error.tsx` files today; loading and error states
are handled inside the client components via TanStack Query (see
`/skill:admin-table`). Add route-level files only if you also make the whole
subtree use them — half-and-half is worse than either.

A route with no entry in `AppSidebar.tsx` is unreachable in practice. Adding
the nav item is part of shipping the screen.

## Images

`next/image` is used in a few places (`LoginForm`, `AppSidebar`, `MediaGallery`);
plain `<img>` elsewhere. Either is fine, but `next/image` requires the host in
`next.config.ts` `images.remotePatterns` — currently `images.unsplash.com`,
`assets.mixkit.co`, and `localhost`/`127.0.0.1` **on port 8010 only**. A backend
on 8011 will fail `next/image` while plain `<img>` still works; that mismatch is
a common false alarm.

Backend uploads are proxied: `next.config.ts` rewrites `/uploads/:path*` to the
API origin. Store and render upload URLs as **relative** `/uploads/...` paths so
they work in both dev and prod without host juggling.

## Charts

ApexCharts touches `window` at import time — always:

```tsx
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
```

Chart theming (tooltip, legend, gridlines) is already overridden in
`globals.css`; don't restyle those inline. See
`@/common/components/ecommerce/MonthlySalesChart.tsx`.

## SVG

SVGR is configured for both webpack and turbopack, so
`import Icon from '@/icons/foo.svg'` yields a React component (`src/svg.d.ts`
declares the module). Prefer `react-icons` for generic glyphs.

## Provider order — do not reorder

```
AuthProvider → PermissionsProvider → AdminGuard → QueryProvider → SidebarProvider
```

`PermissionsProvider` derives from `useAuth()`, and `AdminGuard` reacts to
`isAuthReady`. Note `QueryProvider` sits **inside** `AdminGuard`: query hooks
only run once the guard has admitted the user. Moving it out means unauthorized
requests fire during redirect.

## Hydration

Mismatch errors here usually come from rendering `localStorage`, `Date.now()`,
`Math.random()`, or a locale-formatted date directly in the first render. Format
dates through `@/utils/format.ts` with an explicit `vi-VN` locale and timezone,
or render them after mount.

## Build gotchas

- `NEXT_PUBLIC_API_URL` must be set — `next.config.ts` and `apiRoutes.ts` both
  throw at load without it, so `dev`, `build`, and `lint` all fail.
- Only `NEXT_PUBLIC_*` vars reach the client; a secret in any other var is
  simply `undefined` in the browser.
- `next build` type-checks the whole project. A type error in an untouched
  module still fails your build — fix it or say why you left it.
