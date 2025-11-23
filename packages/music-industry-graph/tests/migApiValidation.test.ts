/**
 * MIG Phase 4 - API Validation Tests
 *
 * Tests Zod validation schemas for all MIG API endpoints.
 * Ensures consistent error handling and response formats.
 */

import { describe, it, expect } from 'vitest';
import {
  NodeSearchRequestSchema,
  NodeBySlugRequestSchema,
  RecommendationRequestSchema,
  PathfindingRequestSchema,
  ScenePulseRequestSchema,
  ContactFitRequestSchema,
  InfluenceScoreRequestSchema,
  NLQueryRequestSchema,
  MIGNodeTypeSchema,
  MIGRelationshipTypeSchema,
  createSuccessResponse,
  createErrorResponse,
  MIGErrorCodes,
  safeValidate,
} from '../src/validation';

describe('MIG API Validation', () => {
  describe('Node Type Schema', () => {
    it('should accept valid node types', () => {
      const validTypes = [
        'artist',
        'journalist',
        'radio_host',
        'playlist',
        'blog',
        'dj',
        'label',
        'scene',
        'microgenre',
        'event',
        'venue',
        'festival',
        'radio_show',
        'podcast',
      ];

      validTypes.forEach((type) => {
        const result = MIGNodeTypeSchema.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid node types', () => {
      const invalidTypes = ['invalid', 'artist123', '', null, undefined, 123];

      invalidTypes.forEach((type) => {
        const result = MIGNodeTypeSchema.safeParse(type);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Relationship Type Schema', () => {
    it('should accept valid relationship types', () => {
      const validRelationships = [
        'influences',
        'supports',
        'covers',
        'collaborates',
        'same_scene',
        'part_of',
      ];

      validRelationships.forEach((rel) => {
        const result = MIGRelationshipTypeSchema.safeParse(rel);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid relationship types', () => {
      const invalidRelationships = ['invalid', 'follows123', '', null];

      invalidRelationships.forEach((rel) => {
        const result = MIGRelationshipTypeSchema.safeParse(rel);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Node Search Request Validation', () => {
    it('should validate correct search request', () => {
      const validRequest = {
        type: 'artist',
        query: 'London',
        limit: 50,
        offset: 0,
      };

      const result = NodeSearchRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.type).toBe('artist');
        expect(result.data.query).toBe('London');
        expect(result.data.limit).toBe(50);
      }
    });

    it('should apply default values', () => {
      const minimalRequest = {
        query: 'test',
      };

      const result = NodeSearchRequestSchema.safeParse(minimalRequest);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.limit).toBe(50); // Default
        expect(result.data.offset).toBe(0); // Default
      }
    });

    it('should reject invalid query length', () => {
      const tooLongQuery = {
        query: 'a'.repeat(201), // Exceeds 200 char limit
        limit: 50,
      };

      const result = NodeSearchRequestSchema.safeParse(tooLongQuery);
      expect(result.success).toBe(false);
    });

    it('should reject invalid limit values', () => {
      const invalidLimits = [-1, 0, 101, 'invalid', null];

      invalidLimits.forEach((limit) => {
        const result = NodeSearchRequestSchema.safeParse({
          query: 'test',
          limit,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Pathfinding Request Validation', () => {
    it('should validate correct pathfinding request', () => {
      const validRequest = {
        source_id: '123e4567-e89b-12d3-a456-426614174000',
        target_id: '123e4567-e89b-12d3-a456-426614174001',
        max_depth: 4,
        timeout_ms: 5000,
      };

      const result = PathfindingRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.max_depth).toBe(4);
        expect(result.data.timeout_ms).toBe(5000);
      }
    });

    it('should reject invalid UUIDs', () => {
      const invalidRequest = {
        source_id: 'not-a-uuid',
        target_id: '123e4567-e89b-12d3-a456-426614174001',
      };

      const result = PathfindingRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should enforce max_depth limits', () => {
      const invalidDepths = [0, 7, 100, -1];

      invalidDepths.forEach((depth) => {
        const result = PathfindingRequestSchema.safeParse({
          source_id: '123e4567-e89b-12d3-a456-426614174000',
          target_id: '123e4567-e89b-12d3-a456-426614174001',
          max_depth: depth,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should enforce timeout limits', () => {
      const invalidTimeouts = [500, 50000, -1000];

      invalidTimeouts.forEach((timeout) => {
        const result = PathfindingRequestSchema.safeParse({
          source_id: '123e4567-e89b-12d3-a456-426614174000',
          target_id: '123e4567-e89b-12d3-a456-426614174001',
          timeout_ms: timeout,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Natural Language Query Validation', () => {
    it('should validate correct NL query', () => {
      const validRequest = {
        query: 'Find journalists who cover UK indie artists',
      };

      const result = NLQueryRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject queries that are too short', () => {
      const tooShortQuery = {
        query: 'ab', // Less than 3 chars
      };

      const result = NLQueryRequestSchema.safeParse(tooShortQuery);
      expect(result.success).toBe(false);
    });

    it('should reject queries that are too long', () => {
      const tooLongQuery = {
        query: 'a'.repeat(501), // Exceeds 500 chars
      };

      const result = NLQueryRequestSchema.safeParse(tooLongQuery);
      expect(result.success).toBe(false);
    });
  });

  describe('Response Helpers', () => {
    it('should create success response with correct structure', () => {
      const data = { test: 'value', count: 5 };
      const response = createSuccessResponse(data);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.timestamp).toBeDefined();

      // Timestamp should be ISO 8601
      expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
    });

    it('should create error response with correct structure', () => {
      const response = createErrorResponse(
        MIGErrorCodes.NODE_NOT_FOUND,
        'Node not found',
        { slug: 'test' },
        'Check the slug'
      );

      expect(response.success).toBe(false);
      expect(response.error.code).toBe(MIGErrorCodes.NODE_NOT_FOUND);
      expect(response.error.message).toBe('Node not found');
      expect(response.error.details).toEqual({ slug: 'test' });
      expect(response.error.suggestion).toBe('Check the slug');
      expect(response.timestamp).toBeDefined();
    });

    it('should create error response without optional fields', () => {
      const response = createErrorResponse(
        MIGErrorCodes.INTERNAL_ERROR,
        'Something went wrong'
      );

      expect(response.success).toBe(false);
      expect(response.error.code).toBe(MIGErrorCodes.INTERNAL_ERROR);
      expect(response.error.message).toBe('Something went wrong');
      expect(response.error.details).toBeUndefined();
      expect(response.error.suggestion).toBeUndefined();
    });
  });

  describe('Error Codes', () => {
    it('should have all required error codes', () => {
      const requiredCodes = [
        'INVALID_INPUT',
        'NODE_NOT_FOUND',
        'SCENE_NOT_FOUND',
        'INVALID_SLUG',
        'MISSING_WORKSPACE',
        'DATABASE_ERROR',
        'TIMEOUT',
        'OPERATION_LIMIT_EXCEEDED',
        'INTERNAL_ERROR',
      ];

      requiredCodes.forEach((code) => {
        expect(MIGErrorCodes).toHaveProperty(code);
      });
    });

    it('should use consistent error code format', () => {
      Object.values(MIGErrorCodes).forEach((code) => {
        // Error codes should be UPPER_SNAKE_CASE
        expect(code).toMatch(/^[A-Z_]+$/);
      });
    });
  });

  describe('Safe Validation Helper', () => {
    it('should return success for valid data', () => {
      const result = safeValidate(NodeSearchRequestSchema, {
        query: 'test',
        limit: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('test');
      }
    });

    it('should return error object for invalid data', () => {
      const result = safeValidate(NodeSearchRequestSchema, {
        query: 'test',
        limit: -1, // Invalid
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MIGErrorCodes.INVALID_INPUT);
        expect(result.error.message).toContain('validation failed');
      }
    });
  });

  describe('Contact Fit Request Validation', () => {
    it('should validate correct contact fit request', () => {
      const validRequest = {
        contact_id: '123e4567-e89b-12d3-a456-426614174000',
        artist_slug: 'artist-slug',
        workspace_id: '123e4567-e89b-12d3-a456-426614174001',
      };

      const result = ContactFitRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject missing workspace_id', () => {
      const invalidRequest = {
        contact_id: '123e4567-e89b-12d3-a456-426614174000',
        artist_slug: 'artist-slug',
      };

      const result = ContactFitRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Scene Pulse Request Validation', () => {
    it('should validate with optional parameters', () => {
      const validRequests = [
        { scene_slug: 'uk-indie' },
        { country: 'GB' },
        { country: 'GB', limit: 20 },
        {},
      ];

      validRequests.forEach((req) => {
        const result = ScenePulseRequestSchema.safeParse(req);
        expect(result.success).toBe(true);
      });
    });

    it('should enforce country code length', () => {
      const invalidCountries = ['G', 'GBAA', 'United Kingdom'];

      invalidCountries.forEach((country) => {
        const result = ScenePulseRequestSchema.safeParse({ country });
        expect(result.success).toBe(false);
      });
    });
  });
});
