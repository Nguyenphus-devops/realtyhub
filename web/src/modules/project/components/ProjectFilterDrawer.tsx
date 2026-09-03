'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { FiChevronDown, FiSliders, FiX } from 'react-icons/fi';
import ChoiceChipGroup from '@/common/components/ChoiceChipGroup';
import FilterSelect from '@/common/components/FilterSelect';
import SegmentedControl, {
  type SegmentedOption,
} from '@/common/components/SegmentedControl';
import RangeSliderField from '@/common/components/RangeSliderField';
import {
  AREA_LIMIT,
  AREA_STEP,
  BEDROOM_STEPS,
  POSTED_WITHIN_OPTIONS,
  PRICE_LIMIT,
  PRICE_SCALE,
  PRICE_STEP,
  formatPriceShort,
  type ProjectFilterOptions,
} from '../models/project.model';
import { setOne, type ProjectFilterValues } from './ProjectFilterBar';

type ProjectFilterDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  values: ProjectFilterValues;
  options: ProjectFilterOptions;
  isLoadingOptions: boolean;
  activeCount: number;
  /** So du an khop bo loc hien tai - hien tren nut dong bang loc */
  resultCount: number;
  onClearAll: () => void;
  onChange: (updates: Partial<ProjectFilterValues>) => void;
};

/** Them dong "Tat ca" vao dau mot nhom nut chon mot */
const withAll = (options: { value: string; label: string }[]): SegmentedOption[] => [
  { value: null, label: 'Tất cả' },
  ...options,
];

/**
 * Mot nhom loc thu gon duoc.
 *
 * Mo san mac dinh: nguoi dung mo bang loc la de loc, bat ho phai bam mo tung
 * nhom la them mot buoc thua. Thu lai chi de gon bot khi da cuon xa.
 */
