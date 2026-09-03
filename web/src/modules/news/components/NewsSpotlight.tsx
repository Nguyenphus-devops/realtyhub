import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';

import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import { MOCK_NEWS } from '../mocks/news.mock';
import { NEWS_CATEGORY_LABELS, type NewsArticle } from '../models/news.model';

const TIMEZONE = 'Asia/Ho_Chi_Minh';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: TIMEZONE,
});

/**
 * Rut tung phan tu formatToParts thay vi ghep chuoi da dinh dang: tieng Viet
 * doi cach viet tuy to hop (chi thang + nam ra "tháng 08, 2026", khong phai
 * "08/2026"), nen moi phep replace tren chuoi deu se hong.
 */
const datePartsOf = (iso: string) => {
  const parts = dateFormatter.formatToParts(new Date(iso));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return { day: pick('day'), month: pick('month'), year: pick('year') };
};

const formatDots = (iso: string) => {
  const { day, month, year } = datePartsOf(iso);
  return `${day}.${month}.${year}`;
};

const FeaturedArticle = ({ article }: { article: NewsArticle }) => (
  <article className="group">
    <Link href={`/tin-tuc/${article.slug}`} className="block">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-gray-100">
        <PlaceholderThumb
          seed={article.publicId}
          src={article.thumbnailUrl || undefined}
          alt={`Ảnh bài viết ${article.title}`}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-theme-xs font-semibold text-white">
          {NEWS_CATEGORY_LABELS[article.category]}
        </span>
      </div>
    </Link>

    <div className="mt-5 flex gap-4">
      <time
        dateTime={article.publishedAt}
        className="flex h-16 w-16 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-center"
      >
        <span className="flex flex-1 items-center justify-center text-2xl font-bold leading-none text-gray-900">
          {datePartsOf(article.publishedAt).day}
        </span>
        <span className="bg-gray-50 py-1 text-[11px] font-medium leading-none text-gray-500">
          {datePartsOf(article.publishedAt).month}.{datePartsOf(article.publishedAt).year}
        </span>
      </time>

      <div className="min-w-0">
        <h3 className="text-xl font-bold leading-snug text-gray-900">
          <Link href={`/tin-tuc/${article.slug}`} className="transition hover:text-brand-600">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-theme-sm leading-relaxed text-gray-600">
          {article.excerpt}
        </p>
      </div>
    </div>
  </article>
);

const HeadlineRow = ({ article }: { article: NewsArticle }) => (
  <li className="group flex items-baseline gap-3 border-b border-gray-100 py-2.5 last:border-b-0">
    <span aria-hidden className="text-brand-500">
      •
    </span>
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="min-w-0 flex-1 truncate text-theme-sm text-gray-700 transition group-hover:text-brand-600"
    >
      {article.title}
    </Link>
    <time
      dateTime={article.publishedAt}
      className="shrink-0 text-theme-xs tabular-nums text-gray-400"
    >
      {formatDots(article.publishedAt)}
    </time>
  </li>
);

const NewsSpotlight = ({
  limit = 12,
  articles,
}: {
  limit?: number;
  articles?: NewsArticle[];
}) => {
  const data = (articles ?? MOCK_NEWS).slice(0, limit);
  const [featured, ...rest] = data;

  if (!featured) return null;

  return (
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">Tin tức</h2>
      </div>

      {/* `min-w-0` tren tung cot: grid item mac dinh la `min-width: auto`, no
          khong chiu co xuong duoi be rong noi dung. Danh sach ben duoi dung
          `truncate` (white-space: nowrap) nen be rong toi thieu cua no bang ca
          cau -> cot phinh ra, keo trang tran ngang tren dien thoai. */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <FeaturedArticle article={featured} />
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-gray-900">Tin mới khác</h3>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-theme-sm font-medium text-gray-600 transition hover:text-brand-600"
            >
              Xem thêm
              <FiPlus aria-hidden />
            </Link>
          </div>

          <ul className="border-t border-gray-200">
            {rest.map((article) => (
              <HeadlineRow key={article.publicId} article={article} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NewsSpotlight;
