const MailchimpApiIntegration = require('./mailchimp-api');
const GmailTypeformMatcher = require('./gmail-typeform-matcher');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[PRESS-RELEASE] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[PRESS-RELEASE] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[PRESS-RELEASE] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [PRESS-RELEASE] ${msg}`, ...args)
};

/**
 * Press Release Generator for Liberty Music PR
 * 
 * Pulls artist assets from Typeform and creates complete press release drafts
 * Includes press photos, bio, socials, and all relevant information
 */
class PressReleaseGenerator {
  constructor() {
    this.mailchimp = new MailchimpApiIntegration();
    this.gmailTypeformMatcher = new GmailTypeformMatcher();
  }

  /**
   * Generate press release for a specific artist
   */
  async generatePressReleaseForArtist(artistName) {
    try {
      logger.info(`Generating press release for artist: ${artistName}`);
      
      // Find the artist's campaign data
      const campaigns = await this.gmailTypeformMatcher.findCampaignsByArtist(artistName);
      
      if (campaigns.length === 0) {
        throw new Error(`No campaigns found for artist: ${artistName}`);
      }
      
      // Get the most recent campaign
      const campaign = campaigns[0];
      const artistData = this.extractArtistAssets(campaign);
      
      // Generate press release content (Claude-enhanced if key present)
      const pressRelease = await this.createClaudeFirstContent(artistData);
      
      // Create Mailchimp draft via duplication when possible
      const draft = await this.createMailchimpDraftFromSource(artistData, pressRelease);
      
      logger.success(`Press release generated for ${artistName}`);
      
      return {
        artistName,
        campaignData: artistData,
        pressRelease,
        mailchimpDraft: draft,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to generate press release for ${artistName}:`, error);
      throw error;
    }
  }

  /**
   * Convert Google Drive link to direct image URL
   */
  convertGoogleDriveUrl(url) {
    if (!url) return null;
    
    // Convert Google Drive sharing links to direct image URLs
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId && fileId[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
      }
    }
    
    // For folders, we can't convert directly - return original
    if (url.includes('drive.google.com/drive/folders/')) {
      return url; // Keep original for now
    }
    
    return url;
  }

  /**
   * Extract artist assets from campaign data
   */
  extractArtistAssets(campaign) {
    const typeformData = campaign.typeformResponse?.data || {};
    const gmailData = campaign.gmailCampaign?.artistInfo || {};
    
    return {
      // Basic info
      artistName: typeformData.artistName || gmailData.name || 'Unknown Artist',
      trackTitle: typeformData.trackTitle || gmailData.track || 'Unknown Track',
      genre: typeformData.genre || gmailData.genre || 'Unknown Genre',
      releaseDate: typeformData.releaseDate || gmailData.releaseDate || 'TBD',
      
      // Artist assets - convert Google Drive URLs to direct links
      pressPhoto: this.convertGoogleDriveUrl(typeformData.pressPhoto),
      coverArt: this.convertGoogleDriveUrl(typeformData.coverArt),
      soundcloudLink: this.convertGoogleDriveUrl(typeformData.soundcloudLink),
      mp3Link: this.convertGoogleDriveUrl(typeformData.mp3Link),
      pressBio: typeformData.pressBio || null,
      socialMedia: typeformData.socialMedia || null,
      website: typeformData.website || null,
      pressKit: typeformData.pressKit || null,
      
      // Additional info
      label: typeformData.label || null,
      management: typeformData.management || null,
      budget: typeformData.budget || null,
      targets: typeformData.targets || null,
      
      // Contact info
      contactEmail: typeformData.contactEmail || campaign.matchedEmail || null,
      contactPhone: typeformData.contactPhone || null,
      
      // Campaign context
      gmailSubject: campaign.gmailCampaign?.subject || null,
      typeformForm: campaign.typeformResponse?.formTitle || null,
      matchConfidence: campaign.matchConfidence || 0
    };
  }

  /**
   * Create press release content with all artist assets
   */
  createPressReleaseContent(artistData) {
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
    } = artistData;
    
    // Build social media links
    const socialLinks = this.buildSocialMediaLinks(socialMedia, artistName);
    
    // Build press photo section with actual asset
    const pressPhotoSection = pressPhoto ? `
      <div class="press-photo">
        <img src="${pressPhoto}" alt="${artistName} Press Photo" />
        <p>Press photo for ${artistName}</p>
      </div>
    ` : '';
    
    // Build cover art section
    const coverArtSection = artistData.coverArt ? `
      <div class="press-photo" style="margin: 20px 0;">
        <img src="${artistData.coverArt}" alt="${artistName} - ${trackTitle} Cover Art" />
        <p>Cover art for "${trackTitle}"</p>
      </div>
    ` : '';
    
    // Build audio links section
    const audioLinksSection = (artistData.soundcloudLink || artistData.mp3Link) ? `
      <div class="release-info">
        <h3>Audio Preview</h3>
        <p>Listen to "${trackTitle}" by ${artistName}:</p>
        <ul style="margin: 0; padding-left: 20px; list-style: none;">
          ${artistData.soundcloudLink ? `<li><strong>SoundCloud:</strong> <a href="${artistData.soundcloudLink}" style="color: #3498db; text-decoration: none;">Private SoundCloud Link</a></li>` : ''}
          ${artistData.mp3Link ? `<li><strong>Audio Files:</strong> <a href="${artistData.mp3Link}" style="color: #3498db; text-decoration: none;">MP3 & WAV Files</a></li>` : ''}
        </ul>
      </div>
    ` : '';
    
    // Build press bio section
    const pressBioSection = pressBio ? `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
        <h3 style="margin-top: 0; color: #333; font-size: 18px;">About ${artistName}</h3>
        <p style="margin: 0; line-height: 1.6; color: #555;">${pressBio}</p>
      </div>
    ` : '';
    
    // Build label/management info
    const labelInfo = label ? `<li><strong>Label:</strong> ${label}</li>` : '';
    const managementInfo = management ? `<li><strong>Management:</strong> ${management}</li>` : '';
    
    const html = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <!--[if gte mso 15]>
        <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta charset="UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Press Release: ${artistName} - "${trackTitle}"</title>
        <style type="text/css">
          img{-ms-interpolation-mode:bicubic;} 
          table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} 
          p, a, li, td, blockquote{mso-line-height-rule:exactly;} 
          p, a, li, td, body, table, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;} 
          .bodyCell{margin:0 auto; padding:0; width:100%;}
          .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height:100%;} 
          .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} 
          a[x-apple-data-detectors]{color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} 
          @media only screen and (max-width: 480px){
            body, table, td, p, a, li, blockquote{-webkit-text-size-adjust:none !important;}
          }
        </style>
      </head>
      <body style="height:100%;margin:0;padding:0;width:100%;background-color:#f4f4f4;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tbody>
            <tr>
              <td align="center" valign="top" style="padding-top:20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;max-width:600px;">
                  <tbody>
                    <!-- Header -->
                    <tr>
                      <td align="center" valign="top" style="background-color:#2c3e50;padding:40px 30px;text-align:center;">
                        <h1 style="color:#ffffff;font-family:Arial, sans-serif;font-size:28px;font-weight:bold;line-height:1.2;margin:0;text-transform:uppercase;letter-spacing:1px;">PRESS RELEASE</h1>
                        <h2 style="color:#ecf0f1;font-family:Arial, sans-serif;font-size:22px;font-weight:normal;line-height:1.2;margin:15px 0 10px 0;">${artistName}</h2>
                        <p style="color:#bdc3c7;font-family:Arial, sans-serif;font-size:14px;line-height:1.4;margin:0;">"${trackTitle}" • ${genre} • Release Date: ${releaseDate}</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td align="center" valign="top" style="background-color:#ffffff;padding:40px 30px;">
                        
                        ${pressPhotoSection}
                        ${coverArtSection}
                        
                        <!-- Immediate Release -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:30px 0;">
                          <tbody>
                            <tr>
                              <td style="background-color:#f8f9fa;padding:25px;border-left:4px solid #3498db;">
                                <h3 style="color:#2c3e50;font-family:Arial, sans-serif;font-size:18px;font-weight:bold;line-height:1.2;margin:0 0 15px 0;">FOR IMMEDIATE RELEASE</h3>
                                <p style="color:#333333;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0 0 15px 0;">We're excited to announce the latest release from <strong style="color:#2c3e50;">${artistName}</strong>:</p>
                                <p style="color:#333333;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0;"><strong style="color:#2c3e50;">"${trackTitle}"</strong> - A compelling ${genre} track that showcases the artist's distinctive sound and creative vision.</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        ${pressBioSection}
                        
                        <!-- Release Information -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:30px 0;">
                          <tbody>
                            <tr>
                              <td style="background-color:#ecf0f1;padding:25px;border:1px solid #d5dbdb;">
                                <h3 style="color:#2c3e50;font-family:Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1.2;margin:0 0 20px 0;">Release Information</h3>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                                  <tbody>
                                    <tr><td style="padding:8px 0;border-bottom:1px solid #d5dbdb;"><strong style="color:#2c3e50;">Artist:</strong> ${artistName}</td></tr>
                                    <tr><td style="padding:8px 0;border-bottom:1px solid #d5dbdb;"><strong style="color:#2c3e50;">Track:</strong> "${trackTitle}"</td></tr>
                                    <tr><td style="padding:8px 0;border-bottom:1px solid #d5dbdb;"><strong style="color:#2c3e50;">Genre:</strong> ${genre}</td></tr>
                                    <tr><td style="padding:8px 0;border-bottom:1px solid #d5dbdb;"><strong style="color:#2c3e50;">Release Date:</strong> ${releaseDate}</td></tr>
                                    ${labelInfo ? `<tr><td style="padding:8px 0;border-bottom:1px solid #d5dbdb;"><strong style="color:#2c3e50;">Label:</strong> ${label}</td></tr>` : ''}
                                    ${managementInfo ? `<tr><td style="padding:8px 0;"><strong style="color:#2c3e50;">Management:</strong> ${management}</td></tr>` : ''}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        ${audioLinksSection}
                        ${socialLinks}
                        
                        <!-- Press Contact -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:30px 0;">
                          <tbody>
                            <tr>
                              <td style="background-color:#fff3cd;padding:25px;border-left:4px solid #f39c12;border:1px solid #f39c12;">
                                <h3 style="color:#2c3e50;font-family:Arial, sans-serif;font-size:18px;font-weight:bold;line-height:1.2;margin:0 0 15px 0;">Press Contact</h3>
                                <p style="color:#2c3e50;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0;"><strong>Liberty Music PR</strong><br/>
                                Chris Schofield<br/>
                                <a href="mailto:chrisschofield@libertymusicpr.com" style="color:#3498db;text-decoration:none;font-weight:bold;">chrisschofield@libertymusicpr.com</a></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <!-- Campaign Info -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:30px 0;">
                          <tbody>
                            <tr>
                              <td style="background-color:#f8f9fa;padding:25px;border:1px solid #dee2e6;">
                                <p style="color:#495057;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0 0 15px 0;"><strong style="color:#2c3e50;">Radio Promotion Campaign</strong></p>
                                <p style="color:#495057;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0 0 15px 0;">Our radio promotion campaign is now underway, targeting specialist radio shows and commercial stations across the UK and Europe.</p>
                                <p style="color:#495057;font-family:Arial, sans-serif;font-size:16px;line-height:1.6;margin:0;">We'll keep you updated on campaign progress, radio plays, and media coverage as they develop.</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <!-- Footer -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:50px 0 0 0;">
                          <tbody>
                            <tr>
                              <td style="background-color:#f8f9fa;padding:30px;border-top:1px solid #dee2e6;text-align:center;">
                                <p style="color:#6c757d;font-family:Arial, sans-serif;font-size:14px;line-height:1.6;margin:5px 0;"><strong>Best regards,</strong></p>
                                <p style="color:#6c757d;font-family:Arial, sans-serif;font-size:14px;line-height:1.6;margin:5px 0;">Chris Schofield<br/>
                                Liberty Music PR<br/>
                                <a href="mailto:chrisschofield@libertymusicpr.com" style="color:#3498db;text-decoration:none;font-weight:bold;">chrisschofield@libertymusicpr.com</a></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    return {
      html,
      plainText: this.stripHtml(html),
      assets: {
        pressPhoto: pressPhoto,
        pressBio: pressBio,
        socialMedia: socialMedia,
        website: website,
        label: label,
        management: management
      }
    };
  }

  /**
   * Build social media links section
   */
  buildSocialMediaLinks(socialMedia, artistName) {
    if (!socialMedia) return '';
    
    const socialLinks = [];
    
    // Parse social media links
    if (typeof socialMedia === 'string') {
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
      `<a href="${link.url}" style="color: #007bff; text-decoration: none; margin: 0 10px; font-weight: bold;">${link.platform}</a>`
    ).join(' | ');
    
    return `
      <div class="social-links">
        <h3 style="margin-top: 0; color: #333;">Connect with ${artistName}</h3>
        <p style="margin: 0;">${linksHtml}</p>
      </div>
    `;
  }

  /**
   * Create Mailchimp draft campaign
   */
  async createMailchimpDraft(artistData, pressRelease) {
    try {
      logger.info(`Creating Mailchimp draft for ${artistData.artistName}`);
      
      // Ensure Liberty audience exists
      const audience = await this.mailchimp.ensureLibertyAudience();
      
      // Create campaign
      const campaign = await this.mailchimp.createCampaign({
        type: 'regular',
        recipients: { audienceId: audience.id },
        settings: {
          subjectLine: `Press Release: ${artistData.artistName} - "${artistData.trackTitle}"`,
          fromName: 'Liberty Music PR',
          replyTo: 'chrisschofield@libertymusicpr.com'
        },
        tracking: {
          opens: true,
          htmlClicks: true,
          textClicks: true
        }
      });
      
      // Set campaign content
      await this.mailchimp.setCampaignContent(campaign.id, pressRelease);
      
      logger.success(`Mailchimp draft created: ${campaign.id}`);
      
      return {
        campaignId: campaign.id,
        subjectLine: campaign.settings.subject_line,
        status: 'draft',
        previewUrl: `https://us13.admin.mailchimp.com/campaigns/show?id=${campaign.id}`,
        audience: audience.name
      };
    } catch (error) {
      logger.error('Failed to create Mailchimp draft:', error);
      throw error;
    }
  }

  /**
   * Prefer Claude to write body text; fallback to templated content
   */
  async createClaudeFirstContent(artistData) {
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        // Fallback to existing templated content
        return this.createPressReleaseContent(artistData);
      }
      const { Anthropic } = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });
      const prompt = `Write a professional UK radio promo press release for an artist using British English.
Artist: ${artistData.artistName}
Track: ${artistData.trackTitle}
Genre: ${artistData.genre}
Release date: ${artistData.releaseDate}
Include short intro, artist background, key highlights, and a closing call-to-action for radio programmers. Keep it concise and formatted for email/newsletter.`;
      const res = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL,
        max_tokens: 1200,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });
      const body = res.content?.[0]?.type === 'text' ? res.content[0].text : '';
      if (!body) return this.createPressReleaseContent(artistData);
      const base = this.createPressReleaseContent(artistData);
      // Replace the main intro block with Claude body in a simple way
      const injectedHtml = base.html.replace('We\'re excited to announce the latest release from', body);
      return { html: injectedHtml, plainText: this.stripHtml(injectedHtml), assets: base.assets };
    } catch {
      return this.createPressReleaseContent(artistData);
    }
  }

  /**
   * Duplicate an existing Mailchimp campaign and replace content
   */
  async createMailchimpDraftFromSource(artistData, pressRelease) {
    try {
      const audience = await this.mailchimp.ensureLibertyAudience();
      const sourceName = process.env.MC_DUPLICATE_SOURCE || 'Charcom x Luisa Wilson - KEEP MY EYES ON YOU - Main Contacts';
      // Try duplication path first
      try {
        const dup = await this.mailchimp.duplicateCampaignWithContent(
          sourceName,
          audience.id,
          pressRelease,
          {
            subjectLine: `Press Release: ${artistData.artistName} - "${artistData.trackTitle}"`,
            fromName: 'Liberty Music PR',
            replyTo: 'chrisschofield@libertymusicpr.com'
          }
        );
        return { campaignId: dup.id, status: 'draft', audience: audience.name };
      } catch (e) {
        // Fallback to create fresh draft
        const campaign = await this.mailchimp.createCampaign({
          type: 'regular',
          recipients: { audienceId: audience.id },
          settings: {
            subjectLine: `Press Release: ${artistData.artistName} - "${artistData.trackTitle}"`,
            fromName: 'Liberty Music PR',
            replyTo: 'chrisschofield@libertymusicpr.com'
          }
        });
        await this.mailchimp.setCampaignContent(campaign.id, pressRelease);
        return { campaignId: campaign.id, status: 'draft', audience: audience.name };
      }
    } catch (error) {
      logger.error('Failed to create Mailchimp draft via duplication:', error.message);
      // Last resort: return minimal object
      return { campaignId: null, status: 'error', error: error.message };
    }
  }

  /**
   * Strip HTML tags for plain text version
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Generate press release for all recent campaigns
   */
  async generatePressReleasesForRecentCampaigns(days = 30) {
    try {
      logger.info(`Generating press releases for recent campaigns (last ${days} days)`);
      
      const recentCampaigns = await this.gmailTypeformMatcher.getRecentLibertyCampaigns(days);
      const pressReleases = [];
      
      for (const campaign of recentCampaigns) {
        try {
          const artistName = campaign.typeformResponse?.data?.artistName || campaign.gmailCampaign?.artistInfo?.name;
          if (artistName) {
            const pressRelease = await this.generatePressReleaseForArtist(artistName);
            pressReleases.push(pressRelease);
          }
        } catch (error) {
          logger.warn(`Failed to generate press release for campaign: ${error.message}`);
        }
      }
      
      logger.success(`Generated ${pressReleases.length} press releases`);
      return pressReleases;
    } catch (error) {
      logger.error('Failed to generate press releases for recent campaigns:', error);
      throw error;
    }
  }
}

module.exports = PressReleaseGenerator;

