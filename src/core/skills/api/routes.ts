/**
 * Skills API Routes
 * Total Audio Platform
 *
 * RESTful API for skill management, invocation, and monitoring.
 */

import { Router } from 'express';
import { SkillEngine } from '../SkillEngine';
import { SupabaseClient } from '@supabase/supabase-js';

export function createSkillsRouter(skillEngine: SkillEngine, db: SupabaseClient): Router {
  const router = Router();

  /**
   * GET /api/skills
   * List all available skills with versions
   */
  router.get('/', async (req, res) => {
    try {
      const skills = await skillEngine.listSkills();

      res.json({
        success: true,
        skills,
        count: skills.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * GET /api/skills/:key
   * Get details for a specific skill
   */
  router.get('/:key', async (req, res) => {
    try {
      const { key } = req.params;

      const { data: skill, error } = await db
        .from('skill')
        .select(
          `
          id,
          key,
          name,
          description,
          category,
          tags,
          skill_version!inner(
            version,
            status,
            manifest,
            created_at
          )
        `
        )
        .eq('key', key)
        .eq('skill_version.status', 'active')
        .single();

      if (error || !skill) {
        return res.status(404).json({
          success: false,
          error: `Skill "${key}" not found`,
        });
      }

      res.json({
        success: true,
        skill,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * POST /api/skills/:key/invoke
   * Invoke a skill with given inputs
   */
  router.post('/:key/invoke', async (req, res) => {
    try {
      const { key } = req.params;
      const { inputs, version, orgId, userId } = req.body;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'orgId is required',
        });
      }

      if (!inputs) {
        return res.status(400).json({
          success: false,
          error: 'inputs are required',
        });
      }

      const result = await skillEngine.invokeSkill({
        skillKey: key,
        version: version || 'latest',
        payload: inputs,
        orgId,
        userId,
      });

      res.json({
        success: result.success,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * GET /api/skills/invocations
   * Get invocation history (audit trail)
   */
  router.get('/invocations', async (req, res) => {
    try {
      const { orgId, userId, skillKey, limit = 50, offset = 0 } = req.query;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'orgId is required',
        });
      }

      let query = db
        .from('skill_invocation')
        .select('*')
        .eq('org_id', orgId as string)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (userId) {
        query = query.eq('user_id', userId as string);
      }

      if (skillKey) {
        query = query.eq('skill_key', skillKey as string);
      }

      const { data: invocations, error, count } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        invocations,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          total: count,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * GET /api/skills/bindings
   * Get skill bindings for org/user
   */
  router.get('/bindings', async (req, res) => {
    try {
      const { orgId, userId } = req.query;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'orgId is required',
        });
      }

      let query = db
        .from('skill_binding')
        .select(
          `
          id,
          enabled,
          config,
          skill:skill_id (
            key,
            name,
            description
          ),
          version,
          created_at,
          updated_at
        `
        )
        .eq('org_id', orgId as string);

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      const { data: bindings, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        bindings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * POST /api/skills/bindings
   * Create or update skill binding
   */
  router.post('/bindings', async (req, res) => {
    try {
      const { orgId, userId, skillKey, version, enabled, config } = req.body;

      if (!orgId || !skillKey) {
        return res.status(400).json({
          success: false,
          error: 'orgId and skillKey are required',
        });
      }

      // Get skill ID
      const { data: skill, error: skillError } = await db
        .from('skill')
        .select('id')
        .eq('key', skillKey)
        .single();

      if (skillError || !skill) {
        return res.status(404).json({
          success: false,
          error: `Skill "${skillKey}" not found`,
        });
      }

      // Upsert binding
      const { data: binding, error } = await db
        .from('skill_binding')
        .upsert(
          {
            org_id: orgId,
            user_id: userId || null,
            skill_id: skill.id,
            version: version || 'latest',
            enabled: enabled !== undefined ? enabled : true,
            config: config || {},
          },
          {
            onConflict: 'org_id,user_id,skill_id',
          }
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        binding,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * DELETE /api/skills/bindings/:id
   * Remove a skill binding
   */
  router.delete('/bindings/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await db.from('skill_binding').delete().eq('id', id);

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        message: 'Binding removed successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * GET /api/skills/stats
   * Get usage statistics
   */
  router.get('/stats', async (req, res) => {
    try {
      const { orgId, period = '7d' } = req.query;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'orgId is required',
        });
      }

      // Calculate period date
      const periodDays = parseInt(period.toString().replace('d', ''), 10);
      const periodDate = new Date();
      periodDate.setDate(periodDate.getDate() - periodDays);

      // Get invocations in period
      const { data: invocations, error } = await db
        .from('skill_invocation')
        .select('skill_key, duration_ms, tokens_used, created_at, error')
        .eq('org_id', orgId as string)
        .gte('created_at', periodDate.toISOString());

      if (error) {
        throw error;
      }

      // Calculate stats
      const stats = {
        totalInvocations: invocations?.length || 0,
        successfulInvocations: invocations?.filter(i => !i.error).length || 0,
        failedInvocations: invocations?.filter(i => i.error).length || 0,
        averageDuration:
          invocations?.reduce((sum, i) => sum + (i.duration_ms || 0), 0) /
            (invocations?.length || 1) || 0,
        totalTokens: invocations?.reduce((sum, i) => sum + (i.tokens_used || 0), 0) || 0,
        bySkill: {} as Record<string, number>,
        period: `${periodDays} days`,
      };

      // Group by skill
      invocations?.forEach(inv => {
        stats.bySkill[inv.skill_key] = (stats.bySkill[inv.skill_key] || 0) + 1;
      });

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  return router;
}
