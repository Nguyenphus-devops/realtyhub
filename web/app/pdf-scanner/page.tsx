import { FiCamera } from 'react-icons/fi';

import ComingSoon from '@/common/components/ComingSoon';

const PdfScannerPage = () => (
  <ComingSoon
    title="PDF Scanner"
    description="Quét tài liệu, hóa đơn, giấy tờ bằng camera điện thoại thành PDF sắc nét. Tự động cắt, chỉnh sửa góc nghiêng."
    icon={FiCamera}
    tone="jade"
  />
);

export default PdfScannerPage;