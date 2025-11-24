/**
 * Trailer Script Generator - Creates trailer scripts for music promotion
 */

import type { CreativeContext, TrailerScript } from '@total-audio/cis-core';

export class TrailerScriptGenerator {
  async generate(
    context: CreativeContext,
    duration: '10s' | '15s' | '30s' | '60s' = '15s'
  ): Promise<TrailerScript> {
    const artistName = context.artist?.name || 'Artist';
    const genre = context.artist?.genre || 'Music';

    const scripts: Record<string, TrailerScript> = {
      '10s': {
        duration: 10,
        format: '10s',
        voiceover: [`New ${genre} from ${artistName}. Out now.`],
        shotList: [
          {
            shotNumber: 1,
            description: 'Cover art reveal',
            duration: 3,
            visualCues: ['Fade in cover art'],
          },
          {
            shotNumber: 2,
            description: 'Artist performance/vibe',
            duration: 5,
            visualCues: ['Best 5 seconds of track'],
            audioNotes: 'Track highlight',
          },
          {
            shotNumber: 3,
            description: 'Release info',
            duration: 2,
            visualCues: ['Streaming logos', 'Out now text'],
          },
        ],
        musicCues: [
          { timestamp: 0, description: 'Track intro/hook' },
          { timestamp: 8, description: 'Fade out' },
        ],
        pacing: 'Fast, impactful',
      },
      '15s': {
        duration: 15,
        format: '15s',
        voiceover: [
          `${artistName} is back.`,
          `New ${genre} single.`,
          'Stream everywhere now.',
        ],
        shotList: [
          {
            shotNumber: 1,
            description: 'Teaser opening',
            duration: 3,
            visualCues: ['Dark screen', 'Audio cue'],
            audioNotes: 'Track intro',
          },
          {
            shotNumber: 2,
            description: 'Cover art reveal',
            duration: 4,
            visualCues: ['Cover art with motion'],
          },
          {
            shotNumber: 3,
            description: 'Performance/atmosphere',
            duration: 6,
            visualCues: ['Artist footage or mood visuals'],
            audioNotes: 'Track hook/best moment',
          },
          {
            shotNumber: 4,
            description: 'Call to action',
            duration: 2,
            visualCues: ['Stream now', 'Platform logos'],
          },
        ],
        musicCues: [
          { timestamp: 0, description: 'Ambient intro' },
          { timestamp: 3, description: 'Track begins' },
          { timestamp: 13, description: 'Fade out' },
        ],
        pacing: 'Balanced, engaging',
      },
      '30s': {
        duration: 30,
        format: '30s',
        voiceover: [
          `Presenting the new single from ${artistName}.`,
          `A ${genre} journey you won't forget.`,
          'Available everywhere now.',
        ],
        shotList: [
          {
            shotNumber: 1,
            description: 'Atmospheric opening',
            duration: 5,
            visualCues: ['Mood-setting visuals'],
            audioNotes: 'Ambient/intro',
          },
          {
            shotNumber: 2,
            description: 'Artist introduction',
            duration: 5,
            visualCues: ['Artist reveal', 'Setting'],
          },
          {
            shotNumber: 3,
            description: 'Build-up',
            duration: 8,
            visualCues: ['Performance clips', 'Emotional moments'],
            audioNotes: 'Track verse/build',
          },
          {
            shotNumber: 4,
            description: 'Climax',
            duration: 8,
            visualCues: ['Best moment of track'],
            audioNotes: 'Chorus/hook',
          },
          {
            shotNumber: 5,
            description: 'Release info',
            duration: 4,
            visualCues: ['Title card', 'Streaming platforms'],
          },
        ],
        musicCues: [
          { timestamp: 0, description: 'Intro/ambient' },
          { timestamp: 5, description: 'Verse begins' },
          { timestamp: 13, description: 'Build to chorus' },
          { timestamp: 21, description: 'Chorus/hook' },
          { timestamp: 26, description: 'Fade out' },
        ],
        pacing: 'Story-driven, emotional',
      },
      '60s': {
        duration: 60,
        format: '60s',
        voiceover: [
          `This is the story of ${artistName}'s new single.`,
          'A journey through sound and emotion.',
          'Experience it everywhere now.',
        ],
        shotList: [
          {
            shotNumber: 1,
            description: 'Opening scene',
            duration: 10,
            visualCues: ['Cinematic intro', 'Setting the mood'],
            audioNotes: 'Ambient intro',
          },
          {
            shotNumber: 2,
            description: 'Artist story',
            duration: 15,
            visualCues: ['Behind the scenes', 'Creation process'],
            audioNotes: 'Verse 1',
          },
          {
            shotNumber: 3,
            description: 'Build tension',
            duration: 15,
            visualCues: ['Emotional peaks', 'Visual variety'],
            audioNotes: 'Pre-chorus/build',
          },
          {
            shotNumber: 4,
            description: 'Payoff moment',
            duration: 15,
            visualCues: ['Best performance', 'Climactic visuals'],
            audioNotes: 'Chorus/hook',
          },
          {
            shotNumber: 5,
            description: 'Outro and release info',
            duration: 5,
            visualCues: ['Final shots', 'Streaming info'],
          },
        ],
        musicCues: [
          { timestamp: 0, description: 'Intro' },
          { timestamp: 10, description: 'Verse 1' },
          { timestamp: 25, description: 'Pre-chorus' },
          { timestamp: 40, description: 'Chorus' },
          { timestamp: 55, description: 'Outro fade' },
        ],
        pacing: 'Cinematic, narrative-driven',
      },
    };

    return scripts[duration];
  }
}

export const createTrailerScriptGenerator = (): TrailerScriptGenerator => {
  return new TrailerScriptGenerator();
};
