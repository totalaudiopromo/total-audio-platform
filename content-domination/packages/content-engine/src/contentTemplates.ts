/**
 * Content Templates and Brand Customization System
 * Professional templates for press releases, social media, and branded content
 */

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'press-release' | 'social-media' | 'email' | 'comprehensive';
  category: string;
  description: string;
  template: string;
  variables: TemplateVariable[];
  platforms?: string[];
  brandCustomizable: boolean;
  musicIndustryOptimized: boolean;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

export interface BrandTemplate {
  brandId: string;
  brandName: string;
  templates: ContentTemplate[];
  customizations: BrandCustomization;
}

export interface BrandCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
  voice: {
    tone: 'professional' | 'casual' | 'edgy' | 'inspirational';
    personality: string[];
    keyPhrases: string[];
  };
  styling: {
    logoUrl?: string;
    headerTemplate?: string;
    footerTemplate?: string;
    socialHandles?: Record<string, string>;
  };
  compliance: {
    industryStandards: string[];
    legalRequirements?: string[];
    brandGuidelines?: string;
  };
}

export class ContentTemplateEngine {
  private templates: Map<string, ContentTemplate> = new Map();
  private brandTemplates: Map<string, BrandTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default professional templates
   */
  private initializeDefaultTemplates(): void {
    // Press Release Templates
    this.addTemplate({
      id: 'pr-release-announcement',
      name: 'Music Release Announcement',
      type: 'press-release',
      category: 'Release Announcements',
      description: 'Professional press release for new music releases',
      template: this.getPressReleaseTemplate(),
      variables: this.getPressReleaseVariables(),
      brandCustomizable: true,
      musicIndustryOptimized: true
    });

    this.addTemplate({
      id: 'pr-tour-announcement',
      name: 'Tour Announcement',
      type: 'press-release',
      category: 'Tour & Events',
      description: 'Professional press release for tour announcements',
      template: this.getTourAnnouncementTemplate(),
      variables: this.getTourAnnouncementVariables(),
      brandCustomizable: true,
      musicIndustryOptimized: true
    });

    // Social Media Templates
    this.addTemplate({
      id: 'sm-release-instagram',
      name: 'Instagram Release Post',
      type: 'social-media',
      category: 'Release Promotion',
      description: 'Instagram-optimized release announcement post',
      template: this.getInstagramReleaseTemplate(),
      variables: this.getInstagramReleaseVariables(),
      platforms: ['instagram'],
      brandCustomizable: true,
      musicIndustryOptimized: true
    });

    this.addTemplate({
      id: 'sm-release-twitter',
      name: 'Twitter Release Thread',
      type: 'social-media',
      category: 'Release Promotion',
      description: 'Twitter thread for release announcement',
      template: this.getTwitterReleaseTemplate(),
      variables: this.getTwitterReleaseVariables(),
      platforms: ['twitter'],
      brandCustomizable: true,
      musicIndustryOptimized: true
    });

    this.addTemplate({
      id: 'sm-tiktok-concept',
      name: 'TikTok Video Concept',
      type: 'social-media',
      category: 'Video Content',
      description: 'TikTok video concept and script',
      template: this.getTikTokConceptTemplate(),
      variables: this.getTikTokConceptVariables(),
      platforms: ['tiktok'],
      brandCustomizable: true,
      musicIndustryOptimized: true
    });

    // Comprehensive Campaign Templates
    this.addTemplate({
      id: 'campaign-suite-release',
      name: 'Complete Release Campaign',
      type: 'comprehensive',
      category: 'Full Campaign',
      description: 'Comprehensive content suite for music release campaigns',
      template: this.getComprehensiveCampaignTemplate(),
      variables: this.getComprehensiveCampaignVariables(),
      brandCustomizable: true,
      musicIndustryOptimized: true
    });
  }

