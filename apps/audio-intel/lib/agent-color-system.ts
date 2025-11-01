/**
 * Agent Color-Coding System for Total Audio Promo Sprint Week
 * Real-time visual feedback for agent activities and status monitoring
 */

// Agent Color Themes - Each category gets distinctive colors
export const AGENT_COLOR_THEMES = {
  // UI/UX Optimization Agents (Blue theme)
  'ui-ux': {
    primary: '#1E88E5',
    secondary: '#E3F2FD',
    accent: '#0D47A1',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
    icon: '🎨',
    description: 'UI/UX Optimization Agents',
  },

  // Backend Development Agents (Green theme)
  backend: {
    primary: '#4CAF50',
    secondary: '#E8F5E8',
    accent: '#1B5E20',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
    icon: '⚙️',
    description: 'Backend Development Agents',
  },

  // Brand Consistency Agents (Purple theme)
  brand: {
    primary: '#9C27B0',
    secondary: '#F3E5F5',
    accent: '#4A148C',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
    icon: '🎯',
    description: 'Brand Consistency Agents',
  },

  // Quality Assurance Agents (Orange theme)
  quality: {
    primary: '#FF9800',
    secondary: '#FFF3E0',
    accent: '#E65100',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    icon: '🔍',
    description: 'Quality Assurance Agents',
  },

  // Workflow Automation Agents (Red theme)
  automation: {
    primary: '#F44336',
    secondary: '#FFEBEE',
    accent: '#B71C1C',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
    icon: '🤖',
    description: 'Workflow Automation Agents',
  },

  // General Purpose Agents (Gray theme)
  general: {
    primary: '#607D8B',
    secondary: '#ECEFF1',
    accent: '#263238',
    text: '#FFFFFF',
    background: 'linear-gradient(135deg, #607D8B 0%, #78909C 100%)',
    icon: '🔧',
    description: 'General Purpose Agents',
  },

  // Asset Management Agents (Yellow theme)
  assets: {
    primary: '#FFC107',
    secondary: '#FFFDE7',
    accent: '#FF6F00',
    text: '#000000',
    background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
    icon: '📁',
    description: 'Asset Management Agents',
  },
} as const;

// Agent Status States with Visual Indicators
export const AGENT_STATUS_STATES = {
  idle: {
    color: '#9E9E9E',
    background: '#F5F5F5',
    pulse: false,
    animation: 'none',
    icon: '⏸️',
    message: 'Waiting for tasks...',
  },
  active: {
    color: '#4CAF50',
    background: '#E8F5E8',
    pulse: true,
    animation: 'pulse 2s infinite',
    icon: '▶️',
    message: 'Currently processing...',
  },
  processing: {
    color: '#2196F3',
    background: '#E3F2FD',
    pulse: true,
    animation: 'spin 1s linear infinite',
    icon: '⚡',
    message: 'Processing data...',
  },
  completed: {
    color: '#4CAF50',
    background: '#E8F5E8',
    pulse: false,
    animation: 'bounce 0.5s ease-out',
    icon: '✅',
    message: 'Task completed successfully',
  },
  error: {
    color: '#F44336',
    background: '#FFEBEE',
    pulse: true,
    animation: 'shake 0.5s ease-in-out',
    icon: '❌',
    message: 'Error encountered',
  },
  warning: {
    color: '#FF9800',
    background: '#FFF3E0',
    pulse: true,
    animation: 'flash 1s ease-in-out infinite',
    icon: '⚠️',
    message: 'Attention needed',
  },
} as const;

// Agent Type Mappings to Color Themes
export const AGENT_TYPE_MAPPINGS = {
  // UI/UX Optimization
  LoadingStateDemo: 'ui-ux',
  ContactLoadingState: 'ui-ux',
  ProgressBarWithDog: 'ui-ux',
  TextureSelector: 'ui-ux',
  GradientSelector: 'ui-ux',

  // Backend Development
  'database-agent': 'backend',
  'integration-agent': 'backend',
  orchestrator: 'backend',
  'api-handler': 'backend',
  'data-processor': 'backend',

  // Brand Consistency
  'brand-validator': 'brand',
  'content-reviewer': 'brand',
  'style-checker': 'brand',

  // Quality Assurance
  'test-runner': 'quality',
  'error-monitor': 'quality',
  'performance-tracker': 'quality',
  'health-checker': 'quality',

  // Workflow Automation
  'reddit-monitor': 'automation',
  'email-scheduler': 'automation',
  'content-generator': 'automation',
  'competitive-intel': 'automation',
  'viral-content-automation': 'automation',
  'growth-hacking-optimizer': 'automation',

  // General Purpose
  'contact-agent': 'general',
  'campaign-agent': 'general',
  'agency-agent': 'general',
  'analytics-agent': 'general',

  // Asset Management
  'file-processor': 'assets',
  'image-optimizer': 'assets',
  'export-manager': 'assets',
  'backup-agent': 'assets',
} as const;

