'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { formatArticleDate } from '@/common/utils/format';
import { removeDiacritics } from '@/common/utils/text';
import { NEWS_CATEGORY_LABELS } from '@/modules/news/models/news.model';
import type { ProjectDetail } from '../../../models/project-detail.model';
import { MediaFrame } from '../shared';

/** Bo dau de go "ha long" van ra "Hạ Long" */
const normalize = (value: string) => removeDiacritics(value).toLowerCase();

const ProjectNewsTab = ({ project }: { project: ProjectDetail }) => {
  const [search, setSearch] = useState('');

  const articles = useMemo(() => {
    const keyword = normalize(search.trim());
    if (!keyword) return project.news;

    return project.news.filter((article) =>
      normalize(`${article.title} ${article.excerpt}`).includes(keyword),
    );
  }, [project.news, search]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
          Tin tức dự án
        </h2>

        <div className="relative w-full sm:w-80">
          <FiSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm tin tức..."
            aria-label="Tìm kiếm tin tức dự án"
            className="h-11 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-base text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:shadow-focus-ring"
          />
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-base text-gray-500">
            Không tìm thấy bài viết nào khớp từ khóa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <article
              key={article.publicId}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition hover:shadow-card-hover"
            >
              <div className="relative">
                <Link href={`/tin-tuc/${article.slug}`} className="block">
                  <MediaFrame
                    seed={article.publicId}
                    src={article.thumbnailUrl}
                    alt={`Ảnh bài viết ${article.title}`}
                    className="rounded-none"
                  />
                </Link>
                <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                  {NEWS_CATEGORY_LABELS[article.category]}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-800">
                  <Link
                    href={`/tin-tuc/${article.slug}`}
                    className="transition hover:text-brand-600"
                  >
                    {article.title}
                  </Link>
                </h3>

                <p className="line-clamp-3 text-theme-sm leading-relaxed text-gray-500">
                  {article.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2 text-theme-sm text-gray-500">
                  <time dateTime={article.publishedAt}>
                    {formatArticleDate(article.publishedAt)}
                  </time>
                  <Link
                    href={`/tin-tuc/${article.slug}`}
                    className="font-medium text-gray-700 underline underline-offset-2 transition hover:text-brand-600"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectNewsTab;
