'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import HomeHeader from './HomeHeader';
import VideoList from '../common/video/VideoList';
import { useHomeFeed } from '@/hooks/home/useHomeFeed';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function HomeView({ userProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q') || '';
  const exactUser = searchParams.get('user') || '';

  const {
    videos,
    setVideos,
    loading,
    hasMore,
    loadMore,
    handleLikeToggle,
    handleCommentToggle,
    activeCommentVideoId,
    manuallyClosed,
    selectedUserData
  } = useHomeFeed(userProfile?.id, searchQuery, exactUser);

  return (
    <>
      <Head>
        <title>
          {exactUser
            ? `@${exactUser}'s Profile`
            : searchQuery
            ? `Search: ${searchQuery}`
            : 'Home Feed'} - SVideos
        </title>
      </Head>

      <HomeHeader user={userProfile} />

      {/* Exact User Profile Card */}
      {exactUser && selectedUserData && (
        <div className="fixed top-16 left-0 h-full z-40 bg-white border rounded p-4 shadow-md w-72">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={selectedUserData.profile_photo || '/assets/images/avatar/defaultAvatar.png'}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold">@{selectedUserData.username}</p>
              <p className="text-xs text-gray-600 truncate">{selectedUserData.email}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/home')}
            className="mt-2 text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* General search info (q=) */}
      {searchQuery && !exactUser && (
        <div className="fixed top-16 left-0 z-40 flex justify-center pointer-events-none pt-4">
          <div className="bg-blue-900 text-white text-sm px-4 py-2 rounded shadow-md flex justify-between items-center max-w-2xl w-full pointer-events-auto">
            <span>
              Search results for : <strong>{searchQuery}</strong>
            </span>
            <button
              onClick={() => router.push('/home')}
              className="ml-4 px-2 py-1 text-xs rounded bg-blue-700 hover:bg-blue-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {videos.length > 0 ? (
        <VideoList
          currentUserId={userProfile?.id}
          videos={videos}
          setVideos={setVideos}
          onLikeToggle={handleLikeToggle}
          onCommentToggle={handleCommentToggle}
          activeCommentVideoId={activeCommentVideoId}
          loadMore={loadMore}
          hasMore={hasMore}
          loading={loading}
          manuallyClosed={manuallyClosed}
        />
      ) : (
        !loading && (
          <div className="flex items-center justify-center h-[calc(100vh)] text-gray-400 text-2xl">
            No videos found.
          </div>
        )
      )}
    </>
  );
}
