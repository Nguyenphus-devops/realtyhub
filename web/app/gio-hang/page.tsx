import { redirect } from 'next/navigation';

// Trang cu /gio-hang da duoc doi thanh /du-an. File nay redirect nguoi dung
// dang o URL cu sang URL moi (giu nguyen query string). Cac route con
// ([slug], [slug]/phan-khu/[phaseSlug]) khong redirect vi mot du an cu the
// van truy cap duoc qua slug tuy y, khong anh huong den redirect nay.
export default function GioHangLegacyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Build lai query string neu co
  // (trang danh sach khong dung params nhung giu de khong mat filter neu co)
  // use de tuong thich voi Promise<...> cua Next 15+
  // Tach rieng de tranh can synchronous khi redirect
  return redirect('/du-an');
}

export async function generateMetadata() {
  return {
    title: 'Đã chuyển sang /du-an',
    robots: { index: false, follow: false },
  };
}
