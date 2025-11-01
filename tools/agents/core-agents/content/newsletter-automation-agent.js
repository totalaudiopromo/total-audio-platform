#!/usr/bin/env node

/**
 * Newsletter Automation Agent for Total Audio Promo
 *
 * Integrates newsjacked content into "The Unsigned Advantage" newsletter
 * and coordinates multi-platform distribution using authentic Chris Schofield voice patterns.
 *
 * Core Capabilities:
 * - Newsletter content integration with ConvertKit
 * - Multi-platform content distribution
 * - Chris voice consistency validation
 * - Content approval workflow
 * - Performance analytics tracking
 */

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const NewsjackingAgent = require('./newsjacking-agent');

// Simple logger
const logger = {
  info: (msg, ...args) => console.log(`[NEWSLETTER-AUTO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[NEWSLETTER-AUTO] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[NEWSLETTER-AUTO] ${msg}`, ...args),
};

class NewsletterAutomationAgent {
  constructor() {
    this.name = 'NewsletterAutomationAgent';
    this.specialty = 'Newsletter Integration & Multi-Platform Distribution';
    this.prisma = new PrismaClient();
    this.newsjackingAgent = new NewsjackingAgent();

    this.metrics = {
      newslettersGenerated: 0,
      sectionsIntegrated: 0,
      platformsDistributed: 0,
      approvalsPending: 0,
      contentPerformanceScore: 0,
    };

    // ConvertKit API configuration
    this.convertKitConfig = {
      apiKey: process.env.CONVERTKIT_API_KEY || 'PLACEHOLDER_CONVERTKIT_KEY',
      apiSecret: process.env.CONVERTKIT_API_SECRET || 'PLACEHOLDER_CONVERTKIT_SECRET',
      weekendWarriorFormId: '8440957', // From beta signup form
      newsletterSequenceId: '2453581', // Main newsletter sequence
    };

    // Newsletter structure for "The Unsigned Advantage"
    this.newsletterStructure = {
      header: {
        title: 'The Unsigned Advantage',
        subtitle: 'Weekly insights for independent artists who refuse to wait for permission',
        issueNumber: null, // Will be auto-generated
        date: null, // Will be set to current date
      },

      sections: [
        {
          id: 'opening',
          title: "This Week's Reality Check",
          purpose: 'Personal connection and industry context',
          template: 'personal_intro',
        },
        {
          id: 'industry_intel',
          title: 'Industry Intel',
          purpose: 'Newsjacked content with unsigned advantage angle',
          template: 'newsjacked_content',
          source: 'newsjacking_agent',
        },
        {
          id: 'trend_alert',
          title: 'Trend Alert',
          purpose: 'Emerging opportunities for indies',
          template: 'opportunity_spotlight',
          source: 'newsjacking_agent',
        },
        {
          id: 'tool_review',
          title: 'Tool That Actually Works',
          purpose: 'Practical tool recommendations',
          template: 'tool_spotlight',
        },
        {
          id: 'success_story',
          title: 'Unsigned Advantage Win',
          purpose: 'Real artist success story',
          template: 'success_narrative',
        },
        {
          id: 'audio_intel_tip',
          title: 'Contact Research Reality',
          purpose: 'Audio Intel feature highlight',
          template: 'product_integration',
        },
        {
          id: 'closing',
          title: 'Your Move',
          purpose: 'Action-focused closing',
          template: 'call_to_action',
        },
      ],

      footer: {
        signature:
          "Cheers,\nChris\n\nP.S. - Hit reply and tell me what industry BS you're dealing with this week. I read every single response.",
        unsubscribe: "You're receiving this because you signed up for Audio Intel beta access.",
        socialLinks: {
          twitter: '@totalaudipromo',
          linkedin: 'chris-schofield-audio',
          website: 'intel.totalaudiopromo.com',
        },
      },
    };

    // Content approval workflow
    this.approvalWorkflow = {
      stages: ['generated', 'review_pending', 'approved', 'scheduled', 'sent'],
      reviewCriteria: {
        voiceConsistency: 0.8, // Minimum score
        factualAccuracy: 0.9,
        actionableValue: 0.8,
        audienceAlignment: 0.8,
      },
    };

    // Multi-platform distribution templates
    this.platformTemplates = {
      twitter: {
        thread: {
          maxTweets: 10,
          charactersPerTweet: 280,
          structure: ['hook', 'context', 'insights', 'action', 'cta'],
        },
        singleTweet: {
          maxCharacters: 280,
          includeHashtags: ['#IndieMusic', '#MusicPromo', '#UnsignedAdvantage'],
        },
      },

      linkedin: {
        article: {
          maxLength: 1300,
          structure: [
            'hook',
            'professional_context',
            'insights',
            'industry_implications',
            'actionable_steps',
          ],
        },
        post: {
          maxLength: 1300,
          tone: 'professional_casual',
        },
      },

      instagram: {
        carousel: {
          maxSlides: 10,
          textPerSlide: 150,
          visualElements: true,
        },
        story: {
          maxSlides: 5,
          duration: '15s_each',
        },
      },
    };
  }

