import { MediaGallery } from "@/modules/media/components/MediaGallery";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Danh sách hình ảnh",
};
export default function MediaPage() {
  return (
      <MediaGallery />
  );
}