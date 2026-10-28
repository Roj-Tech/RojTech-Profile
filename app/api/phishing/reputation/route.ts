import { NextResponse } from 'next/server';
import { analyzeUrl } from '@/lib/phishing/analyzeUrl';

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ available: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const raw = body.url?.trim() || '';
  const local = analyzeUrl(raw);
  if (!local.ok) {
    return NextResponse.json({ available: false, error: local.error }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      available: false,
      message:
        'Optional Google Safe Browsing API key is not configured. Local URL analysis still applies.',
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'rojtech', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: local.normalized.href }],
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        available: false,
        message: `Threat-intelligence provider returned HTTP ${res.status}. Local analysis still applies.`,
      });
    }

    const data = (await res.json()) as { matches?: unknown[] };
    return NextResponse.json({
      available: true,
      matches: data.matches || [],
      message:
        data.matches && data.matches.length > 0
          ? 'Provider reported known threat matches.'
          : 'Provider returned no known matches. This is not a guarantee of safety.',
    });
  } catch {
    return NextResponse.json({
      available: false,
      message: 'Threat-intelligence lookup unavailable. Local analysis still applies.',
    });
  } finally {
    clearTimeout(timer);
  }
}
