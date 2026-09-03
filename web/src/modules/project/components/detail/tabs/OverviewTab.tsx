'use client';

import { useState } from 'react';
import { FiPhone } from 'react-icons/fi';
import type { ProjectDetail } from '../../../models/project-detail.model';
import ProjectSpecs from '../ProjectSpecs';
import {
  CarouselDots,
  MediaFrame,
  PlayOverlay,
  SectionHeading,
} from '../shared';

const PRODUCTS_PER_PAGE = 3;
const AMENITIES_PER_PAGE = 4;

/** Chia mot mang thanh cac trang co do dai `size` */
const paginate = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, page) =>
    items.slice(page * size, page * size + size),
  );

/**
 * Khoi ke chuyen: video lon tran chieu rong, chu nam duoi.
 *
 * Truoc day khoi nay la panel mau toi, video bi nhet vao mot nua ben phai. Anh
 * phoi canh la thu nguoi mua muon nhin ro nhat, nen gio no chiem tron chieu
 * ngang va khong con vien mau bao quanh.
 */
const StoryPanel = ({
  title,
  body,
  thumbnailUrl,
  seed,
}: {
  title: string;
  body: string;
  thumbnailUrl: string;
  seed: string;
}) => (
  <section>
    <button type="button" className="group relative block w-full text-left">
      <MediaFrame
        seed={seed}
        src={thumbnailUrl}
        alt={`Video giới thiệu: ${title}`}
        ratio="aspect-21/9"
      />
      <PlayOverlay label={`Phát video: ${title}`} />
    </button>

    <div className="mt-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
        {title}
      </h2>
      <span
        aria-hidden
        className="brand-gradient mx-auto mt-3 block h-1 w-16 rounded-full"
      />
      <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-gray-600">
        {body}
      </p>
    </div>
  </section>
);

