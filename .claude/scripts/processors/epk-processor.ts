#!/usr/bin/env npx tsx
/**
 * EPK Processor
 *
 * Electronic Press Kit processor for the IndyDevDan workflow.
 * Reads markdown or JSON files with artist info and generates press kits.
 *
 * Expected input format (JSON):
 * {
 *   "artist_name": "Artist Name",
 *   "bio": "Short bio...",
 *   "genre": "Electronic",
 *   "location": "London, UK",
 *   "social_links": { ... },
 *   "press_quotes": [ ... ],
 *   "releases": [ ... ]
 * }
 *
 * Expected input format (Markdown):
 * # Artist Name
 * ## Bio
 * ...
 * ## Links
 * ...
 *
 * Output:
 * - HTML press kit
 * - Structured JSON summary
 *
 * Usage:
 *   npx tsx epk-processor.ts <input-file.md|json>
 */

import * as fs from 'fs';
import * as path from 'path';
import { AuditLogger } from '../../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const DROPZONES_DIR = path.join(CLAUDE_DIR, 'dropzones');
const PROCESSED_DIR = path.join(DROPZONES_DIR, 'processed');

const logger = new AuditLogger();

export interface SocialLinks {
  spotify?: string;
  apple_music?: string;
  soundcloud?: string;
  bandcamp?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface Release {
  title: string;
  type: 'single' | 'ep' | 'album';
  release_date?: string;
  label?: string;
  link?: string;
}

export interface PressQuote {
  quote: string;
  source: string;
  date?: string;
}

export interface EPKData {
  artist_name: string;
  bio?: string;
  short_bio?: string;
  genre?: string;
  location?: string;
  social_links?: SocialLinks;
  press_quotes?: PressQuote[];
  releases?: Release[];
  images?: string[];
  contact_email?: string;
  booking_email?: string;
  press_contact?: string;
}

export interface ProcessResult {
  success: boolean;
  error?: string;
  outputFile?: string;
  stats?: {
    sections_generated: number;
    duration_ms: number;
  };
}

/**
 * Parse JSON input file
 */
function parseJSON(content: string): EPKData {
  return JSON.parse(content);
}

/**
 * Parse Markdown input file
 */
function parseMarkdown(content: string): EPKData {
  const data: EPKData = {
    artist_name: 'Unknown Artist',
  };

  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // H1 = Artist name
    if (line.startsWith('# ')) {
      data.artist_name = line.replace('# ', '').trim();
      continue;
    }

    // H2 = Section headers
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        saveSection(data, currentSection, currentContent.join('\n').trim());
      }
      currentSection = line.replace('## ', '').trim().toLowerCase();
      currentContent = [];
      continue;
    }

    currentContent.push(line);
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    saveSection(data, currentSection, currentContent.join('\n').trim());
  }

  return data;
}

/**
 * Save parsed section to EPK data
 */
function saveSection(data: EPKData, section: string, content: string): void {
  switch (section) {
    case 'bio':
    case 'biography':
      data.bio = content;
      // Generate short bio from first paragraph
      const firstPara = content.split('\n\n')[0];
      if (firstPara.length > 200) {
        data.short_bio = firstPara.slice(0, 197) + '...';
      } else {
        data.short_bio = firstPara;
      }
      break;

    case 'genre':
    case 'style':
      data.genre = content.split('\n')[0];
      break;

    case 'location':
    case 'based in':
      data.location = content.split('\n')[0];
      break;

    case 'links':
    case 'social':
    case 'social links':
      data.social_links = parseLinks(content);
      break;

    case 'press':
    case 'press quotes':
    case 'reviews':
      data.press_quotes = parsePressQuotes(content);
      break;

    case 'releases':
    case 'discography':
      data.releases = parseReleases(content);
      break;

    case 'contact':
      parseContact(data, content);
      break;
  }
}

/**
 * Parse social links from markdown list
 */
function parseLinks(content: string): SocialLinks {
  const links: SocialLinks = {};
  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const match = line.match(/[-*]\s*\[?([^\]]+)\]?\s*[:(]?\s*(https?:\/\/[^\s)]+)/i);
    if (match) {
      const platform = match[1].toLowerCase().replace(/\s/g, '_');
      links[platform] = match[2];
    }
  }

  return links;
}

