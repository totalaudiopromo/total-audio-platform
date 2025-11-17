/**
 * Showcase Exporter
 *
 * Export showcases to various formats: Markdown, HTML, PDF-spec.
 */

import { buildShowcaseSummary, type ShowcaseSummary, type ShowcaseArtistSummary } from './showcaseEngine.js';
import { logger } from '../utils/logger.js';

/**
 * Export showcase as Markdown
 */
export async function exportShowcaseAsMarkdown(showcaseId: string): Promise<string | null> {
  try {
    const summary = await buildShowcaseSummary(showcaseId);
    if (!summary) {
      return null;
    }

    let md = '';

    // Header
    md += `# ${summary.name}\n\n`;

    if (summary.description) {
      md += `${summary.description}\n\n`;
    }

    // Stats
    md += `## Overview\n\n`;
    md += `- **Total Artists**: ${summary.total_artists}\n`;

    if (summary.avg_composite_score !== undefined) {
      md += `- **Average Score**: ${(summary.avg_composite_score * 100).toFixed(1)}%\n`;
    }

    if (summary.avg_breakout_probability !== undefined) {
      md += `- **Average Breakout Probability**: ${(summary.avg_breakout_probability * 100).toFixed(1)}%\n`;
    }

    if (summary.scenes_represented.length > 0) {
      md += `- **Scenes**: ${summary.scenes_represented.join(', ')}\n`;
    }

    if (summary.countries_represented.length > 0) {
      md += `- **Countries**: ${summary.countries_represented.join(', ')}\n`;
    }

    md += `\n`;

    // Artists
    md += `## Artists\n\n`;

    for (const artist of summary.artists) {
      md += `### ${artist.name || artist.artist_slug}\n\n`;

      if (artist.one_line_pitch) {
        md += `*${artist.one_line_pitch}*\n\n`;
      }

      // Scores
      if (artist.composite_score !== undefined) {
        md += `**Scores:**\n`;
        md += `- Composite: ${(artist.composite_score * 100).toFixed(1)}%\n`;

        if (artist.breakout_probability !== undefined) {
          md += `- Breakout Probability: ${(artist.breakout_probability * 100).toFixed(1)}%\n`;
        }

        if (artist.momentum_score !== undefined) {
          md += `- Momentum: ${(artist.momentum_score * 100).toFixed(1)}%\n`;
        }

        md += `\n`;
      }

      // Momentum
      if (artist.velocity !== undefined || artist.trend) {
        md += `**Momentum:**\n`;

        if (artist.trend) {
          md += `- Trend: ${artist.trend}\n`;
        }

        if (artist.velocity !== undefined) {
          md += `- Velocity: ${artist.velocity.toFixed(3)}\n`;
        }

        if (artist.acceleration !== undefined) {
          md += `- Acceleration: ${artist.acceleration.toFixed(3)}\n`;
        }

        md += `\n`;
      }

      // Highlights
      if (artist.campaign_highlights && artist.campaign_highlights.length > 0) {
        md += `**Highlights:**\n`;
        for (const highlight of artist.campaign_highlights) {
          md += `- ${highlight}\n`;
        }
        md += `\n`;
      }

      // Scene fit
      if (artist.scene_fit_summary) {
        md += `**Scene Fit:** ${artist.scene_fit_summary}\n\n`;
      }

      // Notes
      if (artist.notes) {
        md += `**Notes:** ${artist.notes}\n\n`;
      }

      md += `---\n\n`;
    }

    return md;
  } catch (error) {
    logger.error('Failed to export showcase as Markdown', error, { showcaseId });
    return null;
  }
}

/**
 * Export showcase as HTML
 */
