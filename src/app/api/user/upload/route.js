import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('video');
  const title = formData.get('title');
  const description = formData.get('description');

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'No video file uploaded' }), { status: 400 });
  }

  if (!title || typeof title !== 'string') {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  // Validate MIME type starts with "video/"
  if (!file.type.startsWith('video/')) {
    return new Response(JSON.stringify({ error: 'Invalid file type' }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Optional: limit video size to 16MB (MEDIUMBLOB limit)
  const MAX_SIZE = 16 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'Video file too large (max 16MB)' }), { status: 400 });
  }

  const videoId = uuidv4();

  try {
    await db.execute(
      `INSERT INTO videos (id, user_id, title, description, video_data, video_mime) VALUES (?, ?, ?, ?, ?, ?)`,
      [videoId, session.user.id, title, description, buffer, file.type]
    );

    return new Response(JSON.stringify({ success: true, videoId }), { status: 201 });
  } catch (error) {
    console.error('Video upload error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}
