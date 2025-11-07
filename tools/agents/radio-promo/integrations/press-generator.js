#!/usr/bin/env node

/**
 * Press Release & Media Kit Generator
 *
 * Generates professional press materials
 * Creates press releases, media kits, and formatted content
 * Includes streaming numbers and social proof
 */

const fs = require('fs');
const path = require('path');

class PressGenerator {
  constructor() {
    this.templates = new Map();
    this.generatedContent = new Map();

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'press-generator.json');
    this.loadData();

    // Initialize templates
    this.initializeTemplates();
  }

  /**
   * Initialize press release templates
   */
  initializeTemplates() {
    // Press release templates
    this.templates.set('press_release', {
      title:
        '{artistName} Releases New Single "{trackTitle}" - {genre} Track Showcases {uniqueSellingPoint}',
      body: `FOR IMMEDIATE RELEASE

{artistName} RELEASES NEW SINGLE "{trackTitle}"

{location}, {date} - {artistName} has released their highly anticipated new single "{trackTitle}" today, showcasing their signature {genre} sound and {uniqueSellingPoint}.

The track, produced by {producer}, features {trackHighlights} and is available now on all major streaming platforms including Spotify, Apple Music, and Amazon Music.

"{trackTitle}" represents a {artisticDirection} for {artistName}, who has been {careerContext}. The single follows their previous release "{previousRelease}" which {previousReleaseContext}.

Key highlights of "{trackTitle}":
• {highlight1}
• {highlight2}
• {highlight3}

Streaming numbers and social proof:
• {streamingNumbers}
• {socialMediaStats}
• {previousAchievements}

{artistName} is available for interviews and appearances. For press inquiries, contact {contactName} at {contactEmail} or {contactPhone}.

About {artistName}:
{artistBio}

For more information, visit {website} or follow {artistName} on social media:
• Instagram: {instagram}
• Twitter: {twitter}
• Facebook: {facebook}
• YouTube: {youtube}

###

Contact:
{contactName}
{contactTitle}
{contactEmail}
{contactPhone}
{website}`,
      format: 'text',
    });

    // Media kit template
    this.templates.set('media_kit', {
      title: 'Media Kit - {artistName}',
      sections: {
        artist_info: {
          title: 'Artist Information',
          content: `Artist Name: {artistName}
Genre: {genre}
Location: {location}
Label: {label}
Management: {management}
Booking: {booking}

Biography:
{artistBio}

Career Highlights:
{careerHighlights}

Awards & Recognition:
{awards}

Previous Releases:
{previousReleases}`,
        },
        track_info: {
          title: 'Track Information',
          content: `Track Title: {trackTitle}
Artist: {artistName}
Genre: {genre}
Release Date: {releaseDate}
Label: {label}
Producer: {producer}
Mixer: {mixer}
Mastering: {mastering}

Track Description:
{trackDescription}

Key Features:
{keyFeatures}

Streaming Links:
• Spotify: {spotifyLink}
• Apple Music: {appleMusicLink}
• Amazon Music: {amazonMusicLink}
• YouTube: {youtubeLink}`,
        },
        assets: {
          title: 'Media Assets',
          content: `High-Resolution Photos:
• Press Photo 1: {pressPhoto1}
• Press Photo 2: {pressPhoto2}
• Press Photo 3: {pressPhoto3}
• Press Photo 4: {pressPhoto4}

Cover Art:
• Cover Art (3000x3000): {coverArtHighRes}
• Cover Art (1500x1500): {coverArtMedium}
• Cover Art (600x600): {coverArtSmall}

Audio Files:
• Master MP3 (320kbps): {masterMp3}
• Radio Edit: {radioEdit}
• Instrumental: {instrumental}
• Acapella: {acapella}

Video Content:
• Music Video: {musicVideo}
• Behind the Scenes: {behindTheScenes}
• Live Performance: {livePerformance}`,
        },
        social_media: {
          title: 'Social Media',
          content: `Instagram: {instagram}
Twitter: {twitter}
Facebook: {facebook}
YouTube: {youtube}
TikTok: {tiktok}
SoundCloud: {soundcloud}

Social Media Stats:
• Total Followers: {totalFollowers}
• Instagram: {instagramFollowers}
• Twitter: {twitterFollowers}
• Facebook: {facebookFollowers}
• YouTube: {youtubeSubscribers}`,
        },
        contact: {
          title: 'Contact Information',
          content: `Press Contact:
{contactName}
{contactTitle}
{contactEmail}
{contactPhone}

Management:
{managementName}
{managementEmail}
{managementPhone}

Booking:
{bookingName}
{bookingEmail}
{bookingPhone}

Label:
{labelName}
{labelEmail}
{labelPhone}`,
        },
      },
      format: 'structured',
    });

    // Email pitch template
    this.templates.set('email_pitch', {
      subject: 'New Music: {artistName} - "{trackTitle}" ({genre})',
      body: `Hi {contactName},

I hope you're well! I wanted to share {artistName}'s new single "{trackTitle}" with you.

{trackDescription}

Key highlights:
• {highlight1}
• {highlight2}
• {highlight3}

The track is available now on all major streaming platforms and has already {earlyAchievements}.

I've attached the press kit with high-resolution photos, bio, and all the details you need. The track is ready for immediate play and I'd love to hear your thoughts.

Would you like me to send over the MP3 and any additional materials?

Best regards,
{yourName}

P.S. {artistName} is available for interviews and appearances if you're interested in featuring them.

---
{yourName}
{yourTitle}
{yourEmail}
{yourPhone}
{yourWebsite}

Attachments:
• Press Kit (PDF)
• High-res photos (ZIP)
• MP3 files (ZIP)`,
      format: 'email',
    });

    // Social media post templates
    this.templates.set('social_media', {
      instagram: {
        caption: `🎵 NEW MUSIC ALERT! 🎵

{artistName} just dropped "{trackTitle}" and it's absolutely {reaction}!

{trackDescription}

Stream it now on all platforms:
• Spotify: {spotifyLink}
• Apple Music: {appleMusicLink}
• YouTube: {youtubeLink}

{hashtags}

#NewMusic #MusicDiscovery #{genre} #{artistName} #{trackTitle}`,
        hashtags: ['#NewMusic', '#MusicDiscovery', '#FreshTracks', '#IndieMusic', '#NewArtist'],
      },
      twitter: {
        text: `🎵 NEW: {artistName} - "{trackTitle}" ({genre})

{trackDescription}

Stream: {spotifyLink}

{hashtags}`,
        hashtags: ['#NewMusic', '#MusicDiscovery', '#FreshTracks'],
      },
      facebook: {
        text: `🎵 Exciting news! {artistName} has just released their new single "{trackTitle}"!

{trackDescription}

This {genre} track showcases {uniqueSellingPoint} and is perfect for {targetAudience}.

Stream it now on all major platforms:
• Spotify: {spotifyLink}
• Apple Music: {appleMusicLink}
• YouTube: {youtubeLink}

{hashtags}`,
        hashtags: ['#NewMusic', '#MusicDiscovery', '#FreshTracks', '#IndieMusic'],
      },
    });
  }

  /**
   * Generate press release
   */
  async generatePressRelease(campaignData, options = {}) {
    console.log(`📰 Generating press release for ${campaignData.artistName}`);

    try {
      const template = this.templates.get('press_release');
      const content = this.personalizeContent(template, {
        ...campaignData,
        ...options,
        date: new Date().toLocaleDateString('en-GB'),
        contactName: options.contactName || 'Chris',
        contactTitle: options.contactTitle || 'Music PR Specialist',
        contactEmail: options.contactEmail || 'chris@totalaudiopromo.com',
        contactPhone: options.contactPhone || '+44 1234 567890',
      });

      const pressRelease = {
        id: `press-${campaignData.campaignId}-${Date.now()}`,
        campaignId: campaignData.campaignId,
        artistName: campaignData.artistName,
        trackTitle: campaignData.trackTitle,
        title: content.title,
        body: content.body,
        format: 'press_release',
        generatedAt: Date.now(),
        wordCount: content.body.split(' ').length,
      };

      // Store generated content
      this.generatedContent.set(pressRelease.id, pressRelease);
      this.saveData();

      console.log(`✅ Press release generated: ${pressRelease.wordCount} words`);

      return pressRelease;
    } catch (error) {
      console.error('❌ Failed to generate press release:', error.message);
      throw error;
    }
  }

  /**
   * Generate media kit
   */
  async generateMediaKit(campaignData, options = {}) {
    console.log(`📁 Generating media kit for ${campaignData.artistName}`);

    try {
      const template = this.templates.get('media_kit');
      const mediaKit = {
        id: `media-kit-${campaignData.campaignId}-${Date.now()}`,
        campaignId: campaignData.campaignId,
        artistName: campaignData.artistName,
        trackTitle: campaignData.trackTitle,
        title: this.personalizeText(template.title, campaignData),
        sections: {},
        generatedAt: Date.now(),
      };

      // Generate each section
      for (const [sectionKey, sectionTemplate] of Object.entries(template.sections)) {
        mediaKit.sections[sectionKey] = {
          title: sectionTemplate.title,
          content: this.personalizeText(sectionTemplate.content, {
            ...campaignData,
            ...options,
          }),
        };
      }

      // Store generated content
      this.generatedContent.set(mediaKit.id, mediaKit);
      this.saveData();

      console.log(`✅ Media kit generated with ${Object.keys(mediaKit.sections).length} sections`);

      return mediaKit;
    } catch (error) {
      console.error('❌ Failed to generate media kit:', error.message);
      throw error;
    }
  }

  /**
   * Generate email pitch
   */
  async generateEmailPitch(campaignData, contact, options = {}) {
    console.log(`📧 Generating email pitch for ${contact.name}`);

    try {
      const template = this.templates.get('email_pitch');
      const content = this.personalizeContent(template, {
        ...campaignData,
        ...contact,
        ...options,
        contactName: contact.name || contact.contactName,
        yourName: options.yourName || 'Chris',
        yourTitle: options.yourTitle || 'Music PR Specialist',
        yourEmail: options.yourEmail || 'chris@totalaudiopromo.com',
        yourPhone: options.yourPhone || '+44 1234 567890',
        yourWebsite: options.yourWebsite || 'totalaudiopromo.com',
      });

      const emailPitch = {
        id: `email-${campaignData.campaignId}-${contact.id}-${Date.now()}`,
        campaignId: campaignData.campaignId,
        contactId: contact.id,
        contactName: contact.name || contact.contactName,
        subject: content.subject,
        body: content.body,
        format: 'email_pitch',
        generatedAt: Date.now(),
      };

      // Store generated content
      this.generatedContent.set(emailPitch.id, emailPitch);
      this.saveData();

      console.log(`✅ Email pitch generated for ${contact.name}`);

      return emailPitch;
    } catch (error) {
      console.error('❌ Failed to generate email pitch:', error.message);
      throw error;
    }
  }

  /**
   * Generate social media posts
   */
  async generateSocialMediaPosts(campaignData, options = {}) {
    console.log(`📱 Generating social media posts for ${campaignData.artistName}`);

    try {
      const template = this.templates.get('social_media');
      const posts = {};

      // Generate posts for each platform
      for (const [platform, platformTemplate] of Object.entries(template)) {
        posts[platform] = {
          platform: platform,
          content: this.personalizeText(platformTemplate.caption || platformTemplate.text, {
            ...campaignData,
            ...options,
            hashtags: this.generateHashtags(campaignData, platformTemplate.hashtags),
          }),
          hashtags: this.generateHashtags(campaignData, platformTemplate.hashtags),
          generatedAt: Date.now(),
        };
      }

      const socialMediaPosts = {
        id: `social-${campaignData.campaignId}-${Date.now()}`,
        campaignId: campaignData.campaignId,
        artistName: campaignData.artistName,
        trackTitle: campaignData.trackTitle,
        posts: posts,
        generatedAt: Date.now(),
      };

      // Store generated content
      this.generatedContent.set(socialMediaPosts.id, socialMediaPosts);
      this.saveData();

      console.log(`✅ Social media posts generated for ${Object.keys(posts).length} platforms`);

      return socialMediaPosts;
    } catch (error) {
      console.error('❌ Failed to generate social media posts:', error.message);
      throw error;
    }
  }

  /**
   * Generate hashtags
   */
  generateHashtags(campaignData, baseHashtags = []) {
    const hashtags = [...baseHashtags];

    // Add genre-specific hashtags
    if (campaignData.genre) {
      hashtags.push(`#${campaignData.genre}`);
    }

    // Add artist-specific hashtags
    if (campaignData.artistName) {
      hashtags.push(`#${campaignData.artistName.replace(/\s+/g, '')}`);
    }

    // Add track-specific hashtags
    if (campaignData.trackTitle) {
      hashtags.push(`#${campaignData.trackTitle.replace(/\s+/g, '')}`);
    }

    // Add location hashtags
    if (campaignData.location) {
      hashtags.push(`#${campaignData.location.replace(/\s+/g, '')}`);
    }

    // Add general music hashtags
    hashtags.push('#Music', '#NewRelease', '#FreshTracks', '#MusicDiscovery');

    return hashtags.slice(0, 10); // Limit to 10 hashtags
  }

  /**
   * Personalize content with data
   */
  personalizeContent(template, data) {
    const result = {};

    for (const [key, value] of Object.entries(template)) {
      if (typeof value === 'string') {
        result[key] = this.personalizeText(value, data);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Personalize text with placeholders
   */
  personalizeText(text, data) {
    let personalizedText = text;

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      personalizedText = personalizedText.replace(new RegExp(placeholder, 'g'), value || '');
    });

    return personalizedText;
  }

  /**
   * Export content to file
   */
  async exportContent(contentId, format = 'txt') {
    const content = this.generatedContent.get(contentId);
    if (!content) {
      throw new Error(`Content not found: ${contentId}`);
    }

    const filename = `${content.artistName}-${content.trackTitle}-${content.format}.${format}`;
    const filepath = path.join(__dirname, '..', 'generated', filename);

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let fileContent = '';

    if (content.format === 'press_release') {
      fileContent = `${content.title}\n\n${content.body}`;
    } else if (content.format === 'media_kit') {
      fileContent = `${content.title}\n\n`;
      for (const [sectionKey, section] of Object.entries(content.sections)) {
        fileContent += `${section.title}\n${'='.repeat(section.title.length)}\n\n${
          section.content
        }\n\n`;
      }
    } else if (content.format === 'email_pitch') {
      fileContent = `Subject: ${content.subject}\n\n${content.body}`;
    } else if (content.format === 'social_media') {
      fileContent = JSON.stringify(content.posts, null, 2);
    }

    fs.writeFileSync(filepath, fileContent);

    console.log(`📁 Content exported to: ${filepath}`);

    return {
      filepath,
      filename,
      size: fileContent.length,
    };
  }

  /**
   * Get generated content
   */
  getGeneratedContent(contentId) {
    return this.generatedContent.get(contentId);
  }

  /**
   * Get all generated content for a campaign
   */
  getCampaignContent(campaignId) {
    const content = Array.from(this.generatedContent.values());
    return content.filter(item => item.campaignId === campaignId);
  }

  /**
   * Get content analytics
   */
  getContentAnalytics() {
    const content = Array.from(this.generatedContent.values());
    const totalContent = content.length;

    if (totalContent === 0) {
      return {
        totalContent: 0,
        contentTypes: {},
        averageWordCount: 0,
        totalWords: 0,
      };
    }

    const contentTypes = {};
    let totalWords = 0;

    content.forEach(item => {
      const type = item.format;
      contentTypes[type] = (contentTypes[type] || 0) + 1;

      if (item.wordCount) {
        totalWords += item.wordCount;
      }
    });

    const averageWordCount = totalWords / totalContent;

    return {
      totalContent,
      contentTypes,
      averageWordCount,
      totalWords,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.generatedContent = new Map(data.generatedContent || []);
        console.log(`📚 Loaded press generator data: ${this.generatedContent.size} items`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load press generator data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        generatedContent: Array.from(this.generatedContent.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save press generator data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const analytics = this.getContentAnalytics();

    return {
      status: 'healthy',
      totalContent: analytics.totalContent,
      contentTypes: analytics.contentTypes,
      averageWordCount: analytics.averageWordCount,
      lastChecked: new Date().toISOString(),
    };
  }
}

module.exports = PressGenerator;