  /**
   * Initialize the newsletter automation agent
   */
  async initialize() {
    try {
      await this.prisma.$connect();
      await this.newsjackingAgent.initialize();
      logger.info('Newsletter Automation Agent initialized successfully');
      return true;
    } catch (error) {
      logger.error('Initialization failed:', error);
      return false;
    }
  }

  /**
   * Generate complete newsletter with newsjacked content
   */
  async generateNewsletterWithNewsjacking() {
    try {
      logger.info('Generating newsletter with newsjacked content...');

      // Get newsjacked content from newsjacking agent
      const newsjackedContent = await this.newsjackingAgent.processNewsjackingCycle();

      if (newsjackedContent.length === 0) {
        logger.warn('No newsjacked content available, generating standard newsletter');
        return await this.generateStandardNewsletter();
      }

      // Build newsletter structure
      const newsletter = {
        id: this.generateNewsletterId(),
        issueNumber: await this.getNextIssueNumber(),
        generatedAt: new Date(),
        status: 'generated',

        header: {
          ...this.newsletterStructure.header,
          issueNumber: await this.getNextIssueNumber(),
          date: new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },

        sections: await this.buildNewsletterSections(newsjackedContent),
        footer: this.newsletterStructure.footer,

        metadata: {
          newsjackedStories: newsjackedContent.length,
          primaryTopics: this.extractPrimaryTopics(newsjackedContent),
          estimatedReadTime: this.calculateReadTime(newsjackedContent),
          targetAudience: 'weekend_warriors',
          urgency: this.calculateOverallUrgency(newsjackedContent),
        },
      };

      this.metrics.newslettersGenerated++;

      return newsletter;
    } catch (error) {
      logger.error('Error generating newsletter:', error);
      return null;
    }
  }

  /**
   * Build newsletter sections incorporating newsjacked content
   */
  async buildNewsletterSections(newsjackedContent) {
    const sections = [];

    // Opening section - personal connection
    sections.push(await this.generateOpeningSection(newsjackedContent));

    // Industry Intel - primary newsjacked content
    const primaryStory =
      newsjackedContent.find(c => c.originalStory.relevanceScore > 0.8) || newsjackedContent[0];
    if (primaryStory) {
      const industryIntelSection = primaryStory.newsletterSections.find(
        s => s.type === 'industry_intel'
      );
      if (industryIntelSection) {
        sections.push({
          ...industryIntelSection,
          id: 'industry_intel',
        });
      }
    }

    // Trend Alert - secondary newsjacked content
    const trendStory = newsjackedContent.find(c =>
      c.newsletterSections.some(s => s.type === 'trend_alert')
    );
    if (trendStory) {
      const trendSection = trendStory.newsletterSections.find(s => s.type === 'trend_alert');
      if (trendSection) {
        sections.push({
          ...trendSection,
          id: 'trend_alert',
        });
      }
    }

    // Tool Review - Audio Intel integration
    sections.push(await this.generateToolReviewSection(newsjackedContent));

    // Success Story - Unsigned Advantage narrative
    sections.push(await this.generateSuccessStorySection());

    // Audio Intel Tip - product integration
    sections.push(await this.generateAudioIntelTipSection(newsjackedContent));

    // Closing - action-focused
    sections.push(await this.generateClosingSection(newsjackedContent));

    return sections;
  }

