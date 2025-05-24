import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

export function useVideoUpload(onSuccess) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const xhrRef = useRef(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoFile(null);
    setProgress(0);
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic checks
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file.');
      e.target.value = null;
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('Video must be under 50MB.');
      e.target.value = null;
      return;
    }

    // Check duration and orientation
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);

      const { duration, videoWidth, videoHeight } = video;

      if (duration > 60) {
        toast.error('Video must be 60 seconds or less.');
        e.target.value = null;
        return;
      }

      if (videoHeight <= videoWidth) {
        toast.error('Video must be in portrait orientation.');
        e.target.value = null;
        return;
      }

      setVideoFile(file);
    };
  }, []);

  const uploadVideo = useCallback(() => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!videoFile) {
      toast.error('Please select a video file.');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success('Video uploaded successfully!');
        resetForm();

        if (typeof onSuccess === 'function') onSuccess();
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          toast.error(res.error || 'Upload failed');
        } catch {
          toast.error('Upload failed');
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      toast.error('Upload failed due to network error.');
    };

    xhr.open('POST', '/api/user/upload');
    xhr.send(formData);
  }, [title, description, videoFile, onSuccess]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    videoFile,
    handleFileChange,
    isUploading,
    progress,
    uploadVideo,
  };
}
