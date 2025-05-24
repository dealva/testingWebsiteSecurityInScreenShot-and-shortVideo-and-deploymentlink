import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { db } from '@/lib/db'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('photo');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await db.execute(
      'UPDATE users SET profile_photo = ? WHERE id = ?',
      [buffer, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
