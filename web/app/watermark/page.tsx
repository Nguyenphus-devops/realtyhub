import { FiDroplet } from 'react-icons/fi';

import ComingSoon from '@/common/components/ComingSoon';

const WatermarkPage = () => (
  <ComingSoon
    title="Watermark"
    description="Thêm watermark bản quyền, logo, chữ ký lên ảnh và tài liệu PDF. Tùy chỉnh vị trí, độ trong suốt, font chữ."
    icon={FiDroplet}
    tone="gold"
  />
);

export default WatermarkPage;