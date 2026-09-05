'use client';

import NewsSpotlight from '@/modules/news/components/NewsSpotlight';
import EventsSection from '@/modules/events/components/EventsSection';
import FeaturedUnits from '@/modules/project/components/FeaturedUnits';
import { useHomeContent } from '../hooks/useHome';
import type { HomeContent } from '../models/home.model';
import Doitac from './Doitac';
import FeaturedProjects from './FeaturedProjects';
import HeroSearch from './HeroSearch';
import QuickUtilities from './QuickUtilities';
import Thongbao from './Thongbao';

type HomePageProps = {
  /** Noi dung doc san tu server (route page) - tranh loading o lan paint dau */
  initialContent: HomeContent;
};

const HomePage = ({ initialContent }: HomePageProps) => {
  const { data } = useHomeContent(initialContent);
  const content = data ?? initialContent;

  return (
    <>
      <div className="bg-white mx-auto">
        <HeroSearch slides={content.banners} />
        <Thongbao />

        <div className="bg-white pb-8 pt-16 md:pt-24">
          <QuickUtilities />
        </div>
        <FeaturedProjects projects={content.featuredProjects} />
        <FeaturedUnits initialUnits={content.featuredUnits} />
        <EventsSection />
        <Doitac initialInvestors={content.investors} />
        <div className="bg-white">
          <div className="site-container">
            <NewsSpotlight />
          </div>
        </div>
        {/* Ghi chu:
            - "KHACH HANG NOI GI" (TestimonialsSection) va "VI SAO CHON REALTYHUB"
              (WhyUs) da duoc di chuyen ve trang /gioi-thieu.
            - Chung KHONG xuat hien tren trang chu, cung khong nam trong
              layout dung chung (RootLayout / Footer). Chi su dung trong
              module About (src/modules/about/components).
            - Ly do: 2 khoi nay phu hop voi mot trang gioi thieu chinh thuc
              hon la trang chu tong quan. */}
      </div>
    </>
  );
};

export default HomePage;
