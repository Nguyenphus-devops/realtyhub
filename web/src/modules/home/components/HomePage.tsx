'use client';

import NewsSpotlight from '@/modules/news/components/NewsSpotlight';
import { useHomeContent } from '../hooks/useHome';
import type { HomeContent } from '../models/home.model';
import FeaturedProjects from './FeaturedProjects';
import HeroSearch from './HeroSearch';
import QuickUtilities from './QuickUtilities';
import TestimonialsSection from './TestimonialsSection';
import Thongbao from './Thongbao';
import WhyUs from './WhyUs';

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
      <div className="bg-white">
        <div className="site-container">
          <NewsSpotlight />
        </div>
      </div>
      <TestimonialsSection testimonials={content.testimonials} />
      <FeaturedProjects projects={content.featuredProjects} />
      <WhyUs features={content.features} />
      </div>
    </>
  );
};

export default HomePage;
