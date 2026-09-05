import type { Metadata } from 'next';
import EventsListPage from '@/modules/events/components/EventsListPage';

/**
 * Trang /su-kien - lich su kien BĐS (workshop, hoi thao, networking, open
 * house, webinar). Layout do EventsListPage (client component) dam nhan de
 * co the dung bo loc client-side muot.
 */
export const metadata: Metadata = {
  title: 'Sự kiện',
  description:
    'Workshop, hội thảo, webinar và networking về bất động sản — cập nhật lịch sự kiện RealtyHub mới nhất.',
};

const SuKienPage = () => <EventsListPage />;

export default SuKienPage;
