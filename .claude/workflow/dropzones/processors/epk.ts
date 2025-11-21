// .claude/workflow/dropzones/processors/epk.ts

import { promises as fs } from 'fs';
import path from 'path';
import { ProcessResult } from '../types.js';

interface EpkRelease {
  title?: string;
  label?: string;
  date?: string;
}

interface EpkLinks {
  website?: string;
  spotify?: string;
  apple_music?: string;
  soundcloud?: string;
  bandcamp?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}

interface EpkInput {
  artist: string;
  tagline?: string;
  bio?: string;
  press_quotes?: string[];
  highlights?: string[];
  release?: EpkRelease;
  links?: EpkLinks;
  extra?: Record<string, unknown>;
}

interface EpkSummary {
  artist: string;
  hasBio: boolean;
  quotesCount: number;
  highlightsCount: number;
  releaseTitle?: string;
  primaryLinks: string[];
}

function buildMarkdown(epk: EpkInput): string {
  const lines: string[] = [];

  lines.push(`# ${epk.artist}`);
  if (epk.tagline) {
    lines.push('');
    lines.push(`_${epk.tagline}_`);
  }

  if (epk.bio) {
    lines.push('');
    lines.push('## Bio');
    lines.push('');
    lines.push(epk.bio.trim());
  }

  if (epk.press_quotes && epk.press_quotes.length > 0) {
    lines.push('');
    lines.push('## Press Quotes');
    lines.push('');
    for (const quote of epk.press_quotes) {
      lines.push(`> ${quote.trim()}`);
      lines.push('');
    }
  }

  if (epk.highlights && epk.highlights.length > 0) {
    lines.push('');
    lines.push('## Highlights');
    lines.push('');
    for (const h of epk.highlights) {
      lines.push(`- ${h.trim()}`);
    }
  }

  if (epk.release && (epk.release.title || epk.release.label || epk.release.date)) {
    lines.push('');
    lines.push('## Latest Release');
    lines.push('');
    const releaseBits: string[] = [];
    if (epk.release.title) releaseBits.push(`**Title:** ${epk.release.title}`);
    if (epk.release.label) releaseBits.push(`**Label:** ${epk.release.label}`);
    if (epk.release.date) releaseBits.push(`**Release Date:** ${epk.release.date}`);
    lines.push(releaseBits.join('  \n'));
  }

  if (epk.links) {
    const entries: [string, string | undefined][] = [
      ['Website', epk.links.website],
      ['Spotify', epk.links.spotify],
      ['Apple Music', epk.links.apple_music],
      ['SoundCloud', epk.links.soundcloud],
      ['Bandcamp', epk.links.bandcamp],
      ['Instagram', epk.links.instagram],
      ['Twitter', epk.links.twitter],
      ['TikTok', epk.links.tiktok],
      ['YouTube', epk.links.youtube],
    ].filter(([_, url]) => !!url);

    if (entries.length > 0) {
      lines.push('');
      lines.push('## Links');
      lines.push('');
      for (const [label, url] of entries) {
        lines.push(`- **${label}:** ${url}`);
      }
    }
  }

  return lines.join('\n');
}

function buildHtml(epk: EpkInput, markdown: string): string {
  // Very simple HTML wrapper. Later you can swap to your real EPK template.
  const title = `${epk.artist} – EPK`;
  const css = `
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background:#050509; color:#f4f4f5; padding:2rem; line-height:1.5; }
    a { color:#22d3ee; }
    h1, h2 { color:#e5e7eb; }
    blockquote { border-left:3px solid #22d3ee; padding-left:1rem; margin-left:0; color:#e5e7eb; }
    ul { padding-left:1.25rem; }
  `;

  // For now we just wrap the Markdown; later you might run it through a proper MD→HTML renderer.
  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return [
    '<!DOCTYPE html>',
    `<html lang="en">`,
    '<head>',
    `<meta charset="utf-8"/>`,
    `<title>${title}</title>`,
    `<style>${css}</style>`,
    '</head>',
    '<body>',
    `<h1>${epk.artist}</h1>`,
    epk.tagline ? `<p><em>${epk.tagline}</em></p>` : '',
    '<hr/>',
    `<div class="epk-body">${escaped}</div>`,
    '</body>',
    '</html>',
  ].join('\n');
}

export async function processEpkFile(
  inputPath: string,
  processedDir: string,
): Promise<ProcessResult> {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const raw = await fs.readFile(inputPath, 'utf8');

  let epk: EpkInput;
  try {
    epk = JSON.parse(raw);
  } catch (err) {
    return {
      success: false,
      action: 'epk:parse_error',
      message: `Failed to parse EPK JSON: ${(err as Error).message}`,
    };
  }

  if (!epk.artist) {
    return {
      success: false,
      action: 'epk:missing_artist',
      message: 'EPK JSON is missing required field: artist',
    };
  }

  const markdown = buildMarkdown(epk);
  const html = buildHtml(epk, markdown);

  const summary: EpkSummary = {
    artist: epk.artist,
    hasBio: !!epk.bio && epk.bio.trim().length > 0,
    quotesCount: epk.press_quotes?.length ?? 0,
    highlightsCount: epk.highlights?.length ?? 0,
    releaseTitle: epk.release?.title,
    primaryLinks: Object.values(epk.links ?? {}).filter(Boolean) as string[],
  };

  await fs.mkdir(processedDir, { recursive: true });

  const mdPath = path.join(processedDir, `${baseName}-epk.md`);
  const htmlPath = path.join(processedDir, `${baseName}-epk.html`);
  const summaryPath = path.join(processedDir, `${baseName}-epk-summary.json`);

  await fs.writeFile(mdPath, markdown, 'utf8');
  await fs.writeFile(htmlPath, html, 'utf8');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  // 🔌 This is the hook point to update Supabase:
  // - upsert epk_sections
  // - cache HTML
  // - link to campaigns / artists
  // Left as a TODO so you can reuse your existing Supabase clients.

  return {
    success: true,
    action: 'epk:processed',
    message: `EPK regenerated for ${epk.artist}`,
    filePath: mdPath,
  };
}
