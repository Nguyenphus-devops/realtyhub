import LoginForm from "@/auth/login/LoginForm";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Đăng nhập",
};
export default function LoginApp() {
  return <LoginForm />;
}