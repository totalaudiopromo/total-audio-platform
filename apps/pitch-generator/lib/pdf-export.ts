/**
 * PDF Export utility for pitches
 * Generates formatted PDF documents for pitches without external dependencies
 */

export interface PitchData {
  artistName: string;
  trackTitle: string;
  contactName: string;
  contactOutlet?: string;
  subjectLine: string;
  pitchBody: string;
  genre: string;
  releaseDate: string;
  createdAt?: string;
}

/**
 * Generate HTML content for PDF export
 */
export function generatePitchHTML(pitch: PitchData): string {
  const currentDate = pitch.createdAt
    ? new Date(pitch.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pitch.artistName} - ${pitch.trackTitle} Pitch</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #1f2937;
      font-size: 24pt;
      margin: 0 0 10px 0;
      font-weight: bold;
    }

    .header .subtitle {
      color: #6b7280;
      font-size: 14pt;
      margin: 0;
    }

    .meta-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .meta-item {
      margin: 0;
    }

    .meta-label {
      font-weight: bold;
      color: #4b5563;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 5px;
    }

    .meta-value {
      color: #1f2937;
      font-size: 12pt;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #6366f1;
      margin: 0 0 15px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .subject-line {
      background: #eef2ff;
      border-left: 4px solid #6366f1;
      padding: 15px 20px;
      margin: 0 0 30px 0;
      border-radius: 4px;
    }

    .pitch-body {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.8;
      font-size: 11pt;
    }

    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 10pt;
      text-align: center;
    }

    .footer strong {
      color: #4b5563;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .header {
        page-break-after: avoid;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${pitch.artistName} - ${pitch.trackTitle}</h1>
    <p class="subtitle">Music Pitch Document</p>
  </div>

  <div class="meta-info">
    <div class="meta-item">
      <div class="meta-label">Contact</div>
      <div class="meta-value">${pitch.contactName}</div>
      ${
        pitch.contactOutlet
          ? `<div class="meta-value" style="color: #6b7280; font-size: 10pt;">${pitch.contactOutlet}</div>`
          : ''
      }
    </div>

    <div class="meta-item">
      <div class="meta-label">Genre</div>
      <div class="meta-value">${pitch.genre}</div>
    </div>

    <div class="meta-item">
      <div class="meta-label">Release Date</div>
      <div class="meta-value">${new Date(pitch.releaseDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}</div>
    </div>

    <div class="meta-item">
      <div class="meta-label">Generated</div>
      <div class="meta-value">${currentDate}</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Subject Line</h2>
    <div class="subject-line">
      ${pitch.subjectLine}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Pitch Email</h2>
    <div class="pitch-body">${pitch.pitchBody}</div>
  </div>

  <div class="footer">
    <p>
      Generated with <strong>Pitch Generator by Total Audio Promo</strong><br>
      https://pitch.totalaudiopromo.com
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Export pitch as PDF using browser's print functionality
 */
export function exportPitchToPDF(pitch: PitchData) {
  // Generate HTML content
  const htmlContent = generatePitchHTML(pitch);

  // Create a new window with the content
  const printWindow = window.open('', '', 'width=800,height=600');

  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  // Write the HTML content
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();

    // Close the window after printing (or if cancelled)
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };
}

/**
 * Download pitch as HTML file (fallback)
 */
export function downloadPitchAsHTML(pitch: PitchData) {
  const htmlContent = generatePitchHTML(pitch);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${pitch.artistName.replace(/\s+/g, '-')}-${pitch.trackTitle.replace(
    /\s+/g,
    '-'
  )}-pitch.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Copy pitch content to clipboard (formatted)
 */
export async function copyPitchToClipboard(pitch: PitchData): Promise<boolean> {
  const content = `${pitch.subjectLine}\n\n${pitch.pitchBody}`;

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
