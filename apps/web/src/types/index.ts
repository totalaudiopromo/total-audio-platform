export type UserRole = 'artist' | 'agency' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'artist' | 'agency' | 'white_label';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  monthlyPrice: number;
  setupFee: number;
  currentPeriodEnd: Date;
  createdAt: Date;
}

export interface Agency {
  id: string;
  name: string;
  ownerId: string;
  isWhiteLabel: boolean;
  brandingConfig?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  userId?: string;
  agencyId?: string;
  genre?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  artistId: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'social' | 'mixed';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  genre?: string;
  notes?: string;
  lastContactedAt?: string;
  responseRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  campaignId: string;
  mailchimpCampaignId?: string;
  subject: string;
  content: string;
  recipientCount: number;
  sentAt?: Date;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  analytics: {
    opens: number;
    clicks: number;
    replies: number;
    bounces: number;
    unsubscribes: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  campaignId: string;
  contactId: string;
  type: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'email_bounced';
  details?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  campaignId: string;
  generatedBy: string;
  type: 'weekly' | 'monthly' | 'campaign_summary';
  content: string;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'gmail' | 'mailchimp' | 'airtable' | 'claude';
  status: 'connected' | 'disconnected' | 'error';
  config: any;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalContacts: number;
  emailsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageReplyRate: number;
  recentActivity: Interaction[];
}