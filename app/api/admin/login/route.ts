import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkLoginRateLimit,
  createAdminToken,
  verifyAdminCredentials,
} from '@/lib/courses/auth';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again shortly.' }, { status: 429 });
  }

  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_SHA256) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_PASSWORD (or ADMIN_PASSWORD_SHA256) and SESSION_SECRET.' },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const username = body.username?.trim() || '';
  const password = body.password || '';
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createAdminToken(username);
  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions(60 * 60 * 12));
  return res;
}