export async function exportShowcaseAsHTML(showcaseId: string): Promise<string | null> {
  try {
    const summary = await buildShowcaseSummary(showcaseId);
    if (!summary) {
      return null;
    }

    let html = '';

    // Header
    html += `<!DOCTYPE html>\n`;
    html += `<html lang="en">\n`;
    html += `<head>\n`;
    html += `  <meta charset="UTF-8">\n`;
    html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    html += `  <title>${escapeHtml(summary.name)}</title>\n`;
    html += `  <style>\n`;
    html += `    body { font-family: Inter, -apple-system, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }\n`;
    html += `    h1 { color: #3aa9be; margin-bottom: 10px; }\n`;
    html += `    h2 { color: #3aa9be; margin-top: 40px; border-bottom: 2px solid #334155; padding-bottom: 8px; }\n`;
    html += `    h3 { color: #94a3b8; margin-top: 30px; }\n`;
    html += `    .overview { background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; }\n`;
    html += `    .overview ul { list-style: none; padding: 0; }\n`;
    html += `    .overview li { padding: 8px 0; }\n`;
    html += `    .artist { background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; }\n`;
    html += `    .pitch { color: #3aa9be; font-style: italic; margin: 10px 0; }\n`;
    html += `    .scores, .momentum, .highlights { margin: 15px 0; }\n`;
    html += `    .scores ul, .momentum ul, .highlights ul { padding-left: 20px; }\n`;
    html += `    .label { color: #64748b; font-weight: bold; }\n`;
    html += `    hr { border: none; border-top: 1px solid #334155; margin: 30px 0; }\n`;
    html += `  </style>\n`;
    html += `</head>\n`;
    html += `<body>\n`;

    // Title
    html += `  <h1>${escapeHtml(summary.name)}</h1>\n`;

    if (summary.description) {
      html += `  <p>${escapeHtml(summary.description)}</p>\n`;
    }

    // Overview
    html += `  <div class="overview">\n`;
    html += `    <h2>Overview</h2>\n`;
    html += `    <ul>\n`;
    html += `      <li><span class="label">Total Artists:</span> ${summary.total_artists}</li>\n`;

    if (summary.avg_composite_score !== undefined) {
      html += `      <li><span class="label">Average Score:</span> ${(summary.avg_composite_score * 100).toFixed(1)}%</li>\n`;
    }

    if (summary.avg_breakout_probability !== undefined) {
      html += `      <li><span class="label">Average Breakout Probability:</span> ${(summary.avg_breakout_probability * 100).toFixed(1)}%</li>\n`;
    }

    if (summary.scenes_represented.length > 0) {
      html += `      <li><span class="label">Scenes:</span> ${escapeHtml(summary.scenes_represented.join(', '))}</li>\n`;
    }

    if (summary.countries_represented.length > 0) {
      html += `      <li><span class="label">Countries:</span> ${escapeHtml(summary.countries_represented.join(', '))}</li>\n`;
    }

    html += `    </ul>\n`;
    html += `  </div>\n`;

    // Artists
    html += `  <h2>Artists</h2>\n`;

    for (const artist of summary.artists) {
      html += `  <div class="artist">\n`;
      html += `    <h3>${escapeHtml(artist.name || artist.artist_slug)}</h3>\n`;

      if (artist.one_line_pitch) {
        html += `    <p class="pitch">${escapeHtml(artist.one_line_pitch)}</p>\n`;
      }

      // Scores
      if (artist.composite_score !== undefined) {
        html += `    <div class="scores">\n`;
        html += `      <p class="label">Scores:</p>\n`;
        html += `      <ul>\n`;
        html += `        <li>Composite: ${(artist.composite_score * 100).toFixed(1)}%</li>\n`;

        if (artist.breakout_probability !== undefined) {
          html += `        <li>Breakout Probability: ${(artist.breakout_probability * 100).toFixed(1)}%</li>\n`;
        }

        if (artist.momentum_score !== undefined) {
          html += `        <li>Momentum: ${(artist.momentum_score * 100).toFixed(1)}%</li>\n`;
        }

        html += `      </ul>\n`;
        html += `    </div>\n`;
      }

      // Momentum
      if (artist.velocity !== undefined || artist.trend) {
        html += `    <div class="momentum">\n`;
        html += `      <p class="label">Momentum:</p>\n`;
        html += `      <ul>\n`;

        if (artist.trend) {
          html += `        <li>Trend: ${escapeHtml(artist.trend)}</li>\n`;
        }

        if (artist.velocity !== undefined) {
          html += `        <li>Velocity: ${artist.velocity.toFixed(3)}</li>\n`;
        }

        if (artist.acceleration !== undefined) {
          html += `        <li>Acceleration: ${artist.acceleration.toFixed(3)}</li>\n`;
        }

        html += `      </ul>\n`;
        html += `    </div>\n`;
      }

      // Highlights
      if (artist.campaign_highlights && artist.campaign_highlights.length > 0) {
        html += `    <div class="highlights">\n`;
        html += `      <p class="label">Highlights:</p>\n`;
        html += `      <ul>\n`;

        for (const highlight of artist.campaign_highlights) {
          html += `        <li>${escapeHtml(highlight)}</li>\n`;
        }

        html += `      </ul>\n`;
        html += `    </div>\n`;
      }

      // Scene fit
      if (artist.scene_fit_summary) {
        html += `    <p><span class="label">Scene Fit:</span> ${escapeHtml(artist.scene_fit_summary)}</p>\n`;
      }

      // Notes
      if (artist.notes) {
        html += `    <p><span class="label">Notes:</span> ${escapeHtml(artist.notes)}</p>\n`;
      }

      html += `  </div>\n`;
    }

    html += `</body>\n`;
    html += `</html>\n`;

    return html;
  } catch (error) {
    logger.error('Failed to export showcase as HTML', error, { showcaseId });
    return null;
  }
}

/**
 * Export showcase as PDF spec (JSON format for PDF generation)
 */
export async function exportShowcaseAsPDFSpec(showcaseId: string): Promise<object | null> {
  try {
    const summary = await buildShowcaseSummary(showcaseId);
    if (!summary) {
      return null;
    }

    // Return structured JSON that a PDF generator can consume
    const pdfSpec = {
      document: {
        title: summary.name,
        description: summary.description,
        metadata: {
          created_at: summary.created_at,
          updated_at: summary.updated_at,
        },
      },
      overview: {
        total_artists: summary.total_artists,
        avg_composite_score: summary.avg_composite_score,
        avg_breakout_probability: summary.avg_breakout_probability,
        scenes_represented: summary.scenes_represented,
        countries_represented: summary.countries_represented,
      },
      artists: summary.artists.map((artist) => ({
        name: artist.name || artist.artist_slug,
        slug: artist.artist_slug,
        position: artist.position,
        pitch: artist.one_line_pitch,
        microgenre: artist.microgenre,
        country: artist.country,
        scores: {
          composite: artist.composite_score,
          breakout_probability: artist.breakout_probability,
          momentum: artist.momentum_score,
          scene_alignment: artist.scene_alignment,
          creative_uniqueness: artist.creative_uniqueness,
        },
        momentum: {
          trend: artist.trend,
          velocity: artist.velocity,
          acceleration: artist.acceleration,
        },
        highlights: artist.campaign_highlights,
        scene_fit_summary: artist.scene_fit_summary,
        notes: artist.notes,
      })),
    };

    return pdfSpec;
  } catch (error) {
    logger.error('Failed to export showcase as PDF spec', error, { showcaseId });
    return null;
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}
