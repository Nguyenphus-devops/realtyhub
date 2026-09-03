'use client';

import { useState, type FormEvent } from 'react';
import {
  FiBriefcase,
  FiHeart,
  FiHome,
  FiList,
  FiMap,
  FiMapPin,
  FiSearch,
  FiSliders,
  FiTag,
} from 'react-icons/fi';
import FilterSelect from '@/common/components/FilterSelect';
import ShineSweep from '@/common/components/ShineSweep';
import ProjectFilterDrawer from './ProjectFilterDrawer';
import {
  STATUS_LABELS,
  type FilterOption,
  type ProjectFilterOptions,
} from '../models/project.model';

/**
 * Trang thai bo loc duoi dang phang, doc thang tu URL.
 *
 * Deu la kieu nguyen thuy chu khong phai union hep cua model: URL co the chua
 * bat cu chuoi nao, viec ep ve dung kieu do ProjectListPage lam khi dung
 * ProjectQuery. Component chi hien thi va bao "nguoi dung vua chon gi".
 */
export type ProjectFilterValues = {
  search: string;
  developerId: string | null;
  regionId: string | null;
  propertyType: string | null;
  status: string | null;
  segment: string | null;
  priceMin: number | null;
  priceMax: number | null;
  areaMax: number | null;
  bedrooms: number | null;
  handoverBefore: number | null;
  amenityTags: string[];
  viewpoints: string[];
  legal: string | null;
  hasDiscount: boolean;
  hasBankSupport: boolean;
  postedWithinDays: number | null;
};

/** Danh sach the / ban do - hai cach nhin cung mot ket qua loc */
export type ProjectViewMode = 'danh-sach' | 'ban-do';

/** Loc nhanh mot cham: dung lai chinh o loc "Trang thai" chu khong them tham so moi */
const QUICK_STATUS = 'dang-mo-ban';

/** Vien bo tron dung chung cho moi chip tren hang loc */
const CHIP_BASE =
  'flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-theme-sm font-medium transition';

const CHIP_ON = 'border-brand-500 bg-brand-50 text-brand-700';
const CHIP_OFF =
  'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50';

/** Cac o loc duoc dua len hang chip cho bam nhanh - phan con lai nam trong bang loc */
type ChipSelectKey = 'regionId' | 'propertyType' | 'developerId' | 'status';

type ProjectFilterBarProps = {
  values: ProjectFilterValues;
  options: ProjectFilterOptions;
  isLoadingOptions: boolean;
  /** So o loc dang bat - hien tren huy hieu nut "Bo loc" */
  activeCount: number;
  /** So du an khop bo loc hien tai - hien tren nut dong bang loc */
  resultCount: number;
  view: ProjectViewMode;
  onViewChange: (view: ProjectViewMode) => void;
  onClearAll: () => void;
  /** Ap tu khoa ngay lap tuc, bo qua do tre go phim */
  onSubmitSearch: () => void;
  /**
   * Nhan mot lan NHIEU o loc cung luc.
   *
   * Khong tach thanh onChange(key, value) goi lien tiep: moi lan goi deu dung
   * URL hien tai lam goc, nen hai lan goi trong cung mot su kien se de lan sau
   * ghi de lan truoc (thanh truot dat ca can duoi lan can tren mot luc).
   */
  onChange: (updates: Partial<ProjectFilterValues>) => void;
};

/** Goi onChange cho dung mot o loc - phan lon truong hop la the nay */
export const setOne = <K extends keyof ProjectFilterValues>(
  onChange: (updates: Partial<ProjectFilterValues>) => void,
  key: K,
  value: ProjectFilterValues[K],
) => onChange({ [key]: value } as Partial<ProjectFilterValues>);

const VIEWS: { value: ProjectViewMode; label: string; icon: React.ReactNode }[] = [
  { value: 'danh-sach', label: 'Danh sách', icon: <FiList /> },
  { value: 'ban-do', label: 'Bản đồ', icon: <FiMap /> },
];

