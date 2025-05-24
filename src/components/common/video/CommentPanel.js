'use client';

import React from 'react';
import { useComments } from '@/hooks/comments/useComments';
import { useCompactNumber } from '@/hooks/utils/useCompactNumber';
import cn from 'classnames';

export default function CommentPanel({ videoId, currentUserId, onCommentCountChange }) {
  const {
    loading,
    comments,
    content,
    setContent,
    replyTo,
    setReplyTo,
    submitting,
    handleSubmit,
    collapsedReplies,
    toggleReplies,
    topLevel,
    repliesMap,
  } = useComments(videoId, currentUserId);

  const { format } = useCompactNumber();

  const renderProfilePhoto = (comment) => {
    if (comment.profile_photo) {
      return (
        <img
          src={comment.profile_photo}
          alt={`${comment.username} profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-lg">
        {comment.username.charAt(0).toUpperCase()}
      </div>
    );
  };

  // Wrap the original handleSubmit to also notify parent of new comment count
  const handleSubmitWithCountUpdate = async () => {
    const updatedComments = await handleSubmit();

    if (onCommentCountChange && updatedComments) {
      // Use updated comments length as new comment count
    onCommentCountChange(videoId, updatedComments.length);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="font-semibold text-white text-lg mb-2">
        Comments {comments.length > 0 ? format(comments.length) : '0'}
      </h2>

      {/* Scrollable comments section */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {loading ? (
          <p className="text-gray-400">Loading comments...</p>
        ) : (
          topLevel.map((comment) => (
            <div key={comment.id} className=" border-zinc-700 pb-2">
              <div className="flex items-start gap-3">
                {renderProfilePhoto(comment)}
                <div className="flex flex-col">
                  <p className="text-sm text-white font-semibold">{comment.username}</p>
                  <p className="text-white">{comment.content}</p>
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="text-xs text-blue-400 rounded-full px-3 py-1 transition-all hover:bg-blue-500/10 self-start w-auto"
                  >
                    Reply
                  </button>
                </div>
              </div>

              <div className="pl-14 mt-2 space-y-2">
                {repliesMap[comment.id]?.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className={cn(
                      'flex items-center gap-1 text-xs text-indigo-400 rounded-full px-3 py-1 transition-all',
                      'hover:bg-indigo-500/10'
                    )}
                  >
                    <span>{!collapsedReplies[comment.id] ? '▼' : '▲'}</span>
                    <span>
                      {!collapsedReplies[comment.id]
                        ? `Show ${repliesMap[comment.id].length} repl${repliesMap[comment.id].length > 1 ? 'ies' : 'y'}`
                        : `Hide repl${repliesMap[comment.id].length > 1 ? 'ies' : 'y'}`}
                    </span>
                  </button>
                )}

                {collapsedReplies[comment.id] &&
                  (repliesMap[comment.id] || []).map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3 text-sm text-zinc-300">
                      {renderProfilePhoto(reply)}
                      <div className="flex flex-col">
                        <p className="font-semibold">{reply.username}</p>
                        <p>{reply.content}</p>
                        <button
                          className="text-xs text-blue-400 rounded-full px-3 py-1 transition-all hover:bg-blue-500/10 self-start w-auto"
                          onClick={() => setReplyTo(reply)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment input at the bottom */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-700">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            replyTo
              ? `Replying to ${replyTo.parent_comment_id ? `@${replyTo.username}` : replyTo.username}...`
              : 'Write a comment...'
          }
          className="flex-1 px-4 py-2 rounded-md bg-zinc-800 text-white"
        />
        <button
          onClick={handleSubmitWithCountUpdate}
          disabled={submitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
        >
          {submitting ? 'Working...' : 'Comment'}
        </button>
      </div>
    </div>
  );
}
