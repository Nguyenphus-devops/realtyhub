---
name: admin-table
description: The list screen pattern for admin/ — data table with search, filters, pagination, loading/empty/error states, row actions gated by permission, and delete confirmation. Use for any "danh sách / quản lý X" screen. This is the most repeated screen in the POS product; build it the same way every time.
---

# List screen (data table)

A POS admin is mostly list screens. Every one of them has the same skeleton;
the only things that change are columns, filters, and the row actions.

Reference implementations: `admin/src/modules/service-category/components/ServiceCategoriesAdminPage.tsx`
(client-side filter, modal form) and `admin/src/modules/blog/components/BlogList.tsx`
(server pagination). Load `/skill:ui-design-system` for the tokens used below.

## Decide first: where does filtering happen?

| Rows | Approach |
|---|---|
| bounded and small (units, brands, warehouses, tax rates) | fetch all once, filter/sort in a `useMemo` |
| unbounded (products, sales, purchases, customers, stock) | server-side — page, limit, search, filters all go in the query key |

Products and documents in this product **will** grow past a page. Default to
server-side for anything transactional; do not ship a client-side filter over
`findAll()` and plan to fix it later.

## State ownership

```tsx
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [warehouseId, setWarehouseId] = useState<string | null>(null);
```

- Reset `page` to 1 whenever a filter or the search term changes, or the user
  lands on an empty page 7.
- Debounce the search input (~300 ms) before it enters the query key, otherwise
  every keystroke is a request.
- Every filter that affects the request **must** be in the `queryKey`:
  `['products', { page, limit, search, warehouseId }]`.
- Use `placeholderData: keepPreviousData` so the table doesn't blank out between
  pages.

## The four render states — handle all of them

Missing states are the most common defect in these screens.

```tsx
if (!canViewPage) return <EmptyNotice>Bạn không có quyền xem mục này.</EmptyNotice>;
if (listQuery.isLoading) return <TableSkeleton rows={limit} />;   // never a bare spinner shift
if (listQuery.isError) return <ErrorNotice onRetry={listQuery.refetch} />;
// then: rows.length === 0 → empty row inside the table, not a replaced page
```

Distinguish **empty because no data** ("Chưa có sản phẩm nào.") from **empty
because of a filter** ("Không tìm thấy sản phẩm phù hợp." + a clear-filter
button). They call for different actions from the user.

## Table markup

```tsx
<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
        <tr className="text-left font-semibold text-gray-700 dark:text-gray-300">
          <th className="px-6 py-4">Tên</th>
          <th className="px-6 py-4 text-right">Giá bán</th>
          <th className="px-6 py-4">Trạng thái</th>
          {showActionColumn && <th className="px-6 py-4 text-center">Thao tác</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.length === 0 ? (
          <tr>
            <td colSpan={colCount} className="px-6 py-12 text-center text-gray-500">
              Chưa có sản phẩm nào.
            </td>
          </tr>
        ) : rows.map((item) => (
          <tr key={item.publicId} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">…</tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

Rules:
- `key` is `publicId` — never the array index.
- `colSpan` on the empty row must match the visible column count, which changes
  with permissions. Compute `colCount` once.
- Numeric columns (quantity, price, total) are `text-right` and `tabular-nums`;
  money formatted with `Intl.NumberFormat('vi-VN')`.
- Status → `<Badge>`, not a hand-rolled span.
- Long text truncates (`max-w-[240px] truncate`) with a `title` attribute.
- Wrap the table in `overflow-x-auto`; on a POS product with 8+ columns, freeze
  nothing and let it scroll rather than shrinking the font.

## Row actions

```tsx
const { canEdit, canDelete } = usePermissions();
const showActionColumn = canEditItem || canDeleteItem;
```

Hide the whole column when the user can do neither. The resource string must
match the backend `PermissionResource` value exactly — import the enum from
`@/modules/permission/types/permissions` instead of typing `'products'`.

**Delete confirmation.** Existing screens use `window.confirm`, which is
acceptable and consistent — but never on a bulk action or a destructive
document void. Those need a real modal stating what will be affected
(`/skill:admin-form` has the modal recipe). Always name the row in the prompt:
`Xóa sản phẩm "${item.name}"?`.

Mutations are called from hooks, and the hook shows the toast — the table
component should not call `toast` itself.

## Pagination

```tsx
{totalPages > 1 && (
  <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
    <p className="text-sm text-gray-500">
      Hiển thị {rows.length} / {total} bản ghi
    </p>
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  </div>
)}
```

`Pagination` from `@/common/components/tables/Pagination` takes exactly
`currentPage`, `totalPages`, `onPageChange`. Derive
`totalPages = Math.max(1, Math.ceil(total / limit))` from the backend's
`{ total, page, limit, hasMore }` — never from `rows.length`.

## Bulk selection (only when asked)

Checkbox column with a header "select all" that reflects the **current page**
only, a sticky action bar showing the selected count, and an explicit
"bỏ chọn" action. Selection must clear on page/filter change or the user will
act on invisible rows.

## Performance

Do not memoize every cell. Do keep `rows` in a `useMemo`, keep the columns
array module-level, and avoid creating inline handler closures inside large
tables when the row count can exceed a few hundred — pass `item.publicId` to a
stable callback instead.
