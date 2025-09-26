#!/usr/bin/env node

/**
 * Mailchimp API Integration for Liberty Music PR
 * 
 * Handles email campaigns, client communications, and audience management
 * Integrates with radio promo campaigns for automated email sequences
 */

const fetch = require('node-fetch');

class MailchimpApiIntegration {
  constructor() {
    // Use Liberty API key directly
    this.apiKey = process.env.MAILCHIMP_API_KEY || 'b0f629921e6d1f85c4549c63dee5b9b2-us13';
    this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us13';
    this.baseUrl = `https://${this.serverPrefix}.api.mailchimp.com/3.0`;
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;
    
    // Liberty Music PR specific settings
    this.libertySettings = {
      companyName: 'Liberty Music PR',
      contactEmail: 'chris@libertymusicpr.com',
      fromName: 'Liberty Music PR',
      replyTo: 'chris@libertymusicpr.com'
    };
  }

  /**
   * Rate-limited API call to Mailchimp
   */
  async callMailchimpAPI(endpoint, options = {}) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      this.lastApiCall = Date.now();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Mailchimp API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mailchimp API call failed:', error);
      throw error;
    }
  }

  /**
   * Get all audiences (lists)
   */
  async getAudiences() {
    try {
      const response = await this.callMailchimpAPI('/lists');
      return response.lists || [];
    } catch (error) {
      console.error('Failed to get audiences:', error);
      throw error;
    }
  }

  /**
   * Create Liberty Music PR audience if it doesn't exist
   */
  async ensureLibertyAudience() {
    try {
      const audiences = await this.getAudiences();
      let libertyAudience = audiences.find(audience => 
        audience.name.toLowerCase().includes('liberty') || 
        audience.name.toLowerCase().includes('music pr')
      );

      if (!libertyAudience) {
        console.log('Creating Liberty Music PR audience...');
        libertyAudience = await this.createLibertyAudience();
      }

      return libertyAudience;
    } catch (error) {
      console.error('Failed to ensure Liberty audience:', error);
      throw error;
    }
  }

  /**
   * Create Liberty Music PR audience
   */
  async createLibertyAudience() {
    const audienceData = {
      name: 'Liberty Music PR Clients',
      contact: {
        company: 'Liberty Music PR',
        address1: 'London, UK',
        city: 'London',
        state: 'England',
        zip: 'SW1A 1AA',
        country: 'GB',
        phone: '+44 7XXX XXXXXX'
      },
      permission_reminder: 'You are receiving this email because you are a client of Liberty Music PR.',
      campaign_defaults: {
        from_name: this.libertySettings.fromName,
        from_email: this.libertySettings.contactEmail,
        subject: 'Liberty Music PR Campaign Update',
        language: 'en'
      },
      email_type_option: true
    };

    try {
      const response = await this.callMailchimpAPI('/lists', {
        method: 'POST',
        body: JSON.stringify(audienceData)
      });
      
      console.log(`✅ Liberty Music PR audience created: ${response.id}`);
      return response;
    } catch (error) {
      console.error('Failed to create Liberty audience:', error);
      throw error;
    }
  }

  /**
   * Get specific audience details
   */
  async getAudience(audienceId) {
    try {
      const response = await this.callMailchimpAPI(`/lists/${audienceId}`);
      return response;
    } catch (error) {
      console.error(`Failed to get audience ${audienceId}:`, error);
      throw error;
    }
  }

  /**
   * Add contact to audience
   */
  async addContact(audienceId, contactData) {
    const { email, firstName, lastName, tags = [] } = contactData;
    
    const memberData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || ''
      },
      tags: tags
    };

    try {
      const response = await this.callMailchimpAPI(`/lists/${audienceId}/members`, {
        method: 'POST',
        body: JSON.stringify(memberData)
      });
      
      console.log(`✅ Contact added to audience: ${email}`);
      return response;
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  }

  /**
   * Update contact in audience
   */
  async updateContact(audienceId, email, contactData) {
    const { firstName, lastName, tags = [] } = contactData;
    
    const memberData = {
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || ''
      },
      tags: tags
    };

    try {
      const response = await this.callMailchimpAPI(`/lists/${audienceId}/members/${this.getSubscriberHash(email)}`, {
        method: 'PATCH',
        body: JSON.stringify(memberData)
      });
      
      console.log(`✅ Contact updated: ${email}`);
      return response;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  }

  /**
   * Create email campaign
   */
  async createCampaign(campaignData) {
    const { type, recipients, settings, tracking } = campaignData;
    
    const campaignPayload = {
      type: type || 'regular',
      recipients: {
        list_id: recipients.audienceId
      },
      settings: {
        subject_line: settings.subjectLine,
        from_name: settings.fromName || 'Liberty Music PR',
        reply_to: settings.replyTo || 'chris@libertymusicpr.com',
        ...settings
      },
      tracking: {
        opens: tracking?.opens !== false,
        html_clicks: tracking?.htmlClicks !== false,
        text_clicks: tracking?.textClicks !== false,
        ...tracking
      }
    };

    try {
      const response = await this.callMailchimpAPI('/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignPayload)
      });
      
      console.log(`✅ Campaign created: ${response.id}`);
      return response;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Find an existing campaign by name (matches settings.title or subject_line)
   */
  async findCampaignByName(name) {
    try {
      const response = await this.callMailchimpAPI('/campaigns?count=1000');
      const campaigns = response.campaigns || [];
      const lower = name.toLowerCase();
      return campaigns.find(c =>
        (c.settings?.title && c.settings.title.toLowerCase() === lower) ||
        (c.settings?.subject_line && c.settings.subject_line.toLowerCase() === lower) ||
        (c.settings?.title && c.settings.title.toLowerCase().includes(lower)) ||
        (c.settings?.subject_line && c.settings.subject_line.toLowerCase().includes(lower))
      ) || null;
    } catch (error) {
      console.error('Failed to find campaign by name:', error);
      throw error;
    }
  }

  /**
   * Replicate a campaign by ID
   */
  async replicateCampaign(campaignId) {
    try {
      const replicated = await this.callMailchimpAPI(`/campaigns/${campaignId}/actions/replicate`, {
        method: 'POST'
      });
      return replicated;
    } catch (error) {
      console.error('Failed to replicate campaign:', error);
      throw error;
    }
  }

  /**
   * Update campaign settings and recipients
   */
  async updateCampaign(campaignId, { recipients, settings }) {
    try {
      const payload = {};
      if (recipients?.audienceId) {
        payload.recipients = { list_id: recipients.audienceId, ...recipients.extra };
      }
      if (settings) {
        payload.settings = settings;
      }
      const updated = await this.callMailchimpAPI(`/campaigns/${campaignId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      return updated;
    } catch (error) {
      console.error('Failed to update campaign:', error);
      throw error;
    }
  }

  /**
   * Get campaign content
   */
  async getCampaignContent(campaignId) {
    try {
      return await this.callMailchimpAPI(`/campaigns/${campaignId}/content`);
    } catch (error) {
      console.error('Failed to get campaign content:', error);
      throw error;
    }
  }

  /**
   * Duplicate a source campaign by name and replace content with provided HTML/text
   */
  async duplicateCampaignWithContent(sourceName, audienceId, content, settingsOverride = {}) {
    try {
      const source = await this.findCampaignByName(sourceName);
      if (!source) throw new Error(`Source campaign not found: ${sourceName}`);

      const replica = await this.replicateCampaign(source.id);
      const newId = replica.id || replica.campaign_id || replica;

      // Update recipients and basic settings
      await this.updateCampaign(newId, {
        recipients: { audienceId },
        settings: {
          subject_line: settingsOverride.subjectLine || source.settings?.subject_line,
          from_name: settingsOverride.fromName || source.settings?.from_name || 'Liberty Music PR',
          reply_to: settingsOverride.replyTo || source.settings?.reply_to || 'chrisschofield@libertymusicpr.com'
        }
      });

      // Replace content
      await this.setCampaignContent(newId, content);

      return { id: newId };
    } catch (error) {
      console.error('Failed to duplicate campaign with content:', error);
      throw error;
    }
  }

  /**
   * Set campaign content
   */
  async setCampaignContent(campaignId, content) {
    const contentPayload = {
      html: content.html,
      plain_text: content.plainText || this.stripHtml(content.html)
    };

    try {
      const response = await this.callMailchimpAPI(`/campaigns/${campaignId}/content`, {
        method: 'PUT',
        body: JSON.stringify(contentPayload)
      });
      
      console.log(`✅ Campaign content set for: ${campaignId}`);
      return response;
    } catch (error) {
      console.error('Failed to set campaign content:', error);
      throw error;
    }
  }

  /**
   * Send campaign
   */
  async sendCampaign(campaignId) {
    try {
      const response = await this.callMailchimpAPI(`/campaigns/${campaignId}/actions/send`, {
        method: 'POST'
      });
      
      console.log(`✅ Campaign sent: ${campaignId}`);
      return response;
    } catch (error) {
      console.error('Failed to send campaign:', error);
      throw error;
    }
  }

  /**
   * Create automated email sequence for radio promo campaign
   */
  async createRadioPromoSequence(campaignData, audienceId) {
    const { artistName, trackTitle, genre, releaseDate } = campaignData;
    
    try {
      // Create main campaign announcement
      const announcementCampaign = await this.createCampaign({
        type: 'regular',
        recipients: { audienceId },
        settings: {
          subjectLine: `New ${genre} Release: ${artistName} - "${trackTitle}"`,
          fromName: 'Liberty Music PR',
          replyTo: 'chris@libertymusicpr.com'
        },
        tracking: {
          opens: true,
          htmlClicks: true,
          textClicks: true
        }
      });

      // Set campaign content
      const announcementContent = this.generateAnnouncementContent(campaignData);
      await this.setCampaignContent(announcementCampaign.id, announcementContent);

      // Create follow-up sequence
      const followUpCampaign = await this.createCampaign({
        type: 'regular',
        recipients: { audienceId },
        settings: {
          subjectLine: `Update: ${artistName} Radio Campaign Progress`,
          fromName: 'Liberty Music PR',
          replyTo: 'chris@libertymusicpr.com'
        }
      });

      const followUpContent = this.generateFollowUpContent(campaignData);
      await this.setCampaignContent(followUpCampaign.id, followUpContent);

      console.log(`✅ Radio promo sequence created for ${artistName}`);
      return {
        announcementCampaign,
        followUpCampaign,
        sequenceId: `radio-promo-${Date.now()}`
      };
    } catch (error) {
      console.error('Failed to create radio promo sequence:', error);
      throw error;
    }
  }

  /**
   * Generate announcement email content with artist assets
   */
  generateAnnouncementContent(campaignData) {
    const { 
      artistName, 
      trackTitle, 
      genre, 
      releaseDate,
      pressPhoto,
      pressBio,
      socialMedia,
      website,
      label,
      management
    } = campaignData;
    
    // Build social media links
    const socialLinks = this.buildSocialMediaLinks(socialMedia);
    
    // Build press photo section
    const pressPhotoSection = pressPhoto ? `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${pressPhoto}" alt="${artistName} Press Photo" style="max-width: 100%; height: auto; border-radius: 8px;">
      </div>
    ` : '';
    
    // Build press bio section
    const pressBioSection = pressBio ? `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">About ${artistName}</h3>
        <p style="margin: 0; line-height: 1.6;">${pressBio}</p>
      </div>
    ` : '';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New ${genre} Release: ${artistName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">New ${genre} Release</h1>
          <h2 style="color: #666; margin: 10px 0;">${artistName} - "${trackTitle}"</h2>
        </div>
        
        ${pressPhotoSection}
        
        <div style="margin-bottom: 20px;">
          <p>We're excited to announce the latest release from ${artistName}:</p>
          <p><strong>"${trackTitle}"</strong> - A compelling ${genre} track that showcases the artist's distinctive sound and creative vision.</p>
        </div>
        
        ${pressBioSection}
        
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Campaign Details</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Artist:</strong> ${artistName}</li>
            <li><strong>Track:</strong> "${trackTitle}"</li>
            <li><strong>Genre:</strong> ${genre}</li>
            <li><strong>Release Date:</strong> ${releaseDate || 'TBD'}</li>
            ${label ? `<li><strong>Label:</strong> ${label}</li>` : ''}
            ${management ? `<li><strong>Management:</strong> ${management}</li>` : ''}
          </ul>
        </div>
        
        ${socialLinks}
        
        <div style="margin-bottom: 20px;">
          <p>Our radio promotion campaign is now underway, targeting specialist radio shows and commercial stations across the UK and Europe.</p>
          <p>We'll keep you updated on campaign progress, radio plays, and media coverage as they develop.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            Chris Schofield<br>
            Liberty Music PR<br>
            <a href="mailto:chrisschofield@libertymusicpr.com">chrisschofield@libertymusicpr.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return {
      html,
      plainText: this.stripHtml(html)
    };
  }

  /**
   * Build social media links section
   */
  buildSocialMediaLinks(socialMedia) {
    if (!socialMedia) return '';
    
    const socialLinks = [];
    
    // Parse social media links
    if (typeof socialMedia === 'string') {
      // Try to extract URLs from the string
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = socialMedia.match(urlRegex) || [];
      
      urls.forEach(url => {
        if (url.includes('instagram.com')) socialLinks.push({ platform: 'Instagram', url });
        else if (url.includes('twitter.com') || url.includes('x.com')) socialLinks.push({ platform: 'Twitter/X', url });
        else if (url.includes('facebook.com')) socialLinks.push({ platform: 'Facebook', url });
        else if (url.includes('tiktok.com')) socialLinks.push({ platform: 'TikTok', url });
        else if (url.includes('youtube.com')) socialLinks.push({ platform: 'YouTube', url });
        else if (url.includes('spotify.com')) socialLinks.push({ platform: 'Spotify', url });
        else if (url.includes('soundcloud.com')) socialLinks.push({ platform: 'SoundCloud', url });
      });
    }
    
    if (socialLinks.length === 0) return '';
    
    const linksHtml = socialLinks.map(link => 
      `<a href="${link.url}" style="color: #007bff; text-decoration: none; margin: 0 10px;">${link.platform}</a>`
    ).join(' | ');
    
    return `
      <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #333;">Connect with ${socialLinks[0]?.platform ? 'the artist' : 'us'}</h3>
        <p style="margin: 0;">${linksHtml}</p>
      </div>
    `;
  }

  /**
   * Generate follow-up email content
   */
  generateFollowUpContent(campaignData) {
    const { artistName, trackTitle, genre } = campaignData;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Campaign Update: ${artistName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Campaign Update</h1>
          <h2 style="color: #666; margin: 10px 0;">${artistName} - "${trackTitle}"</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>Here's an update on the radio promotion campaign for ${artistName}'s "${trackTitle}":</p>
        </div>
        
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Campaign Progress</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Press release distributed to media contacts</li>
            <li>Radio station outreach initiated</li>
            <li>WARM API tracking activated</li>
            <li>Monday.com campaign board created</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>We're monitoring radio plays and will provide detailed performance reports as the campaign develops.</p>
          <p>Thank you for your trust in Liberty Music PR for your radio promotion needs.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            Chris Schofield<br>
            Liberty Music PR<br>
            <a href="mailto:chris@libertymusicpr.com">chris@libertymusicpr.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return {
      html,
      plainText: this.stripHtml(html)
    };
  }

  /**
   * Add client to Liberty Music PR audience
   */
  async addClientToAudience(clientData, audienceId) {
    const contactData = {
      email: clientData.email,
      firstName: clientData.firstName || clientData.artistName?.split(' ')[0],
      lastName: clientData.lastName || clientData.artistName?.split(' ').slice(1).join(' '),
      tags: ['client', 'radio-promo', clientData.genre?.toLowerCase() || 'music']
    };

    try {
      const response = await this.addContact(audienceId, contactData);
      console.log(`✅ Client added to Liberty audience: ${clientData.email}`);
      return response;
    } catch (error) {
      console.error('Failed to add client to audience:', error);
      throw error;
    }
  }

  /**
   * Get campaign performance data
   */
  async getCampaignPerformance(campaignId) {
    try {
      const response = await this.callMailchimpAPI(`/campaigns/${campaignId}`);
      return {
        id: response.id,
        status: response.status,
        sendTime: response.send_time,
        emailsSent: response.emails_sent,
        opens: response.opens,
        clicks: response.clicks,
        unsubscribes: response.unsubscribes,
        bounces: response.bounces
      };
    } catch (error) {
      console.error('Failed to get campaign performance:', error);
      throw error;
    }
  }

  /**
   * Get subscriber hash for API calls
   */
  getSubscriberHash(email) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  /**
   * Strip HTML tags for plain text version
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Analyze existing Mailchimp campaigns for training data
   */
  async analyzeExistingCampaigns() {
    try {
      console.log('Analyzing existing Mailchimp campaigns for training...');
      
      // Get all campaigns
      const campaignsResponse = await this.callMailchimpAPI('/campaigns?count=100');
      const campaigns = campaignsResponse.campaigns || [];
      
      console.log(`Found ${campaigns.length} campaigns to analyze`);
      
      const trainingData = {
        timestamp: new Date().toISOString(),
        totalCampaigns: campaigns.length,
        analyzedCampaigns: 0,
        templates: [],
        subjectLines: [],
        contentPatterns: [],
        sendTimes: [],
        audienceSegments: [],
        campaignTypes: [],
        errors: []
      };
      
      // Analyze each campaign
      for (const campaign of campaigns) {
        try {
          // Get campaign details
          const campaignDetails = await this.callMailchimpAPI(`/campaigns/${campaign.id}`);
          
          // Extract training data
          const campaignData = {
            id: campaign.id,
            name: campaign.settings?.subject_line || 'No subject',
            type: campaign.type,
            status: campaign.status,
            sendTime: campaign.send_time,
            audience: campaign.recipients?.list_name || 'Unknown',
            template: campaign.settings?.template_id || null,
            content: campaign.settings?.preview_text || '',
            subjectLine: campaign.settings?.subject_line || '',
            fromName: campaign.settings?.from_name || '',
            replyTo: campaign.settings?.reply_to || ''
          };
          
          // Collect patterns
          trainingData.templates.push({
            id: campaignData.template,
            name: campaignData.name,
            type: campaignData.type
          });
          
          trainingData.subjectLines.push({
            subject: campaignData.subjectLine,
            type: campaignData.type,
            audience: campaignData.audience
          });
          
          trainingData.contentPatterns.push({
            preview: campaignData.content,
            fromName: campaignData.fromName,
            replyTo: campaignData.replyTo
          });
          
          trainingData.sendTimes.push(campaignData.sendTime);
          trainingData.audienceSegments.push(campaignData.audience);
          trainingData.campaignTypes.push(campaignData.type);
          
          trainingData.analyzedCampaigns++;
        } catch (error) {
          console.warn(`Failed to analyze campaign ${campaign.id}: ${error.message}`);
          trainingData.errors.push({
            campaignId: campaign.id,
            error: error.message
          });
        }
      }
      
      // Save training data
      const fs = require('fs');
      const trainingPath = `./training-data/mailchimp_training_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(trainingPath, JSON.stringify(trainingData, null, 2));
      
      console.log(`✅ Mailchimp training data saved: ${trainingPath}`);
      return trainingData;
    } catch (error) {
      console.error('Failed to analyze Mailchimp campaigns:', error);
      throw error;
    }
  }

  /**
   * Get Liberty Music PR email templates
   */
  async getLibertyTemplates() {
    try {
      console.log('Fetching Liberty Music PR email templates...');
      
      // Get all templates
      const templatesResponse = await this.callMailchimpAPI('/templates?count=100');
      const templates = templatesResponse.templates || [];
      
      // Filter for Liberty-related templates
      const libertyTemplates = templates.filter(template => 
        template.name.toLowerCase().includes('liberty') ||
        template.name.toLowerCase().includes('music') ||
        template.name.toLowerCase().includes('pr') ||
        template.name.toLowerCase().includes('radio') ||
        template.name.toLowerCase().includes('promo')
      );
      
      console.log(`Found ${libertyTemplates.length} Liberty-related templates`);
      
      const templateData = {
        timestamp: new Date().toISOString(),
        totalTemplates: templates.length,
        libertyTemplates: libertyTemplates.length,
        templates: libertyTemplates.map(template => ({
          id: template.id,
          name: template.name,
          type: template.type,
          category: template.category,
          created: template.date_created,
          updated: template.date_edited
        }))
      };
      
      // Save template data
      const fs = require('fs');
      const templatePath = `./training-data/liberty_templates_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(templatePath, JSON.stringify(templateData, null, 2));
      
      console.log(`✅ Liberty templates data saved: ${templatePath}`);
      return templateData;
    } catch (error) {
      console.error('Failed to fetch Liberty templates:', error);
      throw error;
    }
  }

  /**
   * Analyze email content patterns for Liberty style
   */
  async analyzeLibertyEmailStyle() {
    try {
      console.log('Analyzing Liberty Music PR email style patterns...');
      
      // Get campaigns and templates
      const campaignsData = await this.analyzeExistingCampaigns();
      const templatesData = await this.getLibertyTemplates();
      
      // Analyze patterns
      const styleAnalysis = {
        timestamp: new Date().toISOString(),
        subjectLinePatterns: this.analyzeSubjectLines(campaignsData.subjectLines),
        contentPatterns: this.analyzeContentPatterns(campaignsData.contentPatterns),
        sendTimePatterns: this.analyzeSendTimes(campaignsData.sendTimes),
        audienceSegments: this.analyzeAudienceSegments(campaignsData.audienceSegments),
        templateUsage: this.analyzeTemplateUsage(templatesData.templates),
        libertyStyle: {
          commonPhrases: this.extractCommonPhrases(campaignsData.contentPatterns),
          tone: this.analyzeTone(campaignsData.contentPatterns),
          structure: this.analyzeStructure(campaignsData.contentPatterns)
        }
      };
      
      // Save style analysis
      const fs = require('fs');
      const stylePath = `./training-data/liberty_style_analysis_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(stylePath, JSON.stringify(styleAnalysis, null, 2));
      
      console.log(`✅ Liberty style analysis saved: ${stylePath}`);
      return styleAnalysis;
    } catch (error) {
      console.error('Failed to analyze Liberty email style:', error);
      throw error;
    }
  }

  /**
   * Analyze subject line patterns
   */
  analyzeSubjectLines(subjectLines) {
    const patterns = {
      commonWords: {},
      length: { min: Infinity, max: 0, avg: 0 },
      emojis: 0,
      questions: 0,
      exclamations: 0
    };
    
    subjectLines.forEach(subject => {
      const words = subject.subject.toLowerCase().split(' ');
      words.forEach(word => {
        patterns.commonWords[word] = (patterns.commonWords[word] || 0) + 1;
      });
      
      patterns.length.min = Math.min(patterns.length.min, subject.subject.length);
      patterns.length.max = Math.max(patterns.length.max, subject.subject.length);
      patterns.length.avg += subject.subject.length;
      
      if (subject.subject.includes('?')) patterns.questions++;
      if (subject.subject.includes('!')) patterns.exclamations++;
      if (/[\u{1F600}-\u{1F64F}]/u.test(subject.subject)) patterns.emojis++;
    });
    
    patterns.length.avg = patterns.length.avg / subjectLines.length;
    
    return patterns;
  }

  /**
   * Analyze content patterns
   */
  analyzeContentPatterns(contentPatterns) {
    if (!contentPatterns || contentPatterns.length === 0) {
      return {
        commonFromNames: [],
        commonReplyTo: [],
        averageLength: 0
      };
    }
    
    return {
      commonFromNames: this.getCommonValues(contentPatterns.map(c => c.fromName)),
      commonReplyTo: this.getCommonValues(contentPatterns.map(c => c.replyTo)),
      averageLength: contentPatterns.reduce((sum, c) => sum + (c.content ? c.content.length : 0), 0) / contentPatterns.length
    };
  }

  /**
   * Analyze send time patterns
   */
  analyzeSendTimes(sendTimes) {
    if (!sendTimes || sendTimes.length === 0) {
      return {
        mostCommonHour: null,
        hourDistribution: {}
      };
    }
    
    const times = sendTimes.filter(t => t).map(t => new Date(t).getHours());
    const hourCounts = {};
    
    times.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return {
      mostCommonHour: Object.keys(hourCounts).length > 0 ? Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b) : null,
      hourDistribution: hourCounts
    };
  }

  /**
   * Analyze audience segments
   */
  analyzeAudienceSegments(audienceSegments) {
    return this.getCommonValues(audienceSegments);
  }

  /**
   * Analyze template usage
   */
  analyzeTemplateUsage(templates) {
    return {
      totalTemplates: templates.length,
      templateTypes: this.getCommonValues(templates.map(t => t.type)),
      templateCategories: this.getCommonValues(templates.map(t => t.category))
    };
  }

  /**
   * Extract common phrases from content
   */
  extractCommonPhrases(contentPatterns) {
    const phrases = [];
    contentPatterns.forEach(content => {
      if (content.content) {
        const text = content.content.toLowerCase();
        if (text.includes('liberty music')) phrases.push('liberty music');
        if (text.includes('radio promo')) phrases.push('radio promo');
        if (text.includes('new release')) phrases.push('new release');
        if (text.includes('exclusive')) phrases.push('exclusive');
      }
    });
    
    return this.getCommonValues(phrases);
  }

  /**
   * Analyze tone from content
   */
  analyzeTone(contentPatterns) {
    const tone = {
      professional: 0,
      casual: 0,
      enthusiastic: 0,
      urgent: 0
    };
    
    contentPatterns.forEach(content => {
      const text = content.content.toLowerCase();
      if (text.includes('urgent') || text.includes('asap')) tone.urgent++;
      if (text.includes('excited') || text.includes('amazing')) tone.enthusiastic++;
      if (text.includes('hey') || text.includes('cheers')) tone.casual++;
      if (text.includes('please') || text.includes('thank you')) tone.professional++;
    });
    
    return tone;
  }

  /**
   * Analyze email structure
   */
  analyzeStructure(contentPatterns) {
    return {
      averageLength: contentPatterns.reduce((sum, c) => sum + c.content.length, 0) / contentPatterns.length,
      hasGreeting: contentPatterns.filter(c => c.content.toLowerCase().includes('hi') || c.content.toLowerCase().includes('hello')).length,
      hasSignature: contentPatterns.filter(c => c.content.toLowerCase().includes('liberty music')).length
    };
  }

  /**
   * Get common values from array
   */
  getCommonValues(arr) {
    const counts = {};
    arr.forEach(item => {
      if (item) {
        counts[item] = (counts[item] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([value, count]) => ({ value, count }));
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      await this.getAudiences();
      return {
        status: 'healthy',
        service: 'mailchimp',
        serverPrefix: this.serverPrefix,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'mailchimp',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = MailchimpApiIntegration;
