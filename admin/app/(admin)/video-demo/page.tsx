import VideoUploadDemo from "@/modules/media/components/VideoUploadDemo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Upload Video",
  description: "Trang demo upload video với progress tracking",
};

export default function VideoDemoPage() {
  return <VideoUploadDemo />;
}
