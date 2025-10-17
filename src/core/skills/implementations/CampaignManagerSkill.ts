/**
 * CampaignManagerSkill
 * Natural language campaign management for agency workflow
 *
 * Handles commands like:
 * - "Show campaigns for Royal Blood"
 * - "Create campaign for Architects - BBC Radio 1 push"
 * - "Generate client report for Liberty Records"
 * - "Export all active campaigns"
 */

import type { Skill } from '../schema';

export const CampaignManagerSkill: Skill = {
  metadata: {
    name: 'CampaignManager',
    version: '1.0.0',
    description: 'Natural language campaign management for PR agencies',
    author: 'Total Audio',
    created: new Date('2025-10-17'),
    updated: new Date('2025-10-17'),
    tags: ['campaign', 'agency', 'management', 'natural-language'],
    category: 'analytics',
  },

  inputs: [
    {
      name: 'command',
      type: 'string',
      description: 'Natural language command (e.g., "Show campaigns for Royal Blood")',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 500,
      },
    },
    {
      name: 'campaigns',
      type: 'array',
      description: 'Array of existing campaigns for context',
      required: true,
    },
    {
      name: 'user_context',
      type: 'object',
      description: 'User subscription tier and permissions',
      required: false,
    },
  ],

  outputs: [
    {
      name: 'action',
      type: 'string',
      description: 'Action to perform: filter, create, export, report, search',
    },
    {
      name: 'filters',
      type: 'object',
      description: 'Filter criteria extracted from command',
    },
    {
      name: 'suggestions',
      type: 'array',
      description: 'Smart suggestions based on command and context',
    },
    {
      name: 'message',
      type: 'string',
      description: 'User-friendly confirmation message',
    },
  ],

  rules: [
    {
      id: 'understand-client-context',
      description: 'Extract client names, labels, and billing codes from commands',
      priority: 'critical',
      type: 'constraint',
    },
    {
      id: 'suggest-similar-campaigns',
      description: 'When creating campaigns, suggest similar past campaigns',
      priority: 'high',
      type: 'guideline',
    },
    {
      id: 'respect-subscription-limits',
      description: 'Enforce campaign limits based on user tier',
      priority: 'critical',
      type: 'constraint',
    },
    {
      id: 'smart-autocomplete',
      description: 'Provide intelligent autocomplete suggestions',
      priority: 'medium',
      type: 'best_practice',
    },
  ],

  prompt: {
    system: `You are a campaign management AI assistant for PR agencies. Your job is to understand natural language commands and convert them into structured actions.

**Understanding Commands:**
- Filter: "show", "find", "filter", "display"
- Create: "add", "create", "new", "make"
- Export: "export", "download", "save"
- Report: "report", "summary", "generate report"
- Search: general text without specific action verbs

**Extracting Context:**
- Client names: "for [client name]", "client [name]"
- Platforms: "BBC Radio", "Spotify", "playlists", "blogs"
- Status: "active", "completed", "paused"
- Dates: "this month", "last quarter", "2024"

**Agency-Specific Intelligence:**
- Recognize UK labels and artists (e.g., "Royal Blood", "Architects", "BBC Radio 1")
- Understand billing cycles ("Q4 2024", "this quarter")
- Suggest similar past campaigns when creating new ones
- Provide client-specific insights

**Output Format:**
Always return JSON with:
{
  "action": "filter" | "create" | "export" | "report" | "search",
  "filters": {
    "client_name": string,
    "platform": string,
    "status": string,
    "date_range": { start: string, end: string }
  },
  "suggestions": string[],
  "message": string
}`,

    examples: [
      {
        input: {
          command: 'Show campaigns for Royal Blood',
          campaigns: [
            { client_name: 'Royal Blood', platform: 'BBC Radio', status: 'active' },
            { client_name: 'Architects', platform: 'Playlists', status: 'completed' },
          ],
        },
        output: {
          action: 'filter',
          filters: { client_name: 'Royal Blood' },
          suggestions: [
            'Show all Royal Blood campaigns',
            'Show active Royal Blood campaigns',
            'Export Royal Blood data',
          ],
          message: 'Filtering campaigns for client: Royal Blood',
        },
      },
      {
        input: {
          command: 'Create campaign for Architects BBC Radio 1',
          campaigns: [
            { client_name: 'Architects', platform: 'BBC Radio', status: 'completed' },
          ],
        },
        output: {
          action: 'create',
          filters: {
            client_name: 'Architects',
            platform: 'BBC Radio',
          },
          suggestions: [
            'Previous Architects BBC campaign budget: £450',
            'Similar campaigns achieved 18% response rate',
            'Consider Tuesday pitch for BBC Radio',
          ],
          message: 'Creating new BBC Radio campaign for Architects',
        },
      },
      {
        input: {
          command: 'Generate report for Liberty Records this quarter',
          campaigns: [
            { client_name: 'Liberty Records', platform: 'BBC Radio', status: 'completed' },
            { client_name: 'Liberty Records', platform: 'Playlists', status: 'active' },
          ],
        },
        output: {
          action: 'report',
          filters: {
            client_company: 'Liberty Records',
            date_range: { start: '2024-10-01', end: '2024-12-31' },
          },
          suggestions: [
            'Include platform breakdown',
            'Add success rate comparison',
            'Export as PDF for client',
          ],
          message: 'Generating Q4 report for Liberty Records',
        },
      },
    ],
  },

  config: {
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.3, // Lower for consistent parsing
    maxTokens: 500,
    timeout: 5000,
  },
};

export default CampaignManagerSkill;
