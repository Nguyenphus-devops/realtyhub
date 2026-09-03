import ForgotPassword from "@/auth/forgot-password/ForgotPassword"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Quên mật khẩu",
};
const ForgotPasswordApp = () => {
  return (
    <ForgotPassword />
  )
}

export default ForgotPasswordApp