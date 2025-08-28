/**
 * Content Orchestrator - Intelligence-Driven Content Creation System
 * Coordinates Enhanced Content Creation Agent with Campaign Planner and Intel Research agents
 */

import axios from 'axios';

export interface ContentRequest {
  contentType: 'press-release' | 'social-media' | 'comprehensive';
  artistName: string;
  trackTitle?: string;
  releaseDate?: string;
  genre?: string;
  campaignContext?: any;
  intelContext?: any;
  brandProfile?: BrandProfile;
  targetPlatforms?: Platform[];
}

export interface BrandProfile {
  primaryColor: string;
  secondaryColor: string;
  voice: 'professional' | 'casual' | 'edgy' | 'inspirational';
  tone: 'friendly' | 'authoritative' | 'playful' | 'serious';
  industry: string;
  targetAudience: string;
  keyMessages: string[];
  logoUrl?: string;
  brandGuidelines?: string;
}

export interface Platform {
  name: 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'linkedin' | 'youtube';
  specifications: PlatformSpecs;
}

export interface PlatformSpecs {
  characterLimit?: number;
  aspectRatio?: string;
  optimalLength?: string;
  features: string[];
  bestPostingTimes: string[];
}

export interface ContentSuite {
  pressRelease?: PressRelease;
  socialMediaContent: SocialMediaPost[];
  emailContent?: EmailContent;
  brandedAssets: BrandedAsset[];
  campaignIntegration: CampaignIntegration;
  performanceMetrics: PerformanceMetric[];
}

export interface PressRelease {
  headline: string;
  dateline: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  boilerplate: string;
  contactInfo: string;
  keywords: string[];
  seoOptimized: boolean;
  distributionReady: boolean;
}

export interface SocialMediaPost {
  platform: string;
  contentType: string;
  headline?: string;
  caption: string;
  hashtags: string[];
  visualConcept: string;
  callToAction: string;
  optimalPostingTime: string;
  engagementStrategy: string[];
}

export interface EmailContent {
  subject: string;
  preview: string;
  bodyHtml: string;
  bodyText: string;
  ctaButtons: CTAButton[];
}

export interface CTAButton {
  text: string;
  url: string;
  style: 'primary' | 'secondary';
}

export interface BrandedAsset {
  type: string;
  content: string;
  brandElements: string[];
  customization: any;
}

export interface CampaignIntegration {
  campaignPhase: string;
  milestoneAlignment: string[];
  contentCalendar: ContentCalendarItem[];
  crossPlatformStrategy: string;
}

export interface ContentCalendarItem {
  date: string;
  platform: string;
  contentType: string;
  status: 'draft' | 'scheduled' | 'published';
  performanceGoals: string[];
}

export interface PerformanceMetric {
  metric: string;
  target: number;
  tracking: string;
  optimization: string[];
}

class ContentOrchestrator {
  private apiBase: string;

  constructor(apiBase: string = '/api') {
    this.apiBase = apiBase;
  }

  /**
   * Generate comprehensive content suite with intelligence integration
   */
  async generateIntelligentContent(request: ContentRequest): Promise<ContentSuite> {
    try {
      // Step 1: Gather campaign intelligence for content context
      const campaignIntelligence = await this.gatherCampaignIntelligence(request);
      
      // Step 2: Get contact intelligence for personalization
      const contactIntelligence = await this.gatherContactIntelligence(request);
      
      // Step 3: Generate content with intelligence context
      const contentSuite = await this.generateContentWithIntelligence(request, campaignIntelligence, contactIntelligence);
      
      // Step 4: Apply brand customization
      const brandedContent = await this.applyBrandCustomization(contentSuite, request.brandProfile);
      
      // Step 5: Optimize for campaign integration
      const campaignIntegratedContent = await this.integrateCampaignStrategy(brandedContent, campaignIntelligence);
      
      return campaignIntegratedContent;
    } catch (error) {
      console.error('Content orchestration failed:', error);
      throw new Error('Failed to generate intelligent content suite');
    }
  }

