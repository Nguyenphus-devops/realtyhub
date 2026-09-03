import type { Metadata } from 'next';
import AgentOnboardingView from '@/modules/agent-onboarding/components/AgentOnboardingView';

export const metadata: Metadata = {
  title: 'Trở thành môi giới',
  description:
    'Hoàn tất 4 bước đăng ký để trở thành đối tác môi giới chính thức của Saleplust: khu vực hoạt động, người cố vấn, định danh điện tử và chứng chỉ hành nghề.',
};

const TroThanhMoiGioiPage = () => <AgentOnboardingView />;

export default TroThanhMoiGioiPage;
