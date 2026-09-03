"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type CategoriesBlog = {
  _id: string;
  name: string;
  slug: string;
};

type BlogPreview = {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  createdAt: string;
};

type BlogPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  blogData: string;
  thumbnailUrl: string;
  categoryMainSlugs: string[];
  categories: CategoriesBlog[];
  relatedBlogs?: BlogPreview[];
  faqs?: { question: string; answer: string }[];
  author?: {
    avatar?: string;
    name?: string;
    position?: string;
    description?: string;
  };
};

function calculateReadTime(htmlContent: string): string {
  if (!htmlContent) return "1 phút đọc";
  const textContent = htmlContent.replace(/<[^>]*>/g, " ");
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.round(wordCount / 200));
  return `${readTimeMin} phút đọc`;
}

type TocItem = { id: string; title: string; level: number; prefix: string };

function buildTableOfContents(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = [];
  const entities: Record<string, string> = {
    amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"',
  };
  const decodeText = (value: string) => value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] === "#") {
        const isHex = code[1]?.toLowerCase() === "x";
        const number = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
        return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
      }
      return entities[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();

  let h2Count = 0;
  const enrichedHtml = html.replace(
    /<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (heading, tag: string, attributes: string, innerHtml: string) => {
      const title = decodeText(innerHtml);
      if (!title) return heading;

      const level = parseInt(tag.charAt(1), 10);
      if (level === 2) h2Count++;
      const prefix = level === 2 ? `${h2Count}. ` : "";

      const id = `article-section-${items.length + 1}`;
      items.push({ id, title, level, prefix });
      const cleanAttributes = attributes.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, "");
      return `<${tag}${cleanAttributes} id="${id}">${innerHtml}</${tag}>`;
    },
  );

  return { html: enrichedHtml, items };
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  title,
  excerpt,
  blogData,
  thumbnailUrl,
  categoryMainSlugs,
  categories,
  relatedBlogs = [],
  faqs = [],
  author,
}: BlogPreviewModalProps) {
  const readTime = useMemo(() => calculateReadTime(blogData), [blogData]);
  const toc = useMemo(() => buildTableOfContents(blogData), [blogData]);
  const todayStr = useMemo(() => new Date().toLocaleDateString("vi-VN"), []);
  const hasFaqs = faqs.some((item) => item.question.trim() && item.answer.trim());
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);



  const categoryName = useMemo(() => {
    if (categoryMainSlugs.length > 0) {
      const match = categories.find((c) => c.slug === categoryMainSlugs[0]);
      if (match) return match.name;
    }
    return "Dinh dưỡng";
  }, [categoryMainSlugs, categories]);

  if (!isOpen) return null;

  const imageSrc = thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800";

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col bg-[#0A0A0A] text-white overflow-hidden font-sans selection:bg-yellow-300 selection:text-black"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#111111] border-b border-white/[0.08] shrink-0 sticky top-0 z-[110]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-300">
            Chế độ xem trước (Giao diện Blog Chi Tiết trên Web)
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Đóng xem trước
        </button>
      </div>

      {/* Main Preview Content Area */}
      <div
        ref={contentScrollRef}
        className="flex-1 overflow-y-auto scroll-smooth relative custom-scrollbar pb-24"
      >
        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 opacity-50 overflow-hidden">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#4337EF]/10 blur-[130px]" />
          <div className="absolute bottom-1/3 left-0 h-[400px] w-[400px] rounded-full bg-yellow-300/[0.04] blur-[120px]" />
        </div>

        <main className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-white">
              Trang chủ
            </Link>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            {categoryName && (
              <>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
                <span className="transition hover:text-white">
                  {categoryName}
                </span>
              </>
            )}
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
            <span className="max-w-[240px] truncate text-white/70 sm:max-w-md">
              {title || "Tiêu đề bài viết"}
            </span>
          </nav>

          {/* Back Button */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/60 hover:bg-white/[0.08] hover:text-white cursor-pointer transition">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại Blog
          </div>

          {/* --- MAIN GRID LAYOUT: 2-Columns --- */}
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <article className="space-y-6">
              <header>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-300">
                    <svg className="h-3 w-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {categoryName}
                  </span>
                  <span className="rounded-full border border-[#4337EF]/30 bg-[#4337EF]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
                    Bài viết mới
                  </span>
                </div>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {title || "Tiêu đề bài viết của bạn sẽ hiển thị tại đây"}
                </h1>

                <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/50 border-b border-white/[0.06] pb-5">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-yellow-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Biên tập X-Gym
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-yellow-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {todayStr}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-yellow-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readTime}
                  </span>
                </div>
              </header>

              {/* Text Content Body */}
              <div className="font-sans rounded-2xl border border-white/[0.06] bg-[#111111]/40 p-5 shadow-sm sm:p-8 space-y-6">
                <section id="details" className="scroll-mt-28 space-y-6">
                  {blogData ? (
                    <div
                      className="blog-rich-content"
                      dangerouslySetInnerHTML={{ __html: toc.html }}
                    />
                  ) : (
                    <p className="text-gray-400 italic">Nội dung bài viết chưa được nhập...</p>
                  )}
                </section>

                {hasFaqs && (
                  <section
                    id="faq"
                    className="scroll-mt-28 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86l-8.23 14.25A2 2 0 003.79 21h16.42a2 2 0 001.73-2.89L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <h2 className="text-xl font-black text-white">
                        Câu hỏi thường gặp
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {faqs
                        .filter((item) => item.question.trim() && item.answer.trim())
                        .map((faq, index) => {
                          const isOpen = openFaqIndex === index;
                          return (
                            <div
                              key={`${faq.question}-${index}`}
                              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20"
                            >
                              <button
                                type="button"
                                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                              >
                                <div
                                  className="faq-rich-text font-semibold text-white"
                                  dangerouslySetInnerHTML={{ __html: faq.question }}
                                />
                                <svg
                                  className={`h-5 w-5 shrink-0 text-yellow-300 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              {isOpen && (
                                <div
                                  className="faq-rich-text border-t border-white/[0.08] px-4 py-4 text-sm leading-7 text-white/70"
                                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </section>
                )}

                {/* Author Section */}
                {author && (author.name || author.description) && (
                  <section className="mt-12 rounded-2xl border border-purple-500/30 bg-purple-900/10 p-6 md:p-8">
                    <div className="mb-2 uppercase tracking-wider text-xs font-bold text-purple-400">
                      Về tác giả
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-purple-500 bg-black/40">
                          {author.avatar ? (
                            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-white">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          {author.name}
                        </h3>
                        {author.position && (
                          <div className="text-purple-400 font-semibold mb-3">
                            {author.position}
                          </div>
                        )}
                        {author.description && (
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            {author.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </article>

            {/* Sidebar Column */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              {/* Outline Box */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/80">
                  <svg className="h-4 w-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Mục lục bài viết
                </div>
                {toc.items.length > 0 && (
                  <ol className="space-y-1 text-sm text-white/70 mb-4 border-b border-white/[0.06] pb-4">
                    {toc.items.map((item) => (
                      <li key={item.id} className={item.level === 3 ? "ml-4 border-l border-white/10 pl-3 mt-1" : "mt-2"}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const container = contentScrollRef.current;
                            const target = container?.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`);
                            if (!container || !target) return;
                            
                            // Tính vị trí cuộn tuyệt đối để đưa thẻ h2/h3 lên sát mép trên cùng của container
                            const containerRect = container.getBoundingClientRect();
                            const targetRect = target.getBoundingClientRect();
                            const scrollPosition = container.scrollTop + (targetRect.top - containerRect.top);
                            
                            container.scrollTo({
                              top: scrollPosition,
                              behavior: "smooth"
                            });
                          }}
                          className={`block rounded-lg px-2 py-1.5 transition hover:bg-white/[0.05] hover:text-white ${item.level === 3 ? "text-white/40 text-xs flex items-center before:content-[''] before:w-1 before:h-1 before:bg-white/20 before:rounded-full before:mr-2" : "font-medium text-sm"}`}
                        >
                          {item.prefix}{item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Chia sẻ</span>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/80 hover:bg-white/[0.1] hover:text-white cursor-pointer transition">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318m0 4.152l-4.636-2.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Facebook
                  </div>
                </div>
              </div>

              {/* Related Articles Box */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-white/80">Bài viết liên quan</h2>
                <div className="space-y-4">
                  {relatedBlogs.length > 0 ? (
                    relatedBlogs.map((art) => (
                      <div key={art._id} className="flex gap-3 items-center group cursor-pointer">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#222]">
                          <img
                            src={art.thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200"}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-yellow-300 line-clamp-2 transition duration-200">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-white/40 font-semibold mt-1 block">
                            Đã đăng ngày {new Date(art.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex gap-3 items-center group cursor-pointer">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#222]">
                          <img
                            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200"
                            alt="Related article"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-yellow-300 line-clamp-2 transition duration-200">
                            Chế độ ăn kiêng tăng cơ giảm mỡ hiệu quả trong 4 tuần
                          </h4>
                          <span className="text-[10px] text-white/40 font-semibold mt-1 block">
                            Đã đăng ngày 15/06/2026
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center group cursor-pointer">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#222]">
                          <img
                            src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200"
                            alt="Related article"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-yellow-300 line-clamp-2 transition duration-200">
                            Lợi ích tuyệt vời của bộ môn Dance fitness đối với sức khỏe
                          </h4>
                          <span className="text-[10px] text-white/40 font-semibold mt-1 block">
                            Đã đăng ngày 10/06/2026
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
          <style>{`
            .blog-rich-content {
              background: transparent !important;
              color: rgba(255, 255, 255, 0.7);
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}
