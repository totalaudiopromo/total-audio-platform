/**
 * Audio Intel API Client
 */

import { BaseClient, ClientConfig } from './base-client';
import type {
  EnrichContactsResponse,
  ValidateEmailsResponse,
  EnrichedContact,
  EnrichContactInput,
  EnrichContactsRequest,
} from '@total-audio/api-types';

export interface IntelClientConfig extends ClientConfig {
  baseUrl?: string;
}

export class IntelClient extends BaseClient {
  constructor(config: IntelClientConfig) {
    super({ ...config, baseUrl: config.baseUrl || 'https://intel.totalaudiopromo.com' });
  }

  async enrichContacts(
    contacts: EnrichContactInput[],
    options?: EnrichContactsRequest['options']
  ): Promise<EnrichedContact[]> {
    const response = await this.post<EnrichContactsResponse>('/api/enrich-claude', {
      contacts,
      options,
    });
    return response.enriched;
  }

  async enrichContact(contact: EnrichContactInput): Promise<EnrichedContact> {
    const results = await this.enrichContacts([contact]);
    return results[0];
  }

  async validateEmails(emails: string[]): Promise<ValidateEmailsResponse> {
    return this.post<ValidateEmailsResponse>('/api/validate-emails', { emails });
  }

  async validateEmail(email: string) {
    const response = await this.validateEmails([email]);
    return response.results[0];
  }
}
