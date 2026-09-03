import { FiStar } from 'react-icons/fi';

/**
 * Card quang cao dat giua header va phan tin dang. Noi dung:
 *   - Tieu de: "Chia se noi ban song nhu the nao"
 *   - 5 sao rate
 *   - Mo ta ngan
 *   - Nut "Viet danh gia khu vuc" (vang)
 */
const AreaRatingCTA = ({ location }: { location: string }) => (
  <section className="overflow-hidden rounded-2xl border border-warning-500/30 bg-gradient-to-br from-warning-50 via-orange-50 to-warning-50 p-5 shadow-theme-sm md:p-6">
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <h3 className="text-base font-bold text-gray-900 md:text-lg">
          Chia sẻ về nơi bạn sống như thế nào?
        </h3>
        <p className="mt-1 text-theme-sm text-gray-700">
          Trải nghiệm của bạn giúp cộng đồng có thêm thông tin hữu ích về khu vực.
        </p>

        {/* 5 sao rate */}
        <div className="mt-3 flex items-center gap-1" aria-label="Đánh giá 5 sao">
          {[0, 1, 2, 3, 4].map((i) => (
            <FiStar
              key={i}
              aria-hidden
              className="h-5 w-5 fill-warning-500 text-warning-500"
            />
          ))}
          <span className="ml-2 text-theme-xs text-gray-600">
            Đánh giá khu vực <strong>{location}</strong>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="shrink-0 rounded-full bg-gradient-to-r from-warning-500 to-orange-500 px-5 py-2.5 text-theme-sm font-bold text-white shadow-theme-md transition hover:from-warning-600 hover:to-orange-600"
      >
        Viết đánh giá khu vực
      </button>
    </div>
  </section>
);

export default AreaRatingCTA;