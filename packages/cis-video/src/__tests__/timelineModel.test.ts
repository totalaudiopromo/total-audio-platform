/**
 * Tests for TimelineModel
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TimelineModel } from '../timelineModel';
import type { TimelineClip } from '../types';

describe('TimelineModel', () => {
  let timeline: TimelineModel;

  beforeEach(() => {
    timeline = new TimelineModel(30, 30);
  });

  describe('constructor', () => {
    it('should initialize with correct duration and fps', () => {
      expect(timeline.getDuration()).toBe(30);
      expect(timeline.getFPS()).toBe(30);
    });
  });

  describe('addClip', () => {
    it('should add a clip to the timeline', () => {
      const clip = timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 5,
        assetUrl: 'test.jpg',
      });

      expect(clip).toBeDefined();
      expect(clip.id).toBeDefined();
      expect(clip.type).toBe('image');
      expect(clip.duration).toBe(5);
    });

    it('should sort clips by start time', () => {
      timeline.addClip({
        type: 'image',
        startTime: 10,
        duration: 5,
        assetUrl: 'test2.jpg',
      });

      timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 5,
        assetUrl: 'test1.jpg',
      });

      const clips = timeline.getTimeline().clips;
      expect(clips[0].startTime).toBe(0);
      expect(clips[1].startTime).toBe(10);
    });
  });

  describe('removeClip', () => {
    it('should remove a clip from the timeline', () => {
      const clip = timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 5,
        assetUrl: 'test.jpg',
      });

      const removed = timeline.removeClip(clip.id);
      expect(removed).toBe(true);
      expect(timeline.getTimeline().clips).toHaveLength(0);
    });

    it('should return false when clip not found', () => {
      const removed = timeline.removeClip('nonexistent');
      expect(removed).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate timeline with no overlapping clips', () => {
      timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 5,
        assetUrl: 'test1.jpg',
      });

      timeline.addClip({
        type: 'image',
        startTime: 5,
        duration: 5,
        assetUrl: 'test2.jpg',
      });

      const result = timeline.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect overlapping clips', () => {
      timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 10,
        assetUrl: 'test1.jpg',
      });

      timeline.addClip({
        type: 'image',
        startTime: 5,
        duration: 5,
        assetUrl: 'test2.jpg',
      });

      const result = timeline.validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('overlap');
    });

    it('should detect clips exceeding timeline duration', () => {
      timeline.addClip({
        type: 'image',
        startTime: 25,
        duration: 10,
        assetUrl: 'test.jpg',
      });

      const result = timeline.validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds');
    });
  });

  describe('addMusicCue', () => {
    it('should add a music cue to the timeline', () => {
      timeline.addMusicCue({
        startTime: 0,
        duration: 30,
        trackUrl: 'music.mp3',
        volume: 1.0,
      });

      const musicCues = timeline.getTimeline().musicCues;
      expect(musicCues).toHaveLength(1);
      expect(musicCues![0].trackUrl).toBe('music.mp3');
    });
  });

  describe('addTextOverlay', () => {
    it('should add a text overlay to a clip', () => {
      const clip = timeline.addClip({
        type: 'image',
        startTime: 0,
        duration: 5,
        assetUrl: 'test.jpg',
      });

      timeline.addTextOverlay(clip.id, {
        text: 'Hello World',
        position: { x: 100, y: 100 },
        style: {
          fontSize: 24,
          color: '#FFFFFF',
        },
      });

      const updatedClip = timeline.getTimeline().clips.find((c) => c.id === clip.id);
      expect(updatedClip?.textOverlays).toHaveLength(1);
      expect(updatedClip?.textOverlays![0].text).toBe('Hello World');
    });
  });
});