  /**
   * Press Release Templates
   */
  private getPressReleaseTemplate(): string {
    return `**{{headline}}**

{{dateline}}

{{leadParagraph}}

{{bodyParagraph1}}

"{{artistQuote}}" said {{artistName}}.

{{bodyParagraph2}}

{{bodyParagraph3}}

**About {{artistName}}:**
{{artistBio}}

{{labelInformation}}

**Media Contact:**
{{contactName}}
{{contactEmail}}
{{contactPhone}}

**High-resolution images and additional assets available upon request.**

**Social Media:**
{{socialHandles}}

**Streaming Links:**
{{streamingLinks}}

###

**Note to editors:** This press release is available online at {{websiteUrl}}`;
  }

  private getPressReleaseVariables(): TemplateVariable[] {
    return [
      { key: 'headline', label: 'Press Release Headline', type: 'text', required: true, placeholder: 'Compelling news headline under 80 characters' },
      { key: 'dateline', label: 'Dateline', type: 'text', required: true, placeholder: 'CITY, State – Date –' },
      { key: 'leadParagraph', label: 'Lead Paragraph', type: 'textarea', required: true, placeholder: 'Who, what, when, where, why in 2-3 sentences' },
      { key: 'artistName', label: 'Artist Name', type: 'text', required: true },
      { key: 'artistQuote', label: 'Artist Quote', type: 'textarea', required: true, placeholder: 'Compelling quote from the artist' },
      { key: 'artistBio', label: 'Artist Bio', type: 'textarea', required: true, placeholder: '50-100 word artist biography' },
      { key: 'bodyParagraph1', label: 'Body Paragraph 1', type: 'textarea', required: true },
      { key: 'bodyParagraph2', label: 'Body Paragraph 2', type: 'textarea', required: false },
      { key: 'bodyParagraph3', label: 'Body Paragraph 3', type: 'textarea', required: false },
      { key: 'labelInformation', label: 'Label/Management Info', type: 'textarea', required: false },
      { key: 'contactName', label: 'Media Contact Name', type: 'text', required: true },
      { key: 'contactEmail', label: 'Media Contact Email', type: 'text', required: true },
      { key: 'contactPhone', label: 'Media Contact Phone', type: 'text', required: false },
      { key: 'socialHandles', label: 'Social Media Handles', type: 'textarea', required: true },
      { key: 'streamingLinks', label: 'Streaming Platform Links', type: 'textarea', required: true },
      { key: 'websiteUrl', label: 'Artist Website', type: 'text', required: false }
    ];
  }

  private getTourAnnouncementTemplate(): string {
    return `**{{artistName}} Announces {{tourName}} Tour with {{numberOfShows}} Dates Across {{territories}}**

{{dateline}}

{{artistName}}, the {{genreDescription}} artist behind {{hitSongs}}, today announced the {{tourName}} tour, featuring {{numberOfShows}} shows across {{territories}} beginning {{tourStartDate}}.

The tour, produced by {{tourProducer}}, will kick off {{tourStartDate}} in {{firstVenue}}, {{firstCity}}, and conclude {{tourEndDate}} at {{finalVenue}} in {{finalCity}}.

"{{tourQuote}}" said {{artistName}}.

{{tourDescription}}

**Tour Dates:**
{{tourDates}}

{{ticketInformation}}

{{sponsorInformation}}

**About {{artistName}}:**
{{artistBio}}

**Media Contact:**
{{contactInformation}}

###`;
  }

  private getTourAnnouncementVariables(): TemplateVariable[] {
    return [
      { key: 'artistName', label: 'Artist Name', type: 'text', required: true },
      { key: 'tourName', label: 'Tour Name', type: 'text', required: true },
      { key: 'numberOfShows', label: 'Number of Shows', type: 'number', required: true },
      { key: 'territories', label: 'Territories/Regions', type: 'text', required: true, placeholder: 'e.g., North America, Europe' },
      { key: 'dateline', label: 'Dateline', type: 'text', required: true },
      { key: 'genreDescription', label: 'Genre Description', type: 'text', required: true },
      { key: 'hitSongs', label: 'Notable Songs', type: 'text', required: true },
      { key: 'tourStartDate', label: 'Tour Start Date', type: 'date', required: true },
      { key: 'tourEndDate', label: 'Tour End Date', type: 'date', required: true },
      { key: 'firstVenue', label: 'First Venue', type: 'text', required: true },
      { key: 'firstCity', label: 'First City', type: 'text', required: true },
      { key: 'finalVenue', label: 'Final Venue', type: 'text', required: true },
      { key: 'finalCity', label: 'Final City', type: 'text', required: true },
      { key: 'tourProducer', label: 'Tour Producer/Promoter', type: 'text', required: false },
      { key: 'tourQuote', label: 'Tour Quote', type: 'textarea', required: true },
      { key: 'tourDescription', label: 'Tour Description', type: 'textarea', required: true },
      { key: 'tourDates', label: 'Tour Dates List', type: 'textarea', required: true },
      { key: 'ticketInformation', label: 'Ticket Information', type: 'textarea', required: true },
      { key: 'sponsorInformation', label: 'Sponsor Information', type: 'textarea', required: false },
      { key: 'artistBio', label: 'Artist Bio', type: 'textarea', required: true },
      { key: 'contactInformation', label: 'Media Contact Info', type: 'textarea', required: true }
    ];
  }

