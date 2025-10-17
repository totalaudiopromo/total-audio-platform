/**
 * Voice Guard Skill Tests
 * Total Audio Platform
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { VoiceGuardSkill } from '../implementations/VoiceGuardSkill';
import { SkillContext } from '../SkillEngine';

describe('VoiceGuardSkill', () => {
  let mockContext: SkillContext;

  beforeAll(() => {
    mockContext = {} as SkillContext;
  });

  describe('UK Spelling Corrections', () => {
    it('should correct US spelling to UK spelling', async () => {
      const input = {
        text: 'We organize and analyze your music contacts.',
        contentType: 'email_pitch' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.text).toContain('organise');
      expect(result.text).toContain('analyse');
      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.changes[0].severity).toBe('critical');
    });

    it('should handle multiple spelling errors', async () => {
      const input = {
        text: 'This organization will help you realize your color vision.',
        contentType: 'website_copy' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.text).toContain('organisation');
      expect(result.text).toContain('realise');
      expect(result.text).toContain('colour');
      expect(result.changes.length).toBe(3);
    });

    it('should preserve correctly spelled UK words', async () => {
      const input = {
        text: 'We organise and analyse your data with colour.',
        contentType: 'email_pitch' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.text).toBe(input.text);
      expect(result.changes.length).toBe(0);
    });
  });

  describe('Corporate Speak Detection', () => {
    it('should warn about corporate jargon', async () => {
      const input = {
        text: 'Leverage our innovative solution to unlock synergies.',
        contentType: 'website_copy' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('leverage'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('solution'))).toBe(true);
      expect(result.compliance_score).toBeLessThan(0.8);
    });

    it('should detect marketing hype words', async () => {
      const input = {
        text: 'Our revolutionary, game-changing platform is best-in-class.',
        contentType: 'website_copy' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.warnings.length).toBeGreaterThan(2);
      expect(result.compliance_score).toBeLessThan(0.5);
    });

    it('should pass authentic industry language', async () => {
      const input = {
        text: 'Built by someone with 5+ years of BBC Radio 1 experience.',
        contentType: 'website_copy' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.warnings.length).toBe(0);
      expect(result.compliance_score).toBeGreaterThan(0.8);
    });
  });

  describe('Email Pitch Validation', () => {
    it('should warn about pitch length over 150 words', async () => {
      const longPitch =
        'Hi there. ' + 'This is a really long pitch email. '.repeat(20);

      const input = {
        text: longPitch,
        contentType: 'email_pitch' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.warnings.some((w) => w.includes('150 words'))).toBe(true);
    });

    it('should suggest personalisation if missing', async () => {
      const input = {
        text: 'Here is a great track. Please listen to it.',
        contentType: 'email_pitch' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(
        result.suggestions.some((s) => s.includes('personalisation'))
      ).toBe(true);
    });

    it('should pass well-structured pitch', async () => {
      const input = {
        text: `Hi Sarah,

Love your recent ambient electronic features. I've just released "Midnight Drive" – a late-night piece that sits between Boards of Canada and Jon Hopkins.

BBC Introducing featured it last month. Think it could work for your show if you get a sec.

Best,
Chris`,
        contentType: 'email_pitch' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.compliance_score).toBeGreaterThan(0.8);
      expect(result.warnings.length).toBe(0);
    });
  });

  describe('Audience-Specific Validation', () => {
    it('should suggest industry credibility for radio promoters', async () => {
      const input = {
        text: 'Check out this new music platform.',
        contentType: 'email_pitch' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(
        result.suggestions.some((s) => s.includes('industry credibility'))
      ).toBe(true);
    });

    it('should pass content with radio credibility', async () => {
      const input = {
        text: 'Built from 5+ years of radio promotion experience at BBC.',
        contentType: 'website_copy' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.suggestions.length).toBe(0);
      expect(result.compliance_score).toBeGreaterThan(0.9);
    });
  });

  describe('Convenience Methods', () => {
    it('validate() should return true for compliant text', async () => {
      const goodText = 'We organise your contacts. Right, so this works.';

      const isValid = await VoiceGuardSkill.validate(
        goodText,
        'email_pitch'
      );

      expect(isValid).toBe(true);
    });

    it('validate() should return false for non-compliant text', async () => {
      const badText = 'Leverage our revolutionary solution to organize everything.';

      const isValid = await VoiceGuardSkill.validate(badText, 'email_pitch');

      expect(isValid).toBe(false);
    });

    it('correct() should fix spelling automatically', async () => {
      const badText = 'We organize and analyze your data.';

      const corrected = await VoiceGuardSkill.correct(
        badText,
        'email_pitch'
      );

      expect(corrected).toContain('organise');
      expect(corrected).toContain('analyse');
    });
  });

  describe('Compliance Scoring', () => {
    it('should give perfect score for fully compliant text', async () => {
      const input = {
        text: 'We organise your radio contacts. Built by someone with BBC Radio 1 experience.',
        contentType: 'website_copy' as const,
        targetAudience: 'radio_promoters' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.compliance_score).toBeGreaterThanOrEqual(0.9);
      expect(result.changes.length).toBe(0);
      expect(result.warnings.length).toBe(0);
    });

    it('should reduce score for critical issues', async () => {
      const input = {
        text: 'Leverage our revolutionary solution to organize your music ecosystem.',
        contentType: 'website_copy' as const,
        targetAudience: 'general' as const,
      };

      const result = await VoiceGuardSkill.execute(input, mockContext);

      expect(result.compliance_score).toBeLessThan(0.5);
      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(2);
    });
  });
});
