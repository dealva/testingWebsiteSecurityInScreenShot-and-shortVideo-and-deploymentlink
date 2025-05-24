'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import VideoReelsViewer from './VideoReelsViewer';
import CommentPanel from './CommentPanel';
import { useScrollableVideoList } from '@/hooks/video/useScrollableVideoList';
import cn from 'classnames';

export default function VideoList({
  currentUserId,
  videos,
  setVideos,           // <-- you need to pass this setter from parent or manage videos state here
  onLikeToggle,
  onCommentToggle,
  activeCommentVideoId,
  loadMore,
  hasMore,
  loading,
  manuallyClosed,
}) {
  const { containerRef, videoRefs, currentIndex, scrollTo } = useScrollableVideoList(videos, {
    hasMore,
    loading,
    loadMore,
  });

  useEffect(() => {
    if (!manuallyClosed && videos[currentIndex]) {
      if (videos[currentIndex].id !== activeCommentVideoId) {
        onCommentToggle(videos[currentIndex].id);
      }
    }
  }, [currentIndex, manuallyClosed, videos, onCommentToggle, activeCommentVideoId]);

  const updateCommentCount = (videoId, newCount) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, comment_count: newCount } : video
      )
    );
  };
 

  return (
    <>
      <div ref={containerRef} className="overflow-y-auto h-screen snap-y snap-mandatory no-scrollbar">
        {videos.map((video, index) => {
          const isActive = activeCommentVideoId === video.id;

          return (
            <div
              key={video.id || index}
              data-index={index}
              ref={(el) => (videoRefs.current[index] = el)}
              className="snap-start relative"
              style={{ height: '100vh', paddingTop: '64px' }}
            >
              <div className="relative h-full w-full overflow-hidden flex justify-center px-16">
                <div className="relative h-full w-full flex items-center justify-center transition-all duration-300 ease-in-out">
                  {/* Video container with transform shift */}
                  <div
                    className={cn(
                      'transition-transform duration-300 ease-in-out',
                      isActive && 'translate-x-[-150px]'
                    )}
                  >
                    <VideoReelsViewer
                      videos={[video]}
                      currentUserId={currentUserId}
                      onLikeToggle={onLikeToggle}
                      onCommentToggle={() => onCommentToggle(video.id)}
                      initialIndex={0}
                      isSingleVideo
                    />
                  </div>

                  {/* Comment panel: absolute, animated in/out */}
                  <div
                    className={cn(
                      'absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out overflow-hidden',
                      isActive ? 'w-[600px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    )}
                  >
                    <div className="h-[640px] bg-white dark:bg-zinc-900 text-black dark:text-white border-l border-zinc-800 shadow-lg overflow-y-auto rounded-l-xl p-4">
                      {isActive && (
                        <CommentPanel
                          videoId={video.id}
                          currentUserId={currentUserId}
                          onCommentCountChange={updateCommentCount}  
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && <div className="text-white text-center p-4">Loading more...</div>}
      </div>

      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-50">
        {currentIndex > 0 && (
          <button
            onClick={() => scrollTo(currentIndex - 1)}
            className="bg-indigo-500/60 hover:bg-indigo-500/90 text-white p-2 rounded-full"
          >
            <ArrowUp />
          </button>
        )}
        {(currentIndex < videos.length - 1 || hasMore) && (
          <button
            onClick={() => scrollTo(currentIndex + 1)}
            className="bg-indigo-500/60 hover:bg-indigo-500/90 text-white p-2 rounded-full"
          >
            <ArrowDown />
          </button>
        )}
      </div>
    </>
  );
}
