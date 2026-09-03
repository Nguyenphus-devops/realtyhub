import { FiUsers } from 'react-icons/fi';

import ComingSoon from '@/common/components/ComingSoon';

const CrmPage = () => (
  <ComingSoon
    title="CRM - Quản lý khách hàng"
    description="Công cụ CRM dành cho môi giới bất động sản: lưu thông tin khách hàng, theo dõi deal, lịch hẹn, đánh dấu tiềm năng."
    icon={FiUsers}
    tone="brand"
  />
);

export default CrmPage;