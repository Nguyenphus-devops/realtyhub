

const ANNOUNCEMENTS: { label: string }[] = [
  {
    label: 'CHÚC MỪNG NHÀ MÔI GIỚI NÔNG HẢI TRÂN ĐÃ BOOKING THÀNH CÔNG TẠI VINHOMES GREEN PARADISE!',
  },
  {
    label: 'CHÚC MỪNG NHÀ MÔI GIỚI NGUYỄN MINH KHANG ĐÃ BOOKING THÀNH CÔNG TẠI VINHOMES GREEN PARADISE!',
  },
  {
    label: 'CHÚC MỪNG NHÀ MÔI GIỚI TRẦN THỊ MAI ĐÃ CHỐT CỌC THÀNH CÔNG CĂN HỘ 3 PHÒNG NGỦ TẠI THE EMERALD 68!',
  },
  {
    label: 'REALTYHUB TUYỂN DỤNG 20 NHÀ MÔI GIỚI BẤT ĐỘNG SẢN - HOA HỒNG HẤP DẪN LÊN ĐẾN 8%!',
  },
  {
    label: 'ĐĂNG KÝ THAM QUAN NHÀ MẪU 5 DỰ ÁN TRONG THÁNG 8 - MIỄN PHÍ ĐƯA ĐÓN!',
  },
  {
    label: 'SỰ KIỆN MỞ BÁN CUỐI TUẦN - ƯU ĐÃI ĐẾN 8% CHO KHÁCH ĐẶT CỌC SỚM!',
  },
];

/** Toc do chay: 40s cho vong lap 50% noi dung (marquee keyframe). Nhanh hon
    ban 50s cu ~25%, vua doc duoc vua khong bi ngan. Tang giam tuy y. */
const MARQUEE_DURATION_SEC = 40;

