/**
 * ProjectStore tests
 */

import { describe, it, expect } from '@jest/globals';
import { ProjectStore } from '../src/projectStore';

describe('ProjectStore', () => {
  it('should create a project store instance', () => {
    const mockSupabase = {};
    const store = new ProjectStore(
      { supabaseUrl: 'test', supabaseKey: 'test' },
      mockSupabase
    );
    expect(store).toBeDefined();
  });

  // Add more tests when Supabase client is available
});