const OverviewTab = ({ project }: { project: ProjectDetail }) => {
  const [sheetKey, setSheetKey] = useState(project.masterPlan[0]?.key ?? '');
  const [productPage, setProductPage] = useState(0);
  const [amenityPage, setAmenityPage] = useState(0);

  const activeSheet =
    project.masterPlan.find((sheet) => sheet.key === sheetKey) ?? project.masterPlan[0];

  const productPages = paginate(project.products, PRODUCTS_PER_PAGE);
  const amenityPages = paginate(project.amenities, AMENITIES_PER_PAGE);

  return (
    <div className="space-y-12">
      {/* Bang anh hero va dai chi so da chuyen len ProjectHero o dau trang -
          chung thuoc ve ca trang chu khong rieng tab nay. */}

      {/* Tong quan du an: phoi canh tran chieu rong -> mo ta -> bang thong so.
          Thu tu nay di tu tong the den chi tiet: nhin anh truoc de hinh dung,
          doc mo ta de hieu, roi moi tra thong so cu the. */}
      <section>
        {/* Muc duy nhat can trai: ben duoi la doan mo ta dai chay theo le trai,
            tieu de can giua se lam gay le doc cua ca khoi. */}
        <SectionHeading title="Tổng quan dự án" subtitle={project.tagline} align="left" />

        <MediaFrame
          seed={`${project.publicId}-overview`}
          src={project.overviewImageUrl}
          alt={`Phối cảnh tổng thể ${project.name}`}
          ratio="aspect-21/9"
        />

        <p className="mt-6 max-w-4xl text-base leading-relaxed text-gray-600">
          {project.description}
        </p>

        <ProjectSpecs project={project} />
      </section>

      {/* Mat bang */}
      {activeSheet && (
        <section>
          <SectionHeading title="Mặt bằng" subtitle="Thiết kế chi tiết các phân khu" />

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {project.masterPlan.map((sheet) => (
              <button
                key={sheet.key}
                type="button"
                onClick={() => setSheetKey(sheet.key)}
                aria-pressed={sheet.key === activeSheet.key}
                className={`rounded-full px-4 py-2 text-base font-semibold uppercase tracking-wide transition ${
                  sheet.key === activeSheet.key
                    ? 'brand-gradient text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sheet.label}
              </button>
            ))}
          </div>

         
          <MediaFrame
            seed={`${project.publicId}-plan-${activeSheet.key}`}
            src={activeSheet.imageUrl}
            alt={`Mặt bằng ${activeSheet.label} - ${project.name}`}
            label={`Mặt bằng ${activeSheet.label}`}
            ratio="aspect-3/2"
            fit="contain"
            className="bg-white"
          />
        </section>
      )}

      {/* San pham */}
      {productPages.length > 0 && (
        <section>
          <SectionHeading title="Sản phẩm" subtitle="Đa dạng lựa chọn cho mọi nhu cầu" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productPages[Math.min(productPage, productPages.length - 1)].map((product) => (
              <article
                key={product.publicId}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition hover:shadow-card-hover"
              >
                <MediaFrame
                  seed={product.publicId}
                  src={product.imageUrl}
                  alt={product.name}
                  ratio="aspect-4/3"
                  className="rounded-none"
                />
                <div className="p-4">
                  <h3 className="text-base font-bold uppercase tracking-wide text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-base text-gray-500">{product.areaLabel}</p>
                </div>
              </article>
            ))}
          </div>

          <CarouselDots
            count={productPages.length}
            current={productPage}
            onSelect={setProductPage}
            label="Trang sản phẩm"
          />
        </section>
      )}

      {/* Tien ich */}
      {amenityPages.length > 0 && (
        <section>
          <SectionHeading title="Tiện ích" subtitle="Hệ thống tiện ích nội khu đồng bộ" />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {amenityPages[Math.min(amenityPage, amenityPages.length - 1)].map((amenity) => (
              <figure
                key={amenity.publicId}
                className="group relative overflow-hidden rounded-lg shadow-card"
              >
                <MediaFrame
                  seed={amenity.publicId}
                  src={amenity.imageUrl}
                  alt={amenity.name}
                  ratio="aspect-4/3"
                  className="rounded-none transition duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2.5 text-base font-semibold uppercase leading-tight text-white">
                  {amenity.name}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-3 text-right text-theme-sm text-gray-400">
            {Math.min(amenityPage, amenityPages.length - 1) + 1} / {amenityPages.length}
          </div>

          <CarouselDots
            count={amenityPages.length}
            current={amenityPage}
            onSelect={setAmenityPage}
            label="Trang tiện ích"
          />
        </section>
      )}

      <StoryPanel
        title={project.closing.title}
        body={project.closing.body}
        thumbnailUrl={project.closing.videoThumbnailUrl}
        seed={`${project.publicId}-closing`}
      />

      {/* Lien he tu van */}
      <section>
        <SectionHeading
          title="Liên hệ tư vấn"
          subtitle="Đội ngũ chuyên viên sẵn sàng hỗ trợ bạn 24/7"
        />

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          {project.consultants.map((consultant) => (
            <div
              key={consultant.publicId}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-card"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-jade-50 text-xl text-jade-500">
                <FiPhone aria-hidden />
              </span>

              <p className="text-base font-semibold uppercase tracking-wide text-gold-500">
                {consultant.role}
              </p>
              <p className="mt-0.5 text-base font-medium text-gray-700">
                {consultant.name}
              </p>

              <a
                href={`tel:${consultant.phone.replace(/\s/g, '')}`}
                className="mt-2 text-xl font-bold text-jade-600 transition hover:text-jade-500"
              >
                {consultant.phone}
              </a>

              <a
                href={`tel:${consultant.phone.replace(/\s/g, '')}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-5 py-2 text-base font-bold uppercase tracking-wide text-jade-800 transition hover:bg-gold-300"
              >
                <FiPhone aria-hidden />
                Liên hệ ngay
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;