/**
 * Parse press quotes from markdown
 */
function parsePressQuotes(content: string): PressQuote[] {
  const quotes: PressQuote[] = [];
  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    // Format: > "Quote" - Source
    const match = line.match(/[>"]\s*(.+?)["]?\s*[-–—]\s*(.+)/);
    if (match) {
      quotes.push({
        quote: match[1].replace(/^["']|["']$/g, ''),
        source: match[2].trim(),
      });
    }
  }

  return quotes;
}

/**
 * Parse releases from markdown
 */
function parseReleases(content: string): Release[] {
  const releases: Release[] = [];
  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    // Format: - Title (Type, Year)
    const match = line.match(/[-*]\s*(.+?)\s*\(([^)]+)\)/);
    if (match) {
      const title = match[1].trim();
      const meta = match[2].toLowerCase();

      let type: 'single' | 'ep' | 'album' = 'single';
      if (meta.includes('album') || meta.includes('lp')) type = 'album';
      else if (meta.includes('ep')) type = 'ep';

      const yearMatch = meta.match(/\d{4}/);
      const release_date = yearMatch ? yearMatch[0] : undefined;

      releases.push({ title, type, release_date });
    }
  }

  return releases;
}

/**
 * Parse contact info from markdown
 */
function parseContact(data: EPKData, content: string): void {
  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

    if (emailMatch) {
      if (lowerLine.includes('booking')) {
        data.booking_email = emailMatch[1];
      } else if (lowerLine.includes('press')) {
        data.press_contact = emailMatch[1];
      } else {
        data.contact_email = emailMatch[1];
      }
    }
  }
}

/**
 * Generate HTML press kit
 */
