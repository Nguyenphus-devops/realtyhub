'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker, TileLayer } from 'leaflet';
import { FiChevronRight, FiLayers, FiMinus, FiPlus } from 'react-icons/fi';
import {
  TbArrowsMaximize,
  TbBuildingCommunity,
  TbCalculator,
  TbCalendarEvent,
  TbCurrencyDong,
  TbMapPin,
  TbRulerMeasure,
  TbTag,
} from 'react-icons/tb';
import ProjectCard from './ProjectCard';
import { useFavorites } from '../hooks/useFavorites';
import {
  PROPERTY_TYPE_LABELS,
  STATUS_LABELS,
  formatPriceShort,
  type Project,
  type ProjectPropertyType,
  type ProjectStatus,
} from '../models/project.model';

/**
 * Hai lop nen cua ban do.
 *
 * Ca hai deu la dich vu mien phi khong can khoa API, du cho ban demo. Len that
 * voi luu luong lon thi phai doi sang nha cung cap co hop dong - chi thay URL
 * o day, khong cham gi den phan con lai.
 */
const BASEMAPS = {
  'ban-do': {
    label: 'Bản đồ',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  },
  've-tinh': {
    label: 'Vệ tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Ảnh vệ tinh &copy; Esri',
    maxZoom: 18,
  },
} as const;

type BasemapKey = keyof typeof BASEMAPS;

/**
 * Cach ghim tu gioi thieu minh tren ban do.
 *
 * Moi che do deu doc tu du lieu that cua du an - khong co nut nao chi de trang
 * tri. `text` tra ve chu hien tren ghim (bo trong = ghim cham tron), `tone` tra
 * ve so mau trong bang .map-pin--cN cua globals.css.
 */
type PinMode = {
  key: string;
  label: string;
  icon: React.ReactNode;
  text?: (project: Project) => string;
  tone?: (project: Project) => number;
  /** Chu thich mau, hien o goc duoi trai ban do */
  legend?: { label: string; tone: number }[];
};

const PROPERTY_TONE: Record<ProjectPropertyType, number> = {
  'can-ho': 1,
  'biet-thu': 2,
  'nha-pho': 3,
  shophouse: 4,
  'dat-nen': 5,
};

const STATUS_TONE: Record<ProjectStatus, number> = {
  'dang-mo-ban': 3,
  'sap-mo-ban': 1,
  'da-ban-giao': 5,
};

const toLegend = <K extends string>(
  labels: Record<K, string>,
  tones: Record<K, number>,
) => (Object.keys(labels) as K[]).map((key) => ({ label: labels[key], tone: tones[key] }));

const PIN_MODES: PinMode[] = [
  { key: 'mac-dinh', label: 'Mặc định', icon: <TbMapPin /> },
  {
    key: 'gia-ban',
    label: 'Giá bán',
    icon: <TbCurrencyDong />,
    text: (project) => formatPriceShort(project.priceFrom),
  },
  {
    key: 'gia-m2',
    label: 'Giá / m²',
    icon: <TbCalculator />,
    text: (project) =>
      `${Math.round(project.priceFrom / project.areaFrom / 1_000_000)} tr/m²`,
  },
  {
    key: 'dien-tich',
    label: 'Diện tích',
    icon: <TbRulerMeasure />,
    text: (project) => `${project.areaFrom} m²`,
  },
  {
    key: 'quy-mo',
    label: 'Quy mô',
    icon: <TbArrowsMaximize />,
    text: (project) => `${project.scaleHa} ha`,
  },
  {
    key: 'nam-ban-giao',
    label: 'Năm bàn giao',
    icon: <TbCalendarEvent />,
    text: (project) => String(project.handoverYear),
  },
  {
    key: 'loai-hinh',
    label: 'Loại hình',
    icon: <TbBuildingCommunity />,
    tone: (project) => PROPERTY_TONE[project.propertyType],
    legend: toLegend(PROPERTY_TYPE_LABELS, PROPERTY_TONE),
  },
  {
    key: 'trang-thai',
    label: 'Trạng thái',
    icon: <TbTag />,
    tone: (project) => STATUS_TONE[project.status],
    legend: toLegend(STATUS_LABELS, STATUS_TONE),
  },
];

