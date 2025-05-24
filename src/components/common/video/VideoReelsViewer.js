'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { redirect } from 'next/navigation';
import { useCompactNumber } from '@/hooks/utils/useCompactNumber';

export default function VideoReelsViewer({
  videos,
  currentUserId,
  onLikeToggle,
  onCommentToggle,
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const { format } = useCompactNumber();
  const router = useRouter();
  if (!videos?.length) return null;

  const video = videos[0];

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <div className="relative w-[360px] h-[640px] bg-black rounded-xl overflow-hidden shadow-xl">
        <ReactPlayer
          url={`data:${video.video_mime};base64,${video.video_data}`}
          playing={isPlaying}
          muted={isMuted}
          controls={false}
          loop
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />

        {/* Top-left controls */}
        <div className="absolute top-2 left-2 flex gap-3 text-white z-10">
          <button onClick={() => setIsPlaying((prev) => !prev)} aria-label="Play/Pause">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={() => setIsMuted((prev) => !prev)} aria-label="Mute/Unmute">
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>

        {/* Bottom-left info */}
        <div className="absolute bottom-3 left-3 text-white z-10 max-w-[80%]">
          <span
            className="font-semibold text-blue-400 cursor-pointer hover:underline"
            onClick={() => router.push(`/home?user=${video.uploader_name}`)}
          >
            {video.uploader_name}
          </span>
          <p className="text-lg font-semibold">{video.title}</p>
          <p className="text-sm text-gray-300 line-clamp-3">{video.description}</p>
        </div>

        {/* Right-side actions */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-6 text-white z-10">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                if (!currentUserId) redirect('/login');
                onLikeToggle(video.id);
              }}
              aria-label="Like"
            >
              <Heart fill={video.liked_by_current_user ? 'red' : 'none'} />
            </button>
            <span className="text-xs text-white">{format(video.like_count)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                if (!currentUserId) redirect('/login');
                onCommentToggle(video.id);
              }}
              aria-label="Comment"
            >
              <MessageCircle />
            </button>
            <span className="text-xs text-white">{format(video.comment_count)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
