/**
 * Blueprint Engine Tests
 */

import { listBlueprints, loadBlueprint, getBlueprintSummary } from '../blueprintEngine';

describe('BlueprintEngine', () => {
  describe('listBlueprints', () => {
    it('should return all blueprints', () => {
      const blueprints = listBlueprints();

      expect(blueprints.length).toBeGreaterThan(0);
      expect(blueprints[0]).toHaveProperty('name');
      expect(blueprints[0]).toHaveProperty('tasks');
      expect(blueprints[0]).toHaveProperty('constraints');
    });
  });

  describe('loadBlueprint', () => {
    it('should load a specific blueprint', () => {
      const blueprint = loadBlueprint('single_release');

      expect(blueprint).not.toBeNull();
      expect(blueprint?.name).toBe('Single Release Campaign');
      expect(blueprint?.tasks.length).toBeGreaterThan(0);
    });

    it('should return null for non-existent blueprint', () => {
      const blueprint = loadBlueprint('non_existent');
      expect(blueprint).toBeNull();
    });
  });

  describe('getBlueprintSummary', () => {
    it('should return summary for valid blueprint', () => {
      const summary = getBlueprintSummary('single_release');

      expect(summary).not.toBeNull();
      expect(summary?.name).toBe('Single Release Campaign');
      expect(summary?.taskCount).toBeGreaterThan(0);
      expect(summary?.maxContacts).toBe(80);
    });

    it('should return null for invalid blueprint', () => {
      const summary = getBlueprintSummary('invalid');
      expect(summary).toBeNull();
    });
  });
});