  /**
   * Social Media Templates
   */
  private getInstagramReleaseTemplate(): string {
    return `🎵 {{releaseType}} ALERT! 🎵

{{artistName}} just dropped "{{trackTitle}}" and it's absolutely {{emotionalDescriptor}}! 

{{hookDescription}}

{{callToAction}}

{{hashtags}}

---
📱 Stream now: {{streamingLink}}
🔗 Full EP/Album: {{albumLink}}
👆 Save this post and share with a friend who needs to hear this!

#{{artistNameHash}} #{{genre}} #NewMusic #{{releaseMonth}}Vibes`;
  }

  private getInstagramReleaseVariables(): TemplateVariable[] {
    return [
      { key: 'artistName', label: 'Artist Name', type: 'text', required: true },
      { key: 'trackTitle', label: 'Track Title', type: 'text', required: true },
      { key: 'releaseType', label: 'Release Type', type: 'select', required: true, options: ['SINGLE', 'EP', 'ALBUM', 'REMIX'] },
      { key: 'emotionalDescriptor', label: 'Emotional Descriptor', type: 'select', required: true, options: ['incredible', 'mesmerizing', 'powerful', 'beautiful', 'energetic', 'haunting'] },
      { key: 'hookDescription', label: 'Hook Description', type: 'textarea', required: true, placeholder: '1-2 sentences describing what makes this release special' },
      { key: 'callToAction', label: 'Call to Action', type: 'text', required: true, placeholder: 'What you want followers to do' },
      { key: 'streamingLink', label: 'Primary Streaming Link', type: 'text', required: true },
      { key: 'albumLink', label: 'Album/EP Link', type: 'text', required: false },
      { key: 'artistNameHash', label: 'Artist Name (Hashtag)', type: 'text', required: true, placeholder: 'Artist name without spaces for hashtag' },
      { key: 'genre', label: 'Genre', type: 'text', required: true },
      { key: 'releaseMonth', label: 'Release Month', type: 'text', required: true },
      { key: 'hashtags', label: 'Additional Hashtags', type: 'textarea', required: true, placeholder: 'Additional relevant hashtags' }
    ];
  }

  private getTwitterReleaseTemplate(): string {
    return `🧵 THREAD: {{artistName}} - "{{trackTitle}}" is out now and here's why you need to listen... 1/{{threadCount}}

{{thread1}}

{{thread2}}

{{thread3}}

Stream "{{trackTitle}}" everywhere: {{streamingLinks}}

{{finalCTA}} {{threadCount}}/{{threadCount}}`;
  }

  private getTwitterReleaseVariables(): TemplateVariable[] {
    return [
      { key: 'artistName', label: 'Artist Name', type: 'text', required: true },
      { key: 'trackTitle', label: 'Track Title', type: 'text', required: true },
      { key: 'threadCount', label: 'Thread Count', type: 'number', required: true, placeholder: '3-5 tweets recommended' },
      { key: 'thread1', label: 'Thread Tweet 1', type: 'textarea', required: true, placeholder: 'First tweet content (max 280 chars)' },
      { key: 'thread2', label: 'Thread Tweet 2', type: 'textarea', required: true, placeholder: 'Second tweet content (max 280 chars)' },
      { key: 'thread3', label: 'Thread Tweet 3', type: 'textarea', required: false, placeholder: 'Third tweet content (max 280 chars)' },
      { key: 'streamingLinks', label: 'Streaming Links', type: 'text', required: true },
      { key: 'finalCTA', label: 'Final Call to Action', type: 'text', required: true, placeholder: 'Final engagement request' }
    ];
  }