function generateHTML(data: EPKData): string {
  const sections: string[] = [];

  // Header
  sections.push(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.artist_name)} - Electronic Press Kit</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; margin: 2rem 0 1rem; border-bottom: 2px solid #3AA9BE; padding-bottom: 0.5rem; }
    .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 2rem; }
    .bio { white-space: pre-wrap; }
    .quote { border-left: 3px solid #3AA9BE; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
    .quote-source { font-style: normal; color: #666; margin-top: 0.5rem; }
    .release { margin: 0.5rem 0; }
    .release-type { background: #3AA9BE; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; margin-right: 0.5rem; }
    .links a { display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem; color: #3AA9BE; }
    .contact { background: #f5f5f5; padding: 1rem; border-radius: 5px; margin-top: 2rem; }
    .contact p { margin: 0.25rem 0; }
    footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(data.artist_name)}</h1>
    <p class="subtitle">${[data.genre, data.location].filter(Boolean).join(' • ')}</p>
  </header>
`);

  // Bio
  if (data.bio) {
    sections.push(`
  <section>
    <h2>Biography</h2>
    <div class="bio">${escapeHtml(data.bio)}</div>
  </section>
`);
  }

  // Press Quotes
  if (data.press_quotes && data.press_quotes.length > 0) {
    sections.push(`
  <section>
    <h2>Press</h2>
    ${data.press_quotes
      .map(
        q => `
    <blockquote class="quote">
      "${escapeHtml(q.quote)}"
      <div class="quote-source">— ${escapeHtml(q.source)}</div>
    </blockquote>
    `
      )
      .join('')}
  </section>
`);
  }

  // Releases
  if (data.releases && data.releases.length > 0) {
    sections.push(`
  <section>
    <h2>Releases</h2>
    ${data.releases
      .map(
        r => `
    <div class="release">
      <span class="release-type">${r.type.toUpperCase()}</span>
      <strong>${escapeHtml(r.title)}</strong>
      ${r.release_date ? `<span>(${r.release_date})</span>` : ''}
    </div>
    `
      )
      .join('')}
  </section>
`);
  }

  // Social Links
  if (data.social_links && Object.keys(data.social_links).length > 0) {
    sections.push(`
  <section>
    <h2>Links</h2>
    <div class="links">
      ${Object.entries(data.social_links)
        .map(([platform, url]) =>
          url ? `<a href="${escapeHtml(url)}" target="_blank">${capitalise(platform)}</a>` : ''
        )
        .join('')}
    </div>
  </section>
`);
  }

  // Contact
  if (data.contact_email || data.booking_email || data.press_contact) {
    sections.push(`
  <section>
    <h2>Contact</h2>
    <div class="contact">
      ${data.contact_email ? `<p><strong>General:</strong> <a href="mailto:${escapeHtml(data.contact_email)}">${escapeHtml(data.contact_email)}</a></p>` : ''}
      ${data.booking_email ? `<p><strong>Booking:</strong> <a href="mailto:${escapeHtml(data.booking_email)}">${escapeHtml(data.booking_email)}</a></p>` : ''}
      ${data.press_contact ? `<p><strong>Press:</strong> <a href="mailto:${escapeHtml(data.press_contact)}">${escapeHtml(data.press_contact)}</a></p>` : ''}
    </div>
  </section>
`);
  }

  // Footer
  sections.push(`
  <footer>
    <p>Generated by Total Audio Platform • ${new Date().toLocaleDateString('en-GB')}</p>
  </footer>
</body>
</html>
`);

  return sections.join('');
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Capitalise first letter
 */
function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ');
}

/**
 * Main process function - exported for use by processor-router
 */
export async function processFile(inputFile: string): Promise<ProcessResult> {
  const startTime = Date.now();

  logger.info('processor', 'epk-processor-start', { inputFile });

  try {
    // Read input file
    if (!fs.existsSync(inputFile)) {
      return {
        success: false,
        error: `Input file not found: ${inputFile}`,
      };
    }

    const content = fs.readFileSync(inputFile, 'utf-8');
    const ext = path.extname(inputFile).toLowerCase();

    // Parse based on file type
    let data: EPKData;
    if (ext === '.json') {
      data = parseJSON(content);
    } else if (ext === '.md') {
      data = parseMarkdown(content);
    } else {
      return {
        success: false,
        error: `Unsupported file type: ${ext}. Expected .json or .md`,
      };
    }

    if (!data.artist_name || data.artist_name === 'Unknown Artist') {
      return {
        success: false,
        error: 'Artist name is required',
      };
    }

    // Generate HTML
    const html = generateHTML(data);

    // Generate output filename
    const basename = data.artist_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `epk-${basename}-${timestamp}.html`;
    const outputPath = path.join(PROCESSED_DIR, outputFilename);

    // Write HTML file
    fs.writeFileSync(outputPath, html);

    // Write JSON summary
    const summaryPath = path.join(PROCESSED_DIR, `epk-${basename}-${timestamp}.json`);
    const summary = {
      input_file: inputFile,
      output_file: outputPath,
      timestamp: new Date().toISOString(),
      artist_name: data.artist_name,
      genre: data.genre,
      location: data.location,
      sections: {
        has_bio: !!data.bio,
        has_press_quotes: (data.press_quotes?.length || 0) > 0,
        has_releases: (data.releases?.length || 0) > 0,
        has_social_links: Object.keys(data.social_links || {}).length > 0,
        has_contact: !!(data.contact_email || data.booking_email || data.press_contact),
      },
      short_bio: data.short_bio,
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    const duration_ms = Date.now() - startTime;
    const sectionsGenerated = Object.values(summary.sections).filter(Boolean).length;

    logger.info('processor', 'epk-processor-complete', {
      inputFile,
      outputFile: outputPath,
      artist: data.artist_name,
      sections: sectionsGenerated,
      duration_ms,
    });

    return {
      success: true,
      outputFile: outputPath,
      stats: {
        sections_generated: sectionsGenerated,
        duration_ms,
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error('processor', 'epk-processor-error', { inputFile, error });
    return {
      success: false,
      error,
    };
  }
}

// CLI interface
async function main(): Promise<void> {
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.log('Usage: npx tsx epk-processor.ts <input-file.md|json>');
    console.log('');
    console.log('Generates Electronic Press Kit from artist data:');
    console.log('  - Accepts .md or .json input');
    console.log('  - Generates HTML press kit');
    console.log('  - Creates JSON summary');
    process.exit(1);
  }

  const result = await processFile(inputFile);
  console.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    process.exit(1);
  }
}

main().catch(console.error);
