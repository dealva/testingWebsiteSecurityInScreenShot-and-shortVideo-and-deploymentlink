import { useState } from 'react';
import { toast } from 'react-toastify';

export function useProfilePhotoUpload({ onSuccess } = {}) {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedFileBlob, setSelectedFileBlob] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePhotoChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setSelectedFileBlob(selected);
    setUploadSuccess(false); // reset success state when new file selected
  };

  const uploadPhoto = async () => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false); // reset before upload

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/user/profile-photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      toast.success('Profile photo updated!');
      setUploadSuccess(true);
      onSuccess?.();
    } catch (err) {
      toast.error('Error uploading photo.');
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    showPhotoUpload,
    setShowPhotoUpload,
    isUploading,
    handlePhotoChange,
    uploadPhoto,
    selectedFileBlob,
    uploadSuccess,  
  };
}
