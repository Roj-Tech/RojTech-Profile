'use client';

/** Convert emoji to a local Twemoji SVG path (font-independent). */
function emojiAssetPath(emoji: string): string {
  const cps: string[] = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp === undefined) continue;
    // Skip variation selector-16 so Twemoji file names match
    if (cp === 0xfe0f) continue;
    cps.push(cp.toString(16));
  }
  return `/icons/emoji/${cps.join('-')}.svg`;
}

/**
 * Renders emoji as a fixed-size local SVG image.
 * UI fonts (Rabar/Cairo) cannot change the icon size on Windows PC.
 */
export default function EmojiGlyph({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`emoji-glyph emoji-glyph-img ${className}`.trim()}
      src={emojiAssetPath(children)}
      alt=""
      width={64}
      height={64}
      draggable={false}
      decoding="async"
      lang="en"
    />
  );
}
