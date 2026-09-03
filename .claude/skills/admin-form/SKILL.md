---
name: admin-form
description: The create/edit form and modal pattern for admin/ — react-hook-form wiring, validation mirroring the backend DTO, mapping server errors onto fields, submit/pending/disabled states, and accessible modal mechanics (Escape, backdrop, focus, scroll lock, z-index scale). Use for any "thêm / sửa / chi tiết" screen, dialog, or confirmation.
---

# Forms & modals

Reference implementations: `admin/src/modules/categories-blog/components/CategoriesBlogForm.tsx`
(react-hook-form) and `admin/src/modules/trainer/components/TrainerModal.tsx`
(modal shape). Load `/skill:ui-design-system` for control classes.

## react-hook-form or useState?

`react-hook-form` is a dependency but only two files use it; most screens hand-roll
`useState` + a `formErrors` `useMemo`. For anything past ~4 fields, use RHF —
POS forms (product with variants, purchase with line items) get unmanageable
otherwise, and the hand-rolled version re-renders the whole form on every
keystroke.

```tsx
const { register, handleSubmit, reset, setError, control, formState: { errors, isSubmitting } }
  = useForm<CreateProductInput>({ defaultValues: emptyProduct() });
```

Repeating line items (purchase/sale lines) → `useFieldArray`. Never model them
as a hand-managed array in `useState`.

## Validation must mirror the DTO

The backend runs `ValidationPipe` with `forbidNonWhitelisted`, so client and
server validation have to agree on the **field set**, not just the rules:

- a field in the form but not in the DTO → **400 on every save**
- a rule on the server but not the client → an avoidable round-trip
- a rule on the client but not the server → a hole; the API is the boundary

Open the DTO while writing the form. Mirror `@IsNotEmpty`, `@MaxLength`,
`@IsEmail`, numeric bounds, and any regex (slug rules, forbidden name
characters) as RHF rules with **Vietnamese messages matching the server's**.

Uniqueness (`slug đã tồn tại`, duplicate SKU) cannot be validated client-side
against a paged list — check it locally as a courtesy if the full list is
already loaded, but always handle the server's 409/400 as the real answer.

## Submitting

```tsx
const onSubmit = handleSubmit((values) => {
  const payload = { ...values, name: values.name.trim() };   // trim strings, Number() numerics
  if (editingId) {
    updateMutation.mutate({ publicId: editingId, body: payload }, { onSuccess: close });
    return;
  }
  createMutation.mutate(payload, { onSuccess: close });
});

const isPending = createMutation.isPending || updateMutation.isPending;
```

- Disable the submit button while `isPending` and show "Đang lưu..." — a
  double-submit on a purchase creates two stock movements.
- Toasts belong in the hook (`/skill:admin-module`), not here.
- `reset()` the form when the modal closes **and** when the edited record
  changes; a stale `defaultValues` silently saves the previous row's data.
- Send only changed fields on update where the DTO is a `PartialType`.

## Mapping backend errors onto fields

```tsx
onError: (error) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string; errors?: Record<string, string> } | undefined;
    if (payload?.errors) {
      Object.entries(payload.errors).forEach(([field, msg]) =>
        setError(field as keyof CreateProductInput, { message: translate(msg) }));
      return;
    }
    toast.error(payload?.message ?? 'Không thể lưu. Vui lòng thử lại.');
  }
}
```

Nest returns either a `message` string/array or a field-keyed `errors` object
(see `admin/src/auth/auth-api.ts` for the translation approach). Put the message
next to the offending field when the shape allows — a generic toast for a
per-field problem forces the user to guess.

Never swallow an error into a `console.error`; the user must see something.

## Modal mechanics

There is **no shared Modal component**; screens hand-roll the same div. Copy
this shape, and if you write it a third time, extract it to
`@/common/components/ui/modal/Modal.tsx`.

```tsx
if (!isOpen) return null;

return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="product-modal-title"
    onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-lg dark:bg-gray-dark">
      <h2 id="product-modal-title" className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      </h2>
      …
    </div>
  </div>
);
```

Required behaviour, most of which the existing modals are missing — add it to
new ones:

- **Escape closes** — a `useEffect` keydown listener, removed on unmount.
- **Backdrop click closes** via `onMouseDown` target check (using `onClick`
  closes the modal when a drag starts inside and ends on the backdrop).
- **Body scroll lock** while open (`document.body.style.overflow = 'hidden'`,
  restored in cleanup).
- **Focus** moves to the first field on open.
- **Do not close on backdrop/Escape while `isPending`**, or a dirty form
  disappears mid-save.
- Confirm before discarding a dirty form (`formState.isDirty`).

**z-index scale** — current values are inconsistent (50 / 100 / 150). Use:
`z-50` normal modal, `z-[60]` nested/confirm modal, `z-[70]` toasts. The tokens
`--z-index-*` in globals.css exist; prefer them if you touch a file that
already uses them.

## Field patterns

| Field | Approach |
|---|---|
| money | text input, `inputMode="decimal"`, format on blur with `Intl.NumberFormat('vi-VN')`, store a `number` |
| quantity | `inputMode="numeric"`, integer, clamp at 0 |
| select of a related resource | its own `useQuery`; show a loading/disabled state, never an empty select |
| image | upload via the existing `images` module first, then store the returned URL |
| slug | auto-derive from name while untouched (`isAutoSlug` flag), stop on manual edit — see `ServiceCategoriesAdminPage` |
| date | flatpickr styles are already themed in globals.css |
| rich text | the `SunEditor` wrapper |

Label every input (`<label htmlFor>`), mark required fields, and render the
error under the field in `text-theme-xs text-error-500`.

## Large forms

`BlogForm.tsx` is 1815 lines — do not use it as a size precedent. Split a big
form into sections as sibling components sharing one RHF `control` via
`useFormContext`, and keep the page component under ~300 lines.
