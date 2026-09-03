import { FiFileText } from 'react-icons/fi';

import ComingSoon from '@/common/components/ComingSoon';

const PdfConverterPage = () => (
  <ComingSoon
    title="PDF Converter"
    description="Chuyển đổi tài liệu PDF sang Word, Excel, PowerPoint, JPG và ngược lại. Xử lý hàng loạt, giữ nguyên định dạng."
    icon={FiFileText}
    tone="brand"
  />
);

export default PdfConverterPage;