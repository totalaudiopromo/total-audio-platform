/**
 * Hook Generator - AI-powered content hook generation for social platforms
 */

import type { CreativeContext, ContentHook } from '@total-audio/cis-core';

export class HookGenerator {
  /**
   * Generate content hooks for multiple platforms
   */
  async generate(
    context: CreativeContext,
    platforms: Array<'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'generic'> = [
      'tiktok',
      'instagram',
      'youtube',
    ]
  ): Promise<ContentHook[]> {
    const hooks: ContentHook[] = [];

    for (const platform of platforms) {
      hooks.push(...this.generateForPlatform(platform, context));
    }

    return hooks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private generateForPlatform(
    platform: ContentHook['platform'],
    context: CreativeContext
  ): ContentHook[] {
    const hooks: ContentHook[] = [];
    const genre = context.artist?.genre || 'Music';

    switch (platform) {
      case 'tiktok':
        hooks.push(
          {
            platform: 'tiktok',
            hookText: `POV: You discover ${genre} that actually hits different 🎵`,
            visualSuggestion: 'Close-up reaction shot with music reveal',
            duration: 15,
            callToAction: 'Stream now 🔗 in bio',
            relevanceScore: 0.9,
          },
          {
            platform: 'tiktok',
            hookText: 'Making music at 3am be like...',
            visualSuggestion: 'Studio session time-lapse',
            duration: 10,
            callToAction: 'New single out now',
            relevanceScore: 0.85,
          },
          {
            platform: 'tiktok',
            hookText: 'This part gives me chills every time 🥶',
            visualSuggestion: 'Highlight the best 8 bars',
            duration: 15,
            callToAction: 'Full track in bio',
            relevanceScore: 0.8,
          }
        );
        break;

      case 'instagram':
        hooks.push(
          {
            platform: 'instagram',
            hookText: '✨ New release alert ✨',
            visualSuggestion: 'Cover art with audio visualizer',
            duration: 30,
            callToAction: 'Stream everywhere now',
            relevanceScore: 0.85,
          },
          {
            platform: 'instagram',
            hookText: 'Behind the sound...',
            visualSuggestion: 'Studio footage carousel',
            duration: 60,
            callToAction: 'Swipe to hear the final track',
            relevanceScore: 0.8,
          }
        );
        break;

      case 'youtube':
        hooks.push(
          {
            platform: 'youtube',
            hookText: `The story behind my new ${genre} single`,
            visualSuggestion: 'Talking head with B-roll',
            duration: 60,
            callToAction: 'Listen to the full track',
            relevanceScore: 0.75,
          }
        );
        break;

      case 'twitter':
        hooks.push(
          {
            platform: 'twitter',
            hookText: `New single out now. This one means a lot. 🎵`,
            relevanceScore: 0.8,
          }
        );
        break;
    }

    return hooks;
  }

  /**
   * Generate meme-format hooks
   */
  async generateMemeFormats(context: CreativeContext): Promise<ContentHook[]> {
    return [
      {
        platform: 'generic',
        hookText: 'Nobody:\nAbsolutely nobody:\nMe making music at 3am:',
        visualSuggestion: 'Studio chaos screenshot',
        relevanceScore: 0.85,
      },
      {
        platform: 'generic',
        hookText: 'Expectation vs Reality of being a musician',
        visualSuggestion: 'Split screen comparison',
        relevanceScore: 0.8,
      },
      {
        platform: 'generic',
        hookText: 'Tell me you make [GENRE] without telling me you make [GENRE]',
        visualSuggestion: 'Studio setup or gear showcase',
        relevanceScore: 0.75,
      },
    ];
  }
}

export const createHookGenerator = (): HookGenerator => {
  return new HookGenerator();
};
