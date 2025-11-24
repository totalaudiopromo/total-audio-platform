/**
 * Script export (TXT/MD) functionality
 */

import type { TrailerScript } from '@total-audio/cis-core';

export class ScriptExporter {
  exportToText(script: TrailerScript): string {
    let text = `# Trailer Script (${script.format})\n\n`;
    text += `Duration: ${script.duration}s\n`;
    text += `Pacing: ${script.pacing}\n\n`;

    if (script.voiceover) {
      text += `## Voiceover\n`;
      script.voiceover.forEach((line, i) => {
        text += `${i + 1}. ${line}\n`;
      });
      text += `\n`;
    }

    text += `## Shot List\n`;
    script.shotList.forEach((shot) => {
      text += `\nShot ${shot.shotNumber} (${shot.duration}s)\n`;
      text += `Description: ${shot.description}\n`;
      if (shot.visualCues) {
        text += `Visual Cues: ${shot.visualCues.join(', ')}\n`;
      }
      if (shot.audioNotes) {
        text += `Audio: ${shot.audioNotes}\n`;
      }
    });

    if (script.musicCues) {
      text += `\n## Music Cues\n`;
      script.musicCues.forEach((cue) => {
        text += `${cue.timestamp}s: ${cue.description}\n`;
      });
    }

    return text;
  }

  async exportToFile(script: TrailerScript, filename: string): Promise<File> {
    const content = this.exportToText(script);
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], filename, { type: 'text/plain' });
  }
}

export const createScriptExporter = (): ScriptExporter => {
  return new ScriptExporter();
};
