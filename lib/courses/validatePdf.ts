export const DEFAULT_MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const DEFAULT_MAX_COVER_BYTES = 2 * 1024 * 1024;

export function getMaxUploadBytes() {
  const raw = process.env.MAX_UPLOAD_BYTES;
  const n = raw ? Number(raw) : DEFAULT_MAX_UPLOAD_BYTES;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_UPLOAD_BYTES;
}

export function isPdfBuffer(buf: Buffer) {
  if (buf.length < 5) return false;
  return buf.subarray(0, 5).toString('utf8') === '%PDF-';
}

export function isJpegBuffer(buf: Buffer) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

export function isPngBuffer(buf: Buffer) {
  return (
    buf.length > 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  );
}

export function detectCoverExt(buf: Buffer): 'jpg' | 'png' | null {
  if (isJpegBuffer(buf)) return 'jpg';
  if (isPngBuffer(buf)) return 'png';
  return null;
}
