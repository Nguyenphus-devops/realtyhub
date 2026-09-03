"use client";

import { Fragment, useMemo, useState } from "react";
import { ShootingStarIcon } from "@/icons/index";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";
import { useAdminBanners } from "../hooks/useAdminBanners";
import type {
  AdminBanner,
  AdminCreateBannerInput,
  BannerMediaType,
} from "../models/banner.model";

const DEFAULT_PLACEMENT = "home_hero";

const resolveAdminMediaUrl = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const origin = base.replace(/\/api\/v\d+\/?$/i, "");
  if (src.startsWith("/")) return origin ? `${origin}${src}` : src;
  return src;
};

const emptyCreateForm = (): AdminCreateBannerInput => ({
  placement: DEFAULT_PLACEMENT,
  mediaType: "video",
  src: "",
  posterUrl: "",
  thumbnailUrl: "",
  alt: "",
  isActive: true,
});

const BannersAdminPage = () => {
  const [placementFilter, setPlacementFilter] = useState(DEFAULT_PLACEMENT);
  const [createForm, setCreateForm] =
    useState<AdminCreateBannerInput>(emptyCreateForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<AdminCreateBannerInput>>(
    {},
  );
  const { canCreate, canEdit, canDelete } = usePermissions();
  const canCreateBanner = canCreate(PermissionResource.IMAGE);
  const canEditBanner = canEdit(PermissionResource.IMAGE);
  const canDeleteBanner = canDelete(PermissionResource.IMAGE);
  const showActionColumn = canEditBanner || canDeleteBanner;

  const {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    reorderMutation,
  } = useAdminBanners(placementFilter);

  const sortedBanners = useMemo(() => {
    const rows = listQuery.data ?? [];
    return [...rows].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [listQuery.data]);

  const startEdit = (banner: AdminBanner) => {
    setEditingId(banner.publicId);
    setEditDraft({
      mediaType: banner.mediaType,
      src: banner.src,
      posterUrl: banner.posterUrl || "",
      thumbnailUrl: banner.thumbnailUrl || "",
      alt: banner.alt || "",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = (publicId: string) => {
    updateMutation.mutate(
      {
        publicId,
        placement: placementFilter,
        body: {
          mediaType: editDraft.mediaType,
          src: editDraft.src,
          posterUrl: editDraft.posterUrl,
          thumbnailUrl: editDraft.thumbnailUrl,
          alt: editDraft.alt,
          isActive: editDraft.isActive,
          sortOrder: editDraft.sortOrder,
        },
      },
      { onSuccess: () => cancelEdit() },
    );
  };

  const moveBanner = (index: number, delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= sortedBanners.length) return;
    const reordered = [...sortedBanners];
    const temp = reordered[index];
    reordered[index] = reordered[next] as AdminBanner;
    reordered[next] = temp as AdminBanner;
    reorderMutation.mutate({
      placement: placementFilter,
      orderedPublicIds: reordered.map((b) => b.publicId),
    });
  };

  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createMutation.mutate(
      {
        ...createForm,
        posterUrl: createForm.posterUrl || undefined,
        thumbnailUrl: createForm.thumbnailUrl || undefined,
        alt: createForm.alt || undefined,
      },
      { onSuccess: () => setCreateForm(emptyCreateForm()) },
    );
  };

  const previewSrc = (banner: AdminBanner): string => {
    const thumb =
      banner.mediaType === "video"
        ? banner.posterUrl || banner.thumbnailUrl || banner.src
        : banner.src;
    return resolveAdminMediaUrl(thumb);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ShootingStarIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Banner &amp; hero
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý slide trang chủ và các vị trí banner (placement).
            </p>
          </div>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">Placement</span>
          <input
            type="text"
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value.trim())}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900"
            placeholder="home_hero"
          />
        </label>
      </div>

      {listQuery.isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500" />
        </div>
      ) : listQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Không tải được danh sách banner. Đăng nhập lại hoặc kiểm tra API.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Xem nhanh</th>
                <th className="px-4 py-3 font-medium text-gray-700">Loại</th>
                <th className="px-4 py-3 font-medium text-gray-700">URL nội dung</th>
                <th className="px-4 py-3 font-medium text-gray-700">Hiển thị</th>
                <th className="px-4 py-3 font-medium text-gray-700">Thứ tự</th>
                {showActionColumn && (
                  <th className="px-4 py-3 font-medium text-gray-700">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedBanners.map((banner, index) => (
                <Fragment key={banner.publicId}>
                  <tr className="align-top">
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewSrc(banner)}
                        alt=""
                        className="h-16 w-28 rounded-md object-cover bg-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800">{banner.mediaType}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-600">
                      {editingId === banner.publicId ? (
                        <input
                          type="text"
                          value={editDraft.src ?? ""}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, src: e.target.value }))
                          }
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                        />
                      ) : (
                        banner.src
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === banner.publicId ? (
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(editDraft.isActive)}
                            onChange={(e) =>
                              setEditDraft((d) => ({
                                ...d,
                                isActive: e.target.checked,
                              }))
                            }
                          />
                          Active
                        </label>
                      ) : (
                        <span
                          className={
                            banner.isActive ? "text-emerald-600" : "text-gray-400"
                          }
                        >
                          {banner.isActive ? "Bật" : "Tắt"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === banner.publicId ? (
                        <input
                          type="number"
                          min={0}
                          value={editDraft.sortOrder ?? 0}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              sortOrder: Number(e.target.value),
                            }))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs"
                        />
                      ) : (
                        banner.sortOrder
                      )}
                    </td>
                    {showActionColumn && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                        {editingId === banner.publicId ? (
                          <>
                            {canEditBanner && (
                              <button
                                type="button"
                                onClick={() => saveEdit(banner.publicId)}
                                disabled={updateMutation.isPending}
                                className="rounded-lg bg-brand-500 px-2 py-1 text-xs text-white hover:bg-brand-600 disabled:opacity-50"
                              >
                                Lưu
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          canEditBanner && (
                            <button
                              type="button"
                              onClick={() => startEdit(banner)}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                            >
                              Sửa
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => moveBanner(index, -1)}
                          disabled={index === 0 || reorderMutation.isPending}
                          className="rounded-lg border border-gray-200 px-2 py-1 text-xs disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBanner(index, 1)}
                          disabled={
                            index === sortedBanners.length - 1 ||
                            reorderMutation.isPending
                          }
                          className="rounded-lg border border-gray-200 px-2 py-1 text-xs disabled:opacity-40"
                        >
                          ↓
                        </button>
                        {canDeleteBanner && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Xóa banner này? Hành động không hoàn tác.",
                                )
                              ) {
                                removeMutation.mutate({
                                  publicId: banner.publicId,
                                  placement: placementFilter,
                                });
                              }
                            }}
                            disabled={removeMutation.isPending}
                            className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        )}
                        </div>
                      </td>
                    )}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          {sortedBanners.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              Chưa có banner cho placement này. Thêm mới bên dưới.
            </p>
          )}
        </div>
      )}

      {canCreateBanner && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Thêm banner</h2>
          <form onSubmit={handleCreateSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Placement</span>
              <input
                required
                type="text"
                value={createForm.placement}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, placement: e.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Loại media</span>
              <select
                value={createForm.mediaType}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    mediaType: e.target.value as BannerMediaType,
                  }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
              >
                <option value="video">video (MP4 URL)</option>
                <option value="image">image</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-gray-600">URL video / ảnh (src)</span>
              <input
                required
                type="text"
                value={createForm.src}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, src: e.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
                placeholder="https://... hoặc /uploads/..."
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-gray-600">Poster (video) / tùy chọn</span>
              <input
                type="text"
                value={createForm.posterUrl ?? ""}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, posterUrl: e.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-gray-600">Thumbnail</span>
              <input
                type="text"
                value={createForm.thumbnailUrl ?? ""}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-gray-600">Alt text</span>
              <input
                type="text"
                value={createForm.alt ?? ""}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, alt: e.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={createForm.isActive ?? true}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              <span>Hiển thị (active)</span>
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {createMutation.isPending ? "Đang thêm…" : "Thêm banner"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default BannersAdminPage;
