import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import  cloudinary  from '@/lib/cloudinary';

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

  if (!file.type.startsWith('video/')) {
    return new Response(JSON.stringify({ error: 'Invalid file type' }), { status: 400 });
  }

  try {
    // Convert file to buffer then to base64 data URI
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'video',
      folder: 'svideos', // optional folder
      public_id: uuidv4(), // to keep file name unique
    });

    const videoUrl = uploadResponse.secure_url;
    const videoId = uuidv4();

    // Save video metadata with URL to DB
    await db.execute(
      `INSERT INTO videos (id, user_id, title, description, video_url) VALUES (?, ?, ?, ?, ?)`,
      [videoId, session.user.id, title, description, videoUrl]
    );

    return new Response(JSON.stringify({ success: true, videoId }), { status: 201 });
  } catch (error) {
    console.error('Video upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
}
