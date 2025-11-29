/**
 * Base HTTP client for Total Audio APIs
 */

import type { ApiResponse, ApiError } from '@total-audio/api-types';

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class TotalAudioApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TotalAudioApiError';
  }

  static fromApiError(error: ApiError, status: number): TotalAudioApiError {
    return new TotalAudioApiError(error.message, status, error.code, error.details);
  }
}

export class BaseClient {
  protected readonly apiKey: string;
  protected readonly baseUrl: string;
  protected readonly timeout: number;
  protected readonly headers: Record<string, string>;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://intel.totalaudiopromo.com';
    this.timeout = config.timeout || 30000;
    this.headers = config.headers || {};
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          ...this.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok || !data.success) {
        const error = data.error || {
          code: 'UNKNOWN_ERROR',
          message: `Request failed with status ${response.status}`,
        };
        throw TotalAudioApiError.fromApiError(error, response.status);
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof TotalAudioApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TotalAudioApiError('Request timed out', 504, 'TIMEOUT');
      }
      throw new TotalAudioApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'NETWORK_ERROR'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  protected get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }
  protected post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }
}
