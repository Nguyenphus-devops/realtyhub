import ComfirmEmail from '@/auth/comfirm-email/ConfirmEmail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Xác nhận Email",
};

const ComfirmEmailApp = () => {
  return <ComfirmEmail />;
};

export default ComfirmEmailApp;