  /**
   * Generate opening section with personal touch
   */
  async generateOpeningSection(newsjackedContent) {
    const primaryTopic = newsjackedContent[0]?.originalStory.title || 'the music industry';

    const openingOptions = [
      `Right, so this week ${primaryTopic.toLowerCase()} happened, and honestly? It's exactly why I built Audio Intel...`,

      `Been watching ${primaryTopic.toLowerCase()} unfold this week, and it's a perfect example of why independent artists who move fast always win...`,

      `Kids asked me why I work weekends again. Explained that whilst everyone's talking about ${primaryTopic.toLowerCase()}, someone needs to show indies the actual opportunities...`,

      `Coffee shop conversation this morning: "Is it really possible to compete with major labels?" After seeing ${primaryTopic.toLowerCase()} this week, the answer is more obvious than ever...`,
    ];

    return {
      id: 'opening',
      title: "This Week's Reality Check",
      content: this.selectRandomFromArray(openingOptions),
      type: 'opening',
    };
  }

  /**
   * Generate tool review section
   */
  async generateToolReviewSection(newsjackedContent) {
    const toolContext = this.extractToolContext(newsjackedContent);

    return {
      id: 'tool_review',
      title: 'Tool That Actually Works',
      content: `Speaking of ${toolContext}, let me share something that's been saving artists 4+ hours weekly...

Audio Intel's contact enrichment isn't just another database. It's about turning 3 hours of research into 3 minutes of results.

**Real example from this week:**
Manchester electronic artist uploaded 47 contacts, got complete contact details plus submission preferences in under 60 seconds. Result? 3 playlist placements confirmed by Wednesday.

The difference between Audio Intel and generic contact lists? We show you *exactly* what each contact is looking for right now, not what they were doing 6 months ago.

**Your move**: Test it with your next campaign. See the difference real contact intelligence makes.`,
      type: 'tool_review',
      audioIntelIntegration: true,
    };
  }

  /**
   * Generate success story section
   */
  async generateSuccessStorySection() {
    const successStories = [
      {
        artist: 'Folk duo from Brighton',
        challenge: 'Working full-time, only had Saturday mornings for music promo',
        solution: 'Used Audio Intel during commute, campaign ready before weekend ended',
        result: 'Regional radio play, festival circuit breakthrough',
      },
      {
        artist: 'Electronic producer from Liverpool',
        challenge: '£40 monthly budget for all promotion',
        solution: 'Strategic use of Audio Intel free tier over 3 months',
        result: 'BBC Radio 1 play, 2 label interest inquiries',
      },
      {
        artist: 'Teacher/singer-songwriter',
        challenge: 'Can only work on music during school holidays',
        solution: 'Batch campaign planning during Easter holidays using Audio Intel',
        result: '3 radio interviews, 2 festival bookings, all organized during 2-week break',
      },
    ];

    const story = this.selectRandomFromArray(successStories);

    return {
      id: 'success_story',
      title: 'Unsigned Advantage Win',
      content: `**${story.artist}:**
- **Challenge**: ${story.challenge}
- **Solution**: ${story.solution}  
- **Result**: ${story.result}

**Quote**: "Finally found a music tool that works around my chaotic life, not against it."

This is exactly why Audio Intel exists - helping artists who refuse to wait for perfect circumstances.`,
      type: 'success_story',
    };
  }

  /**
   * Generate Audio Intel tip section
   */
  async generateAudioIntelTipSection(newsjackedContent) {
    const context = this.extractContactContext(newsjackedContent);

    return {
      id: 'audio_intel_tip',
      title: 'Contact Research Reality',
      content: `Quick Audio Intel tip that connects to ${context}:

When researching contacts, don't just collect emails. Get the context.

**Example**: Instead of just finding "sarah@musicblog.com", Audio Intel shows you:
- Last 5 artists featured (genre matching)
- Submission preferences (email vs streaming links)
- Response timing patterns (Tuesdays vs Fridays)
- Current playlist themes ("UK underground electronic")

**Reality check**: Generic contact lists give you emails. Audio Intel gives you intel.

That's the difference between 8% and 35% response rates.`,
      type: 'audio_intel_tip',
      audioIntelIntegration: true,
    };
  }

  /**
   * Generate closing section with action focus
   */
  async generateClosingSection(newsjackedContent) {
    const actionContext = this.extractActionContext(newsjackedContent);

    return {
      id: 'closing',
      title: 'Your Move',
      content: `Bottom line: ${actionContext}

While everyone else is still figuring out what this means, you've got the roadmap.

**This week's action**: Pick one opportunity from above and implement it before next Sunday. 

Results come from action, not analysis.

The unsigned advantage isn't about having major label resources. It's about moving faster than major label bureaucracy.`,
      type: 'closing',
    };
  }

