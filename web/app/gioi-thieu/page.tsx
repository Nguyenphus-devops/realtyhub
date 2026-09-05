/**
 * Trang /gioi-thieu - phien ban viet lai ngay 05/09/2026.
 *
 * Truoc day: trang gioi thieu doanh nghiep truyen thong (hero co anh that,
 * commitments, stats, modules, company, FAQ, CTA co form PartnerSignup).
 *
 * Phien ban moi: trang gioi thieu chinh thuc cua NEN TANG RealtyHub,
 * nhan manh day la cong nghe danh rieng cho moi gioi BĐS.
 *
 * Cau truc:
 *  1. AboutHeroSection          - headline + lead + CTA
 *  2. AboutIntroSection         - "Ve RealtyHub" + grid 8 pillars
 *  3. AboutInventorySection     - "QUY CAN PHONG PHU" + callout Mien Nam
 *  4. AboutTrustedSection       - "DUOC KHACH HANG TIN TUONG"
 *  5. AboutJourneySection       - "DONG HANH CUNG BAN TU A DEN Z" - timeline
 *  6. AboutCtaSection           - "TRO THANH CONG TAC VIEN" - CTA cuoi trang
 *
 * Ghi chu pham vi:
 *  - 2 section cu "KHACH HANG NOI GI" (TestimonialsSection) va "VI SAO
 *    CHON REALTYHUB" (WhyUs) da duoc di chuyen ra khoi trang chu va KHONG
 *    con xuat hien o bat ky trang nao khac - chung chi con ton tai trong
 *    source code vi cac component duoc tai su dung cho muc dich khac.
 *  - Trang nay chi su dung data trong MOCK_ABOUT_PAGE (about-page.mock.ts).
 *  - Khong import MOCK_ABOUT_CONTENT cu de tranh nham lan.
 *  - Route dang ky ctv: /tro-thanh-moi-gioi (AgentOnboardingView da co).
 *  - Route dang nhap: /login.
 */

import type { Metadata } from 'next';

import AboutCtaSection from '@/modules/about/components/AboutCtaSection';
import AboutHeroSection from '@/modules/about/components/AboutHeroSection';
import AboutIntroSection from '@/modules/about/components/AboutIntroSection';
import AboutInventorySection from '@/modules/about/components/AboutInventorySection';
import AboutJourneySection from '@/modules/about/components/AboutJourneySection';
import AboutTrustedSection from '@/modules/about/components/AboutTrustedSection';
import { MOCK_ABOUT_PAGE } from '@/modules/about/mocks/about-page.mock';

export const metadata: Metadata = {
  title: 'Giới thiệu RealtyHub',
  description:
    'RealtyHub là nền tảng công nghệ dành riêng cho môi giới bất động sản — cung cấp thông tin dự án, quỹ căn tập trung (đặc biệt tại miền Nam) và bộ công cụ hỗ trợ bán hàng chuyên dụng.',
};

const ABOUT = MOCK_ABOUT_PAGE;

const GioiThieuPage = () => (
  <main className="bg-white">
    {/* 1. HERO */}
    <AboutHeroSection hero={ABOUT.hero} />

    {/* 2. VỀ REALTYHUB - nền tảng cho môi giới */}
    <AboutIntroSection intro={ABOUT.intro} />

    {/* 3. QUỸ CĂN PHONG PHÚ - tập trung miền Nam */}
    <AboutInventorySection inventory={ABOUT.inventory} />

    {/* 4. ĐƯỢC KHÁCH HÀNG TIN TƯỞNG VÀ LỰA CHỌN */}
    <AboutTrustedSection trusted={ABOUT.trusted} />

    {/* 5. ĐỒNG HÀNH CÙNG BẠN TỪ A ĐẾN Z */}
    <AboutJourneySection journey={ABOUT.journey} />

    {/* 6. CTA - Trở thành cộng tác viên */}
    <AboutCtaSection cta={ABOUT.cta} />
  </main>
);

export default GioiThieuPage;
