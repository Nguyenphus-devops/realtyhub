---
name: ui-design-system
description: Design tokens and visual conventions for the admin UI (Tailwind CSS v4) — colors, typography, shadows, spacing, page shell, buttons, badges, dark mode reality. Load BEFORE writing any JSX or Tailwind class in admin/, so a new screen looks like the rest of the product instead of a fresh template.
---

# Admin design system (Tailwind CSS v4)

The UI is built on a TailAdmin-derived theme. All tokens live in
`admin/app/globals.css` under `@theme` — **there is no `tailwind.config.js`
theme to edit** (that file only sets `content`, a `7xl` max-width and an `xs`
breakpoint). Tailwind v4 reads the CSS.

## The single most important rule

**Use theme tokens, never raw hex.** Several existing screens (e.g.
`ServiceCategoriesAdminPage.tsx`) hardcode values like `#eadfd8` / `#3d2010` /
`#fff7f1`. That is drift, not the standard — it produces a screen that belongs
to no palette and breaks the moment the brand color changes. New code uses
tokens; when editing one of those files heavily, converge it.

## Tokens

**Brand** `brand-25…950`, primary action = `brand-500`, hover = `brand-600`.
Focus ring = `shadow-focus-ring`.

**Neutrals** `gray-25…950` plus `gray-dark` (#1a2231) for dark surfaces.
Body background is `gray-50` (set globally on `body`); cards are `white`.

**Semantic** `success-*` (green), `error-*` (red), `warning-*` (amber),
`blue-light-*` (info), `theme-pink-500`, `theme-purple-500`. Use these for
status, never ad-hoc `green-600` / `amber-500` from Tailwind's default palette.

**Typography** — the default font scale is replaced. Available:
`text-theme-xs` (12/18), `text-theme-sm` (14/20), `text-theme-xl` (20/30), and
display sizes `text-title-sm|md|lg|xl|2xl`. Font is `font-outfit` (applied
globally). Body copy is `text-sm` / `text-theme-sm`; table cells `text-sm`;
page title `text-xl font-semibold`.

**Elevation** `shadow-theme-xs|sm|md|lg|xl` — not Tailwind's `shadow-md`.
Cards use `shadow-theme-sm`, dropdowns/modals `shadow-theme-lg`.

**Radius** `rounded-lg` for controls, `rounded-xl`/`rounded-2xl` for cards,
`rounded-full` for pills and search inputs.

**Breakpoints** are redefined: `2xsm` 375, `xsm` 425, `sm` 640, `md` 768,
`lg` 1024, `xl` 1280, `2xl` 1536, `3xl` 2000.

**Custom utilities** defined in globals.css: `menu-item*` family (sidebar),
`no-scrollbar`, `custom-scrollbar`. Reuse them for sidebar/scroll areas.

## Dark mode — know the actual state

`@custom-variant dark (&:is(.dark *))` is defined and most template components
carry `dark:` classes, but **nothing in the app ever adds `.dark` to the root**
— there is no theme toggle or ThemeContext. So:

- Keep writing `dark:` variants on new components (cheap, consistent with the
  existing code, and makes a future toggle a one-file change).
- Never rely on dark mode for contrast or test it as a feature.
- Do not build a theme toggle unless asked; it needs a provider + persisted
  preference + `.dark` on `<html>`.

## Page shell

Every admin screen renders inside `app/(admin)/layout.tsx`, which supplies
sidebar + header + `p-4 md:p-6` container. A page component starts at
`<div className="space-y-6">` and stacks sections:

```tsx
<div className="space-y-6">
  {/* header: title + description + primary action + search */}
  <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Sản phẩm</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Quản lý danh mục sản phẩm và tồn kho.</p>
      </div>
      {canCreateItem && <PrimaryButton onClick={openCreate}>Thêm sản phẩm</PrimaryButton>}
    </div>
  </section>

  {/* content card */}
  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
    …
  </section>
</div>
```

Set the tab title with `metadata` in the route file, and put a
`PageBreadCrumb` (`@/common/components/common/PageBreadCrumb`) above the header
on nested screens.

## Control recipes

**Primary button**
```
inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold
text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed
disabled:opacity-50
```
**Secondary**
```
inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5
text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50
dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]
```
**Destructive** — `bg-error-500 hover:bg-error-600 text-white`.

**Input**
```
w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800
placeholder:text-gray-400 outline-none transition focus:border-brand-400
focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
```

**Status pill** — use `@/common/components/ui/badge/Badge` rather than a new
`<span>`: `<Badge color="success">Đang hoạt động</Badge>`. Colors available:
`primary | success | error | warning | info | light | dark`; variants
`light | solid`; sizes `sm | md`.

## Component inventory — reuse before creating

| Need | Use |
|---|---|
| status chip | `@/common/components/ui/badge/Badge` |
| dropdown menu | `@/common/components/ui/dropdown/{Dropdown,DropdownItem}` |
| pager | `@/common/components/tables/Pagination` (labels already Vietnamese) |
| breadcrumb | `@/common/components/common/PageBreadCrumb` |
| rich text | `@/common/components/SunEditor` |
| charts | `react-apexcharts` via `next/dynamic` with `ssr: false` |
| icons | `react-icons`, or SVGs in `@/icons` (SVGR imports them as components) |
| toasts | `react-toastify` — `ToastContainer` is already mounted in the root layout |

There is **no shared Modal, Button, Input, or Table component** yet. Screens
hand-roll them, which is why they drift. If you build the same control a third
time, extract it into `@/common/components/ui/` and say so.

## Copy

All user-visible text is Vietnamese, including buttons, table headers, empty
states, toasts, and validation messages. Keep sentence case with diacritics.
Prices display as `Intl.NumberFormat('vi-VN')` + `₫`; dates via helpers in
`@/utils/format.ts`.

## Responsive

Sidebar collapses below `lg`. Tables must sit in `overflow-x-auto` — the page
body itself never scrolls horizontally. Action buttons stack (`flex-col`) below
`sm`. Test the layout at 375px (`2xsm`) since that is the defined floor.