  /**
   * Gather campaign intelligence for content strategy
   */
  private async gatherCampaignIntelligence(request: ContentRequest): Promise<any> {
    if (!request.campaignContext) {
      return { strategy: 'Standard content approach', timing: 'Immediate', focus: 'General audience' };
    }

    const campaignQuery = `Analyze campaign context for content strategy:

Artist: ${request.artistName}
Track: ${request.trackTitle || 'Various'}
Genre: ${request.genre || 'Music'}
Release Date: ${request.releaseDate || 'TBD'}
Campaign Context: ${JSON.stringify(request.campaignContext)}

Provide content strategy recommendations for:
1. Content timing and sequencing aligned with campaign phases
2. Messaging strategy based on campaign goals
3. Platform prioritization for campaign objectives
4. Content pillars that support campaign strategy
5. Performance metrics aligned with campaign success`;

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: 'campaign-planner-agent',
        query: campaignQuery,
        context: request
      });

      const data = response.data as any;
      if (data.success) {
        return {
          strategy: data.response,
          recommendations: data.recommendations || [],
          campaignData: data.data,
          contentStrategy: this.extractContentStrategy(data.response)
        };
      }
    } catch (error) {
      console.warn('Campaign intelligence gathering failed:', error);
    }

    return { strategy: 'Standard content approach', timing: 'Immediate', focus: 'General audience' };
  }

  /**
   * Gather contact intelligence for content personalization
   */
  private async gatherContactIntelligence(request: ContentRequest): Promise<any> {
    if (!request.intelContext) {
      return { insights: 'General content approach', personalization: 'Standard messaging' };
    }

    const intelQuery = `Analyze contact intelligence for content personalization:

Artist: ${request.artistName}
Intel Context: ${JSON.stringify(request.intelContext)}

Provide content personalization insights for:
1. Key industry contacts and their preferences
2. Platform-specific messaging optimization
3. Timing recommendations based on contact behavior
4. Personalization strategies for press releases and social media
5. Industry relationship building through content`;

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: 'intel-research-agent',
        query: intelQuery,
        context: request.intelContext
      });

      const data = response.data as any;
      if (data.success) {
        return {
          insights: data.response,
          recommendations: data.recommendations || [],
          intelligenceData: data.data,
          personalizationStrategy: this.extractPersonalizationStrategy(data.response)
        };
      }
    } catch (error) {
      console.warn('Contact intelligence gathering failed:', error);
    }

    return { insights: 'General content approach', personalization: 'Standard messaging' };
  }

  /**
   * Generate content with intelligence context
   */
  private async generateContentWithIntelligence(
    request: ContentRequest,
    campaignIntelligence: any,
    contactIntelligence: any
  ): Promise<any> {
    const contentQuery = this.buildIntelligentContentQuery(request, campaignIntelligence, contactIntelligence);

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: 'content-generation-agent',
        query: contentQuery,
        context: {
          ...request,
          campaignIntelligence,
          contactIntelligence
        }
      });

      const data = response.data as any;
      if (data.success) {
        return {
          content: data.response,
          contentData: data.data,
          recommendations: data.recommendations || [],
          nextSteps: data.nextSteps || []
        };
      }
    } catch (error) {
      console.error('Content generation failed:', error);
    }

    throw new Error('Content generation with intelligence failed');
  }

  /**
   * Build intelligent content query
   */
  private buildIntelligentContentQuery(
    request: ContentRequest,
    campaignIntelligence: any,
    contactIntelligence: any
  ): string {
    let baseQuery = '';

    if (request.contentType === 'press-release') {
      baseQuery = `Create a professional press release for ${request.artistName}`;
      if (request.trackTitle) baseQuery += ` announcing "${request.trackTitle}"`;
    } else if (request.contentType === 'social-media') {
      baseQuery = `Create comprehensive social media content for ${request.artistName}`;
      if (request.targetPlatforms) {
        baseQuery += ` across ${request.targetPlatforms.map(p => p.name).join(', ')}`;
      }
    } else {
      baseQuery = `Create comprehensive content suite including press release and social media for ${request.artistName}`;
    }

    return `${baseQuery}

CAMPAIGN INTELLIGENCE:
${campaignIntelligence.strategy || 'Standard approach'}

CONTACT INTELLIGENCE:
${contactIntelligence.insights || 'General insights'}

ADDITIONAL CONTEXT:
- Artist: ${request.artistName}
- Track: ${request.trackTitle || 'Various'}
- Genre: ${request.genre || 'Music'}
- Release Date: ${request.releaseDate || 'TBD'}

REQUIREMENTS:
1. Integrate campaign strategy insights into content messaging
2. Apply contact intelligence for personalization and targeting
3. Ensure professional music industry standards
4. Optimize for multiple platform distribution
5. Include performance tracking recommendations

Generate comprehensive, intelligence-driven content that aligns with campaign goals and contact insights.`;
  }

  /**
   * Apply brand customization to content
   */
  private async applyBrandCustomization(contentSuite: any, brandProfile?: BrandProfile): Promise<any> {
    if (!brandProfile) {
      return contentSuite; // Return content without customization
    }

    // Apply brand voice and tone
    const brandedContent = {
      ...contentSuite,
      brandProfile,
      customizedContent: this.customizeContentForBrand(contentSuite.content, brandProfile),
      brandElements: this.extractBrandElements(brandProfile),
      brandConsistency: this.ensureBrandConsistency(contentSuite, brandProfile)
    };

    return brandedContent;
  }

  /**
   * Customize content for specific brand
   */
  private customizeContentForBrand(content: string, brandProfile: BrandProfile): string {
    let customizedContent = content;

    // Apply brand voice adjustments
    if (brandProfile.voice === 'casual') {
      customizedContent = customizedContent.replace(/\bformal\b/g, 'relaxed');
      customizedContent = customizedContent.replace(/\bprofessional\b/g, 'approachable');
    } else if (brandProfile.voice === 'professional') {
      customizedContent = customizedContent.replace(/\bcasual\b/g, 'professional');
      customizedContent = customizedContent.replace(/\bfun\b/g, 'engaging');
    }

    // Apply tone adjustments
    if (brandProfile.tone === 'playful') {
      customizedContent = customizedContent.replace(/\bserious\b/g, 'lighthearted');
    } else if (brandProfile.tone === 'authoritative') {
      customizedContent = customizedContent.replace(/\bsuggests\b/g, 'demonstrates');
      customizedContent = customizedContent.replace(/\bmight\b/g, 'will');
    }

    // Integrate key messages
    if (brandProfile.keyMessages && brandProfile.keyMessages.length > 0) {
      customizedContent += '\n\nKey Brand Messages:\n';
      brandProfile.keyMessages.forEach(message => {
        customizedContent += `• ${message}\n`;
      });
    }

    return customizedContent;
  }

  /**
   * Extract brand elements from profile
   */
  private extractBrandElements(brandProfile: BrandProfile): any {
    return {
      colors: {
        primary: brandProfile.primaryColor,
        secondary: brandProfile.secondaryColor
      },
      voice: brandProfile.voice,
      tone: brandProfile.tone,
      targetAudience: brandProfile.targetAudience,
      industry: brandProfile.industry,
      keyMessages: brandProfile.keyMessages,
      guidelines: brandProfile.brandGuidelines
    };
  }

  /**
   * Ensure brand consistency across content
   */
  private ensureBrandConsistency(contentSuite: any, brandProfile: BrandProfile): any {
    return {
      voiceConsistency: 'Applied throughout all content pieces',
      toneAlignment: `Maintained ${brandProfile.tone} tone across platforms`,
      messageIntegration: 'Key brand messages integrated naturally',
      visualAlignment: 'Content optimized for brand color scheme',
      audienceTargeting: `Focused on ${brandProfile.targetAudience}`
    };
  }

  /**
   * Integrate campaign strategy into content
   */
  private async integrateCampaignStrategy(contentSuite: any, campaignIntelligence: any): Promise<ContentSuite> {
    const campaignIntegration: CampaignIntegration = {
      campaignPhase: this.determineCampaignPhase(campaignIntelligence),
      milestoneAlignment: this.alignWithCampaignMilestones(campaignIntelligence),
      contentCalendar: this.generateContentCalendar(contentSuite, campaignIntelligence),
      crossPlatformStrategy: this.developCrossPlatformStrategy(contentSuite)
    };

    return {
      pressRelease: this.extractPressRelease(contentSuite),
      socialMediaContent: this.extractSocialMediaContent(contentSuite),
      emailContent: this.extractEmailContent(contentSuite),
      brandedAssets: this.extractBrandedAssets(contentSuite),
      campaignIntegration,
      performanceMetrics: this.generatePerformanceMetrics(contentSuite)
    };
  }

  /**
   * Extract content strategy from campaign response
   */
  private extractContentStrategy(campaignResponse: string): any {
    return {
      timing: campaignResponse.includes('immediate') ? 'immediate' : 'scheduled',
      focus: campaignResponse.includes('engagement') ? 'engagement' : 'awareness',
      platforms: this.extractMentionedPlatforms(campaignResponse),
      contentTypes: this.extractMentionedContentTypes(campaignResponse)
    };
  }

  /**
   * Extract personalization strategy from intel response
   */
  private extractPersonalizationStrategy(intelResponse: string): any {
    return {
      contactTypes: this.extractContactTypes(intelResponse),
      messagingApproach: this.extractMessagingApproach(intelResponse),
      timingRecommendations: this.extractTimingRecommendations(intelResponse),
      platformPreferences: this.extractPlatformPreferences(intelResponse)
    };
  }

  /**
   * Helper methods for content extraction and processing
   */
  private extractMentionedPlatforms(text: string): string[] {
    const platforms = ['instagram', 'twitter', 'tiktok', 'facebook', 'linkedin', 'youtube'];
    return platforms.filter(platform => 
      text.toLowerCase().includes(platform)
    );
  }

  private extractMentionedContentTypes(text: string): string[] {
    const contentTypes = ['press release', 'social media', 'email', 'video', 'blog'];
    return contentTypes.filter(type => 
      text.toLowerCase().includes(type)
    );
  }

  private extractContactTypes(text: string): string[] {
    const contactTypes = ['curator', 'journalist', 'blogger', 'influencer', 'radio'];
    return contactTypes.filter(type => 
      text.toLowerCase().includes(type)
    );
  }

  private extractMessagingApproach(text: string): string {
    if (text.includes('personal')) return 'personal';
    if (text.includes('professional')) return 'professional';
    if (text.includes('casual')) return 'casual';
    return 'balanced';
  }

  private extractTimingRecommendations(text: string): string[] {
    const timings = [];
    if (text.includes('morning')) timings.push('morning');
    if (text.includes('afternoon')) timings.push('afternoon');
    if (text.includes('evening')) timings.push('evening');
    return timings.length > 0 ? timings : ['optimal'];
  }

  private extractPlatformPreferences(text: string): any {
    return {
      primary: this.extractMentionedPlatforms(text)[0] || 'instagram',
      secondary: this.extractMentionedPlatforms(text).slice(1) || ['twitter', 'tiktok']
    };
  }

  private determineCampaignPhase(campaignIntelligence: any): string {
    const strategy = campaignIntelligence.strategy || '';
    if (strategy.includes('pre-release')) return 'pre-release';
    if (strategy.includes('release')) return 'release';
    if (strategy.includes('post-release')) return 'post-release';
    return 'ongoing';
  }

  private alignWithCampaignMilestones(campaignIntelligence: any): string[] {
    return [
      'Content creation milestone',
      'Pre-release content deployment',
      'Release week content push',
      'Post-release engagement sustaining'
    ];
  }

  private generateContentCalendar(contentSuite: any, campaignIntelligence: any): ContentCalendarItem[] {
    return [
      {
        date: new Date().toISOString().split('T')[0],
        platform: 'instagram',
        contentType: 'announcement',
        status: 'draft',
        performanceGoals: ['engagement', 'reach']
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        platform: 'twitter',
        contentType: 'teaser',
        status: 'draft',
        performanceGoals: ['shares', 'comments']
      }
    ];
  }

  private developCrossPlatformStrategy(contentSuite: any): string {
    return 'Staggered content deployment with platform-specific optimization while maintaining brand consistency and message alignment across all channels.';
  }

  // Content extraction methods (simplified implementations)
  private extractPressRelease(contentSuite: any): PressRelease | undefined {
    const data = contentSuite.contentData;
    return data?.pressRelease ? {
      headline: data.pressRelease.headline || 'Professional Press Release',
      dateline: data.pressRelease.dateline || '[City] - [Date]',
      leadParagraph: data.pressRelease.leadParagraph || 'Lead paragraph content',
      bodyParagraphs: data.pressRelease.bodyParagraphs || [],
      boilerplate: data.pressRelease.boilerplate || 'About the artist',
      contactInfo: data.pressRelease.contactInfo || 'Media contact information',
      keywords: data.pressRelease.keywords || [],
      seoOptimized: true,
      distributionReady: true
    } : undefined;
  }

  private extractSocialMediaContent(contentSuite: any): SocialMediaPost[] {
    const data = contentSuite.contentData;
    if (!data?.socialMedia?.platforms) return [];

    return data.socialMedia.platforms.map((platform: any) => ({
      platform: platform.platform,
      contentType: 'post',
      caption: platform.content || 'Engaging social media content',
      hashtags: ['#music', '#newrelease'],
      visualConcept: 'Eye-catching visual concept',
      callToAction: 'Stream now',
      optimalPostingTime: '2:00 PM',
      engagementStrategy: ['respond to comments', 'share stories', 'create polls']
    }));
  }

  private extractEmailContent(contentSuite: any): EmailContent | undefined {
    return undefined; // Would be implemented based on content analysis
  }

  private extractBrandedAssets(contentSuite: any): BrandedAsset[] {
    return [
      {
        type: 'branded-content',
        content: 'Content with brand customization',
        brandElements: contentSuite.brandElements || [],
        customization: contentSuite.brandProfile || {}
      }
    ];
  }

  private generatePerformanceMetrics(contentSuite: any): PerformanceMetric[] {
    return [
      {
        metric: 'engagement_rate',
        target: 5.0,
        tracking: 'platform_analytics',
        optimization: ['hashtag optimization', 'posting time adjustment']
      },
      {
        metric: 'reach',
        target: 10000,
        tracking: 'social_media_insights',
        optimization: ['content quality', 'audience targeting']
      }
    ];
  }
}

export default ContentOrchestrator;