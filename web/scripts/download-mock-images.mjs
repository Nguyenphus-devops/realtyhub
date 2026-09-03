/**
 * Tai anh mock that ve repo.
 *
 * Chay:  node scripts/download-mock-images.mjs
 * Ket qua: public/images/projects/<slug>.jpg  va  public/images/news/news-XXX.jpg
 *
 * Nguon: Unsplash. Giay phep Unsplash cho phep dung mien phi ca cho muc dich
 * thuong mai va khong bat buoc ghi nguon (https://unsplash.com/license).
 * Danh sach anh ghi thang trong file nay de biet ro anh nao tu dau.
 *
 * KHONG dung anh marketing cua cac chu dau tu that (Vinhomes, Masterise...)
 * vi do la tai san co ban quyen.
 *
 * Anh chi la du lieu mau. Khi backend co module upload, anh that se do admin
 * tai len va truong `thumbnailUrl` tro sang duong dan do.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SEED_PATH = join(ROOT, 'src/modules/project/mocks/projects.seed.json');
const PROJECT_OUT = join(ROOT, 'public/images/projects');
const NEWS_OUT = join(ROOT, 'public/images/news');

/** Cat va nen anh ngay tren CDN de file ve nho, dung ti le khung anh */
const projectVariant = 'w=800&h=500&fit=crop&crop=entropy&q=72&fm=jpg';
const newsVariant = 'w=800&h=450&fit=crop&crop=entropy&q=72&fm=jpg';

const BASE = 'https://images.unsplash.com/photo-';

/**
 * Lang biet thu ven bien + khu nghi duong nhin tu tren cao -> du an thap tang.
 *
 * Luu y khi doi anh: tim kiem chung chung tren Unsplash ("aerial view
 * residential neighborhood") tra ve anh drone chup khu dan cu binh thuong,
 * nhin nhu anh tu lieu chu khong phai anh ban hang. Cac tu khoa thien ve
 * kien truc / ven bien / skyline cho ket qua dung chat hon nhieu.
 */
const LOW_RISE = [
  '1618055403426-0c4e16c6fde3',
  '1759848915476-11bb5f92f8cd',
  '1762457811223-1d3dc337a35e',
  '1767717746998-5a1792381a37',
  '1779561718208-7063d547c0c4',
  '1758465912270-77ca730743ba',
  '1776761363364-e7004e80e58f',
  '1711110065918-388182f86e00',
  '1771192442016-d4c78d5729eb',
  '1780734323790-6f18edf42997',
  '1565214988145-8e826f79d8c2',
  '1770185998570-db739db7af47',
];

/** Skyline / cao oc -> du an cao tang */
const HIGH_RISE = [
  '1502905704466-2690947baeee',
  '1541447271487-09612b3f49f7',
  '1548454934-501d30773413',
  '1613059093860-582e53c584c3',
  '1523647422542-12d57cb9edad',
  '1550763347-0736ab2976ea',
  '1473777584131-937735dc793a',
  '1597285952775-1382215fbff0',
  '1567450475250-21f5b6d98021',
  '1581441428005-8cdc927bf053',
  '1482790197944-0bd99292659b',
  '1528628226822-6f38ca9687c9',
  '1499619133989-ce8080329b74',
];

/** Anh cho khoi tin tuc */
const NEWS = [
  '1499619133989-ce8080329b74',
  '1618055403426-0c4e16c6fde3',
  '1528628226822-6f38ca9687c9',
  '1762457811223-1d3dc337a35e',
  '1482790197944-0bd99292659b',
  '1767717746998-5a1792381a37',
  '1581441428005-8cdc927bf053',
  '1759848915476-11bb5f92f8cd',
];

const download = async (photoId, variant, destination) => {
  const url = `${BASE}${photoId}?${variant}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} khi tai ${url}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`${url} tra ve ${contentType}, khong phai anh`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
  return buffer.byteLength;
};

/** Tai tuan tu theo tung nhom nho de khong ban qua nhieu request cung luc */
const inBatches = async (items, size, worker) => {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    results.push(...(await Promise.all(batch.map(worker))));
  }
  return results;
};

const main = async () => {
  await mkdir(PROJECT_OUT, { recursive: true });
  await mkdir(NEWS_OUT, { recursive: true });

  const seeds = JSON.parse(await readFile(SEED_PATH, 'utf8'));

  // Chia theo segment roi phat anh trong dung nhom, de anh cao tang khong
  // roi vao du an thap tang va nguoc lai.
  const counters = { 'cao-tang': 0, 'thap-tang': 0 };
  const jobs = seeds.map((seed) => {
    const pool = seed.segment === 'cao-tang' ? HIGH_RISE : LOW_RISE;
    const photoId = pool[counters[seed.segment] % pool.length];
    counters[seed.segment] += 1;
    return { photoId, destination: join(PROJECT_OUT, `${seed.slug}.jpg`), label: seed.slug };
  });

  NEWS.forEach((photoId, index) => {
    const id = `news-${String(index + 1).padStart(3, '0')}`;
    jobs.push({
      photoId,
      destination: join(NEWS_OUT, `${id}.jpg`),
      label: id,
      variant: newsVariant,
    });
  });

  let totalBytes = 0;
  const sizes = await inBatches(jobs, 6, async (job) => {
    const bytes = await download(
      job.photoId,
      job.variant ?? projectVariant,
      job.destination,
    );
    totalBytes += bytes;
    return { label: job.label, bytes };
  });

  const biggest = [...sizes].sort((a, b) => b.bytes - a.bytes)[0];
  console.log(`Da tai ${sizes.length} anh, tong ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Anh lon nhat: ${biggest.label} (${Math.round(biggest.bytes / 1024)} KB)`);
};

main().catch((error) => {
  console.error('Tai anh that bai:', error.message);
  process.exit(1);
});
