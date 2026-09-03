import { FiMoon } from 'react-icons/fi';

import ComingSoon from '@/common/components/ComingSoon';

const LichAmPage = () => (
  <ComingSoon
    title="Lịch âm Việt Nam"
    description="Xem lịch âm, can chi, ngày tốt xấu, giờ hoàng đạo. Đồng bộ với dương lịch, tra cứu nhanh các ngày lễ tết truyền thống."
    icon={FiMoon}
    tone="accent"
  />
);

export default LichAmPage;