/** Toan Viet Nam - dung khi bo loc khong con du an nao de canh khung theo */
const VIETNAM_CENTER: [number, number] = [16.0, 107.5];
const VIETNAM_ZOOM = 5;

/** Chen chuoi vao HTML tho cua popup nen phai tu chan the */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

type ProjectMapViewProps = {
  projects: Project[];
  /** Hien khung xuong khi dang tai lan dau */
  isLoading: boolean;
};

/**
 * Che do xem ban do: danh sach ben trai, ban do dinh sat mep phai man hinh.
 *
 * Hai ben noi nhau qua `activeId`: ro chuot len the thi ghim tuong ung phong
 * to, bam vao ghim thi the duoc keo vao vung nhin va popup mo ra.
 */
const ProjectMapView = ({ projects, isLoading }: ProjectMapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const tileRef = useRef<TileLayer | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const stripRef = useRef<HTMLDivElement>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [basemap, setBasemap] = useState<BasemapKey>('ban-do');
  const [modeKey, setModeKey] = useState(PIN_MODES[0].key);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { favorites } = useFavorites();
  const mode = PIN_MODES.find((item) => item.key === modeKey) ?? PIN_MODES[0];

  /** Chi ve lai ghim khi TAP du an doi, khong phai moi lan ro chuot */
  const projectKey = projects.map((project) => project.publicId).join(',');

  // ── Khoi tao ban do mot lan ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    const markers = markersRef.current;

    // Leaflet doc `window` ngay khi nap nen phai import dong trong effect,
    // khong duoc import tinh o dau file (se vo khi Next render tren server).
    void (async () => {
      const leaflet = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      const L = leaflet.default ?? leaflet;
      leafletRef.current = L;

      map = L.map(containerRef.current, {
        center: VIETNAM_CENTER,
        zoom: VIETNAM_ZOOM,
        // Dieu khien tu ve o goc duoi phai cho bam dung thiet ke
        zoomControl: false,
        // Bo tien to "Leaflet |" - tren dien thoai dong ghi chu dai gan het
        // be ngang ban do. Nguon ban do van duoc ghi day du.
        attributionControl: false,
      });

      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      mapRef.current = map;
      setIsMapReady(true);
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      tileRef.current = null;
      markers.clear();
      setIsMapReady(false);
    };
  }, []);

  // Khung ban do doi kich thuoc (xoay may, doi cach xem) thi Leaflet phai do
  // lai, neu khong ghim se lech khoi nen.
  useEffect(() => {
    const container = containerRef.current;
    if (!isMapReady || !container) return;

    const observer = new ResizeObserver(() => mapRef.current?.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [isMapReady]);

  // ── Doi lop nen ──────────────────────────────────────────────────────────
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!isMapReady || !L || !map) return;

    const config = BASEMAPS[basemap];
    const layer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);

    // Go lop cu SAU khi lop moi da gan vao, neu khong ban do chop mot mang trong
    tileRef.current?.remove();
    tileRef.current = layer;
  }, [isMapReady, basemap]);

  // ── Ve lai ghim khi tap du an hoac cach ghim doi ─────────────────────────
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!isMapReady || !L || !map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    projects.forEach((project) => {
      const text = mode.text?.(project);
      const tone = mode.tone?.(project);
      const className = ['map-pin', text && 'map-pin--label', tone && `map-pin--c${tone}`]
        .filter(Boolean)
        .join(' ');

      const marker = L.marker([project.latitude, project.longitude], {
        // Ca hai loai ghim deu ve phan nhin thay bang <span> ben trong, va
        // deu ghi de iconSize/iconAnchor thanh undefined. Ly do:
        //  - L.divIcon co san mac dinh iconSize [12,12]; bo trong thi Leaflet
        //    van gan width/height inline, o chu khong co dan duoc theo chu.
        //  - Leaflet ghi transform inline len the ghim, nen phan phong to khi
        //    ro chuot phai nam o <span>, khong dat tren the duoc.
        // De undefined thi the ghim la diem neo 0x0 dung toa do, <span> tu keo
        // ve giua - o chu dai ngan the nao cung can dung ghim.
        icon: L.divIcon({
          className,
          html: `<span>${text ? escapeHtml(text) : ''}</span>`,
          iconSize: undefined,
          iconAnchor: undefined,
        }),
        title: project.name,
      })
        .bindPopup(
          `<div style="min-width:190px">
            <p style="font-weight:700;color:#101828;margin-bottom:6px">${escapeHtml(project.name)}</p>
            <p style="color:#475467;font-size:12px;line-height:1.7;margin:0 0 8px">
              Giá từ <strong>${escapeHtml(formatPriceShort(project.priceFrom))}</strong><br/>
              Diện tích <strong>${project.areaFrom}–${project.areaTo} m²</strong><br/>
              ${escapeHtml(project.address)}
            </p>
            <a href="${escapeHtml(project.detailUrl)}" style="color:#0f6fd1;font-weight:600;font-size:12px">Xem chi tiết →</a>
          </div>`,
        )
        .on('click', () => setActiveId(project.publicId))
        .addTo(map);

      markersRef.current.set(project.publicId, marker);
    });

    if (projects.length > 0) {
      map.fitBounds(
        projects.map((project) => [project.latitude, project.longitude]),
        { padding: [56, 56], maxZoom: 13 },
      );
    } else {
      map.setView(VIETNAM_CENTER, VIETNAM_ZOOM);
    }
    // projectKey thay cho `projects`: mang la tham chieu moi moi lan render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, projectKey, modeKey]);

  // ── To dam ghim cua du an dang tro toi / da luu ──────────────────────────
  useEffect(() => {
    if (!isMapReady) return;

    // favorites la mang { publicId, savedAt } nen phai rut publicId ra truoc
    const favoriteIds = new Set(favorites.map((entry) => entry.publicId));

    markersRef.current.forEach((marker, publicId) => {
      const element = marker.getElement();
      if (!element) return;
      element.classList.toggle('map-pin--active', publicId === activeId);
      element.classList.toggle('map-pin--favorite', favoriteIds.has(publicId));
    });
  }, [isMapReady, activeId, favorites, projectKey, modeKey]);

  // Bam vao ghim thi keo dung the do vao vung nhin cua cot ben trai
  useEffect(() => {
    if (!activeId) return;
    cardsRef.current
      .get(activeId)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* ── Ban do: dinh theo man hinh, tran sat mep phai ────────────────── */}
      {/* 65px la chieu cao header dinh - ban do bat dau ngay duoi no va choan
          het phan con lai cua man hinh.

          `top` phai la class chu khong duoc dat inline: inline thi no ap dung o
          MOI be ngang, ma truoc day the nay con mang class `relative` nen tren
          dien thoai bi day xuong 65px, chua ra mot vet trang ngay tren ban do.
          Dung `sticky` luon (thay `relative`) - sticky cung tao khung cho cac
          lop phu dat tuyet doi ben trong. */}
      <div className="sticky top-[65px] order-1 h-[calc(100dvh-65px)] lg:order-2 lg:h-[calc(100vh-65px)]">
        <div ref={containerRef} className="h-full w-full" />

        {/* Dai icon chon cach ghim tu gioi thieu minh - cuon ngang khi hep */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-500 p-3">
          <div className="pointer-events-auto flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white shadow-panel">
            <button
              type="button"
              onClick={() =>
                setBasemap((current) => (current === 'ban-do' ? 've-tinh' : 'ban-do'))
              }
              aria-label={`Lớp nền đang là ${BASEMAPS[basemap].label}, bấm để đổi`}
              className="flex w-18 shrink-0 flex-col items-center justify-center gap-1 border-r border-gray-200 bg-gray-50 px-2 py-2 text-gray-800 transition hover:bg-gray-100"
            >
              <FiLayers aria-hidden className="text-lg" />
              <span className="text-[11px] font-semibold leading-none">
                {BASEMAPS[basemap].label}
              </span>
            </button>

            <div
              ref={stripRef}
              className="no-scrollbar flex flex-1 items-stretch overflow-x-auto scroll-smooth"
            >
              {PIN_MODES.map((item) => {
                const isActive = item.key === modeKey;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setModeKey(item.key)}
                    aria-pressed={isActive}
                    className={`flex w-20 shrink-0 flex-col items-center justify-center gap-1 px-2 py-2 transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span aria-hidden className="text-lg">
                      {item.icon}
                    </span>
                    <span className="text-center text-[11px] font-medium leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => stripRef.current?.scrollBy({ left: 200 })}
              aria-label="Xem thêm lựa chọn"
              className="flex w-9 shrink-0 items-center justify-center border-l border-gray-200 text-gray-500 transition hover:bg-gray-50"
            >
              <FiChevronRight aria-hidden />
            </button>
          </div>
        </div>

        {/* Chu thich mau - chi hien o cac che do to mau theo nhom */}
        {mode.legend && (
          <div className="absolute bottom-6 left-3 z-500 rounded-lg border border-gray-200 bg-white/95 p-3 shadow-card">
            <p className="mb-2 text-theme-xs font-semibold text-gray-700">{mode.label}</p>
            <ul className="space-y-1.5">
              {mode.legend.map((entry) => (
                <li
                  key={entry.label}
                  className="flex items-center gap-2 text-theme-xs text-gray-600"
                >
                  <span
                    aria-hidden
                    className={`h-3 w-3 shrink-0 rounded-full border-2 border-white shadow-card map-pin--c${entry.tone}`}
                  />
                  {entry.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Phong to / thu nho - goc duoi phai, giong mau */}
        <div className="absolute bottom-6 right-3 z-500 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Phóng to"
            className="flex h-9 w-9 items-center justify-center text-gray-700 transition hover:bg-gray-50"
          >
            <FiPlus aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Thu nhỏ"
            className="flex h-9 w-9 items-center justify-center border-t border-gray-200 text-gray-700 transition hover:bg-gray-50"
          >
            <FiMinus aria-hidden />
          </button>
        </div>

        {projects.length === 0 && !isLoading && (
          <p className="absolute inset-x-6 top-1/2 z-500 -translate-y-1/2 rounded-lg bg-white/95 px-4 py-3 text-center text-theme-sm text-gray-600 shadow-panel">
            Không có dự án nào khớp bộ lọc để hiển thị trên bản đồ.
          </p>
        )}
      </div>

      {/* ── Danh sach: cuon cung trang, ban do dinh lai ben canh ───────────
          An hoan toan tren dien thoai: man hinh hep khong du cho vua ban do
          vua danh sach, trang mau cung chi hien moi ban do. Doi lai danh sach
          bang nut "Danh sach" o thanh tren. */}
      <div className="hidden px-4 py-4 sm:px-6 lg:order-1 lg:block lg:py-6 lg:pl-8 lg:pr-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.publicId}
                ref={(node) => {
                  if (node) cardsRef.current.set(project.publicId, node);
                  else cardsRef.current.delete(project.publicId);
                }}
                onMouseEnter={() => setActiveId(project.publicId)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(project.publicId)}
                className={`rounded-xl transition ${
                  activeId === project.publicId
                    ? 'ring-2 ring-brand-400 ring-offset-2'
                    : ''
                }`}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMapView;
