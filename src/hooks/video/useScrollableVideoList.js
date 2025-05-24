'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HEADER_HEIGHT = 64;

export function useScrollableVideoList(videos, { hasMore, loading, loadMore }) {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const observerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Observe which video is visible
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const index = parseInt(visible.target.dataset.index);
          setCurrentIndex(index);

          if (index === videos.length - 1 && hasMore && !loading) {
            loadMore?.();
          }
        }
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => observerRef.current?.disconnect();
  }, [videos, hasMore, loading, loadMore]);

  // Scroll to a video programmatically
  const scrollTo = useCallback((index) => {
    const target = videoRefs.current[index];
    if (target) {
      const top = target.offsetTop - HEADER_HEIGHT;
      containerRef.current?.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        scrollTo(Math.min(currentIndex + 1, videos.length - 1));
      } else if (e.key === 'ArrowUp') {
        scrollTo(Math.max(currentIndex - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollTo, currentIndex, videos.length]);

  return {
    containerRef,
    videoRefs,
    currentIndex,
    scrollTo,
  };
}
