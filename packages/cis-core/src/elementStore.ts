/**
 * Element store - handles CRUD operations for CIS elements
 */

import { createLogger } from './utils/logger';
import type { CISElement, CreateElementInput, UpdateElementInput } from './types';

const logger = createLogger({ module: 'elementStore' });

export interface ElementStoreConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export class ElementStore {
  private config: ElementStoreConfig;
  private supabase: any;

  constructor(config: ElementStoreConfig, supabaseClient: any) {
    this.config = config;
    this.supabase = supabaseClient;
  }

  /**
   * Create a new element
   */
  async create(input: CreateElementInput): Promise<CISElement> {
    try {
      logger.info('Creating element', {
        projectId: input.projectId,
        type: input.elementType,
      });

      const { data, error } = await this.supabase
        .from('cis_elements')
        .insert({
          project_id: input.projectId,
          element_type: input.elementType,
          content: input.content,
          position: input.position || { x: 0, y: 0, w: 100, h: 100 },
          ordering: input.ordering || 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create element', error);
        throw this.handleError(error);
      }

      logger.info('Element created successfully', { elementId: data.id });
      return this.mapFromDb(data);
    } catch (error) {
      logger.error('Error creating element', error);
      throw error;
    }
  }

  /**
   * Get element by ID
   */
  async getById(elementId: string): Promise<CISElement | null> {
    try {
      const { data, error } = await this.supabase
        .from('cis_elements')
        .select('*')
        .eq('id', elementId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.handleError(error);
      }

      return data ? this.mapFromDb(data) : null;
    } catch (error) {
      logger.error('Error fetching element', error);
      throw error;
    }
  }

  /**
   * List elements for a project
   */
  async listByProject(
    projectId: string,
    options?: {
      type?: string;
    }
  ): Promise<CISElement[]> {
    try {
      let query = this.supabase
        .from('cis_elements')
        .select('*')
        .eq('project_id', projectId)
        .order('ordering', { ascending: true });

      if (options?.type) {
        query = query.eq('element_type', options.type);
      }

      const { data, error } = await query;

      if (error) {
        throw this.handleError(error);
      }

      return data ? data.map((row) => this.mapFromDb(row)) : [];
    } catch (error) {
      logger.error('Error listing elements', error);
      throw error;
    }
  }

  /**
   * Update an element
   */
  async update(
    elementId: string,
    input: UpdateElementInput
  ): Promise<CISElement> {
    try {
      logger.info('Updating element', { elementId });

      const updateData: any = {};
      if (input.content !== undefined) {
        updateData.content = input.content;
      }
      if (input.position !== undefined) {
        updateData.position = input.position;
      }
      if (input.ordering !== undefined) {
        updateData.ordering = input.ordering;
      }

      const { data, error } = await this.supabase
        .from('cis_elements')
        .update(updateData)
        .eq('id', elementId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update element', error);
        throw this.handleError(error);
      }

      logger.info('Element updated successfully', { elementId });
      return this.mapFromDb(data);
    } catch (error) {
      logger.error('Error updating element', error);
      throw error;
    }
  }

  /**
   * Delete an element
   */
  async delete(elementId: string): Promise<void> {
    try {
      logger.info('Deleting element', { elementId });

      const { error } = await this.supabase
        .from('cis_elements')
        .delete()
        .eq('id', elementId);

      if (error) {
        logger.error('Failed to delete element', error);
        throw this.handleError(error);
      }

      logger.info('Element deleted successfully', { elementId });
    } catch (error) {
      logger.error('Error deleting element', error);
      throw error;
    }
  }

  /**
   * Bulk update element ordering
   */
  async updateOrdering(
    updates: Array<{ id: string; ordering: number }>
  ): Promise<void> {
    try {
      logger.info('Bulk updating element ordering', {
        count: updates.length,
      });

      // Use a transaction-like approach with Promise.all
      const promises = updates.map((update) =>
        this.supabase
          .from('cis_elements')
          .update({ ordering: update.ordering })
          .eq('id', update.id)
      );

      const results = await Promise.all(promises);

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw new Error('Failed to update some element orderings');
      }

      logger.info('Element ordering updated successfully');
    } catch (error) {
      logger.error('Error updating element ordering', error);
      throw error;
    }
  }

  /**
   * Map database row to CISElement type
   */
  private mapFromDb(row: any): CISElement {
    return {
      id: row.id,
      projectId: row.project_id,
      elementType: row.element_type,
      content: row.content || {},
      position: row.position || { x: 0, y: 0, w: 100, h: 100 },
      ordering: row.ordering || 0,
      createdAt: row.created_at,
    };
  }

  /**
   * Handle database errors
   */
  private handleError(error: any): Error {
    const message = error.message || 'Database operation failed';
    const code = error.code || 'DB_ERROR';
    return new Error(`${code}: ${message}`);
  }
}

/**
 * Factory function to create an ElementStore instance
 */
export const createElementStore = (
  config: ElementStoreConfig,
  supabaseClient: any
): ElementStore => {
  return new ElementStore(config, supabaseClient);
};
