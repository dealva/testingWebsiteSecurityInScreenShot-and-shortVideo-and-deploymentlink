'use client';

import { useRouter } from 'next/navigation';

export default function UploadButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/user/upload');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    >
      Upload
    </button>
  );
}
