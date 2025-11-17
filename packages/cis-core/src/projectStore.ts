/**
 * Project store - handles CRUD operations for CIS projects
 */

import { createLogger } from './utils/logger';
import type {
  CISProject,
  CreateProjectInput,
  UpdateProjectInput,
  CISError,
} from './types';

const logger = createLogger({ module: 'projectStore' });

export interface ProjectStoreConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export class ProjectStore {
  private config: ProjectStoreConfig;
  private supabase: any; // Type from @supabase/supabase-js

  constructor(config: ProjectStoreConfig, supabaseClient: any) {
    this.config = config;
    this.supabase = supabaseClient;
  }

  /**
   * Create a new project
   */
  async create(
    userId: string,
    input: CreateProjectInput
  ): Promise<CISProject> {
    try {
      logger.info('Creating project', { userId, type: input.type });

      const { data, error } = await this.supabase
        .from('cis_projects')
        .insert({
          user_id: userId,
          title: input.title,
          type: input.type,
          metadata: input.metadata || {},
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create project', error);
        throw this.handleError(error);
      }

      logger.info('Project created successfully', { projectId: data.id });
      return this.mapFromDb(data);
    } catch (error) {
      logger.error('Error creating project', error);
      throw error;
    }
  }

  /**
   * Get project by ID
   */
  async getById(userId: string, projectId: string): Promise<CISProject | null> {
    try {
      const { data, error } = await this.supabase
        .from('cis_projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw this.handleError(error);
      }

      return data ? this.mapFromDb(data) : null;
    } catch (error) {
      logger.error('Error fetching project', error);
      throw error;
    }
  }

  /**
   * List all projects for a user
   */
  async list(
    userId: string,
    options?: {
      type?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<CISProject[]> {
    try {
      let query = this.supabase
        .from('cis_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (options?.type) {
        query = query.eq('type', options.type);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 50) - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        throw this.handleError(error);
      }

      return data ? data.map((row) => this.mapFromDb(row)) : [];
    } catch (error) {
      logger.error('Error listing projects', error);
      throw error;
    }
  }

  /**
   * Update a project
   */
  async update(
    userId: string,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<CISProject> {
    try {
      logger.info('Updating project', { userId, projectId });

      const updateData: any = {};
      if (input.title !== undefined) {
        updateData.title = input.title;
      }
      if (input.metadata !== undefined) {
        updateData.metadata = input.metadata;
      }

      const { data, error } = await this.supabase
        .from('cis_projects')
        .update(updateData)
        .eq('id', projectId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update project', error);
        throw this.handleError(error);
      }

      logger.info('Project updated successfully', { projectId });
      return this.mapFromDb(data);
    } catch (error) {
      logger.error('Error updating project', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async delete(userId: string, projectId: string): Promise<void> {
    try {
      logger.info('Deleting project', { userId, projectId });

      const { error } = await this.supabase
        .from('cis_projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to delete project', error);
        throw this.handleError(error);
      }

      logger.info('Project deleted successfully', { projectId });
    } catch (error) {
      logger.error('Error deleting project', error);
      throw error;
    }
  }

  /**
   * Map database row to CISProject type
   */
  private mapFromDb(row: any): CISProject {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      type: row.type,
      metadata: row.metadata || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
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
 * Factory function to create a ProjectStore instance
 */
export const createProjectStore = (
  config: ProjectStoreConfig,
  supabaseClient: any
): ProjectStore => {
  return new ProjectStore(config, supabaseClient);
};
