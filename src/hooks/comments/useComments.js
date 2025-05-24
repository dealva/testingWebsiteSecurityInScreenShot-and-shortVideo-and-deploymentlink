'use client';

import { useEffect, useState } from 'react';

export function useComments(videoId, currentUserId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [collapsedReplies, setCollapsedReplies] = useState({});

  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos/${videoId}/comments`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch comments');
        setComments(data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const getTopLevelParentId = (comment) => {
    if (!comment.parent_comment_id) return comment.id;
    const parent = comments.find(c => c.id === comment.parent_comment_id);
    return parent ? getTopLevelParentId(parent) : comment.id;
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);

    try {
      let bodyContent = content.trim();
      let parentCommentId = null;

      if (replyTo) {
        parentCommentId = getTopLevelParentId(replyTo);

        if (replyTo.parent_comment_id) {
          bodyContent = `@${replyTo.username} ${bodyContent}`;
        }
      }

      const body = {
        content: bodyContent,
        userId: currentUserId,
        parentCommentId,
      };

      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setContent('');
        setReplyTo(null);
        const updated = await fetch(`/api/videos/${videoId}/comments`);
        const updatedData = await updated.json();
        setComments(updatedData.comments);
        return updatedData.comments;
      } else {
        console.error('Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId) => {
    setCollapsedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const topLevel = comments.filter((c) => c.parent_comment_id === null);

  const repliesMap = comments.reduce((acc, c) => {
    if (c.parent_comment_id) {
      acc[c.parent_comment_id] = acc[c.parent_comment_id] || [];
      acc[c.parent_comment_id].push(c);
    }
    return acc;
  }, {});

  return {
    comments,
    loading,
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
  };
}
