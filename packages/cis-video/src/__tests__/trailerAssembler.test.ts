/**
 * Tests for TrailerAssembler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TrailerAssembler } from '../trailerAssembler';

describe('TrailerAssembler', () => {
  let assembler: TrailerAssembler;

  beforeEach(() => {
    assembler = new TrailerAssembler();
  });

  describe('createSimpleTrailer', () => {
    it('should create 10-second trailer', () => {
      const timeline = assembler.createSimpleTrailer('test-project', '10s', {
        title: 'Test Release',
        subtitle: 'Out Now',
        callToAction: 'Listen',
        brandColors: ['#3AA9BE', '#0F172A'],
      });

      expect(timeline.duration).toBe(10);
      expect(timeline.clips.length).toBeGreaterThan(0);
    });

    it('should create 15-second trailer', () => {
      const timeline = assembler.createSimpleTrailer('test-project', '15s', {
        title: 'Test Release',
        subtitle: 'Out Now',
        callToAction: 'Listen',
        brandColors: ['#3AA9BE', '#0F172A'],
      });

      expect(timeline.duration).toBe(15);
    });

    it('should create 30-second trailer', () => {
      const timeline = assembler.createSimpleTrailer('test-project', '30s', {
        title: 'Test Release',
        subtitle: 'Out Now',
        callToAction: 'Listen',
        brandColors: ['#3AA9BE', '#0F172A'],
      });

      expect(timeline.duration).toBe(30);
    });

    it('should create 60-second trailer', () => {
      const timeline = assembler.createSimpleTrailer('test-project', '60s', {
        title: 'Test Release',
        subtitle: 'Out Now',
        callToAction: 'Listen',
        brandColors: ['#3AA9BE', '#0F172A'],
      });

      expect(timeline.duration).toBe(60);
    });

    it('should include text overlays with config text', () => {
      const timeline = assembler.createSimpleTrailer('test-project', '30s', {
        title: 'My Song',
        subtitle: 'Available Everywhere',
        callToAction: 'Stream Now',
        brandColors: ['#3AA9BE', '#0F172A'],
      });

      const clipsWithText = timeline.clips.filter(
        (clip) => clip.textOverlays && clip.textOverlays.length > 0
      );

      expect(clipsWithText.length).toBeGreaterThan(0);

      // Check if title appears
      const hasTitle = clipsWithText.some((clip) =>
        clip.textOverlays?.some((overlay) => overlay.text === 'My Song')
      );
      expect(hasTitle).toBe(true);
    });

    it('should use brand colors in text overlays', () => {
      const brandColors = ['#FF0000', '#00FF00'];
      const timeline = assembler.createSimpleTrailer('test-project', '30s', {
        title: 'Test',
        subtitle: 'Test',
        callToAction: 'Test',
        brandColors,
      });

      const textOverlays = timeline.clips
        .flatMap((clip) => clip.textOverlays || []);

      const usedColors = textOverlays.map((overlay) => overlay.style?.color);
      const usesBrandColor = usedColors.some((color) =>
        brandColors.includes(color || '')
      );

      expect(usesBrandColor).toBe(true);
    });
  });

  describe('assembleFromScript', () => {
    it('should assemble trailer from script', () => {
      const script = {
        scenes: [
          {
            duration: 5,
            visualDescription: 'Cover art fade in',
            text: 'New Release',
          },
          {
            duration: 5,
            visualDescription: 'Artist name',
            text: 'Test Artist',
          },
        ],
      };

      const timeline = assembler.assembleFromScript('test-project', script, 10);

      expect(timeline.duration).toBe(10);
      expect(timeline.clips.length).toBeGreaterThan(0);
    });

    it('should create clips for each scene', () => {
      const script = {
        scenes: [
          { duration: 3, visualDescription: 'Scene 1', text: 'Text 1' },
          { duration: 3, visualDescription: 'Scene 2', text: 'Text 2' },
          { duration: 4, visualDescription: 'Scene 3', text: 'Text 3' },
        ],
      };

      const timeline = assembler.assembleFromScript('test-project', script, 10);

      expect(timeline.clips).toHaveLength(3);
      expect(timeline.clips[0].duration).toBe(3);
      expect(timeline.clips[1].duration).toBe(3);
      expect(timeline.clips[2].duration).toBe(4);
    });
  });
});
