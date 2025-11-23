/**
 * Artifact store - handles CRUD operations for CIS artifacts
 */

import { createLogger } from './utils/logger';
import type { CISArtifact, CreateArtifactInput } from './types';

const logger = createLogger({ module: 'artifactStore' });

export interface ArtifactStoreConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export class ArtifactStore {
  private config: ArtifactStoreConfig;
  private supabase: any;

  constructor(config: ArtifactStoreConfig, supabaseClient: any) {
    this.config = config;
    this.supabase = supabaseClient;
  }

  /**
   * Create a new artifact
   */
  async create(input: CreateArtifactInput): Promise<CISArtifact> {
    try {
      logger.info('Creating artifact', {
        projectId: input.projectId,
        type: input.artifactType,
      });

      const { data, error } = await this.supabase
        .from('cis_artifacts')
        .insert({
          project_id: input.projectId,
          artifact_type: input.artifactType,
          url: input.url,
          metadata: input.metadata || {},
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create artifact', error);
        throw this.handleError(error);
      }

      logger.info('Artifact created successfully', { artifactId: data.id });
      return this.mapFromDb(data);
    } catch (error) {
      logger.error('Error creating artifact', error);
      throw error;
    }
  }

  /**
   * Get artifact by ID
   */
  async getById(artifactId: string): Promise<CISArtifact | null> {
    try {
      const { data, error } = await this.supabase
        .from('cis_artifacts')
        .select('*')
        .eq('id', artifactId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.handleError(error);
      }

      return data ? this.mapFromDb(data) : null;
    } catch (error) {
      logger.error('Error fetching artifact', error);
      throw error;
    }
  }

  /**
   * List artifacts for a project
   */
  async listByProject(
    projectId: string,
    options?: {
      type?: string;
      limit?: number;
    }
  ): Promise<CISArtifact[]> {
    try {
      let query = this.supabase
        .from('cis_artifacts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (options?.type) {
        query = query.eq('artifact_type', options.type);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw this.handleError(error);
      }

      return data ? data.map((row) => this.mapFromDb(row)) : [];
    } catch (error) {
      logger.error('Error listing artifacts', error);
      throw error;
    }
  }

  /**
   * Delete an artifact
   */
  async delete(artifactId: string): Promise<void> {
    try {
      logger.info('Deleting artifact', { artifactId });

      const { error } = await this.supabase
        .from('cis_artifacts')
        .delete()
        .eq('id', artifactId);

      if (error) {
        logger.error('Failed to delete artifact', error);
        throw this.handleError(error);
      }

      logger.info('Artifact deleted successfully', { artifactId });
    } catch (error) {
      logger.error('Error deleting artifact', error);
      throw error;
    }
  }

  /**
   * Map database row to CISArtifact type
   */
  private mapFromDb(row: any): CISArtifact {
    return {
      id: row.id,
      projectId: row.project_id,
      artifactType: row.artifact_type,
      url: row.url,
      metadata: row.metadata || {},
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
 * Factory function to create an ArtifactStore instance
 */
export const createArtifactStore = (
  config: ArtifactStoreConfig,
  supabaseClient: any
): ArtifactStore => {
  return new ArtifactStore(config, supabaseClient);
};
