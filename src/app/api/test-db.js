import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    return Response.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message });
  }
}