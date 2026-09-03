import ContactsAdminPage from "@/modules/contact/components/ContactsAdminPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Danh sách liên hệ & đặt chỗ",
};
export default function AdminContactPage() {
  return <ContactsAdminPage />;
}
