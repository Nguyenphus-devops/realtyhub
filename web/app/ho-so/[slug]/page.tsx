import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import AreaRatingCTA from '@/modules/profile/components/AreaRatingCTA';
import ListingsSection from '@/modules/profile/components/ListingsSection';
import PublicProfileHeader from '@/modules/profile/components/PublicProfileHeader';
import ReviewsSection from '@/modules/profile/components/ReviewsSection';
import { MOCK_PROFILE } from '@/modules/profile/mocks/profile.mock';
import { profileService } from '@/modules/profile/services/profile.service';

/**
 * Trang profile public /ho-so/[slug].
 *
 * Trang nay la server component de SSR cho SEO (Google/Meta canh thi
 * cac trang profile user de ranking). `PublicProfileHeader` la client
 * component vi co share button + popover.
 *
 * Server-side check `isOwnProfile` qua cookie token (mock: lay tu slug
 * 'me' hoac slug trung MOCK_PROFILE.slug de demo). Sau nay se doc
 * token -> user.id -> so sanh voi profile.id.
 */

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await profileService.findBySlug(slug);
  if (!profile) return { title: 'Không tìm thấy trang cá nhân' };
  return {
    title: `${profile.name} - RealtyHub`,
    description: `Trang cá nhân của ${profile.name} trên RealtyHub.`,
  };
}

const HoSoPage = async ({ params }: Props) => {
  const { slug } = await params;
  const profile = await profileService.findBySlug(slug);
  if (!profile) notFound();

  // Quyet dinh "trang cua minh": mock = slug trung MOCK_PROFILE.slug.
  // TODO backend: doc cookie token -> goi /auth/me -> so sanh user.id.
  // Client component `IsOwnBadge` se doc localStorage user de match
  // trong client-side (khi user da login). Server khong biet localStorage.
  const isOwnByServer = slug === MOCK_PROFILE.slug;

  return (
    <div className="site-container max-w-3xl py-8 md:py-12">
      {/* Header: banner QC + avatar + ten + chips + edit/share */}
      <PublicProfileHeader profile={profile} isOwnByServer={isOwnByServer} />

      {/* Card quang cao danh gia khu vuc */}
      <div className="mt-6">
        <AreaRatingCTA location={profile.location} />
      </div>

      {/* Tat ca tin dang + tabs + empty state */}
      <div className="mt-6">
        <ListingsSection />
      </div>

      {/* Danh gia */}
      <div className="mt-6">
        <ReviewsSection />
      </div>
    </div>
  );
};

export default HoSoPage;