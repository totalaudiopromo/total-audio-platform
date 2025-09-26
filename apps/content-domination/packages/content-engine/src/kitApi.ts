/**
 * Kit.com API Integration for Audio Intel
 * API Documentation: https://developers.kit.com/
 */

interface KitConfig {
  apiKey: string;
  accountId?: string;
  baseUrl: string;
}

interface KitSubscriber {
  id?: string;
  email_address: string;
  first_name?: string;
  last_name?: string;
  state: 'active' | 'unsubscribed' | 'cancelled' | 'unconfirmed' | 'bounced' | 'complained';
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  fields?: Record<string, any>;
}

interface KitForm {
  id?: string;
  name: string;
  description?: string;
  settings?: {
    after_subscribe_url?: string;
    success_message?: string;
    require_confirmation?: boolean;
    gdpr_checkbox_text?: string;
  };
  embed_js?: string;
  embed_url?: string;
}

interface KitSequence {
  id?: string;
  name: string;
  description?: string;
  emails?: KitEmail[];
  trigger_settings?: {
    tags?: string[];
    forms?: string[];
  };
}

interface KitEmail {
  id?: string;
  subject: string;
  content: string;
  delay_days?: number;
  delay_hours?: number;
  sent_at?: string;
  sequence_id?: string;
  template_id?: string;
}

interface KitTag {
  id?: string;
  name: string;
  created_at?: string;
}

interface KitSegment {
  id?: string;
  name: string;
  description?: string;
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
    value: string;
  }>;
}

interface KitWebhook {
  id?: string;
  target_url: string;
  events: string[];
  secret?: string;
}

// Minimal shape for account details used by the app
interface KitAccount {
  company_name?: string;
  name?: string;
  from_name?: string;
  from_email?: string;
  website_url?: string;
}