const ProjectFilterBar = ({
  values,
  options,
  isLoadingOptions,
  activeCount,
  resultCount,
  view,
  onViewChange,
  onClearAll,
  onSubmitSearch,
  onChange,
}: ProjectFilterBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Chua co API luu tim kiem - tam giu trang thai trong phien de nut co phan hoi
  const [isSearchSaved, setIsSearchSaved] = useState(false);

  const chipSelects: {
    key: ChipSelectKey;
    label: string;
    icon: React.ReactNode;
    options: FilterOption[];
  }[] = [
    { key: 'regionId', label: 'Khu vực', icon: <FiMapPin />, options: options.regions },
    {
      key: 'propertyType',
      label: 'Loại hình',
      icon: <FiHome />,
      options: options.propertyTypes,
    },
    {
      key: 'developerId',
      label: 'Chủ đầu tư',
      icon: <FiBriefcase />,
      options: options.developers,
    },
    { key: 'status', label: 'Trạng thái', icon: <FiTag />, options: options.statuses },
  ];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmitSearch();
  };

  const isQuickStatusOn = values.status === QUICK_STATUS;

  return (
    <>
      {/* ── Hang 1: o tim kiem - luu tim kiem - doi cach xem ─────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        {/* focus-within de ca vien vien sang khi con tro nam trong o nhap -
            o nhap khong co vien rieng nen phai lam o day. */}
        <form
          onSubmit={submit}
          role="search"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pl-5 pr-2 shadow-card transition focus-within:border-brand-300 focus-within:shadow-panel lg:max-w-2xl"
        >
          <input
            type="search"
            value={values.search}
            onChange={(event) => setOne(onChange, 'search', event.target.value)}
            placeholder="Tìm theo tên dự án, khu vực, chủ đầu tư..."
            aria-label="Tìm kiếm dự án"
            className="h-9 min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-brand-50 hover:text-brand-600"
          >
            <FiSearch aria-hidden className="text-lg" />
          </button>
        </form>

        {/* lg:contents tha hai nut nay thanh phan tu truc tiep cua hang tren,
            de toggle day duoc ra sat mep phai bang ml-auto.
            flex-wrap la phao cuu sinh cho may rat hep (<=320px): thay vi day
            nhau tran ra ngoai man hinh thi toggle tu xuong dong. */}
        <div className="flex flex-wrap items-center gap-3 lg:contents">
          <button
            type="button"
            onClick={() => setIsSearchSaved((saved) => !saved)}
            aria-pressed={isSearchSaved}
            className="brand-gradient group relative flex h-12 shrink-0 items-center overflow-hidden rounded-full px-4 text-theme-sm font-bold text-white sm:px-5 shadow-[0_4px_16px_-4px_rgba(15,111,209,0.75)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FiHeart
                aria-hidden
                className={`text-base ${isSearchSaved ? 'fill-current' : ''}`}
              />
              {/* Man hinh hep chi de lai icon: hai nut nay cong lai 406px, khong
                  vua 358px con trong cua may 390px */}
              <span className="hidden sm:inline">
                {isSearchSaved ? 'Đã lưu' : 'Lưu tìm kiếm'}
              </span>
            </span>
            <ShineSweep />
          </button>

          <div
            role="group"
            aria-label="Cách xem danh sách"
            className="ml-auto flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-100 p-1"
          >
            {VIEWS.map((item) => {
              const isActive = view === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  // Bam lai nut dang bat thi tat di, ve lai danh sach - nen bam
                  // "Ban do" lan hai la dong ban do. Rieng "Danh sach" da la
                  // che do mac dinh nen bam lai khong doi gi.
                  onClick={() => onViewChange(isActive ? 'danh-sach' : item.value)}
                  aria-pressed={isActive}
                  className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-theme-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-card'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span aria-hidden className="text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Hang 2: chip loc. Tran ngang tren mobile nen cho cuon ngang ───── */}
      <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          aria-expanded={isFilterOpen}
          className={`${CHIP_BASE} ${activeCount > 0 ? CHIP_ON : CHIP_OFF}`}
        >
          <FiSliders aria-hidden className="text-base" />
          Bộ lọc
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <span aria-hidden className="h-6 w-px shrink-0 bg-gray-200" />

        {chipSelects.map((config) => (
          <FilterSelect
            key={config.key}
            variant="chip"
            label={config.label}
            icon={config.icon}
            value={values[config.key]}
            options={config.options}
            isLoading={isLoadingOptions}
            onChange={(next) => setOne(onChange, config.key, next)}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            setOne(onChange, 'status', isQuickStatusOn ? null : QUICK_STATUS)
          }
          aria-pressed={isQuickStatusOn}
          className={`${CHIP_BASE} ${isQuickStatusOn ? CHIP_ON : CHIP_OFF}`}
        >
          {STATUS_LABELS[QUICK_STATUS]}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="shrink-0 whitespace-nowrap px-2 text-theme-sm font-medium text-gray-500 underline underline-offset-2 transition hover:text-error-600"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <ProjectFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        values={values}
        options={options}
        isLoadingOptions={isLoadingOptions}
        activeCount={activeCount}
        resultCount={resultCount}
        onClearAll={onClearAll}
        onChange={onChange}
      />
    </>
  );
};

export default ProjectFilterBar;