  private getTikTokConceptTemplate(): string {
    return `🎬 TikTok Video Concept: {{conceptTitle}}

**Hook (0-3 seconds):** {{hook}}

**Content (3-{{videoLength}} seconds):**
{{mainContent}}

**Call to Action (Last 3 seconds):** {{callToAction}}

**Audio:** {{audioChoice}}

**Visual Style:** {{visualStyle}}

**Hashtags:** {{hashtags}}

**Best Posting Time:** {{postingTime}}

**Engagement Strategy:**
{{engagementStrategy}}`;
  }

  private getTikTokConceptVariables(): TemplateVariable[] {
    return [
      { key: 'conceptTitle', label: 'Video Concept Title', type: 'text', required: true },
      { key: 'hook', label: 'Opening Hook', type: 'textarea', required: true, placeholder: 'Attention-grabbing opening (first 3 seconds)' },
      { key: 'videoLength', label: 'Video Length', type: 'select', required: true, options: ['15', '30', '60'] },
      { key: 'mainContent', label: 'Main Content Description', type: 'textarea', required: true },
      { key: 'callToAction', label: 'Call to Action', type: 'text', required: true },
      { key: 'audioChoice', label: 'Audio Choice', type: 'select', required: true, options: ['Original Track', 'Trending Sound', 'Remix/Mashup', 'Acapella Version'] },
      { key: 'visualStyle', label: 'Visual Style', type: 'text', required: true },
      { key: 'hashtags', label: 'Hashtags', type: 'textarea', required: true },
      { key: 'postingTime', label: 'Optimal Posting Time', type: 'text', required: true },
      { key: 'engagementStrategy', label: 'Engagement Strategy', type: 'textarea', required: true }
    ];
  }

  private getComprehensiveCampaignTemplate(): string {
    return `# {{campaignName}} - Complete Content Campaign

## Campaign Overview
**Artist:** {{artistName}}
**Release:** {{releaseTitle}}
**Campaign Period:** {{campaignStartDate}} - {{campaignEndDate}}
**Primary Goal:** {{primaryGoal}}

## Press Release
{{pressReleaseContent}}

## Social Media Content Suite

### Instagram
{{instagramContent}}

### Twitter
{{twitterContent}}

### TikTok
{{tiktokContent}}

### Facebook
{{facebookContent}}

## Email Marketing
{{emailContent}}

## Content Calendar
{{contentCalendar}}

## Performance Metrics
{{performanceMetrics}}

## Brand Guidelines
{{brandGuidelines}}`;
  }

  private getComprehensiveCampaignVariables(): TemplateVariable[] {
    return [
      { key: 'campaignName', label: 'Campaign Name', type: 'text', required: true },
      { key: 'artistName', label: 'Artist Name', type: 'text', required: true },
      { key: 'releaseTitle', label: 'Release Title', type: 'text', required: true },
      { key: 'campaignStartDate', label: 'Campaign Start Date', type: 'date', required: true },
      { key: 'campaignEndDate', label: 'Campaign End Date', type: 'date', required: true },
      { key: 'primaryGoal', label: 'Primary Campaign Goal', type: 'text', required: true },
      { key: 'pressReleaseContent', label: 'Press Release Content', type: 'textarea', required: true },
      { key: 'instagramContent', label: 'Instagram Content Strategy', type: 'textarea', required: true },
      { key: 'twitterContent', label: 'Twitter Content Strategy', type: 'textarea', required: true },
      { key: 'tiktokContent', label: 'TikTok Content Strategy', type: 'textarea', required: true },
      { key: 'facebookContent', label: 'Facebook Content Strategy', type: 'textarea', required: false },
      { key: 'emailContent', label: 'Email Marketing Content', type: 'textarea', required: false },
      { key: 'contentCalendar', label: 'Content Calendar', type: 'textarea', required: true },
      { key: 'performanceMetrics', label: 'Performance Metrics', type: 'textarea', required: true },
      { key: 'brandGuidelines', label: 'Brand Guidelines', type: 'textarea', required: false }
    ];
  }

