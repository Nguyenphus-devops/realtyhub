'use client';

import { useEffect, useRef, useState } from 'react';

/** Cho nguoi dung go xong roi moi loc, thay vi loc lai o tung chu so */
const TYPING_DELAY_MS = 400;

const clamp = (value: number, low: number, high: number) =>
  Math.min(Math.max(value, low), high);

type NumberBoxProps = {
  /** Gia tri theo don vi luu tru; null = de trong */
  value: number | null;
  /** He so doi tu don vi luu tru sang don vi go tay */
  scale: number;
  limit: number;
  unit: string;
  placeholder: string;
  ariaLabel: string;
  onCommit: (value: number | null) => void;
};

const NumberBox = ({
  value,
  scale,
  limit,
  unit,
  placeholder,
  ariaLabel,
  onCommit,
}: NumberBoxProps) => {
  // Lam tron 2 chu so thap phan: 1_500_000_000 / 1e9 ra dung 1.5, khong ra 1.4999
  const display = value === null ? '' : String(Math.round((value / scale) * 100) / 100);

  const [text, setText] = useState(display);
  const [lastDisplay, setLastDisplay] = useState(display);

  // Keo thanh truot hay bam "Xoa tat ca" thi o nhap phai doi theo
  if (lastDisplay !== display) {
    setLastDisplay(display);
    setText(display);
  }

  // Giu callback trong ref chu khong dua vao mang phu thuoc: no doi danh tinh
  // moi lan cha render, de trong mang thi dong ho 400ms bi dat lai lien tuc va
  // khong bao gio kip chay.
  const commitRef = useRef(onCommit);

  useEffect(() => {
    commitRef.current = onCommit;
  });

  useEffect(() => {
    const trimmed = text.trim();
    const parsed = trimmed === '' ? null : Number(trimmed);
    // Go dang do ra so vo nghia thi cho tiep, dung loc voi gia tri rac
    if (parsed !== null && !Number.isFinite(parsed)) return;

    const next = parsed === null ? null : Math.round(clamp(parsed * scale, 0, limit));
    if (next === value) return;

    const timer = setTimeout(() => commitRef.current(next), TYPING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [text, value, scale, limit]);

  return (
    <label className="flex min-w-0 flex-1 items-center gap-1.5">
      <span className="sr-only">{ariaLabel}</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        max={limit / scale}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full min-w-0 rounded-md border border-gray-300 px-2.5 text-theme-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:shadow-focus-ring"
      />
      <span className="shrink-0 text-theme-sm text-gray-500">{unit}</span>
    </label>
  );
};

type RangeSliderFieldProps = {
  label: string;
  /** Moc cuoi duong ray, don vi luu tru. Nut nam o day nghia la khong gioi han */
  limit: number;
  /** Buoc nhay khi keo, don vi luu tru */
  step: number;
  /** Doi don vi luu tru sang don vi go tay. Gia luu VND nhung nhap theo ty => 1e9 */
  scale?: number;
  /** Don vi hien canh o nhap: "m²", "tỷ" */
  unit: string;
  /** Chi mot nut keo - dien ta mot nguong tren: "tu 0 den N" */
  singleThumb?: boolean;
  /** Bo qua khi singleThumb */
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  /** Doi gia tri luu tru thanh chuoi doc duoc cho nhan lon */
  format: (value: number) => string;
};

/**
 * Thanh truot kem o nhap so, dung cho ca khoang hai dau (gia) lan nguong tren
 * mot dau (dien tich).
 *
 * Gia tri chay lien tuc theo `step` chu khong theo mot day moc dinh san: o nhap
 * cho go bat cu con so nao, neu duong ray chi dung lai o vai moc thi con so vua
 * go se khong the hien dung tren duong ray.
 */
const RangeSliderField = ({
  label,
  limit,
  step,
  scale = 1,
  unit,
  singleThumb = false,
  min,
  max,
  onChange,
  format,
}: RangeSliderFieldProps) => {
  const propLow = singleThumb ? 0 : (min ?? 0);
  const propHigh = max ?? limit;

  /**
   * Vi tri hai nut keo duoc giu tai cho.
   *
   * Bao len tren o MOI buoc keo se lam URL doi lien tuc, keo theo mot vong
   * render + mot lan truy van cho tung pixel - keo thay giat va tut hau. O day
   * nut chay theo tay ngay lap tuc, chi khi tha ra moi bao gia tri cuoi cung.
   */
  const [range, setRange] = useState<[number, number]>([propLow, propHigh]);
  const [lastProps, setLastProps] = useState<[number, number]>([propLow, propHigh]);

  // URL doi tu ben ngoai (nut Back, "Xoa tat ca") thi keo nut ve theo
  if (lastProps[0] !== propLow || lastProps[1] !== propHigh) {
    setLastProps([propLow, propHigh]);
    setRange([propLow, propHigh]);
  }

  const [lowPos, highPos] = range;

  // Nam o hai dau mut duong ray nghia la "de trong", khong can nut xoa rieng
  const lowValue = lowPos <= 0 ? null : lowPos;
  const highValue = highPos >= limit ? null : highPos;

  const emit = (next: [number, number]) => {
    const nextMin = singleThumb || next[0] <= 0 ? null : next[0];
    const nextMax = next[1] >= limit ? null : next[1];
    if (nextMin !== min || nextMax !== max) onChange(nextMin, nextMax);
  };

  const apply = (next: [number, number]) => {
    setRange(next);
    emit(next);
  };

  // Khong cho hai nut vuot qua nhau: keo nut duoi len qua nut tren thi dung lai
  // ngay tai do, va nguoc lai. De chung "doi cho" se sinh ra khoang am.
  const dragLow = (next: number) => setRange([Math.min(next, highPos), highPos]);
  const dragHigh = (next: number) => setRange([lowPos, Math.max(next, lowPos)]);

  const commit = () => emit(range);

  /**
   * Bam vao duong ray thi keo nut gan nhat toi do.
   *
   * Chi can cho thanh hai dau: than hai the input o do da bi tat pointer-events
   * (neu khong the nam tren se nuot het cu cham cua the nam duoi) nen trinh
   * duyet khong con tu xu ly cu bam vao ray. Thanh mot dau chi co mot input phu
   * kin duong ray, target luon la INPUT nen ham nay thoat ngay va co che san cua
   * trinh duyet lam viec.
   */
  const jumpToPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === 'INPUT') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const snapped = clamp(Math.round((ratio * limit) / step) * step, 0, limit);

    // Ra ngoai khoang thi keo dung dau dang chan, con lai chon dau gan hon
    const moveLow =
      !singleThumb &&
      (snapped < lowPos ||
        (snapped <= highPos && snapped - lowPos <= highPos - snapped));

    apply(moveLow ? [snapped, highPos] : [lowPos, Math.max(snapped, lowPos)]);
  };

  // Keo bang chuot/cham tha ra o pointerup; di bang phim thi la keyup
  const commitProps = {
    onPointerUp: commit,
    onKeyUp: commit,
    onBlur: commit,
  };

  const thumbClass = `range-thumb absolute inset-x-0 top-0 h-5 w-full ${
    singleThumb ? '' : 'pointer-events-none'
  }`;

  const percent = (position: number) => (position / limit) * 100;

  const lowText = lowValue === null ? 'Không giới hạn' : format(lowValue);
  const highText = highValue === null ? 'Không giới hạn' : format(highValue);

  const track = (
    <div className="relative h-5 cursor-pointer" onPointerDown={jumpToPointer}>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
        style={{
          left: `${percent(lowPos)}%`,
          width: `${percent(highPos) - percent(lowPos)}%`,
        }}
      />

      {!singleThumb && (
        <input
          type="range"
          min={0}
          max={limit}
          step={step}
          value={lowPos}
          onChange={(event) => dragLow(Number(event.target.value))}
          {...commitProps}
          aria-label={`${label} - giá trị thấp nhất`}
          aria-valuetext={lowText}
          className={thumbClass}
        />
      )}
      <input
        type="range"
        min={0}
        max={limit}
        step={step}
        value={highPos}
        onChange={(event) => dragHigh(Number(event.target.value))}
        {...commitProps}
        aria-label={singleThumb ? label : `${label} - giá trị cao nhất`}
        aria-valuetext={highText}
        className={thumbClass}
      />
    </div>
  );

  const maxBox = (
    <NumberBox
      value={highValue}
      scale={scale}
      limit={limit}
      unit={unit}
      placeholder={singleThumb ? 'Tối đa' : 'Đến'}
      ariaLabel={singleThumb ? label : `${label} - giá trị cao nhất`}
      onCommit={(next) => apply([lowPos, Math.max(next ?? limit, lowPos)])}
    />
  );

  if (singleThumb) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-theme-sm font-medium text-gray-700">
            {highValue === null ? 'Tất cả' : `Từ 0 đến ${format(highValue)}`}
          </span>
          <div className="w-28 shrink-0">{maxBox}</div>
        </div>

        {track}

        <div className="mt-1 flex justify-between text-theme-xs text-gray-400">
          <span>0 {unit}</span>
          <span>Không giới hạn</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 text-theme-sm">
        <span className="font-medium text-gray-700">{lowText}</span>
        <span aria-hidden className="text-gray-300">
          —
        </span>
        <span className="font-medium text-gray-700">{highText}</span>
      </div>

      {track}

      <div className="mt-3 flex items-center gap-2">
        <NumberBox
          value={lowValue}
          scale={scale}
          limit={limit}
          unit={unit}
          placeholder="Từ"
          ariaLabel={`${label} - giá trị thấp nhất`}
          onCommit={(next) => apply([Math.min(next ?? 0, highPos), highPos])}
        />
        <span aria-hidden className="text-gray-300">
          —
        </span>
        {maxBox}
      </div>
    </div>
  );
};

export default RangeSliderField;
