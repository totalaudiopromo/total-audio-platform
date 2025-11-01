/**
 * Template-Based Content Generator
 * Zero-cost content generation using smart templates when AI budget is exhausted
 * Maintains voice consistency and quality without API costs
 */

import { format } from 'date-fns';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  publishDate: Date;
  relevanceScore: number;
  automationAngle: string;
  keywords: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  platform: 'twitter' | 'linkedin' | 'newsletter';
  category: string;
  template: string;
  variables: string[];
  voiceConsistencyScore: number;
  exampleOutput: string;
  usageCount: number;
  successRate: number;
}

export interface TemplateGenerationResult {
  success: boolean;
  content: string;
  platform: string;
  templateUsed: string;
  voiceConsistencyScore: number;
  variables: Record<string, string>;
  estimatedEngagement: number;
  improvements: string[];
}

class TemplateContentGenerator {
  private templates: Map<string, ContentTemplate> = new Map();
  private voiceProfile: any;
  private industryTerms: Map<string, string> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeVoiceProfile();
    this.initializeIndustryTerms();
  }

  /**
   * Generate content using templates instead of AI
   */
  async generateTemplateContent(
    newsItem: NewsItem,
    platform: 'twitter' | 'linkedin' | 'newsletter',
    urgency: 'immediate' | 'same-day' | 'weekly' = 'same-day'
  ): Promise<TemplateGenerationResult> {
    console.log(`🎨 Generating template content for: ${newsItem.title}`);

    try {
      // Select best template for this news item
      const selectedTemplate = this.selectBestTemplate(newsItem, platform);

      if (!selectedTemplate) {
        throw new Error(`No suitable template found for ${platform} content`);
      }

      // Extract variables from news item
      const variables = this.extractVariables(newsItem, selectedTemplate);

      // Generate content using template
      const content = this.populateTemplate(selectedTemplate, variables, newsItem);

      // Apply voice consistency enhancements
      const enhancedContent = this.applyVoiceEnhancements(content, platform);

      // Calculate quality scores
      const voiceConsistencyScore = this.calculateVoiceConsistency(enhancedContent);
      const estimatedEngagement = this.estimateEngagement(enhancedContent, platform);

      // Generate improvement suggestions
      const improvements = this.generateImprovements(enhancedContent, newsItem);

      // Update template usage statistics
      this.updateTemplateUsage(selectedTemplate.id, voiceConsistencyScore > 8.0);

      return {
        success: true,
        content: enhancedContent,
        platform,
        templateUsed: selectedTemplate.name,
        voiceConsistencyScore,
        variables,
        estimatedEngagement,
        improvements,
      };
    } catch (error) {
      console.error('❌ Template content generation failed:', error);
      return {
        success: false,
        content: '',
        platform,
        templateUsed: 'none',
        voiceConsistencyScore: 0,
        variables: {},
        estimatedEngagement: 0,
        improvements: [`Template generation failed: ${error.message}`],
      };
    }
  }

  /**
   * Select the best template for this news item and platform
   */
  private selectBestTemplate(newsItem: NewsItem, platform: string): ContentTemplate | null {
    const platformTemplates = Array.from(this.templates.values()).filter(
      template => template.platform === platform
    );

    if (platformTemplates.length === 0) {
      return null;
    }

    // Score templates based on relevance to news item
    const scoredTemplates = platformTemplates.map(template => {
      let score = template.successRate * 0.4; // Base score from past performance

      // Category match bonus
      if (template.category === newsItem.automationAngle) {
        score += 0.3;
      }

      // Keyword overlap bonus
      const templateKeywords = this.extractTemplateKeywords(template.template);
      const keywordOverlap = newsItem.keywords.filter(keyword =>
        templateKeywords.some(tk => tk.toLowerCase().includes(keyword.toLowerCase()))
      ).length;
      score += (keywordOverlap / Math.max(newsItem.keywords.length, 1)) * 0.2;

      // Voice consistency bonus
      score += (template.voiceConsistencyScore / 10) * 0.1;

      return { template, score };
    });

    // Return highest scoring template
    scoredTemplates.sort((a, b) => b.score - a.score);
    return scoredTemplates[0]?.template || null;
  }

  /**
   * Extract variables from news item for template population
   */
  private extractVariables(newsItem: NewsItem, template: ContentTemplate): Record<string, string> {
    const variables: Record<string, string> = {};

    // Standard variables available in all templates
    variables.headline = newsItem.title;
    variables.source = newsItem.source;
    variables.date = format(newsItem.publishDate, 'dd/MM/yyyy');
    variables.time = format(newsItem.publishDate, 'HH:mm');
    variables.url = newsItem.url;
    variables.automation_angle = newsItem.automationAngle;

    // Extract key entities from content
    variables.key_points = this.extractKeyPoints(newsItem.content);
    variables.automation_opportunity = this.identifyAutomationOpportunity(newsItem);
    variables.call_to_action = this.generateCallToAction(newsItem.automationAngle);

    // Industry-specific variables
    variables.industry_context = this.getIndustryContext(newsItem);
    variables.audio_intel_angle = this.getAudioIntelAngle(newsItem);

    // Template-specific variables
    template.variables.forEach(varName => {
      if (!variables[varName]) {
        variables[varName] = this.generateDynamicVariable(varName, newsItem);
      }
    });

    return variables;
  }

  /**
   * Populate template with extracted variables
   */
  private populateTemplate(
    template: ContentTemplate,
    variables: Record<string, string>,
    newsItem: NewsItem
  ): string {
    let content = template.template;

    // Replace all variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    });

    // Handle conditional sections
    content = this.processConditionalSections(content, newsItem);

    // Handle platform-specific formatting
    content = this.applyPlatformFormatting(content, template.platform);

    return content.trim();
  }

  /**
   * Apply voice consistency enhancements
   */
  private applyVoiceEnhancements(content: string, platform: string): string {
    let enhanced = content;

    // Apply British English preferences
    enhanced = this.applyBritishEnglish(enhanced);

    // Apply casual-professional tone adjustments
    enhanced = this.applyCasualProfessionalTone(enhanced);

    // Apply platform-specific voice tweaks
    enhanced = this.applyPlatformVoice(enhanced, platform);

    // Apply Chris's personal voice elements
    enhanced = this.applyPersonalVoice(enhanced);

    return enhanced;
  }

  /**
   * Initialize content templates
   */
  private initializeTemplates(): void {
    const templates: ContentTemplate[] = [
      // Twitter Templates
      {
        id: 'twitter_breaking_news',
        name: 'Breaking News Response',
        platform: 'twitter',
        category: 'general_automation',
        template: `Just saw this: {{headline}}

The manual approach most artists are taking here is absolutely mental. 

Here's what you should automate instead:

{{automation_opportunity}}

Thoughts? 🤔

{{url}}`,
        variables: ['headline', 'automation_opportunity', 'url'],
        voiceConsistencyScore: 8.5,
        exampleOutput: 'Just saw this: Spotify changes playlist submission process...',
        usageCount: 0,
        successRate: 0.75,
      },

      {
        id: 'twitter_playlist_automation',
        name: 'Playlist Automation Angle',
        platform: 'twitter',
        category: 'playlist_automation',
        template: `{{headline}} 

This is exactly why I built Audio Intel.

{{key_points}}

Stop manually pitching playlists. Here's the smart approach:

• {{automation_opportunity}}
• Track everything automatically
• Scale without burning out

{{call_to_action}}

{{url}}`,
        variables: ['headline', 'key_points', 'automation_opportunity', 'call_to_action', 'url'],
        voiceConsistencyScore: 9.0,
        exampleOutput: 'Spotify announces new playlist features...',
        usageCount: 0,
        successRate: 0.85,
      },

      {
        id: 'twitter_industry_commentary',
        name: 'Industry Commentary',
        platform: 'twitter',
        category: 'general_automation',
        template: `{{industry_context}}

{{headline}}

The problem? {{automation_opportunity}}

Most artists are doing this manually and it's killing their growth.

Here's the automation play: 🧵

1/ {{audio_intel_angle}}

{{url}}`,
        variables: [
          'industry_context',
          'headline',
          'automation_opportunity',
          'audio_intel_angle',
          'url',
        ],
        voiceConsistencyScore: 8.7,
        exampleOutput: 'Music industry news that affects indie artists...',
        usageCount: 0,
        successRate: 0.8,
      },

      // LinkedIn Templates
      {
        id: 'linkedin_industry_analysis',
        name: 'Industry Analysis Post',
        platform: 'linkedin',
        category: 'general_automation',
        template: `{{headline}}

{{industry_context}}

Here's what this means for independent artists:

{{key_points}}

The automation opportunity:
{{automation_opportunity}}

This is exactly the kind of manual process that Audio Intel was built to solve.

{{audio_intel_angle}}

What are your thoughts on this development?

Source: {{url}}`,
        variables: [
          'headline',
          'industry_context',
          'key_points',
          'automation_opportunity',
          'audio_intel_angle',
          'url',
        ],
        voiceConsistencyScore: 8.8,
        exampleOutput: 'Major changes in music streaming industry...',
        usageCount: 0,
        successRate: 0.82,
      },

      {
        id: 'linkedin_automation_insight',
        name: 'Automation Insight',
        platform: 'linkedin',
        category: 'analytics_automation',
        template: `{{headline}}

This news perfectly illustrates why manual processes are holding back music careers.

The traditional approach:
❌ Manual tracking
❌ Spreadsheet chaos  
❌ Missing opportunities
❌ Burning out on admin

The automated approach:
✅ {{automation_opportunity}}
✅ Real-time insights
✅ More time for creativity
✅ Scalable growth

{{audio_intel_angle}}

{{call_to_action}}

#MusicBusiness #MusicMarketing #Automation

Source: {{url}}`,
        variables: [
          'headline',
          'automation_opportunity',
          'audio_intel_angle',
          'call_to_action',
          'url',
        ],
        voiceConsistencyScore: 9.1,
        exampleOutput: 'New analytics tools for music industry...',
        usageCount: 0,
        successRate: 0.87,
      },

      // Newsletter Templates
      {
        id: 'newsletter_weekly_roundup',
        name: 'Weekly Industry Roundup',
        platform: 'newsletter',
        category: 'general_automation',
        template: `## Industry Update: {{headline}}

{{industry_context}}

**What happened:**
{{key_points}}

**Why this matters for your music career:**
{{automation_opportunity}}

**The Audio Intel angle:**
{{audio_intel_angle}}

**Action steps:**
{{call_to_action}}

Read more: {{url}}

---

*Spotted a manual process that could be automated? Reply and let me know - I might build it next.*`,
        variables: [
          'headline',
          'industry_context',
          'key_points',
          'automation_opportunity',
          'audio_intel_angle',
          'call_to_action',
          'url',
        ],
        voiceConsistencyScore: 8.9,
        exampleOutput: 'Weekly roundup of music industry developments...',
        usageCount: 0,
        successRate: 0.85,
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });

    console.log(`✅ Initialized ${templates.length} content templates`);
  }

  /**
   * Initialize voice profile for consistency
   */
  private initializeVoiceProfile(): void {
    this.voiceProfile = {
      tone: 'casual-professional',
      personality: ['direct', 'helpful', 'no-nonsense', 'British'],
      language: 'British English',
      expertise: ['music marketing', 'automation', 'playlist pitching'],
      brand: 'Audio Intel',
      keyPhrases: [
        'absolutely mental',
        "here's the thing",
        'exactly why I built',
        'stop doing this manually',
        'the smart approach',
        'automation play',
      ],
      avoidPhrases: ['game-changer', 'revolutionary', 'disruptive', 'leverage', 'synergy'],
    };
  }

  /**
   * Initialize industry terms mapping
   */
  private initializeIndustryTerms(): void {
    const terms = [
      ['playlist pitching', 'getting your tracks on playlists'],
      ['A&R', 'Artists & Repertoire (talent scouts)'],
      ['sync licensing', 'music for TV/film/ads'],
      ['PRO', 'Performance Rights Organization'],
      ['DSP', 'Digital Service Provider (Spotify, Apple Music, etc.)'],
      ['ISRC', 'International Standard Recording Code'],
      ['mechanical royalties', 'payments for song reproductions'],
      ['master recording', 'the actual recorded version of a song'],
    ];

    terms.forEach(([term, definition]) => {
      this.industryTerms.set(term, definition);
    });
  }

  /**
   * Helper methods for content generation
   */
  private extractKeyPoints(content: string): string {
    // Simple extraction of first 2-3 sentences or key points
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('. ').trim() + '.';
  }

  private identifyAutomationOpportunity(newsItem: NewsItem): string {
    const opportunities = {
      playlist_automation: 'Automate playlist research and pitching with AI-powered targeting',
      content_automation: 'Schedule and optimize social media content automatically',
      email_automation: 'Set up automated email sequences for fan engagement',
      analytics_automation: 'Track performance across platforms without manual spreadsheets',
      distribution_automation: 'Automate release scheduling and metadata management',
      general_automation: 'Eliminate manual tasks that are slowing down your music career',
    };

    return opportunities[newsItem.automationAngle] || opportunities.general_automation;
  }

  private generateCallToAction(automationAngle: string): string {
    const ctas = {
      playlist_automation: 'Want to automate your playlist pitching? Check out Audio Intel.',
      content_automation: "Ready to automate your content? Let's chat about Audio Intel.",
      email_automation: 'Need email automation for your music? Audio Intel can help.',
      analytics_automation:
        'Tired of manual analytics? Audio Intel tracks everything automatically.',
      distribution_automation: 'Want automated release management? Audio Intel has you covered.',
      general_automation: 'Ready to automate your music marketing? Audio Intel is the answer.',
    };

    return ctas[automationAngle] || ctas.general_automation;
  }

  private getIndustryContext(newsItem: NewsItem): string {
    const contexts = {
      'Music Business Worldwide': 'Industry insiders are talking about',
      Billboard: 'The mainstream music industry is buzzing about',
      'BBC Music': 'The BBC is reporting on',
      'Digital Music News': 'The digital music space is evolving with',
      'Music Ally': 'Music tech experts are discussing',
      Hypebot: 'Music marketing professionals are analyzing',
    };

    return contexts[newsItem.source] || 'The music industry is discussing';
  }

  private getAudioIntelAngle(newsItem: NewsItem): string {
    if (newsItem.automationAngle === 'playlist_automation') {
      return "Audio Intel's playlist automation eliminates the manual research and pitching process entirely.";
    }

    if (newsItem.automationAngle === 'analytics_automation') {
      return "This is exactly what Audio Intel's analytics automation was designed to solve.";
    }

    return 'Audio Intel automates exactly these kinds of manual processes that hold back music careers.';
  }

  private generateDynamicVariable(varName: string, newsItem: NewsItem): string {
    // Fallback generation for template variables
    const fallbacks = {
      trending_hashtag: '#MusicBusiness',
      emoji: '🎵',
      time_reference: 'this week',
      audience_reference: 'independent artists',
      problem_statement: 'manual processes are slowing down growth',
      solution_hint: 'automation is the answer',
    };

    return fallbacks[varName] || '[Dynamic content]';
  }

  private processConditionalSections(content: string, newsItem: NewsItem): string {
    // Handle {{#if condition}} sections in templates
    let processed = content;

    // Simple conditional processing
    if (newsItem.relevanceScore > 0.8) {
      processed = processed.replace(/\{\{#high_value\}\}(.*?)\{\{\/high_value\}\}/gs, '$1');
    } else {
      processed = processed.replace(/\{\{#high_value\}\}(.*?)\{\{\/high_value\}\}/gs, '');
    }

    return processed;
  }

  private applyPlatformFormatting(content: string, platform: string): string {
    switch (platform) {
      case 'twitter':
        // Ensure under 280 characters for threads
        return this.formatForTwitter(content);
      case 'linkedin':
        // Add LinkedIn-style formatting
        return this.formatForLinkedIn(content);
      case 'newsletter':
        // Add email formatting
        return this.formatForNewsletter(content);
      default:
        return content;
    }
  }

  private formatForTwitter(content: string): string {
    // Split long content into thread format
    if (content.length > 280) {
      const parts = content.split('\n\n');
      return parts
        .map((part, index) => {
          if (index === 0) return part;
          return `${index + 1}/ ${part}`;
        })
        .join('\n\n');
    }
    return content;
  }

  private formatForLinkedIn(content: string): string {
    // LinkedIn formatting preferences
    return content
      .replace(/\n\n/g, '\n\n') // Preserve paragraphs
      .replace(/•/g, '▪️') // Use better bullet points
      .replace(/✅/g, '✅') // Keep checkmarks
      .replace(/❌/g, '❌'); // Keep X marks
  }

  private formatForNewsletter(content: string): string {
    // Email formatting
    return content
      .replace(/##/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\n---\n/g, '\n\n---\n\n'); // Add spacing around dividers
  }

  private applyBritishEnglish(content: string): string {
    const britishReplacements = [
      ['optimize', 'optimise'],
      ['analyze', 'analyse'],
      ['realize', 'realise'],
      ['organize', 'organise'],
      ['color', 'colour'],
      ['favor', 'favour'],
      ['center', 'centre'],
    ];

    let british = content;
    britishReplacements.forEach(([us, uk]) => {
      const regex = new RegExp(`\\b${us}\\b`, 'gi');
      british = british.replace(regex, uk);
    });

    return british;
  }

  private applyCasualProfessionalTone(content: string): string {
    // Add casual elements while maintaining professionalism
    let toned = content;

    // Add conversational elements
    if (!toned.includes('?') && Math.random() > 0.7) {
      toned += '\n\nThoughts?';
    }

    return toned;
  }

  private applyPlatformVoice(content: string, platform: string): string {
    switch (platform) {
      case 'twitter':
        // More casual for Twitter
        return content.replace(/\. /g, '.\n\n');
      case 'linkedin':
        // More professional for LinkedIn
        return content;
      case 'newsletter':
        // More detailed for newsletter
        return content;
      default:
        return content;
    }
  }

  private applyPersonalVoice(content: string): string {
    // Apply Chris's specific voice elements
    let personal = content;

    // Add British casual phrases occasionally
    if (Math.random() > 0.8) {
      personal = personal.replace(/This is/, 'This is absolutely');
    }

    return personal;
  }

  private calculateVoiceConsistency(content: string): number {
    let score = 8.0; // Base score

    // Check for voice elements
    if (content.includes('absolutely')) score += 0.2;
    if (content.includes("here's")) score += 0.2;
    if (content.includes('Audio Intel')) score += 0.3;
    if (content.includes('automat')) score += 0.2;
    if (content.includes('manual')) score += 0.1;

    // Deduct for corporate speak
    if (content.includes('leverage')) score -= 0.5;
    if (content.includes('synergy')) score -= 0.5;
    if (content.includes('disrupt')) score -= 0.3;

    return Math.min(score, 10.0);
  }

  private estimateEngagement(content: string, platform: string): number {
    // Simple engagement estimation based on content factors
    let score = 0.5; // Base engagement

    // Platform-specific factors
    if (platform === 'twitter') {
      if (content.includes('?')) score += 0.1;
      if (content.includes('🧵')) score += 0.15;
      if (content.length < 280) score += 0.1;
    }

    if (platform === 'linkedin') {
      if (content.includes('#')) score += 0.1;
      if (content.includes('✅')) score += 0.05;
      if (content.length > 300) score += 0.1;
    }

    // Content quality factors
    if (content.includes('Audio Intel')) score += 0.1;
    if (content.includes('automation')) score += 0.08;
    if (content.includes('?')) score += 0.05;

    return Math.min(score, 1.0);
  }

  private generateImprovements(content: string, newsItem: NewsItem): string[] {
    const improvements = [];

    if (content.length > 1000) {
      improvements.push('Consider shortening for better engagement');
    }

    if (!content.includes('?')) {
      improvements.push('Add a question to encourage engagement');
    }

    if (!content.includes('Audio Intel') && newsItem.relevanceScore > 0.7) {
      improvements.push('Consider adding Audio Intel mention for brand awareness');
    }

    if (newsItem.automationAngle === 'playlist_automation' && !content.includes('playlist')) {
      improvements.push('Could emphasize playlist automation angle more strongly');
    }

    return improvements;
  }

  private extractTemplateKeywords(template: string): string[] {
    // Extract meaningful words from template (excluding variables)
    const words =
      template
        .replace(/\{\{.*?\}\}/g, '') // Remove variables
        .toLowerCase()
        .match(/\b[a-z]{3,}\b/g) || [];

    return [...new Set(words)]; // Remove duplicates
  }

  private updateTemplateUsage(templateId: string, success: boolean): void {
    const template = this.templates.get(templateId);
    if (template) {
      template.usageCount++;
      const oldSuccessRate = template.successRate;
      template.successRate =
        (oldSuccessRate * (template.usageCount - 1) + (success ? 1 : 0)) / template.usageCount;
      this.templates.set(templateId, template);
    }
  }

  /**
   * Get template performance statistics
   */
  getTemplateStats(): Array<{
    templateId: string;
    name: string;
    usageCount: number;
    successRate: number;
  }> {
    return Array.from(this.templates.values()).map(template => ({
      templateId: template.id,
      name: template.name,
      usageCount: template.usageCount,
      successRate: template.successRate,
    }));
  }

  /**
   * Add custom template
   */
  addTemplate(template: ContentTemplate): void {
    this.templates.set(template.id, template);
    console.log(`✅ Added custom template: ${template.name}`);
  }

  /**
   * Update template performance
   */
  updateTemplate(templateId: string, updates: Partial<ContentTemplate>): void {
    const template = this.templates.get(templateId);
    if (template) {
      this.templates.set(templateId, { ...template, ...updates });
      console.log(`✅ Updated template: ${template.name}`);
    }
  }
}

export default TemplateContentGenerator;
export type { TemplateGenerationResult, ContentTemplate };
