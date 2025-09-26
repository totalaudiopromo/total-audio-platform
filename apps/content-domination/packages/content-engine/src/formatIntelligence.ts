export function formatContactIntelligence(data: {
  name?: string;
  format?: string;
  location?: string;
  audience?: string;
  contactMethod?: string;
  focus?: string;
  tip?: string;
  confidence?: string;
  updated?: string;
}): string {
  return [
    `🎵 ${data.name || ''}${data.format ? ' | ' + data.format : ''}`,
    `📍 ${data.location || ''}${data.audience ? ' | ' + data.audience : ''}`,
    data.contactMethod ? `📧 ${data.contactMethod}` : '',
    data.focus ? `🎧 Focus: ${data.focus}` : '',
    data.tip ? `💡 Tip: ${data.tip}` : '',
    `✅ Research Confidence: ${data.confidence || 'High'}${data.updated ? ' | Updated: ' + data.updated : ''}`,
  ].filter(Boolean).join('\n');
} 