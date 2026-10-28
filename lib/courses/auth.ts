import { createHash, timingSafeEqual } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'rojtech_admin_session';

let warnedDevSecret = false;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set to a 32+ character value in production');
  }
  if (!warnedDevSecret) {
    warnedDevSecret = true;
    console.warn('[rojtech] SESSION_SECRET missing — using insecure development fallback');
  }
  return 'dev-only-rojtech-session-secret-change-me';
}

function secretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

function safeEqualString(a: string, b: string) {
  const ah = sha256(a);
  const bh = sha256(b);
  return timingSafeEqual(ah, bh);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  if (!safeEqualString(username, expectedUser)) return false;

  const hash = process.env.ADMIN_PASSWORD_SHA256;
  if (hash) {
    const incoming = createHash('sha256').update(password, 'utf8').digest('hex');
    return safeEqualString(incoming.toLowerCase(), hash.toLowerCase());
  }

  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return false;
  return safeEqualString(password, plain);
}

export async function createAdminToken(username: string) {
  return new SignJWT({ role: 'admin', sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secretKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count += 1;
  return true;
}
