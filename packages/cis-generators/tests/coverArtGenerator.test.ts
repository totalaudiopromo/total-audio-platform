/**
 * CoverArtGenerator tests
 */

import { describe, it, expect } from '@jest/globals';
import { CoverArtGenerator } from '../src/coverArtGenerator';

describe('CoverArtGenerator', () => {
  it('should create a generator instance', () => {
    const generator = new CoverArtGenerator();
    expect(generator).toBeDefined();
  });

  it('should generate cover art suggestions', async () => {
    const generator = new CoverArtGenerator();
    const context = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
    };

    const suggestions = await generator.generate(context);
    expect(suggestions).toBeDefined();
    expect(suggestions.palettes).toBeDefined();
    expect(suggestions.layouts).toBeDefined();
    expect(suggestions.typography).toBeDefined();
  });
});
