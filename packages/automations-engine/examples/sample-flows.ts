/**
 * Sample Automation Flows
 * Example flows and trigger contexts for testing and demonstration
 */

import type {
  TriggerContext,
  EmailOpenTrigger,
  EmailReplyTrigger,
  CampaignStatusChangedTrigger,
} from '../src/types';

// ============================================================================
// SAMPLE TRIGGER CONTEXTS
// ============================================================================

/**
 * Email Open Event
 */
export const emailOpenEvent: EmailOpenTrigger = {
  type: 'email_open',
  source: 'email_engine',
  payload: {
    emailId: 'email_123',
    campaignId: 'campaign_456',
    contactId: 'contact_789',
    openedAt: new Date('2025-11-17T10:30:00Z'),
  },
  timestamp: new Date('2025-11-17T10:30:00Z'),
  metadata: {
    userId: 'user_001',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  },
};

/**
 * Email Reply Event
 */
export const emailReplyEvent: EmailReplyTrigger = {
  type: 'email_reply',
  source: 'email_engine',
  payload: {
    emailId: 'email_123',
    campaignId: 'campaign_456',
    contactId: 'contact_789',
    replyText: 'Thanks for the release! I\'d love to feature this on my show.',
    repliedAt: new Date('2025-11-17T14:00:00Z'),
  },
  timestamp: new Date('2025-11-17T14:00:00Z'),
  metadata: {
    userId: 'user_001',
    sentiment: 'positive',
  },
};

/**
 * Campaign Status Changed Event
 */
export const campaignStatusChangedEvent: CampaignStatusChangedTrigger = {
  type: 'campaign_status_changed',
  source: 'tracker',
  payload: {
    campaignId: 'campaign_456',
    oldStatus: 'in_progress',
    newStatus: 'completed',
    changedAt: new Date('2025-11-18T09:00:00Z'),
  },
  timestamp: new Date('2025-11-18T09:00:00Z'),
  metadata: {
    userId: 'user_001',
    totalSent: 50,
    totalOpened: 25,
    totalReplied: 5,
  },
};

/**
 * Asset Uploaded Event
 */
export const assetUploadedEvent: TriggerContext = {
  type: 'asset_uploaded',
  source: 'asset_drop',
  payload: {
    assetId: 'asset_101',
    userId: 'user_001',
    assetType: 'audio',
    fileName: 'new-single-master.wav',
    fileSize: 52428800, // 50MB
    uploadedAt: new Date('2025-11-17T16:00:00Z'),
  },
  timestamp: new Date('2025-11-17T16:00:00Z'),
  metadata: {
    userId: 'user_001',
    releaseId: 'release_202',
  },
};

/**
 * Release Approaching Event
 */
export const releaseApproachingEvent: TriggerContext = {
  type: 'release_approaching',
  source: 'release_planner',
  payload: {
    releaseId: 'release_202',
    releaseDate: new Date('2025-12-01T00:00:00Z'),
    daysUntilRelease: 14,
    releaseType: 'single',
    artistName: 'The Example Band',
    releaseName: 'Summer Nights',
  },
  timestamp: new Date('2025-11-17T00:00:00Z'),
  metadata: {
    userId: 'user_001',
  },
};

// ============================================================================
// SAMPLE FLOW DEFINITIONS (JSON)
// ============================================================================

/**
 * Simple Email Follow-Up Flow
 * When an email is opened but not replied to within 7 days, send a follow-up
 */
export const simpleFollowUpFlow = {
  flow: {
    name: 'Simple Email Follow-Up',
    description: 'Send follow-up after 7 days if no reply',
    triggerType: 'event',
  },
  nodes: [
    {
      type: 'trigger',
      subtype: 'email_open',
      config: {
        allCampaigns: true,
      },
    },
    {
      type: 'action',
      subtype: 'delay',
      config: {
        delaySeconds: 604800, // 7 days
      },
    },
    {
      type: 'condition',
      subtype: 'if_field_match',
      config: {
        field: 'event.replied',
        operator: 'equals',
        value: false,
      },
    },
    {
      type: 'action',
      subtype: 'send_email_campaign',
      config: {
        subject: 'Following up on my release',
        body: 'Hi, just wanted to follow up on the track I sent over...',
        fromEmail: 'artist@example.com',
      },
    },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
    { sourceIndex: 2, targetIndex: 3, conditionLabel: 'true' },
  ],
};

/**
 * Playlist Success Workflow
 * When a campaign gets playlist success, tag contact and update CMG
 */
