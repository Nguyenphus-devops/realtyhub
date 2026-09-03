'use client';

import 'pannellum/build/pannellum.css';
import { useEffect, useRef, useState } from 'react';
import { FiMaximize, FiMinimize, FiRotateCw } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import type { Panorama, ProjectDetail } from '../../../models/project-detail.model';
import { TabEmptyState } from '../shared';

/**
 * Pannellum khong co kieu TypeScript di kem va gan minh vao `window`, nen khai
 * bao dung phan API dang dung. Chi 55 KB JS + 9 KB CSS, khong keo theo three.js.
 */
type PannellumViewer = {
  destroy: () => void;
  toggleFullscreen: () => void;
  setYaw: (yaw: number) => void;
  getYaw: () => number;
};

type PannellumGlobal = {
  viewer: (el: HTMLElement, config: Record<string, unknown>) => PannellumViewer;
};

/**
 * Doi toa do chu thich tu he cua model (x, y tinh theo % khung anh) sang he cua
 * anh cau ma Pannellum dung (yaw: -180..180 do quanh truc dung, pitch: -90..90
 * do tu duoi len). Giu nguyen hop dong du lieu, khong bat backend doi theo.
 */
const toSphere = (hotspot: Panorama['hotspots'][number]) => ({
  yaw: (hotspot.x / 100) * 360 - 180,
  pitch: 90 - (hotspot.y / 100) * 180,
});

const Photo360Tab = ({ project }: { project: ProjectDetail }) => {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [failed, setFailed] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);

  const total = project.panoramas.length;
  const panorama = project.panoramas[Math.min(index, Math.max(0, total - 1))];

  useEffect(() => {
    if (!panorama?.imageUrl) return;

    let cancelled = false;

    // Pannellum doc `window` ngay khi nap nen phai import dong trong effect,
    // giong cach Leaflet duoc nap o tab Mat bang.
    void (async () => {
      await import('pannellum/build/pannellum.js');
      const host = hostRef.current;
      const lib = (window as unknown as { pannellum?: PannellumGlobal }).pannellum;
      if (cancelled || !host || !lib) {
        if (!cancelled) setFailed(true);
        return;
      }

      viewerRef.current = lib.viewer(host, {
        type: 'equirectangular',
        panorama: panorama.imageUrl,
        autoLoad: true,
        showControls: false,
        // Cho keo qua mep tren/duoi mot chut de nguoi xem khong thay bi chan
        minPitch: -85,
        maxPitch: 85,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        friction: 0.15,
        hotSpots: panorama.hotspots.map((hotspot) => ({
          ...toSphere(hotspot),
          type: 'info',
          text: hotspot.label,
          cssClass: 'pano-hotspot',
        })),
      });

      setIsSpinning(false);
    })();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [panorama?.imageUrl, panorama?.hotspots]);

  // Tu xoay: nhich yaw tung chut moi khung hinh cho toi khi nguoi dung tat
  useEffect(() => {
    if (!isSpinning) return;

    let raf = 0;
    const tick = () => {
      const viewer = viewerRef.current;
      if (viewer) viewer.setYaw(viewer.getYaw() + 0.12);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [isSpinning]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  if (total === 0) {
    return <TabEmptyState message="Dự án chưa có ảnh 360°." />;
  }

  return (
    <div>
      <h2 className="mb-5 text-center text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
        Toàn cảnh dự án
      </h2>

      {/* isolate: Pannellum dat z-index noi bo, khong duoc de len header dinh */}
      <div className="relative isolate h-140 w-full overflow-hidden rounded-xl bg-navy-900 shadow-card sm:h-170">
        {failed || !panorama.imageUrl ? (
          <PlaceholderThumb seed={panorama.publicId} label={panorama.title} />
        ) : (
          <div ref={hostRef} className="h-full w-full" />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex items-start justify-between px-3">
          <span className="rounded bg-black/60 px-2 py-1 text-theme-sm font-medium text-white">
            {index + 1}/{total}
          </span>

          <span className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsSpinning((on) => !on)}
              aria-pressed={isSpinning}
              aria-label={isSpinning ? 'Dừng tự xoay' : 'Tự xoay'}
              className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded text-white transition ${
                isSpinning ? 'bg-brand-500' : 'bg-black/60 hover:bg-black/80'
              }`}
            >
              <FiRotateCw aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => viewerRef.current?.toggleFullscreen()}
              aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Xem toàn màn hình'}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded bg-black/60 text-white transition hover:bg-black/80"
            >
              {isFullscreen ? <FiMinimize aria-hidden /> : <FiMaximize aria-hidden />}
            </button>
          </span>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-center text-base font-medium text-white">
          {panorama.title}
        </p>
      </div>

      <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {project.panoramas.map((item, itemIndex) => (
          <li key={item.publicId} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-current={itemIndex === index}
              aria-label={`Xem ${item.title}`}
              className={`block h-20 w-32 overflow-hidden rounded-md border-2 transition ${
                itemIndex === index
                  ? 'border-accent-500'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <PlaceholderThumb
                seed={item.publicId}
                src={item.imageUrl || undefined}
                alt={item.title}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Photo360Tab;
