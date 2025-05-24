'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useProfilePhotoUpload } from '@/hooks/header/useProfilePhotoUpload';
import { useRouter } from 'next/navigation';

export default function UserDropdown({ username, email, profile_photo, onPhotoUploaded }) {
    const [isLoading, setIsLoading] = useState(false);
    const router=useRouter();
    const {
        showPhotoUpload,
        setShowPhotoUpload,
        isUploading,
        handlePhotoChange,
        uploadPhoto,
        selectedFileBlob,
        uploadSuccess, 
    } = useProfilePhotoUpload({
        onSuccess: () => {
        setShowPhotoUpload(false);
        },
    });


    useEffect(() => {
        if (uploadSuccess && selectedFileBlob && onPhotoUploaded) {
            onPhotoUploaded(selectedFileBlob);
        }
    }, [uploadSuccess, selectedFileBlob, onPhotoUploaded]);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
        await signOut({ redirect: false });
        toast.success('Successfully logged out!');
        redirect('/login');
        } catch (error) {
        if (isRedirectError(error)) throw error;
        toast.error('Error logging out');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="absolute top-0 right-full mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 text-sm text-black">
        <div className="flex items-center gap-2 mb-4">
            <img src={profile_photo} className="w-10 h-10 rounded-full" alt="User" />
            <div>
            <p className="font-semibold truncate">{username}</p>
            <p className="text-gray-600 truncate">{email}</p>
            </div>
        </div>

        <button
            className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 transition"
            onClick={() => setShowPhotoUpload(true)}
        >
            Change Profile Picture
        </button>

        {showPhotoUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Change Profile Picture</h2>
                <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mb-4"
                />
                <div className="flex justify-end gap-2">
                <button
                    onClick={() => setShowPhotoUpload(false)}
                    className="text-sm px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={uploadPhoto}
                    disabled={isUploading}
                    className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isUploading ? 'Uploading...' : 'Save'}
                </button>
                </div>
            </div>
            </div>
        )}

        <button
            onClick={() => {
                router.push(`/home?user=${username}`);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
        >
            My Videos
        </button>


        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 text-red-600 transition disabled:opacity-50"
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
        </div>
    );
}
