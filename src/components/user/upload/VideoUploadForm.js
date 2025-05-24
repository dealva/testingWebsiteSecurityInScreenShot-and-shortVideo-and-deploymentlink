'use client';

import { useVideoUpload } from "@/hooks/user/upload/useVideoUpload";
import BackToHomeButton from "@/components/common/BackToHomeButton";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
    const router = useRouter();
    const {
        title,
        setTitle,
        description,
        setDescription,
        videoFile,
        handleFileChange,
        isUploading,
        progress,
        uploadVideo,
    } = useVideoUpload(() => {
        router.push('/home'); 
    });

    return (
    <div className="min-h-screen flex items-center justify-center px-4">
        <form
        onSubmit={(e) => {
            e.preventDefault();
            uploadVideo();
        }}
        className="w-full max-w-md p-6 bg-white rounded shadow"
        >
        <div className="flex mb-4 justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>
        <BackToHomeButton />
        </div>
        <label className="block mb-2">
            Title <span className="text-red-600">*</span>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={isUploading}
            />
        </label>

        <label className="block mb-2">
            Description
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isUploading}
            />
        </label>

        <label className="block mb-4">
            Video File <span className="text-red-600">*</span>
            <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="w-full"
            disabled={isUploading}
            />
        </label>

        {isUploading && (
            <div className="mb-4 w-full bg-gray-200 rounded h-4">
            <div
                className="bg-blue-600 h-4 rounded"
                style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
            />
            </div>
        )}

        <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {isUploading ? `Uploading... ${progress}%` : 'Upload Video'}
        </button>
        </form>
    </div>
    );

}
