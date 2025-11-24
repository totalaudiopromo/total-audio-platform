/**
 * Base Adapter for MeshOS
 * All adapters MUST be READ-ONLY
 */

import type { AdapterConfig, AdapterReadResult } from '../types';
import { logger } from '../utils/logger';
import { now } from '../utils/time';

export abstract class BaseAdapter {
  protected config: AdapterConfig;
  protected systemName: string;

  constructor(systemName: string, config: AdapterConfig) {
    this.systemName = systemName;
    this.config = config;
    logger.setContext(`${systemName}Adapter`);

    // ENFORCE READ-ONLY
    if (config.read_only !== true) {
      throw new Error(`${systemName}Adapter MUST be read-only`);
    }
  }

  /**
   * Wrap adapter results with standard format
   */
  protected wrapResult<T>(data: T, error?: string): AdapterReadResult<T> {
    return {
      success: !error,
      data: error ? undefined : data,
      error,
      timestamp: now(),
    };
  }

  /**
   * Safe read operation with error handling
   */
  protected async safeRead<T>(operation: () => Promise<T>): Promise<AdapterReadResult<T>> {
    try {
      const data = await operation();
      return this.wrapResult(data);
    } catch (error: any) {
      logger.error(`Read error in ${this.systemName}Adapter`, error);
      return this.wrapResult(undefined as any, error.message);
    }
  }
}
