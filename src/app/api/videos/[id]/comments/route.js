import { db } from '@/lib/db'; // adjust if needed
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, { params }) {
  const videoIdData = await params;
  const videoId=videoIdData.id
  const { content, userId, parentCommentId = null } = await req.json();

  if (!videoId || !userId || !content?.trim()) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const id = uuidv4();

    await db.execute(
      `
      INSERT INTO comments (id, video_id, user_id, content, parent_comment_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [id, videoId, userId, content, parentCommentId]
    );

    // Fetch updated comment count
    const [countRows] = await db.query(
      'SELECT COUNT(*) AS comment_count FROM comments WHERE video_id = ?',
      [videoId]
    );

    const comment_count = countRows[0].comment_count;

    return NextResponse.json({
      message: 'Comment added',
      commentId: id,
      comment_count,
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  const videoIdData = await params;
  const videoId = videoIdData.id;
  if (!videoId) {
    return NextResponse.json({ message: 'Video ID is required' }, { status: 400 });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        c.id,
        c.content,
        c.parent_comment_id,
        c.created_at,
        u.id AS user_id,
        u.username,
        u.profile_photo
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.video_id = ?
      ORDER BY c.created_at ASC
      `,
      [videoId]
    );

    const processedRows = rows.map((comment) => ({
    ...comment,
    profile_photo: comment.profile_photo
        ? `data:image/jpeg;base64,${comment.profile_photo.toString('base64')}`
        : null,
    }));
    return NextResponse.json({ comments: processedRows });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