const Thongbao = () => {
  // Nhân đôi danh sách để keyframe -50% di chuyển hết phần A, phần B lấp
  // vào, lặp lại liền mạch. CSS translate(-50%) của 1 lần chiều rộng danh sách
  // gốc = đúng đến đầu danh sách thứ 2.
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <section
      aria-label="Thông báo"
      className="relative w-full border-b border-slate-200 bg-slate-50"
    >
      <div className="site-container overflow-hidden py-2.5 md:py-3">
        {/* Vùng chạy: overflow-hidden, marquee bên trong. Item chi con text
            (khong icon/logo) vi cac item deu cung style do noi bat. */}
        <div
          className="group relative overflow-hidden"
          style={
            // CSS variable để keyframe đọc, đổi 1 chỗ là đổi cả loop
            { ['--marquee-duration' as string]: `${MARQUEE_DURATION_SEC}s` } as React.CSSProperties
          }
        >
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused] md:gap-12">
            {items.map((item, index) => (
              <div key={index} className="flex shrink-0 items-center gap-2.5 md:gap-3">
                {/* Icon loa nho truoc moi item - mau do theo currentColor
                    de dong bo voi text. fill="currentColor" nhuom theo parent
                    text-error-500. */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="15"
                  viewBox="0 0 31 29"
                  fill="currentColor"
                  aria-hidden
                  className="h-3.5 w-auto shrink-0 md:h-4"
                >
                  <path d="M20.345 6.8032L19.4989 3.82097C19.2655 2.99841 18.4067 2.519 17.5846 2.75228C16.7777 2.98122 16.3014 3.81167 16.5031 4.61936C15.3453 6.32944 12.9116 8.43436 10.3692 9.31374L10.2373 8.84894C10.0152 8.06607 9.19778 7.60974 8.41529 7.83177L6.19033 8.46308C5.40784 8.6851 4.95199 9.5027 5.17412 10.2856L5.3181 10.793C3.39379 11.5915 2.32562 13.729 2.90848 15.7832C3.49135 17.8375 5.52298 19.0955 7.57989 18.7643L7.72387 19.2718C7.89928 19.89 8.44584 20.3042 9.05327 20.3419L10.8944 26.8308C10.968 27.0901 11.2381 27.2408 11.4975 27.1672L12.6106 26.8514C13.4827 26.6039 13.9906 25.6922 13.7428 24.8189L12.2177 19.4441C12.7148 19.0929 12.9625 18.4534 12.7871 17.8352L12.6552 17.3704C15.2806 16.7835 18.4571 17.2965 20.3405 18.1436C20.5931 18.9369 21.4345 19.3935 22.2414 19.1645C23.0635 18.9312 23.5425 18.0723 23.3091 17.2497L22.463 14.2675C23.7126 13.1919 24.2441 11.4635 23.7888 9.8587C23.3334 8.25389 21.9734 7.06216 20.345 6.8032ZM10.7181 16.8895L8.98789 17.3805L7.24308 11.2312L8.97332 10.7402L10.7181 16.8895ZM6.11359 10.019C6.03843 9.75411 6.19244 9.4776 6.4569 9.40256L8.68186 8.77124C8.94632 8.69621 9.22265 8.85062 9.29781 9.1155L9.43372 9.59449L6.2495 10.498L6.11359 10.019ZM3.84795 15.5167C3.36691 13.8213 4.35311 12.0512 6.04633 11.5707L6.30361 11.4977L8.04841 17.647L7.79114 17.72C6.09792 18.2005 4.329 17.2121 3.84795 15.5167ZM12.8033 25.0855C12.9041 25.4407 12.6981 25.8114 12.344 25.9119L11.7006 26.0944L10.0155 20.1556L11.301 19.7909L12.8033 25.0855ZM11.8476 18.1018C11.9227 18.3666 11.7687 18.6431 11.5042 18.7182L9.27925 19.3495C9.01479 19.4245 8.73851 19.2701 8.66336 19.0053L8.52744 18.5262L11.7117 17.6227L11.8476 18.1018ZM22.3697 17.5163C22.4561 17.8208 22.279 18.1387 21.9748 18.225C21.67 18.3115 21.3516 18.1342 21.2652 17.8296L19.959 13.2259C19.8854 12.9665 19.6153 12.8159 19.3559 12.8895C19.0965 12.9631 18.9459 13.2331 19.0195 13.4925L20.0025 16.957C17.7753 16.1595 14.5662 15.7977 11.9148 16.55L11.6576 16.623L9.91275 10.4737L10.17 10.4007C12.8214 9.64839 15.3623 7.65498 16.8387 5.80664L17.8217 9.27115C17.8953 9.53054 18.1653 9.6812 18.4247 9.6076C18.6841 9.534 18.8348 9.26397 18.7612 9.00458L17.4549 4.40091C17.3685 4.09643 17.5463 3.77827 17.8512 3.69175C18.1553 3.60545 18.473 3.78301 18.5594 4.08754L19.4944 7.38275L21.4347 14.221L22.3697 17.5163ZM22.1591 13.1965L20.6489 7.87415C21.6979 8.20009 22.5415 9.04041 22.8493 10.1252C23.1571 11.21 22.8806 12.3682 22.1591 13.1965Z" />
                  <path d="M26.3564 8.62279L25.3858 8.89821C25.1264 8.97181 24.9757 9.24184 25.0493 9.50123C25.1229 9.76062 25.3929 9.91129 25.6523 9.83769L26.623 9.56227C26.8824 9.48867 27.033 9.21864 26.9594 8.95925C26.8858 8.69986 26.6158 8.54919 26.3564 8.62279Z" />
                  <path d="M24.3331 7.05853C24.4531 7.02446 24.5602 6.94464 24.6259 6.82713L25.3208 5.58471C25.4524 5.34936 25.3684 5.05188 25.133 4.9202C24.8977 4.78847 24.6001 4.87264 24.4685 5.10799L23.7736 6.35041C23.642 6.58576 23.726 6.88324 23.9614 7.01492C24.0793 7.08089 24.2127 7.09267 24.3331 7.05853Z" />
                  <path d="M26.0944 11.9984C25.8588 11.8673 25.5615 11.9519 25.4303 12.1876C25.2991 12.4233 25.3838 12.7206 25.6195 12.8517L26.8633 13.5441C26.981 13.6096 27.114 13.6213 27.234 13.5872C27.3544 13.5531 27.4617 13.4729 27.5274 13.3549C27.6585 13.1193 27.5739 12.822 27.3382 12.6908L26.0944 11.9984Z" />
                  <path d="M18.7568 10.7786C18.4975 10.8522 18.3468 11.1222 18.4204 11.3816L18.4212 11.3843C18.4948 11.6437 18.7644 11.793 19.0238 11.7194C19.2832 11.6458 19.4335 11.3745 19.3599 11.1151C19.2863 10.8557 19.0163 10.705 18.7568 10.7786Z" />
                </svg>
                <span className="text-theme-xs font-semibold uppercase tracking-wide text-error-500 md:text-theme-sm">
                  {item.label}
                </span>
                {/* Cham phan cach cac item - dinh dang luon de moi item deu co */}
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-error-500/40"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Thongbao;