class KitApi {
  private config: KitConfig;
  private headers: HeadersInit;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.kit.com/v4'
    };
    
    this.headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Kit API Error ${response.status}: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Kit API Request Failed:', error);
      throw error;
    }
  }

  // Account & Configuration Methods
  async getAccount(): Promise<KitAccount> {
    return this.request<KitAccount>('/account');
  }

  async updateAccount(settings: {
    name?: string;
    company_name?: string;
    from_name?: string;
    from_email?: string;
    reply_to_email?: string;
    address?: string;
    website_url?: string;
    timezone?: string;
  }) {
    return this.request('/account', 'PUT', settings);
  }

  // Subscriber Management Methods
  async getSubscribers(params?: {
    page?: number;
    limit?: number;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
    state?: 'active' | 'unsubscribed' | 'cancelled' | 'unconfirmed' | 'bounced' | 'complained';
    tags?: string[];
  }) {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.join(',');
        } else if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return this.request<{subscribers: KitSubscriber[], total_count: number}>(`/subscribers${queryString}`);
  }

  async createSubscriber(subscriber: Omit<KitSubscriber, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<KitSubscriber>('/subscribers', 'POST', subscriber);
  }

  async updateSubscriber(id: string, updates: Partial<KitSubscriber>) {
    return this.request<KitSubscriber>(`/subscribers/${id}`, 'PUT', updates);
  }

  async getSubscriberByEmail(email: string) {
    return this.request<KitSubscriber>(`/subscribers/email:${encodeURIComponent(email)}`);
  }

  async addTagsToSubscriber(subscriberId: string, tags: string[]) {
    return this.request(`/subscribers/${subscriberId}/tags`, 'POST', { tags });
  }

  async removeTagsFromSubscriber(subscriberId: string, tags: string[]) {
    return this.request(`/subscribers/${subscriberId}/tags`, 'DELETE', { tags });
  }

  // Tag Management Methods
  async getTags() {
    return this.request<{tags: KitTag[]}>('/tags');
  }

  async createTag(name: string) {
    return this.request<KitTag>('/tags', 'POST', { name });
  }

  async deleteTag(id: string) {
    return this.request(`/tags/${id}`, 'DELETE');
  }

  // Form Management Methods
  async getForms() {
    return this.request<{forms: KitForm[]}>('/forms');
  }

  async createForm(form: Omit<KitForm, 'id' | 'embed_js' | 'embed_url'>) {
    return this.request<KitForm>('/forms', 'POST', form);
  }

  async updateForm(id: string, updates: Partial<KitForm>) {
    return this.request<KitForm>(`/forms/${id}`, 'PUT', updates);
  }

  async getFormSubscriptions(formId: string) {
    return this.request(`/forms/${formId}/subscriptions`);
  }

  // Sequence Management Methods
  async getSequences() {
    return this.request<{sequences: KitSequence[]}>('/sequences');
  }

  async createSequence(sequence: Omit<KitSequence, 'id'>) {
    return this.request<KitSequence>('/sequences', 'POST', sequence);
  }

  async updateSequence(id: string, updates: Partial<KitSequence>) {
    return this.request<KitSequence>(`/sequences/${id}`, 'PUT', updates);
  }

  async getSequenceEmails(sequenceId: string) {
    return this.request<{emails: KitEmail[]}>(`/sequences/${sequenceId}/emails`);
  }

  async createSequenceEmail(sequenceId: string, email: Omit<KitEmail, 'id' | 'sequence_id'>) {
    return this.request<KitEmail>(`/sequences/${sequenceId}/emails`, 'POST', email);
  }

  async updateSequenceEmail(sequenceId: string, emailId: string, updates: Partial<KitEmail>) {
    return this.request<KitEmail>(`/sequences/${sequenceId}/emails/${emailId}`, 'PUT', updates);
  }

  async subscribeToSequence(sequenceId: string, subscriberId: string) {
    return this.request(`/sequences/${sequenceId}/subscribe`, 'POST', { subscriber_id: subscriberId });
  }

  // Segment Management Methods
  async getSegments() {
    return this.request<{segments: KitSegment[]}>('/segments');
  }

  async createSegment(segment: Omit<KitSegment, 'id'>) {
    return this.request<KitSegment>('/segments', 'POST', segment);
  }

  async updateSegment(id: string, updates: Partial<KitSegment>) {
    return this.request<KitSegment>(`/segments/${id}`, 'PUT', updates);
  }

  async getSegmentSubscribers(segmentId: string) {
    return this.request(`/segments/${segmentId}/subscribers`);
  }

  // Webhook Management Methods
  async getWebhooks() {
    return this.request<{webhooks: KitWebhook[]}>('/webhooks');
  }

  async createWebhook(webhook: Omit<KitWebhook, 'id'>) {
    return this.request<KitWebhook>('/webhooks', 'POST', webhook);
  }

  async updateWebhook(id: string, updates: Partial<KitWebhook>) {
    return this.request<KitWebhook>(`/webhooks/${id}`, 'PUT', updates);
  }

  async deleteWebhook(id: string) {
    return this.request(`/webhooks/${id}`, 'DELETE');
  }

  // Analytics Methods
  async getEmailStats(emailId: string) {
    return this.request(`/emails/${emailId}/stats`);
  }

  async getSequenceStats(sequenceId: string) {
    return this.request(`/sequences/${sequenceId}/stats`);
  }

  async getFormStats(formId: string) {
    return this.request(`/forms/${formId}/stats`);
  }

  async getSubscriberStats() {
    return this.request('/stats/subscribers');
  }

  // Custom Field Management Methods
  async getCustomFields() {
    return this.request('/custom_fields');
  }

  async createCustomField(field: {
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean';
    description?: string;
  }) {
    return this.request('/custom_fields', 'POST', field);
  }

  async updateSubscriberField(subscriberId: string, fieldName: string, value: any) {
    return this.request(`/subscribers/${subscriberId}/fields`, 'PUT', {
      [fieldName]: value
    });
  }
}

export default KitApi;
export type {
  KitConfig,
  KitSubscriber,
  KitForm,
  KitSequence,
  KitEmail,
  KitTag,
  KitSegment,
  KitWebhook,
  KitAccount
};