  /**
   * Template management methods
   */
  addTemplate(template: ContentTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): ContentTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplatesByType(type: string): ContentTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.type === type);
  }

  getTemplatesByCategory(category: string): ContentTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  getAllTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Template rendering with variable substitution
   */
  renderTemplate(templateId: string, variables: Record<string, any>, brandCustomization?: BrandCustomization): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let renderedContent = template.template;

    // Substitute variables
    template.variables.forEach(variable => {
      const value = variables[variable.key] || '';
      const pattern = new RegExp(`{{${variable.key}}}`, 'g');
      renderedContent = renderedContent.replace(pattern, value.toString());
    });

    // Apply brand customization if provided
    if (brandCustomization) {
      renderedContent = this.applyBrandCustomization(renderedContent, brandCustomization);
    }

    return renderedContent;
  }

  /**
   * Apply brand customization to rendered content
   */
  private applyBrandCustomization(content: string, brandCustomization: BrandCustomization): string {
    let customizedContent = content;

    // Apply voice and tone adjustments
    if (brandCustomization.voice.tone === 'casual') {
      customizedContent = customizedContent.replace(/\bformal\b/gi, 'relaxed');
      customizedContent = customizedContent.replace(/\bannouncement\b/gi, 'update');
    } else if (brandCustomization.voice.tone === 'professional') {
      customizedContent = customizedContent.replace(/\bcasual\b/gi, 'professional');
      customizedContent = customizedContent.replace(/\bawesome\b/gi, 'exceptional');
    }

    // Apply brand personality
    if (brandCustomization.voice.personality.includes('energetic')) {
      customizedContent = customizedContent.replace(/\bgood\b/gi, 'amazing');
      customizedContent = customizedContent.replace(/\bnice\b/gi, 'incredible');
    }

    // Add social handles if provided
    if (brandCustomization.styling.socialHandles) {
      const socialText = Object.entries(brandCustomization.styling.socialHandles)
        .map(([platform, handle]) => `${platform}: ${handle}`)
        .join('\n');
      customizedContent = customizedContent.replace(/{{socialHandles}}/g, socialText);
    }

    // Apply header/footer templates
    if (brandCustomization.styling.headerTemplate) {
      customizedContent = brandCustomization.styling.headerTemplate + '\n\n' + customizedContent;
    }

    if (brandCustomization.styling.footerTemplate) {
      customizedContent = customizedContent + '\n\n' + brandCustomization.styling.footerTemplate;
    }

    return customizedContent;
  }

  /**
   * Validate template variables
   */
  validateTemplateVariables(templateId: string, variables: Record<string, any>): ValidationResult {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, errors: [`Template ${templateId} not found`] };
    }

    const errors: string[] = [];

    template.variables.forEach(variable => {
      if (variable.required && !variables[variable.key]) {
        errors.push(`Required variable '${variable.label}' is missing`);
      }

      if (variable.validation && variables[variable.key]) {
        const regex = new RegExp(variable.validation);
        if (!regex.test(variables[variable.key])) {
          errors.push(`Variable '${variable.label}' does not match required format`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate template preview
   */
  generateTemplatePreview(templateId: string): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      return 'Template not found';
    }

    // Create sample variables for preview
    const sampleVariables: Record<string, any> = {};
    template.variables.forEach(variable => {
      switch (variable.type) {
        case 'text':
          sampleVariables[variable.key] = variable.placeholder || `[${variable.label}]`;
          break;
        case 'date':
          sampleVariables[variable.key] = new Date().toISOString().split('T')[0];
          break;
        case 'number':
          sampleVariables[variable.key] = '1';
          break;
        case 'select':
          sampleVariables[variable.key] = variable.options?.[0] || 'Option 1';
          break;
        case 'textarea':
          sampleVariables[variable.key] = variable.placeholder || `[${variable.label}]`;
          break;
      }
    });

    return this.renderTemplate(templateId, sampleVariables);
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export default ContentTemplateEngine;