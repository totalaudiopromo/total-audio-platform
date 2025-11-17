/**
 * Prebuilt Workflow Templates
 * Ready-to-use automation workflows for common music marketing scenarios
 */

import type { FlowTemplate } from '@total-audio/automations-engine';

export const WORKFLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: 'post-release-followup',
    name: 'Post-Release Follow-Up',
    description:
      'Automatically follow up with contacts who opened your release campaign but didn\'t reply',
    category: 'post_release',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'campaign_status_changed',
        config: {
          newStatus: 'completed',
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'condition',
        subtype: 'if_metric_greater',
        config: {
          metric: 'openRate',
          threshold: 0.3,
        },
        position: { x: 300, y: 100 },
      },
      {
        type: 'action',
        subtype: 'schedule_followup',
        config: {
          subject: 'Following up on {{campaign.name}}',
          body: 'Hi {{contact.name}},\n\nJust wanted to follow up on the release I sent over. Would love to hear your thoughts!\n\nBest,\n{{user.name}}',
          fromEmail: '{{user.email}}',
          delayDays: 7,
        },
        position: { x: 500, y: 100 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0', // Will be replaced with actual node IDs
        targetNodeId: '1',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '2',
        conditionLabel: 'true',
      },
    ],
  },

  {
    id: 'warm-contact-reactivation',
    name: 'Warm Contact Reactivation',
    description: 'Re-engage contacts who opened your email but didn\'t reply after 7 days',
    category: 'reactivation',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'email_open',
        config: {
          allCampaigns: true,
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'action',
        subtype: 'delay',
        config: {
          delaySeconds: 604800, // 7 days
        },
        position: { x: 300, y: 100 },
      },
      {
        type: 'condition',
        subtype: 'if_field_match',
        config: {
          field: 'event.replied',
          operator: 'equals',
          value: false,
        },
        position: { x: 500, y: 100 },
      },
      {
        type: 'action',
        subtype: 'send_email_campaign',
        config: {
          subject: 'Quick follow-up',
          body: 'Hi {{contact.name}},\n\nI noticed you checked out my recent release. Any initial thoughts you\'d be willing to share?\n\nCheers,\n{{user.name}}',
          fromEmail: '{{user.email}}',
          toContactIds: ['{{event.contactId}}'],
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0',
        targetNodeId: '1',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '2',
      },
      {
        sourceNodeId: '2',
        targetNodeId: '3',
        conditionLabel: 'true',
      },
    ],
  },

  {
    id: 'new-asset-reminder',
    name: 'New Asset Upload Reminder',
    description: 'Create a release task when new promotional assets are uploaded',
    category: 'reminders',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'asset_uploaded',
        config: {
          assetType: 'audio',
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'action',
        subtype: 'notify_user',
        config: {
          message: 'New audio asset uploaded: {{event.assetId}}',
          notificationType: 'info',
        },
        position: { x: 300, y: 100 },
      },
      {
        type: 'action',
        subtype: 'create_release_task',
        config: {
          title: 'Review and send: {{event.assetId}}',
          description: 'New promotional asset ready for distribution',
          dueDateDays: 3,
        },
        position: { x: 500, y: 100 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0',
        targetNodeId: '1',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '2',
      },
    ],
  },

  {
    id: 'playlist-success-boost',
    name: 'Playlist Success → PR Boost',
    description: 'When a campaign gets playlist success, boost PR efforts and tag as high-value',
    category: 'pr_boost',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'campaign_status_changed',
        config: {
          newStatus: 'playlist_added',
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'action',
        subtype: 'tag_contact',
        config: {
          tag: 'high-value',
        },
        position: { x: 300, y: 50 },
      },
      {
        type: 'action',
        subtype: 'update_cmg_node',
        config: {
          outcome: 'playlist_success',
          logType: 'success',
        },
        position: { x: 300, y: 150 },
      },
      {
        type: 'action',
        subtype: 'notify_user',
        config: {
          message: 'Playlist success! Campaign {{event.campaignId}} added to playlist',
          notificationType: 'success',
        },
        position: { x: 500, y: 100 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0',
        targetNodeId: '1',
      },
      {
        sourceNodeId: '0',
        targetNodeId: '2',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '3',
      },
    ],
  },

  {
    id: 'release-approaching-reminder',
    name: 'Release Date Reminder',
    description: 'Send reminders as release date approaches (14 days, 7 days, 1 day)',
    category: 'reminders',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'release_approaching',
        config: {
          daysUntilRelease: 14,
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'action',
        subtype: 'notify_user',
        config: {
          message: 'Release {{event.releaseId}} is 14 days away!',
          notificationType: 'info',
        },
        position: { x: 300, y: 100 },
      },
      {
        type: 'action',
        subtype: 'create_release_task',
        config: {
          title: 'Final PR push for {{event.releaseId}}',
          description: 'Prepare final round of promotional outreach',
          dueDateDays: 7,
        },
        position: { x: 500, y: 100 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0',
        targetNodeId: '1',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '2',
      },
    ],
  },

  {
    id: 'segment-based-drip',
    name: 'Segment-Based Drip Campaign',
    description: 'Automatically add engaged contacts to a nurture segment for drip campaigns',
    category: 'reactivation',
    triggerType: 'event',
    nodes: [
      {
        type: 'trigger',
        subtype: 'email_click',
        config: {
          allCampaigns: true,
        },
        position: { x: 100, y: 100 },
      },
      {
        type: 'condition',
        subtype: 'if_tag_present',
        config: {
          tag: 'engaged',
        },
        position: { x: 300, y: 100 },
      },
      {
        type: 'action',
        subtype: 'update_segment',
        config: {
          segmentId: '{{config.nurtureSegmentId}}',
          action: 'add',
        },
        position: { x: 500, y: 50 },
      },
      {
        type: 'action',
        subtype: 'log_event',
        config: {
          message: 'Contact added to nurture segment',
          level: 'info',
        },
        position: { x: 500, y: 150 },
      },
    ],
    edges: [
      {
        sourceNodeId: '0',
        targetNodeId: '1',
      },
      {
        sourceNodeId: '1',
        targetNodeId: '2',
        conditionLabel: 'true',
      },
      {
        sourceNodeId: '2',
        targetNodeId: '3',
      },
    ],
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): FlowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: FlowTemplate['category']
): FlowTemplate[] {
  return WORKFLOW_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): Array<{
  value: FlowTemplate['category'];
  label: string;
  description: string;
}> {
  return [
    {
      value: 'post_release',
      label: 'Post-Release',
      description: 'Follow-up workflows after campaign completion',
    },
    {
      value: 'reactivation',
      label: 'Reactivation',
      description: 'Re-engage warm or cold contacts',
    },
    {
      value: 'reminders',
      label: 'Reminders',
      description: 'Automated reminders and notifications',
    },
    {
      value: 'pr_boost',
      label: 'PR Boost',
      description: 'Amplify successful campaigns',
    },
  ];
}