export const playlistSuccessFlow = {
  flow: {
    name: 'Playlist Success Workflow',
    description: 'React to playlist additions with tagging and tracking',
    triggerType: 'event',
  },
  nodes: [
    {
      type: 'trigger',
      subtype: 'campaign_status_changed',
      config: {
        newStatus: 'playlist_added',
      },
    },
    {
      type: 'action',
      subtype: 'tag_contact',
      config: {
        tag: 'high-value',
      },
    },
    {
      type: 'action',
      subtype: 'update_cmg_node',
      config: {
        outcome: 'playlist_success',
        logType: 'success',
      },
    },
    {
      type: 'action',
      subtype: 'notify_user',
      config: {
        message: 'Playlist success! Track added by {{contact.name}}',
        notificationType: 'success',
      },
    },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 0, targetIndex: 2 },
    { sourceIndex: 1, targetIndex: 3 },
  ],
};

/**
 * Engagement-Based Segmentation
 * Move engaged contacts (who click links) into a nurture segment
 */
export const engagementSegmentationFlow = {
  flow: {
    name: 'Engagement-Based Segmentation',
    description: 'Add contacts who click links to nurture segment',
    triggerType: 'event',
  },
  nodes: [
    {
      type: 'trigger',
      subtype: 'email_click',
      config: {
        allCampaigns: true,
      },
    },
    {
      type: 'condition',
      subtype: 'if_tag_present',
      config: {
        tag: 'engaged',
      },
    },
    {
      type: 'action',
      subtype: 'update_segment',
      config: {
        segmentId: 'segment_nurture',
        action: 'add',
      },
    },
    {
      type: 'action',
      subtype: 'log_event',
      config: {
        message: 'Contact added to nurture segment based on engagement',
        level: 'info',
      },
    },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2, conditionLabel: 'true' },
    { sourceIndex: 2, targetIndex: 3 },
  ],
};

/**
 * Release Reminder Chain
 * Multi-step reminders as release date approaches
 */
export const releaseReminderFlow = {
  flow: {
    name: 'Release Date Reminders',
    description: 'Send reminders 14, 7, and 1 day before release',
    triggerType: 'event',
  },
  nodes: [
    {
      type: 'trigger',
      subtype: 'release_approaching',
      config: {
        daysUntilRelease: 14,
      },
    },
    {
      type: 'action',
      subtype: 'notify_user',
      config: {
        message: 'Release "{{event.releaseName}}" is 14 days away!',
        notificationType: 'info',
      },
    },
    {
      type: 'action',
      subtype: 'create_release_task',
      config: {
        title: 'Final PR push for {{event.releaseName}}',
        description: 'Prepare promotional materials and outreach list',
        dueDateDays: 7,
      },
    },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
  ],
};

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Create a mock execution context
 */
export function createMockExecutionContext(userId: string = 'test_user') {
  return {
    userId,
    workspaceId: null,
    fusionContext: {
      userId,
      timestamp: new Date(),
    },
    clients: {
      emailEngine: {
        createCampaign: async () => ({ campaignId: 'mock_campaign' }),
        scheduleCampaign: async () => {},
        sendCampaign: async () => {},
      },
      listBuilder: {
        addContactToSegment: async () => {},
        removeContactFromSegment: async () => {},
        getSegmentContacts: async () => [],
        tagContact: async () => {},
      },
      tracker: {
        getCampaignMetrics: async () => ({
          openRate: 0.5,
          clickRate: 0.2,
          replyRate: 0.1,
          totalSent: 100,
          totalOpened: 50,
          totalClicked: 20,
          totalReplied: 10,
        }),
        updateCampaignStatus: async () => {},
      },
      releasePlanner: {
        createTask: async () => ({ taskId: 'mock_task' }),
      },
      cmg: {
        logSuccessPattern: async () => {},
        logAttempt: async () => {},
      },
    },
    logger: {
      info: console.log,
      error: console.error,
      warn: console.warn,
      debug: console.debug,
    },
    limits: {
      maxActionsPerExecution: 100,
      maxExternalWrites: 50,
      maxContactActions: 200,
    },
  };
}

/**
 * Generate test contact data
 */
export function generateTestContact(index: number = 1) {
  return {
    id: `contact_${index}`,
    name: `Test Contact ${index}`,
    email: `contact${index}@example.com`,
    tags: ['engaged', 'radio-promoter'],
    metadata: {
      station: `Radio Station ${index}`,
      genre: 'indie-rock',
    },
  };
}

/**
 * Generate test campaign data
 */
export function generateTestCampaign(index: number = 1) {
  return {
    id: `campaign_${index}`,
    name: `Test Campaign ${index}`,
    status: 'in_progress',
    genre: 'indie-rock',
    releaseDate: new Date('2025-12-01'),
    metrics: {
      sent: 50,
      opened: 25,
      clicked: 10,
      replied: 5,
    },
  };
}
