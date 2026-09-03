import UsersAdminPage from '@/modules/user/components/UsersAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý người dùng',
};

export default function AdminUsersRoutePage() {
  return <UsersAdminPage />;
}