// Sprint Week Priority Indicators
export const SPRINT_PRIORITY_LEVELS = {
  critical: {
    border: '3px solid #F44336',
    glow: '0 0 20px rgba(244, 67, 54, 0.5)',
    badge: 'CRITICAL',
    badgeColor: '#F44336',
  },
  high: {
    border: '2px solid #FF9800',
    glow: '0 0 15px rgba(255, 152, 0, 0.3)',
    badge: 'HIGH',
    badgeColor: '#FF9800',
  },
  medium: {
    border: '2px solid #2196F3',
    glow: '0 0 10px rgba(33, 150, 243, 0.2)',
    badge: 'MEDIUM',
    badgeColor: '#2196F3',
  },
  low: {
    border: '1px solid #9E9E9E',
    glow: 'none',
    badge: 'LOW',
    badgeColor: '#9E9E9E',
  },
} as const;

// Utility Functions for Color System
export const agentColorUtils = {
  /**
   * Get color theme for specific agent type
   */
  getAgentTheme: (agentType: string) => {
    const themeKey =
      AGENT_TYPE_MAPPINGS[agentType as keyof typeof AGENT_TYPE_MAPPINGS] || 'general';
    return AGENT_COLOR_THEMES[themeKey];
  },

  /**
   * Get status styling for agent state
   */
  getStatusStyling: (status: keyof typeof AGENT_STATUS_STATES) => {
    return AGENT_STATUS_STATES[status];
  },

  /**
   * Generate CSS classes for agent card
   */
  getAgentCardClasses: (agentType: string, status: keyof typeof AGENT_STATUS_STATES = 'idle') => {
    const theme = agentColorUtils.getAgentTheme(agentType);
    const statusStyle = AGENT_STATUS_STATES[status];

    return {
      cardStyle: {
        background: theme.background,
        border: `2px solid ${theme.primary}`,
        boxShadow: statusStyle.pulse
          ? `0 0 20px ${theme.primary}40`
          : `0 4px 12px ${theme.primary}20`,
        animation: statusStyle.animation,
      },
      textColor: theme.text,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
    };
  },

  /**
   * Generate real-time status indicator
   */
  generateStatusIndicator: (agentType: string, status: keyof typeof AGENT_STATUS_STATES) => {
    const theme = agentColorUtils.getAgentTheme(agentType);
    const statusStyle = AGENT_STATUS_STATES[status];

    return {
      indicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: statusStyle.color,
        animation: statusStyle.pulse ? 'pulse 2s infinite' : 'none',
        boxShadow: `0 0 8px ${statusStyle.color}60`,
      },
      icon: statusStyle.icon,
      message: statusStyle.message,
      theme: theme,
    };
  },

  /**
   * Get Sprint Week priority styling
   */
  getPriorityStyle: (priority: keyof typeof SPRINT_PRIORITY_LEVELS) => {
    return SPRINT_PRIORITY_LEVELS[priority];
  },

  /**
   * Generate color-coded log entry
   */
  generateLogEntry: (
    agentType: string,
    message: string,
    level: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const theme = agentColorUtils.getAgentTheme(agentType);
    const timestamp = new Date().toLocaleTimeString();

    const levelColors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
    };

    return {
      timestamp,
      agentType,
      message,
      level,
      styling: {
        backgroundColor: theme.secondary,
        borderLeft: `4px solid ${theme.primary}`,
        color: theme.accent,
        levelColor: levelColors[level],
      },
      theme,
    };
  },
};

// Agent Categories for Dashboard Organization
export const AGENT_CATEGORIES = {
  'Music Industry': {
    agents: ['music-tech-agent', 'music-industry-strategist', 'music-marketing-mastermind'],
    color: '#E91E63',
    icon: '🎵',
  },
  'Growth & Marketing': {
    agents: ['growth-hacking-optimizer', 'viral-content-automation', 'reddit-monitor'],
    color: '#4CAF50',
    icon: '📈',
  },
  'Data & Analytics': {
    agents: ['contact-agent', 'analytics-agent', 'competitive-intel'],
    color: '#2196F3',
    icon: '📊',
  },
  'System Operations': {
    agents: ['orchestrator', 'database-agent', 'integration-agent'],
    color: '#607D8B',
    icon: '⚙️',
  },
} as const;

// Export complete system
export default {
  AGENT_COLOR_THEMES,
  AGENT_STATUS_STATES,
  AGENT_TYPE_MAPPINGS,
  SPRINT_PRIORITY_LEVELS,
  AGENT_CATEGORIES,
  agentColorUtils,
};
