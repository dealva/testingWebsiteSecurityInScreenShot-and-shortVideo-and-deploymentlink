'use client';

import { useEffect, useState, useRef } from 'react';

export function useHomeFeed(currentUserId, search, exactUser) {
  const [videos, setVideos] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
  const [manuallyClosed, setManuallyClosed] = useState(true);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const fetchVideos = async (cursor = null) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '5' });

    if (cursor) params.append('cursor', cursor);
    if (exactUser) params.append('user', exactUser);
    else if (search) params.append('search', search);

    try {
      const res = await fetch(`/api/videos/feed?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch');

      setVideos((prev) => (cursor ? [...prev, ...data.videos] : data.videos));
      setNextCursor(data.nextCursor);

      if (exactUser && data.user) {
        setSelectedUserData(data.user);
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVideos([]);
    setNextCursor(null);
    setSelectedUserData(null);
    fetchVideos();
  }, [search, exactUser]);

  const handleLikeToggle = async (videoId) => {
    if (!currentUserId) return;

    try {
      const res = await fetch(`/api/videos/${videoId}/like`, { method: 'POST' });
      const data = await res.json();

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                liked_by_current_user: !v.liked_by_current_user,
                like_count: data.like_count,
              }
            : v
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentToggle = (videoId) => {
    if (activeCommentVideoId === videoId) {
      setActiveCommentVideoId(null);
      setManuallyClosed(true);
    } else {
      setActiveCommentVideoId(videoId);
      setManuallyClosed(false);
    }
  };

  return {
    videos,
    setVideos,
    loading,
    hasMore: Boolean(nextCursor),
    loadMore: () => {
      if (nextCursor && !loading) fetchVideos(nextCursor);
    },
    handleLikeToggle,
    handleCommentToggle,
    activeCommentVideoId,
    manuallyClosed,
    selectedUserData,
  };
}