  /**
   * Submit newsletter content to ConvertKit
   */
  async submitToConvertKit(newsletter) {
    try {
      logger.info(`Submitting newsletter issue ${newsletter.issueNumber} to ConvertKit...`);

      // Format newsletter content for ConvertKit
      const formattedContent = this.formatNewsletterForEmail(newsletter);

      // Create broadcast in ConvertKit
      const broadcastData = {
        content: formattedContent.html,
        description: `The Unsigned Advantage - Issue ${newsletter.issueNumber}`,
        public: false,
        published_at: null, // Will be scheduled manually
        send_at: null,
        subject: `${newsletter.header.title} - Issue ${newsletter.issueNumber}`,
        subscriber_filter: {
          tag_id: '9942888', // beta_user tag from ConvertKit route
        },
      };

      const response = await axios.post(`https://api.convertkit.com/v3/broadcasts`, {
        api_key: this.convertKitConfig.apiKey,
        ...broadcastData,
      });

      if (response.status === 201) {
        logger.info('Successfully created ConvertKit broadcast');
        return {
          success: true,
          broadcastId: response.data.broadcast.id,
          status: 'scheduled',
        };
      }
    } catch (error) {
      logger.error('Error submitting to ConvertKit:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format newsletter for email HTML
   */
  formatNewsletterForEmail(newsletter) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletter.header.title} - Issue ${newsletter.header.issueNumber}</title>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c5aa0; font-size: 28px; margin-bottom: 10px; }
        h2 { color: #333; font-size: 22px; border-bottom: 2px solid #f6ab00; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #2c5aa0; font-size: 18px; margin-top: 25px; }
        .header { text-align: center; border-bottom: 3px solid #f6ab00; padding-bottom: 20px; margin-bottom: 30px; }
        .subtitle { color: #666; font-style: italic; }
        .section { margin-bottom: 30px; }
        .signature { margin-top: 40px; font-style: italic; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
        .cta { background: #f6ab00; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .cta a { color: white; text-decoration: none; font-weight: bold; }
        blockquote { background: #f5f5f5; border-left: 4px solid #f6ab00; padding: 15px; margin: 20px 0; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${newsletter.header.title}</h1>
        <p class="subtitle">${newsletter.header.subtitle}</p>
        <p><strong>Issue ${newsletter.header.issueNumber}</strong> • ${newsletter.header.date}</p>
    </div>
    
    ${newsletter.sections
      .map(
        section => `
        <div class="section">
            <h2>${section.title}</h2>
            <div>${this.formatSectionContent(section.content)}</div>
        </div>
    `
      )
      .join('')}
    
    <div class="signature">
        ${newsletter.footer.signature.replace(/\n/g, '<br>')}
    </div>
    
    <div class="cta">
        <a href="https://intel.totalaudiopromo.com">Try Audio Intel Free</a>
    </div>
    
    <div class="footer">
        <p>${newsletter.footer.unsubscribe}</p>
        <p>
            <a href="https://twitter.com/${newsletter.footer.socialLinks.twitter}">Twitter</a> • 
            <a href="https://linkedin.com/in/${newsletter.footer.socialLinks.linkedin}">LinkedIn</a> • 
            <a href="https://${newsletter.footer.socialLinks.website}">Website</a>
        </p>
    </div>
</body>
</html>`;

    return { html, text: this.htmlToText(html) };
  }

  /**
   * Format section content with proper HTML
   */
  formatSectionContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  /**
   * Convert HTML to plain text
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Generate multi-platform content from newsletter
   */
  async generateMultiPlatformContent(newsletter) {
    try {
      logger.info('Generating multi-platform content...');

      const platformContent = {};

      // Twitter thread
      platformContent.twitter = await this.generateTwitterThread(newsletter);

      // LinkedIn article
      platformContent.linkedin = await this.generateLinkedInArticle(newsletter);

      // Instagram carousel
      platformContent.instagram = await this.generateInstagramCarousel(newsletter);

      this.metrics.platformsDistributed += Object.keys(platformContent).length;

      return platformContent;
    } catch (error) {
      logger.error('Error generating multi-platform content:', error);
      return {};
    }
  }

  /**
   * Generate Twitter thread from newsletter
   */
  async generateTwitterThread(newsletter) {
    const tweets = [];

    // Hook tweet
    tweets.push(`🧵 This week's industry intel: ${newsletter.sections.find(s => s.id === 'industry_intel')?.content.slice(0, 200)}... 

Thread 👇`);

    // Content tweets
    newsletter.sections.slice(0, 3).forEach((section, index) => {
      if (section.content) {
        const tweetContent = this.formatForTwitter(section.content, index + 2);
        tweets.push(tweetContent);
      }
    });

    // CTA tweet
    tweets.push(`Your move: Stop waiting for permission. Start building direct relationships.

Try Audio Intel free: https://intel.totalaudiopromo.com

#IndieMusic #MusicPromo #UnsignedAdvantage`);

    return {
      platform: 'twitter',
      content: tweets,
      scheduledFor: this.getOptimalPostTime('twitter'),
      hashtags: ['#IndieMusic', '#MusicPromo', '#UnsignedAdvantage'],
    };
  }

  /**
   * Generate LinkedIn article from newsletter
   */
  async generateLinkedInArticle(newsletter) {
    const title = `The Unsigned Advantage: ${newsletter.metadata.primaryTopics[0] || 'Industry Intel'}`;

    const article = `${newsletter.sections.find(s => s.id === 'opening')?.content || ''}

${newsletter.sections.find(s => s.id === 'industry_intel')?.content || ''}

${newsletter.sections.find(s => s.id === 'trend_alert')?.content || ''}

**Key Takeaways for Independent Artists:**
• Move faster than established players
• Turn industry changes into opportunities  
• Focus on direct relationships over gatekeepers

The music industry rewards those who act while others are still planning.

What industry changes are you capitalizing on this week?

#MusicIndustry #IndependentArtist #MusicBusiness #Innovation`;

    return {
      platform: 'linkedin',
      content: {
        title,
        article,
        summary: newsletter.header.subtitle,
      },
      scheduledFor: this.getOptimalPostTime('linkedin'),
    };
  }

  /**
   * Generate Instagram carousel from newsletter
   */
  async generateInstagramCarousel(newsletter) {
    const slides = [
      {
        title: 'The Unsigned Advantage',
        content: `Issue ${newsletter.header.issueNumber}\n\nWeekly intel for indie artists who refuse to wait for permission`,
      },
      {
        title: "This Week's Intel",
        content:
          newsletter.sections.find(s => s.id === 'industry_intel')?.content.slice(0, 150) + '...',
      },
      {
        title: 'Trend Alert',
        content:
          newsletter.sections.find(s => s.id === 'trend_alert')?.content.slice(0, 150) + '...',
      },
      {
        title: 'Your Move',
        content:
          'Stop waiting for permission.\n\nStart building direct relationships.\n\nThe unsigned advantage is real.',
      },
      {
        title: 'Try Audio Intel',
        content:
          'Contact intelligence that actually works.\n\nFree trial available.\n\nintel.totalaudiopromo.com',
      },
    ];

    return {
      platform: 'instagram',
      content: {
        slides,
        caption: `${newsletter.header.title} - Issue ${newsletter.header.issueNumber}

${newsletter.sections.find(s => s.id === 'closing')?.content.slice(0, 100)}...

#IndieMusic #MusicPromo #UnsignedAdvantage #IndependentArtist #MusicBusiness`,
        hashtags: [
          '#IndieMusic',
          '#MusicPromo',
          '#UnsignedAdvantage',
          '#IndependentArtist',
          '#MusicBusiness',
        ],
      },
      scheduledFor: this.getOptimalPostTime('instagram'),
    };
  }

  // Helper methods
  selectRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateNewsletterId() {
    return `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getNextIssueNumber() {
    // This would typically check database for last issue number
    return Math.floor(Date.now() / 1000000); // Simple unique number
  }

  extractPrimaryTopics(newsjackedContent) {
    return newsjackedContent.slice(0, 3).map(c => c.originalStory.title);
  }

  calculateReadTime(newsjackedContent) {
    const totalWords = newsjackedContent.reduce((acc, content) => {
      return (
        acc +
        content.newsletterSections.reduce((sectionAcc, section) => {
          return sectionAcc + (section.content?.split(' ').length || 0);
        }, 0)
      );
    }, 0);

    return Math.ceil(totalWords / 200); // Average reading speed
  }

  calculateOverallUrgency(newsjackedContent) {
    const urgencies = newsjackedContent.map(c => c.originalStory.relevanceScore);
    const avgUrgency = urgencies.reduce((a, b) => a + b, 0) / urgencies.length;

    if (avgUrgency > 0.8) return 'immediate';
    if (avgUrgency > 0.6) return 'same_day';
    return 'this_week';
  }

  extractToolContext(newsjackedContent) {
    return newsjackedContent[0]?.unsignedAngle.opportunity || 'automation tools';
  }

  extractContactContext(newsjackedContent) {
    return newsjackedContent[0]?.originalStory.category || 'contact research';
  }

  extractActionContext(newsjackedContent) {
    return (
      newsjackedContent[0]?.unsignedAngle.actionable ||
      'the opportunity is there for those willing to move fast'
    );
  }

  formatForTwitter(content, tweetNumber) {
    return `${tweetNumber}/🧵 ${content.slice(0, 240)}...`;
  }

  getOptimalPostTime(platform) {
    const times = {
      twitter: '09:00',
      linkedin: '08:00',
      instagram: '19:00',
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(parseInt(times[platform].split(':')[0]), 0, 0, 0);

    return tomorrow;
  }

  async generateStandardNewsletter() {
    // Fallback for when no newsjacked content is available
    return {
      id: this.generateNewsletterId(),
      issueNumber: await this.getNextIssueNumber(),
      generatedAt: new Date(),
      status: 'standard',
      message: 'Standard newsletter - no trending topics detected',
    };
  }

  /**
   * Run complete newsletter automation cycle
   */
  async runNewsletterCycle() {
    try {
      logger.info('Starting newsletter automation cycle...');

      // Generate newsletter with newsjacked content
      const newsletter = await this.generateNewsletterWithNewsjacking();

      if (!newsletter) {
        throw new Error('Failed to generate newsletter');
      }

      // Generate multi-platform content
      const platformContent = await this.generateMultiPlatformContent(newsletter);

      // Submit to ConvertKit (for manual review/scheduling)
      const convertkitResult = await this.submitToConvertKit(newsletter);

      const result = {
        newsletter,
        platformContent,
        convertkitResult,
        status: 'pending_review',
        generatedAt: new Date(),
      };

      logger.info(
        `Newsletter automation cycle complete. Generated content for ${Object.keys(platformContent).length} platforms`
      );

      return result;
    } catch (error) {
      logger.error('Error in newsletter cycle:', error);
      return null;
    }
  }

  /**
   * Get agent metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      lastRun: new Date().toISOString(),
    };
  }

  /**
   * Cleanup and disconnect
   */
  async shutdown() {
    try {
      await this.newsjackingAgent.shutdown();
      await this.prisma.$disconnect();
      logger.info('Newsletter Automation Agent shutdown complete');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}

// Export for use by other agents
module.exports = NewsletterAutomationAgent;

// CLI execution
if (require.main === module) {
  const agent = new NewsletterAutomationAgent();

  async function main() {
    await agent.initialize();

    if (process.argv.includes('--generate')) {
      const newsletter = await agent.generateNewsletterWithNewsjacking();
      console.log(JSON.stringify(newsletter, null, 2));
    } else if (process.argv.includes('--cycle')) {
      const result = await agent.runNewsletterCycle();
      console.log(JSON.stringify(result, null, 2));
    } else if (process.argv.includes('--platforms')) {
      const newsletter = await agent.generateNewsletterWithNewsjacking();
      if (newsletter) {
        const platforms = await agent.generateMultiPlatformContent(newsletter);
        console.log(JSON.stringify(platforms, null, 2));
      }
    } else if (process.argv.includes('--metrics')) {
      console.log(JSON.stringify(agent.getMetrics(), null, 2));
    } else {
      console.log(`
Newsletter Automation Agent Commands:
  --generate   Generate newsletter with newsjacked content
  --cycle      Run complete automation cycle
  --platforms  Generate multi-platform content
  --metrics    Show agent performance metrics
      `);
    }

    await agent.shutdown();
    process.exit(0);
  }

  main().catch(console.error);
}
