import InboxClient from '@/modules/tin-nhan/components/InboxClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hộp thư tin nhắn',
  description:
    'Tin nhắn với môi giới, chủ đầu tư và đội ngũ hỗ trợ RealtyHub — tất cả hội thoại quản lý tại một nơi.',
};


const TinNhanPage = () => (
  <main>
    <InboxClient />
  </main>
);

export default TinNhanPage;
