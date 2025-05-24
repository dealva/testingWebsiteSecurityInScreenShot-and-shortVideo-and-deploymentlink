import { metadataConfig } from '@/lib/metadata';
import VideoUploadForm from '@/components/user/upload/VideoUploadForm';

export const metadata = metadataConfig.upload;

export default function UploadPage() {
  return (

      <VideoUploadForm />

  );
}