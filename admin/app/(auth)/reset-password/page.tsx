import ResetPasswordForm from "@/auth/reset-password/ResetPasswordForm";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Tạo lại mật khẩu",
};
const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
