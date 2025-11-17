/**
 * Trailer Assembler - Assembles trailers from script + assets
 */

import type { CISTrailerTimeline, TimelineClip } from './types';
import type { TrailerScript } from '@total-audio/cis-core';
import { TimelineModel } from './timelineModel';

export interface AssemblyOptions {
  coverArtUrl?: string;
  brandColors?: string[];
  voiceoverDuration?: number;
}

export class TrailerAssembler {
  assembleFromScript(
    projectId: string,
    script: TrailerScript,
    options: AssemblyOptions = {}
  ): CISTrailerTimeline {
    const timeline = new TimelineModel(projectId, script.format);

    let currentTime = 0;

    // Add clips based on shot list
    script.shotList.forEach((shot, index) => {
      // Add background
      if (options.coverArtUrl && index === 0) {
        timeline.addClip({
          type: 'image',
          startTime: currentTime,
          duration: shot.duration,
          content: {
            url: options.coverArtUrl,
            fit: 'cover',
            kenBurns: {
              from: { scale: 1, x: 0, y: 0 },
              to: { scale: 1.1, x: -5, y: -5 },
            },
          },
          transitions: { in: 'fade', out: 'fade' },
        });
      } else if (options.brandColors && options.brandColors.length > 0) {
        timeline.addClip({
          type: 'color',
          startTime: currentTime,
          duration: shot.duration,
          content: {
            color: options.brandColors[index % options.brandColors.length],
          },
        });
      }

      // Add text overlay from shot description
      timeline.addClip({
        type: 'text',
        startTime: currentTime + 0.5,
        duration: shot.duration - 1,
        content: {
          text: shot.description,
          fontSize: 48,
          fontFamily: 'Inter',
          color: '#FFFFFF',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          position: 'bottom',
          alignment: 'center',
        },
        transitions: { in: 'fade', out: 'fade' },
      });

      currentTime += shot.duration;
    });

    // Add music cues if provided
    if (script.musicCues) {
      timeline.setMusicCues(script.musicCues);
    }

    return timeline.getTimeline();
  }

  createSimpleTrailer(
    projectId: string,
    format: '10s' | '15s' | '30s' | '60s',
    options: {
      title?: string;
      subtitle?: string;
      coverArtUrl?: string;
      callToAction?: string;
      brandColors?: string[];
    } = {}
  ): CISTrailerTimeline {
    const timeline = new TimelineModel(projectId, format);
    const durations = { '10s': 10, '15s': 15, '30s': 30, '60s': 60 };
    const duration = durations[format];

    // Opening: Cover art with title (first third)
    const opening = duration / 3;
    if (options.coverArtUrl) {
      timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: opening,
        content: {
          url: options.coverArtUrl,
          fit: 'cover',
          kenBurns: {
            from: { scale: 1, x: 0, y: 0 },
            to: { scale: 1.15, x: -10, y: -10 },
          },
        },
        transitions: { in: 'fade' },
      });
    }

    if (options.title) {
      timeline.addClip({
        type: 'text',
        startTime: 1,
        duration: opening - 2,
        content: {
          text: options.title,
          fontSize: 64,
          fontFamily: 'Inter',
          color: '#FFFFFF',
          position: 'center',
          alignment: 'center',
        },
        transitions: { in: 'fade', out: 'fade' },
      });
    }

    // Middle: Brand color (second third)
    const middle = duration / 3;
    if (options.brandColors && options.brandColors.length > 0) {
      timeline.addClip({
        type: 'gradient',
        startTime: opening,
        duration: middle,
        content: {
          colors: options.brandColors.slice(0, 2),
          direction: 'diagonal',
        },
      });
    }

    if (options.subtitle) {
      timeline.addClip({
        type: 'text',
        startTime: opening + 0.5,
        duration: middle - 1,
        content: {
          text: options.subtitle,
          fontSize: 48,
          fontFamily: 'Inter',
          color: '#FFFFFF',
          position: 'center',
          alignment: 'center',
        },
        transitions: { in: 'fade', out: 'fade' },
      });
    }

    // Ending: CTA (final third)
    const ending = duration - opening - middle;
    if (options.callToAction) {
      timeline.addClip({
        type: 'color',
        startTime: opening + middle,
        duration: ending,
        content: {
          color: '#0F172A',
        },
      });

      timeline.addClip({
        type: 'text',
        startTime: opening + middle + 0.5,
        duration: ending - 1,
        content: {
          text: options.callToAction,
          fontSize: 56,
          fontFamily: 'Inter',
          color: '#3AA9BE',
          position: 'center',
          alignment: 'center',
        },
        transitions: { in: 'fade', out: 'fade' },
      });
    }

    return timeline.getTimeline();
  }
}

export const createTrailerAssembler = (): TrailerAssembler => {
  return new TrailerAssembler();
};
