/**
 * Timeline Model - Creates and manages trailer timelines
 */

import type { CISTrailerTimeline, TimelineClip } from './types';

export class TimelineModel {
  private timeline: CISTrailerTimeline;

  constructor(projectId: string, format: '10s' | '15s' | '30s' | '60s' = '30s') {
    const durations = { '10s': 10, '15s': 15, '30s': 30, '60s': 60 };
    
    this.timeline = {
      id: crypto.randomUUID(),
      projectId,
      title: `Trailer ${format}`,
      duration: durations[format],
      format,
      clips: [],
      musicCues: [],
      metadata: {},
    };
  }

  addClip(clip: Omit<TimelineClip, 'id'>): TimelineClip {
    const newClip: TimelineClip = {
      ...clip,
      id: crypto.randomUUID(),
    };

    this.timeline.clips.push(newClip);
    this.timeline.clips.sort((a, b) => a.startTime - b.startTime);

    return newClip;
  }

  removeClip(clipId: string): boolean {
    const initialLength = this.timeline.clips.length;
    this.timeline.clips = this.timeline.clips.filter(c => c.id !== clipId);
    return this.timeline.clips.length < initialLength;
  }

  updateClip(clipId: string, updates: Partial<TimelineClip>): boolean {
    const clip = this.timeline.clips.find(c => c.id === clipId);
    if (!clip) return false;

    Object.assign(clip, updates);
    this.timeline.clips.sort((a, b) => a.startTime - b.startTime);

    return true;
  }

  getTimeline(): CISTrailerTimeline {
    return { ...this.timeline };
  }

  setMusicCues(cues: Array<{ time: number; description: string }>): void {
    this.timeline.musicCues = cues;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for overlapping clips
    const sorted = [...this.timeline.clips].sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      const currentEnd = current.startTime + current.duration;

      if (currentEnd > next.startTime) {
        errors.push(`Clips ${current.id} and ${next.id} overlap`);
      }
    }

    // Check total duration
    const lastClip = sorted[sorted.length - 1];
    if (lastClip) {
      const totalDuration = lastClip.startTime + lastClip.duration;
      if (totalDuration > this.timeline.duration) {
        errors.push(`Timeline exceeds target duration (${totalDuration}s > ${this.timeline.duration}s)`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const createTimelineModel = (
  projectId: string,
  format?: '10s' | '15s' | '30s' | '60s'
): TimelineModel => {
  return new TimelineModel(projectId, format);
};