const FilterGroup = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="border-b border-gray-100 px-5 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <FiChevronDown
          aria-hidden
          className={`shrink-0 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  );
};

/** Nhan nho dat tren mot o dieu khien trong nhom */
const FieldLabel = ({ children }: { children: ReactNode }) => (
  <span className="mb-1.5 block text-theme-xs font-medium text-gray-500">
    {children}
  </span>
);

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-theme-sm text-gray-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4.5 w-4.5 shrink-0 accent-brand-500"
    />
    {label}
  </label>
);

const ProjectFilterDrawer = ({
  isOpen,
  onClose,
  values,
  options,
  isLoadingOptions,
  activeCount,
  resultCount,
  onClearAll,
  onChange,
}: ProjectFilterDrawerProps) => {
  // Khoa cuon nen va cho Escape dong lai. FilterSelect bat Escape o pha
  // capture nen menu dang mo se "an" phim nay - Escape thu nhat dong menu,
  // thu hai moi dong bang loc.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = <K extends keyof ProjectFilterValues>(
    key: K,
    value: ProjectFilterValues[K],
  ) => setOne(onChange, key, value);

  /** Bat/tat mot muc trong nhom chon nhieu */
  const toggle = (key: 'amenityTags' | 'viewpoints', value: string) => {
    const current = values[key];
    set(
      key,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const yearOptions = options.handoverYears.map((year) => ({
    value: String(year),
    label: `Trước ${year + 1}`,
  }));

  return (
    <div className="fixed inset-0 z-1050">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40"
      />

      {/* Duoi sm chiem tron man hinh, tu sm tro len la ngan keo ben phai */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bộ lọc dự án"
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-panel sm:max-w-[27rem]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <FiSliders aria-hidden className="text-brand-500" />
            Bộ lọc
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
          >
            <FiX aria-hidden className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FilterGroup title="Khoảng giá">
            <RangeSliderField
              label="Khoảng giá"
              limit={PRICE_LIMIT}
              step={PRICE_STEP}
              scale={PRICE_SCALE}
              unit="tỷ"
              min={values.priceMin}
              max={values.priceMax}
              format={formatPriceShort}
              onChange={(min, max) => {
                onChange({ priceMin: min, priceMax: max });
              }}
            />

            <div className="space-y-2 pt-1">
              <Checkbox
                label="Đang có chính sách chiết khấu"
                checked={values.hasDiscount}
                onChange={(checked) => set('hasDiscount', checked)}
              />
              <Checkbox
                label="Có ngân hàng hỗ trợ vay"
                checked={values.hasBankSupport}
                onChange={(checked) => set('hasBankSupport', checked)}
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Phòng ngủ">
            <SegmentedControl
              label="Số phòng ngủ"
              value={values.bedrooms === null ? null : String(values.bedrooms)}
              options={withAll(
                BEDROOM_STEPS.map((count) => ({
                  value: String(count),
                  label: count === 5 ? '5+' : String(count),
                })),
              )}
              onChange={(next) => set('bedrooms', next === null ? null : Number(next))}
            />
          </FilterGroup>

          <FilterGroup title="Loại hình">
            {/* Luoi o vuong thay vi o xo xuong: chi 6 lua chon va deu la khai
                niem quen thuoc, bay het ra nhanh hon mot lan bam mo */}
            <div className="grid grid-cols-3 gap-2">
              {withAll(options.propertyTypes).map((option) => {
                const isActive = values.propertyType === option.value;

                return (
                  <button
                    key={option.value ?? '__all__'}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => set('propertyType', option.value)}
                    className={`flex h-16 items-center justify-center rounded-lg border px-2 text-center text-theme-sm transition ${
                      isActive
                        ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup title="Thông tin mở bán">
            <div>
              <FieldLabel>Trạng thái</FieldLabel>
              <SegmentedControl
                label="Trạng thái mở bán"
                value={values.status}
                options={withAll(options.statuses)}
                onChange={(next) => set('status', next)}
                wrap
              />
            </div>

            <div>
              <FieldLabel>Phân khúc</FieldLabel>
              <SegmentedControl
                label="Phân khúc dự án"
                value={values.segment}
                options={withAll(options.segments)}
                onChange={(next) => set('segment', next)}
              />
            </div>

            <div>
              <FieldLabel>Thời gian đăng</FieldLabel>
              <FilterSelect
                label="Bất kỳ lúc nào"
                resetLabel="Bất kỳ lúc nào"
                value={
                  values.postedWithinDays === null
                    ? null
                    : String(values.postedWithinDays)
                }
                options={POSTED_WITHIN_OPTIONS.map((option) => ({
                  value: String(option.value),
                  label: option.label,
                }))}
                className="w-full"
                onChange={(next) =>
                  set('postedWithinDays', next === null ? null : Number(next))
                }
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Thông tin dự án">
            <div>
              <FieldLabel>Diện tích</FieldLabel>
              <RangeSliderField
                singleThumb
                label="Diện tích tối đa"
                limit={AREA_LIMIT}
                step={AREA_STEP}
                unit="m²"
                min={null}
                max={values.areaMax}
                format={(value) => `${value} m²`}
                onChange={(_, next) => set('areaMax', next)}
              />
            </div>

            <div>
              <FieldLabel>Năm bàn giao</FieldLabel>
              <FilterSelect
                label="Bất kỳ năm nào"
                resetLabel="Bất kỳ năm nào"
                value={
                  values.handoverBefore === null ? null : String(values.handoverBefore)
                }
                options={yearOptions}
                isLoading={isLoadingOptions}
                className="w-full"
                onChange={(next) =>
                  set('handoverBefore', next === null ? null : Number(next))
                }
              />
            </div>

            <div>
              <FieldLabel>Pháp lý</FieldLabel>
              <SegmentedControl
                label="Tình trạng pháp lý"
                value={values.legal}
                options={withAll(options.legals)}
                onChange={(next) => set('legal', next)}
                wrap
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Chủ đầu tư & khu vực">
            <div>
              <FieldLabel>Chủ đầu tư</FieldLabel>
              <FilterSelect
                label="Tất cả chủ đầu tư"
                value={values.developerId}
                options={options.developers}
                isLoading={isLoadingOptions}
                className="w-full"
                onChange={(next) => set('developerId', next)}
              />
            </div>

            <div>
              <FieldLabel>Khu vực</FieldLabel>
              <FilterSelect
                label="Tất cả khu vực"
                value={values.regionId}
                options={options.regions}
                isLoading={isLoadingOptions}
                className="w-full"
                onChange={(next) => set('regionId', next)}
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Tiện ích nội khu">
            <ChoiceChipGroup
              label="Tiện ích nội khu"
              options={options.amenityTags}
              values={values.amenityTags}
              onToggle={(value) => toggle('amenityTags', value)}
            />
            <p className="text-theme-xs text-gray-400">
              Dự án phải có đủ tất cả tiện ích được chọn.
            </p>
          </FilterGroup>

          <FilterGroup title="Hướng nhìn">
            <ChoiceChipGroup
              label="Hướng nhìn"
              options={options.viewpoints}
              values={values.viewpoints}
              onToggle={(value) => toggle('viewpoints', value)}
            />
            <p className="text-theme-xs text-gray-400">
              Chỉ cần khớp một trong các hướng nhìn được chọn.
            </p>
          </FilterGroup>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClearAll}
            disabled={activeCount === 0}
            className="text-theme-sm font-medium text-gray-600 underline underline-offset-2 transition hover:text-error-600 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
          >
            Xóa tất cả
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-full bg-brand-500 text-theme-sm font-bold text-white transition hover:bg-brand-600"
          >
            Xem {resultCount} dự án
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilterDrawer;
