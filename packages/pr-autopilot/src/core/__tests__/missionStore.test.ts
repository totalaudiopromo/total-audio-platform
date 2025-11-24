/**
 * MissionStore Tests
 */

import { MissionStore } from '../missionStore';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  })),
} as any;

describe('MissionStore', () => {
  let store: MissionStore;

  beforeEach(() => {
    store = new MissionStore(mockSupabase);
    jest.clearAllMocks();
  });

  describe('getMission', () => {
    it('should fetch a mission by ID', async () => {
      const mockMission = {
        id: 'mission-1',
        user_id: 'user-1',
        title: 'Test Mission',
        status: 'active',
        mode: 'suggest',
      };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockMission,
        error: null,
      });

      const mission = await store.getMission('mission-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('autopilot_missions');
      expect(mission).toEqual(mockMission);
    });

    it('should throw error if mission not found', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      await expect(store.getMission('invalid-id')).rejects.toThrow();
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const input = {
        userId: 'user-1',
        title: 'New Mission',
        mode: 'suggest' as const,
      };

      const mockCreated = {
        id: 'new-mission-id',
        ...input,
        user_id: input.userId,
        status: 'draft',
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockCreated,
        error: null,
      });

      const mission = await store.createMission(input);

      expect(mockSupabase.from).toHaveBeenCalledWith('autopilot_missions');
      expect(mission).toEqual(mockCreated);
    });
  });

  describe('listMissionsForUser', () => {
    it('should list missions for a user', async () => {
      const mockMissions = [
        { id: 'mission-1', title: 'Mission 1' },
        { id: 'mission-2', title: 'Mission 2' },
      ];

      mockSupabase.from().select().eq().order.mockResolvedValue({
        data: mockMissions,
        error: null,
      });

      const missions = await store.listMissionsForUser('user-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('autopilot_missions');
      expect(missions).toEqual(mockMissions);
    });
  });
});
