#!/usr/bin/env node

const RadioSubmissionService = require('../integrations/radio-submission-service');

class RadioAgent {
  constructor(options = {}) {
    this.name = 'RadioAgent';
    this.version = '2.0.0';
    this.orchestrator = options.orchestrator;
    this.config = options.config || {};
    this.loggerFn = options.logger || console.log;
    this.submissionService = null;
  }

  log(level, message, meta) {
    if (typeof this.loggerFn === 'function') {
      const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
      const prefix = prefixMap[level] || 'ℹ️';
      if (meta !== undefined) {
        this.loggerFn(`${prefix} ${message}`, meta);
      } else {
        this.loggerFn(`${prefix} ${message}`);
      }
      return;
    }

    if (this.loggerFn && typeof this.loggerFn[level] === 'function') {
      this.loggerFn[level](message, meta);
      return;
    }

    console.log(`[${level}]`, message, meta || '');
  }

  async initialize() {
    this.log('info', 'Initializing Radio Agent with automated submission workflows');
    this.submissionService = new RadioSubmissionService({
      log: (level, message, meta) => this.log(level, message, meta),
      gmail: this.config.gmail || null,
      amazingWebhook: this.config.amazingRadioWebhook,
      wigwamWebhook: this.config.wigwamRadioWebhook,
      eimEmail: this.config.europeanIndieEmail,
      paymentUrl: this.config.europeanIndiePaymentUrl,
      amazingUsername: this.config.amazingRadioUsername,
      amazingPassword: this.config.amazingRadioPassword,
      wigwamUsername: this.config.wigwamUsername,
      wigwamPassword: this.config.wigwamPassword
    });
    this.log('success', 'Radio submission service ready');
    return true;
  }

  normalizeCampaignData(raw = {}) {
    const source = raw.data || raw;

    const pick = (keys, fallback = '') => {
      for (const key of keys) {
        if (source[key]) return source[key];
      }
      return fallback;
    };

    const toArray = value => {
      if (!value) return [];
      if (Array.isArray(value)) return value.filter(Boolean);
      if (typeof value === 'string' && value.includes(',')) {
        return value.split(',').map(v => v.trim()).filter(Boolean);
      }
      return [value];
    };

    const normalizeDate = value => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const campaignStart = pick(['campaignStartDate', 'startDate', 'campaign_start_date', 'intakeDate', 'intake_date']);
    const campaignEnd = pick(['campaignEndDate', 'endDate', 'campaign_end_date']);
    const streamingLinks = toArray(pick(['streamingLinks', 'streaming_links', 'spotifyLink', 'soundcloudLink', 'listenLinks'])).filter(Boolean);
    const downloadLinks = toArray(pick(['downloadLinks', 'download_links', 'mp3Link', 'wavLink', 'assetsDownload'])).filter(Boolean);
    const otherLinksRaw = [
      ...toArray(pick(['otherLinks', 'other_links', 'additionalLinks', 'links'])).filter(Boolean),
      ...toArray(source.otherLinks).filter(Boolean)
    ];
    const otherLinks = [...new Set(otherLinksRaw.map(link => link.trim()))].filter(Boolean);

    return {
      original: raw,
      artistName: pick(['artistName', 'artist', 'artist_name', 'bandName', 'band_name'], 'Unknown Artist'),
      trackTitle: pick(['trackTitle', 'track', 'track_name', 'songTitle', 'song_title'], 'Untitled Track'),
      genre: pick(['genre', 'musicGenre', 'music_genre', 'style'], ''),
      releaseDate: pick(['releaseDate', 'release_date', 'launchDate', 'launch_date'], ''),
      isrc: pick(['isrc', 'isrcCode', 'isrc_code'], ''),
      campaignStartDate: normalizeDate(campaignStart),
      campaignEndDate: normalizeDate(campaignEnd),
      pitch: pick(['campaignPitch', 'pitch', 'logline', 'campaignSummary', 'summary'], ''),
      pressRelease: pick(['pressRelease', 'press_release', 'pressBio', 'press_bio'], ''),
      pressReleaseLink: pick(['pressReleaseLink', 'press_release_link', 'pressKit', 'pressKitLink']),
      streamingLinks,
      downloadLinks,
      primaryStream: streamingLinks[0] || null,
      facebook: pick(['facebook', 'facebookLink', 'facebook_link']),
      instagram: pick(['instagram', 'instagramLink', 'instagram_link']),
      twitter: pick(['twitter', 'twitterLink', 'twitter_link', 'x', 'xLink']),
      otherLinks,
      contact: {
        name: pick(['contactName', 'contact_name', 'managerName', 'manager_name']),
        email: pick(['contactEmail', 'contact_email', 'email']),
        phone: pick(['contactPhone', 'contact_phone', 'phone'])
      },
      additionalTracks: source.additionalTracks || [],
      packagePreference: source.packagePreference || source.eimPackage || null,
      paymentReference: source.paymentReference || null
    };
  }

  buildSubmissionSummary(results) {
    const summary = {
      stationsContacted: 0,
      submissions: results
    };

    if (results.amazingRadio?.success) summary.stationsContacted += 1;
    if (results.radioWigwam?.success) summary.stationsContacted += 1;
    if (results.europeanIndieMusic?.success) summary.stationsContacted += 1;

    return summary;
  }

  async initiateSubmissions(campaignData) {
    if (!this.submissionService) {
      throw new Error('Radio submission service not initialized');
    }

    const campaign = this.normalizeCampaignData(campaignData);
    this.log('info', `Initiating radio submissions for ${campaign.artistName} – ${campaign.trackTitle}`);

    const amazingRadio = await this.submissionService.submitToAmazingRadio(campaign);
    const radioWigwam = await this.submissionService.submitToRadioWigwam(campaign);
    const europeanIndieMusic = await this.submissionService.submitToEuropeanIndieMusic(campaign, {
      packageType: campaign.packagePreference,
      paymentReference: campaign.paymentReference,
      campaignId: campaign.original?.campaignId
    });

    const summary = this.buildSubmissionSummary({ amazingRadio, radioWigwam, europeanIndieMusic });
    this.log('success', `Radio submissions completed – contacted ${summary.stationsContacted} channels`);
    return summary;
  }

  async healthCheck() {
    return {
      status: 'healthy',
      agent: this.name,
      version: this.version,
      timestamp: new Date()
    };
  }

  async shutdown() {
    this.log('info', 'Radio Agent shut down');
  }
}

module.exports = RadioAgent;
