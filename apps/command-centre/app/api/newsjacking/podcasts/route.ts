import { NextResponse } from 'next/server';

type Episode = {
  id: string;
  show: string;
  title: string;
  link: string;
  publishedAt: string;
  audioUrl?: string;
  description?: string;
};

const DEFAULT_SHOWS = [
  'Startup Ideas with Greg Isenberg',
  'A New Vibe by Riley Brown',
  'Marketing Against the Grain',
  'My First Million',
  "You've Been a Bad Agent",
];

function withTimeout<T>(promise: Promise<T>, ms: number, message = 'Request timed out'): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return new Promise<T>((resolve, reject) => {
    promise
      .then((v) => resolve(v))
      .catch((e) => reject(e))
      .finally(() => clearTimeout(timeout));
  });
}

async function fetchJSON(input: string, init?: RequestInit) {
  const res = await withTimeout(fetch(input, { ...init, cache: 'no-store' }), 8000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function searchITunesFeedUrl(show: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(show);
    const url = `https://itunes.apple.com/search?term=${q}&media=podcast&entity=podcast&limit=1`;
    const data = await fetchJSON(url);
    const item = data?.results?.[0];
    const feedUrl: string | undefined = item?.feedUrl || item?.feed_url;
    return feedUrl || null;
  } catch {
    return null;
  }
}

function extract(text: string, tag: string): string | undefined {
  const m = text.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i'));
  return m ? m[1].trim() : undefined;
}

function parseRssEpisodes(xml: string, show: string, max = 5): Episode[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  const episodes: Episode[] = [];
  for (const chunk of items.slice(0, max)) {
    const title = extract(chunk, 'title') || 'Untitled';
    const link = extract(chunk, 'link') || '#';
    const pubDate = extract(chunk, 'pubDate') || new Date().toISOString();
    const enclosureMatch = chunk.match(/<enclosure[^>]*url="([^"]+)"/i);
    const desc = extract(chunk, 'description');
    episodes.push({
      id: `${show}:${link || title}`,
      show,
      title,
      link,
      publishedAt: pubDate,
      audioUrl: enclosureMatch ? enclosureMatch[1] : undefined,
      description: desc,
    });
  }
  return episodes;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showsParam = searchParams.get('shows');
    const shows = showsParam ? showsParam.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_SHOWS;

    const results: Episode[] = [];

    for (const show of shows) {
      const feedUrl = await searchITunesFeedUrl(show);
      if (!feedUrl) continue;
      try {
        const rssRes = await withTimeout(fetch(feedUrl, { cache: 'no-store' }), 8000);
        if (!rssRes.ok) continue;
        const xml = await rssRes.text();
        const eps = parseRssEpisodes(xml, show, 6);
        results.push(...eps);
      } catch {
        // skip failures silently
      }
    }

    // Sort by published date desc where possible
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ success: true, count: results.length, episodes: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


