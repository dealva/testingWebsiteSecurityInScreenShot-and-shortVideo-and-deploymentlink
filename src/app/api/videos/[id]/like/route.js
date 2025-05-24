import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { db } from '@/lib/db';

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const videoIdData=await params;
  const videoId = videoIdData.id;

  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  try {
    // Check if already liked
    const [existing] = await db.query(
      'SELECT 1 FROM likes WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    if (existing.length > 0) {
      await db.query(
        'DELETE FROM likes WHERE user_id = ? AND video_id = ?',
        [userId, videoId]
      );
    } else {
      await db.query(
        'INSERT INTO likes (user_id, video_id) VALUES (?, ?)',
        [userId, videoId]
      );
    }

    // Fetch updated like count
    const [likeCountResult] = await db.query(
      'SELECT COUNT(*) AS like_count FROM likes WHERE video_id = ?',
      [videoId]
    );

    const like_count = likeCountResult[0].like_count;

    return NextResponse.json({
      message: existing.length > 0 ? 'Video unliked' : 'Video liked',
      liked: existing.length === 0,
      like_count,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
