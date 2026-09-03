'use client';

import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import { FiFilter, FiMaximize, FiMinus, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { formatBillion, formatBillionShort } from '@/common/utils/format';
import {
  UNIT_FUND_LABELS,
  UNIT_STATUS_LABELS,
  type MasterPlanMap,
  type PlanMarker,
  type UnitFundType,
  type UnitStatus,
} from '../../../models/project-detail.model';

const FUND_TYPES = Object.keys(UNIT_FUND_LABELS) as UnitFundType[];

/** Mau cham trong chu thich - phai khop bien --pin cua .plan-pin--* */
const FUND_DOT_TONES: Record<UnitFundType, string> = {
  'doc-quyen': 'text-error-600',
  'an-cheo': 'text-[#b45309]',
  thuong: 'text-success-500',
};

/** Chuoi tu mock la an toan, nhung popup ghep bang HTML tho nen van phai thoat */
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ??
      char,
  );

const MapButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-card transition hover:border-brand-400 hover:text-brand-600"
  >
    {children}
  </button>
);

type FloorPlanTabProps = {
  planMap: MasterPlanMap;
  lockedPhaseName?: string;
};

const FloorPlanTab = ({ planMap, lockedPhaseName }: FloorPlanTabProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [funds, setFunds] = useState<UnitFundType[]>(FUND_TYPES);
  const [showPrice, setShowPrice] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [phaseName, setPhaseName] = useState<string | null>(null);
  const [status, setStatus] = useState<UnitStatus | null>(null);

  const phaseNames = useMemo(
    () => [...new Set(planMap.markers.map((marker) => marker.phaseName))],
    [planMap.markers],
  );

  const visibleMarkers = useMemo(
    () =>
      planMap.markers.filter((marker) => {
        if (!funds.includes(marker.fundType)) return false;
        if (phaseName && marker.phaseName !== phaseName) return false;
        if (status && marker.status !== status) return false;
        if (search.trim() && !marker.code.toLowerCase().includes(search.trim().toLowerCase()))
          return false;
        return true;
      }),
    [planMap.markers, funds, phaseName, status, search],
  );

  /** % tren anh -> toa do CRS.Simple (truc y cua Leaflet huong len tren) */
  const toLatLng = useCallback(
    (marker: PlanMarker): [number, number] => [
      planMap.height * (1 - marker.y / 100),
      planMap.width * (marker.x / 100),
    ],
    [planMap.height, planMap.width],
  );

  // ── Khoi tao ban do mot lan ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    // Leaflet doc `window` ngay khi nap nen phai import dong trong effect,
    // khong duoc import tinh o dau file (se vo khi Next render tren server).
    void (async () => {
      const leaflet = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      const L = leaflet.default ?? leaflet;
      leafletRef.current = L;

      const bounds: [[number, number], [number, number]] = [
        [0, 0],
        [planMap.height, planMap.width],
      ];

      map = L.map(containerRef.current, {
        crs: L.CRS.Simple,
        zoomControl: false,
        minZoom: -3,
        maxZoom: 2,
        // Phai la 0: moi bac zoom deu lam tron XUONG, nen voi bac 0.25 thi
        // fitBounds co the thu anh mat bang nho hon khung toi ~16% chieu dai
        // (con lai la hai dai xam hai ben). Zoom le cho anh vua khit khung.
        zoomSnap: 0,
        maxBoundsViscosity: 0.9,
      });

      L.imageOverlay(planMap.imageUrl, bounds, {
        attribution: 'RealtyHub',
      }).addTo(map);

      map.fitBounds(bounds);
      map.setMaxBounds(bounds);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setIsMapReady(true);

      
      const observer = new ResizeObserver(() => {
        map?.invalidateSize({ animate: false });
        map?.fitBounds(bounds);
      });
      observer.observe(containerRef.current);
      resizeObserverRef.current = observer;
    })();

    return () => {
      cancelled = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      map?.remove();
      mapRef.current = null;
      layerRef.current = null;
      setIsMapReady(false);
    };
  }, [planMap.imageUrl, planMap.height, planMap.width]);

  // ── Ve lai pin moi khi bo loc hoac cong tac Gia doi ──────────────────────
  useEffect(() => {
    const L = leafletRef.current;
    const layer = layerRef.current;
    if (!isMapReady || !L || !layer) return;

    layer.clearLayers();

    visibleMarkers.forEach((marker) => {
      // Ghim la diem neo 0x0 nam dung toa do, o gia nam trong <span>: xem
      // .plan-pin trong globals.css. Nho vay o gia rong theo do dai tung muc
      // gia, va Leaflet khong giat mat transform cua hieu ung phong to.
      const icon = L.divIcon({
        className: `plan-pin plan-pin--${marker.fundType}${showPrice ? '' : ' plan-pin--dot'}`,
        html: `<span>${showPrice ? escapeHtml(formatBillionShort(marker.price)) : ''}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      L.marker(toLatLng(marker), { icon, title: marker.code })
        .bindPopup(
          `<div style="min-width:180px">
            <p style="font-weight:700;color:#101828;margin-bottom:6px">${escapeHtml(marker.code)}</p>
            <p style="color:#475467;font-size:12px;line-height:1.7;margin:0">
              Phân khu: <strong>${escapeHtml(marker.phaseName)}</strong><br/>
              Loại hình: <strong>${escapeHtml(marker.propertyTypeLabel)}</strong><br/>
              Diện tích: <strong>${marker.landArea} m²</strong><br/>
              Giá: <strong>${escapeHtml(formatBillion(marker.price))}</strong><br/>
              Tình trạng: <strong>${escapeHtml(UNIT_STATUS_LABELS[marker.status])}</strong>
            </p>
          </div>`,
        )
        .addTo(layer);
    });
  }, [isMapReady, visibleMarkers, showPrice, toLatLng]);

  // ── Vao/ra toan man hinh: Leaflet phai do lai kich thuoc khung ───────────
  useEffect(() => {
    const onFullscreenChange = () => {
      window.setTimeout(() => mapRef.current?.invalidateSize(), 120);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Safari tren iPhone khong cho <div> vao toan man hinh - an nut di thay vi de
  // no bam khong len gi. Phai do o effect vi server khong co `document`.
  useEffect(() => {
    setCanFullscreen(
      document.fullscreenEnabled && typeof wrapperRef.current?.requestFullscreen === 'function',
    );
  }, []);

  const toggleFund = (fund: UnitFundType) =>
    setFunds((current) =>
      current.includes(fund) ? current.filter((item) => item !== fund) : [...current, fund],
    );

  /**
   * Ca hai ham deu tra ve Promise co the bi tu choi (trinh duyet chan, khong
   * phai thao tac cua nguoi dung...). `void` khong nuot duoc loi do - thieu
   * `catch` la co mot TypeError chua bat van ra console.
   */
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void wrapperRef.current?.requestFullscreen().catch(() => {});
  };

  /** Bay toi can dau tien khop tu khoa */
  const flyToFirstMatch = () => {
    const target = visibleMarkers[0];
    if (target) mapRef.current?.flyTo(toLatLng(target), 1, { duration: 0.6 });
  };

  const activeFilterCount = [phaseName, status].filter(Boolean).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
          Mặt bằng quỹ căn
        </h2>

        <button
          type="button"
          onClick={() => setIsFilterOpen((open) => !open)}
          aria-expanded={isFilterOpen}
          className={`flex h-10 items-center gap-2 rounded-md border px-4 text-theme-sm font-medium transition ${
            isFilterOpen || activeFilterCount > 0
              ? 'border-brand-400 bg-brand-50 text-brand-600'
              : 'border-gray-300 bg-white text-gray-700 hover:border-brand-400'
          }`}
        >
          <FiFilter aria-hidden />
          Bộ lọc
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isFilterOpen && (
        <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-25 p-4 sm:grid-cols-3">
          {!lockedPhaseName && (
            <label className="block">
              <span className="mb-1 block text-theme-xs font-medium text-gray-500">
                Phân khu
              </span>
              <select
                value={phaseName ?? ''}
                onChange={(event) => setPhaseName(event.target.value || null)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-theme-sm text-gray-700 outline-none transition focus:border-brand-400 focus:shadow-focus-ring"
              >
                <option value="">Tất cả</option>
                {phaseNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-theme-xs font-medium text-gray-500">
              Tình trạng
            </span>
            <select
              value={status ?? ''}
              onChange={(event) => setStatus((event.target.value || null) as UnitStatus | null)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-theme-sm text-gray-700 outline-none transition focus:border-brand-400 focus:shadow-focus-ring"
            >
              <option value="">Tất cả</option>
              {Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setPhaseName(null);
                setStatus(null);
              }}
              className="inline-flex items-center gap-1.5 text-theme-sm font-medium text-gray-600 transition hover:text-brand-600"
            >
              <FiX aria-hidden />
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Chu thich loai quy, bam de bat/tat tung nhom pin */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {FUND_TYPES.map((fund) => {
          const isOn = funds.includes(fund);

          return (
            <button
              key={fund}
              type="button"
              onClick={() => toggleFund(fund)}
              aria-pressed={isOn}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-theme-sm font-medium transition ${
                isOn
                  ? 'border-gray-300 bg-white text-gray-700 shadow-card'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              <span
                aria-hidden
                className={`text-base leading-none ${isOn ? FUND_DOT_TONES[fund] : 'text-gray-300'}`}
              >
                ●
              </span>
              {UNIT_FUND_LABELS[fund]}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setFunds(FUND_TYPES)}
          aria-label="Hiện tất cả loại quỹ"
          title="Hiện tất cả loại quỹ"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:border-brand-400 hover:text-brand-600"
        >
          <FiPlus aria-hidden />
        </button>
      </div>

      
      <div
        ref={wrapperRef}
        className="plan-map-shell relative isolate overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-card"
      >
        <div ref={containerRef} className="plan-map-canvas h-140 w-full sm:h-170" />

        {/* Dieu khien tu ve de bam dung thiet ke; Leaflet control mac dinh da tat */}
        <div className="absolute left-3 top-3 z-900 flex flex-col gap-2">
          <MapButton label="Phóng to" onClick={() => mapRef.current?.zoomIn()}>
            <FiPlus aria-hidden />
          </MapButton>
          <MapButton label="Thu nhỏ" onClick={() => mapRef.current?.zoomOut()}>
            <FiMinus aria-hidden />
          </MapButton>
          {canFullscreen && (
            <MapButton label="Toàn màn hình" onClick={toggleFullscreen}>
              <FiMaximize aria-hidden />
            </MapButton>
          )}

          <button
            type="button"
            onClick={() => setShowPrice((current) => !current)}
            aria-pressed={showPrice}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-theme-xs font-medium text-gray-700 shadow-card"
          >
            Giá
            <span
              aria-hidden
              className={`relative h-4 w-8 rounded-full transition ${
                showPrice ? 'bg-success-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                  showPrice ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </span>
          </button>
        </div>

        <div className="absolute right-3 top-3 z-900 flex items-start gap-2">
          {isSearchOpen && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                flyToFirstMatch();
              }}
            >
              <input
                autoFocus
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm mã căn..."
                aria-label="Tìm mã căn trên mặt bằng"
                className="h-9 w-44 rounded-md border border-gray-300 bg-white px-3 text-theme-sm text-gray-700 shadow-card outline-none focus:border-brand-400"
              />
            </form>
          )}

          <MapButton
            label={isSearchOpen ? 'Đóng tìm kiếm' : 'Tìm mã căn'}
            onClick={() => {
              setIsSearchOpen((open) => !open);
              if (isSearchOpen) setSearch('');
            }}
          >
            {isSearchOpen ? <FiX aria-hidden /> : <FiSearch aria-hidden />}
          </MapButton>

          <span
            aria-hidden
            className="flex h-9 w-9 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 shadow-card"
          >
            <span className="text-[9px] leading-none">▲</span>
            <span className="text-[10px] font-bold leading-none">N</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-theme-xs text-gray-400">
        Đang hiển thị {visibleMarkers.length}/{planMap.markers.length} căn trên mặt bằng. Bấm
        vào pin để xem chi tiết.
      </p>
    </div>
  );
};

export default FloorPlanTab;
