import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';
import { db } from '@/lib/db';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ?? null;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const cursor = searchParams.get('cursor'); // previous video ID
    const search = searchParams.get('search') || '';
    const user = searchParams.get('user') || '';

    let values = [];
    let baseQuery = `
      SELECT 
        v.id, v.title, v.description, v.video_url,
        u.username AS uploader_name,
        (SELECT COUNT(*) FROM likes l WHERE l.video_id = v.id) AS like_count,
        (SELECT COUNT(*) FROM comments c WHERE c.video_id = v.id) AS comment_count,
        ${currentUserId ? `EXISTS (
          SELECT 1 FROM likes l WHERE l.video_id = v.id AND l.user_id = ?
        )` : 'false'} AS liked_by_current_user
      FROM videos v
      JOIN users u ON v.user_id = u.id
    `;

    const whereClauses = [];

    if (cursor) {
      whereClauses.push('v.id < ?');
    }

    if (user) {
      whereClauses.push('u.username = ?');
    } else if (search) {
      whereClauses.push('(v.title LIKE ? OR u.username LIKE ?)');
    }

    if (whereClauses.length > 0) {
      baseQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    baseQuery += ` ORDER BY v.id DESC LIMIT ${limit + 1}`;

    // Prepare values for SQL placeholders
    if (currentUserId) values.push(currentUserId);
    if (cursor) values.push(cursor);
    if (user) {
      values.push(user);
    } else if (search) {
      const pattern = `%${search}%`;
      values.push(pattern, pattern);
    }

    const [rows] = await db.execute(baseQuery, values);

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, -1) : rows;

    const videos = sliced.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      uploader_name: video.uploader_name,
      like_count: video.like_count,
      comment_count: video.comment_count,
      liked_by_current_user: Boolean(video.liked_by_current_user),
    }));

    // If exact user view, fetch their full profile
    let userData = null;
    if (user) {
      const [[userRow]] = await db.execute(
        `SELECT username, email, profile_photo FROM users WHERE username = ?`,
        [user]
      );

      if (userRow) {
        userData = {
          username: userRow.username,
          email: userRow.email,
          profile_photo: userRow.profile_photo
            ? `data:image/jpeg;base64,${userRow.profile_photo.toString('base64')}`
            : null,
        };
      }
    }

    return new Response(
      JSON.stringify({
        videos,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
        ...(userData ? { user: userData } : {}),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Feed API Error]', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
