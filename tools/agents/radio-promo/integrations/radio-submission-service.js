const fetch = require('node-fetch');
const RadioPortalAutomation = require('./radio-portal-automation');
const DriveHelper = require('./drive-helper');
const DriveSyncService = require('./drive-sync-service');

class RadioSubmissionService {
  constructor(options = {}) {
    this.fetch = options.fetch || fetch;
    this.gmail = options.gmail || null;
    this.amazingWebhook = options.amazingWebhook || process.env.AMAZING_RADIO_WEBHOOK_URL || null;
    this.wigwamWebhook = options.wigwamWebhook || process.env.WIGWAM_RADIO_WEBHOOK_URL || null;
    this.eimEmail =
      options.eimEmail || process.env.EUROPEAN_INDIE_MUSIC_EMAIL || 'info@europeanindiemusic.com';
    this.paymentUrl = options.paymentUrl || process.env.EUROPEAN_INDIE_MUSIC_PAYMENT_URL || null;
    this.logFn =
      typeof options.log === 'function'
        ? options.log
        : (level, message, meta) => {
            const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
            const prefix = prefixMap[level] || 'ℹ️';
            if (meta) {
              console.log(prefix, message, meta);
            } else {
              console.log(prefix, message);
            }
          };
    this.portalAutomation = new RadioPortalAutomation({
      log: this.logFn,
      credentials: {
        amazingUsername: options.amazingUsername || process.env.AMAZING_RADIO_USERNAME,
        amazingPassword: options.amazingPassword || process.env.AMAZING_RADIO_PASSWORD,
        wigwamUsername: options.wigwamUsername || process.env.WIGWAM_USERNAME,
        wigwamPassword: options.wigwamPassword || process.env.WIGWAM_PASSWORD,
      },
    });

    const driveEmail =
      process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const driveKey =
      process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_DRIVE_PRIVATE_KEY;
    const driveRoot =
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || process.env.GOOGLE_DRIVE_CAMPAIGNS_FOLDER_ID;

    if (driveEmail && driveKey && driveRoot) {
      this.driveHelper = new DriveHelper({
        clientEmail: driveEmail,
        privateKey: driveKey,
        rootFolderId: driveRoot,
        log: this.logFn,
      });

      this.driveSyncService = new DriveSyncService({
        driveHelper: this.driveHelper,
        rootFolderId: driveRoot,
        log: this.logFn,
      });
    } else {
      this.driveHelper = null;
      this.driveSyncService = null;
    }
  }

  log(level, message, meta) {
    try {
      this.logFn(level, message, meta);
    } catch (error) {
      const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
      const prefix = prefixMap[level] || 'ℹ️';
      if (meta) {
        console.log(prefix, message, meta);
      } else {
        console.log(prefix, message);
      }
      console.log(prefix, 'Logger error fallback:', error.message);
    }
  }

  sanitizeText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value.trim();
    if (Array.isArray(value))
      return value
        .filter(Boolean)
        .map(v => this.sanitizeText(v))
        .join(', ');
    if (value instanceof Date) return value.toISOString();
    return String(value).trim();
  }

  buildStationPayload(campaign, stationName) {
    return {
      artist: this.sanitizeText(campaign.artistName),
      track: this.sanitizeText(campaign.trackTitle),
      genre: this.sanitizeText(campaign.genre),
      releaseDate: this.sanitizeText(campaign.releaseDate),
      campaignStartDate: this.sanitizeText(campaign.campaignStartDate),
      campaignEndDate: this.sanitizeText(campaign.campaignEndDate),
      pitch: this.sanitizeText(campaign.pitch || campaign.logline || campaign.summary),
      pressRelease: this.sanitizeText(campaign.pressRelease),
      streamingLinks: campaign.streamingLinks || [],
      downloadLinks: campaign.downloadLinks || [],
      contact: campaign.contact || {},
      metadata: {
        station: stationName,
        submittedAt: new Date().toISOString(),
      },
    };
  }

  async postWebhook(url, payload, stationLabel) {
    if (!url) {
      this.log('warn', `${stationLabel} webhook URL missing; skipping submission.`);
      return { success: false, skipped: true, reason: 'missing_webhook' };
    }

    try {
      this.log('info', `Submitting to ${stationLabel} webhook`, { url });
      const response = await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status} ${response.statusText} ${text}`.trim());
      }

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      this.log('success', `${stationLabel} submission complete`);
      return { success: true, payload, response: data };
    } catch (error) {
      this.log('error', `${stationLabel} submission failed: ${error.message}`);
      return { success: false, error: error.message, payload };
    }
  }

  async submitToAmazingRadio(campaign) {
    const payload = this.buildStationPayload(campaign, 'Amazing Radio');
    payload.metadata.package = 'standard-webhook';

    if (!campaign.preparedAssets) {
      await this.prepareCampaignAssets(campaign);
    }

    if (this.amazingWebhook) {
      const webhookResult = await this.postWebhook(this.amazingWebhook, payload, 'Amazing Radio');
      if (webhookResult.success || webhookResult.skipped) {
        return webhookResult;
      }
      this.log('warn', 'Amazing Radio webhook failed, attempting portal automation.');
    } else {
      this.log('info', 'Amazing Radio webhook not configured – falling back to portal automation.');
    }

    if (this.portalAutomation.hasAmazingCredentials()) {
      const result = await this.portalAutomation.submitToAmazingRadio(
        campaign,
        campaign.preparedAssets || null
      );
      if (campaign.preparedAssets?.cleanup?.length) {
        await this.portalAutomation.cleanupAssets(campaign.preparedAssets.cleanup);
        campaign.preparedAssets.cleanup = [];
      }
      return result;
    }

    return { success: false, skipped: true, reason: 'no_webhook_or_credentials' };
  }

  async submitToRadioWigwam(campaign) {
    const payload = this.buildStationPayload(campaign, 'Radio Wigwam');
    payload.metadata.package = 'standard-webhook';

    if (!campaign.preparedAssets) {
      await this.prepareCampaignAssets(campaign);
    }

    if (this.wigwamWebhook) {
      const webhookResult = await this.postWebhook(this.wigwamWebhook, payload, 'Radio Wigwam');
      if (webhookResult.success || webhookResult.skipped) {
        return webhookResult;
      }
      this.log('warn', 'Radio Wigwam webhook failed, attempting portal automation.');
    } else {
      this.log('info', 'Radio Wigwam webhook not configured – falling back to portal automation.');
    }

    if (this.portalAutomation.hasWigwamCredentials()) {
      const result = await this.portalAutomation.submitToRadioWigwam(
        campaign,
        campaign.preparedAssets || null
      );
      if (campaign.preparedAssets?.cleanup?.length) {
        await this.portalAutomation.cleanupAssets(campaign.preparedAssets.cleanup);
        campaign.preparedAssets.cleanup = [];
      }
      return result;
    }

    return { success: false, skipped: true, reason: 'no_webhook_or_credentials' };
  }

  async prepareCampaignAssets(campaign) {
    if (!this.driveSyncService) {
      return null;
    }

    try {
      const syncResult = await this.driveSyncService.prepareAssets(campaign);
      if (syncResult) {
        campaign.driveAssets = syncResult.drive;
        campaign.preparedAssets = syncResult.local;
        return syncResult.local;
      }
    } catch (error) {
      this.log('warn', `Drive sync failed: ${error.message}`);
    }

    return null;
  }

  determineEuropeanIndiePackage(campaign, options = {}) {
    if (options.packageType) {
      return options.packageType;
    }

    const additionalTracks = Array.isArray(campaign.additionalTracks)
      ? campaign.additionalTracks.length
      : 0;
    const totalTracks = 1 + additionalTracks;
    return totalTracks > 1 ? 'three-track' : 'single-track';
  }

  getEuropeanIndiePackageDetails(packageType) {
    if (packageType === 'three-track') {
      return {
        code: 'three-track',
        description: '3 songs / 1 month',
        amount: 20,
      };
    }

    return {
      code: 'single-track',
      description: '1 song / 1 month',
      amount: 10,
    };
  }

  buildEuropeanIndieEmail(campaign, packageDetails, options = {}) {
    const attachments = [];
    if (campaign.downloadLinks && campaign.downloadLinks.length > 0) {
      attachments.push({
        label: 'Download Links',
        urls: campaign.downloadLinks,
      });
    }
    if (campaign.pressReleaseLink) {
      attachments.push({
        label: 'Press Release',
        urls: [campaign.pressReleaseLink],
      });
    }
    if (campaign.streamingLinks && campaign.streamingLinks.length > 0) {
      attachments.push({
        label: 'Streaming Links',
        urls: campaign.streamingLinks,
      });
    }

    const paymentReference = options.paymentReference || options.transactionId || null;
    const paymentLine = paymentReference
      ? `Payment Reference: ${paymentReference}`
      : 'Payment: £' +
        packageDetails.amount +
        ' via European Indie Music website (please confirm receipt).';

    const bodyLines = [
      'Hi European Indie Music Team,',
      '',
      'Hope you are well! Please find the details for our latest campaign below:',
      '',
      `Artist: ${this.sanitizeText(campaign.artistName)}`,
      `Track: ${this.sanitizeText(campaign.trackTitle)}`,
      `Genre: ${this.sanitizeText(campaign.genre)}`,
      `Release Date: ${this.sanitizeText(campaign.releaseDate) || 'TBC'}`,
      '',
      'Package Requested: ' + packageDetails.description,
      paymentLine,
      '',
      'Materials:',
      ...(attachments.length > 0
        ? attachments.flatMap(att => att.urls.map(url => `- ${att.label}: ${url}`))
        : ['- Streaming link: ' + (campaign.primaryStream || 'Available on request')]),
      '',
      campaign.pitch ? campaign.pitch : 'Let me know if you need any additional info or assets.',
      '',
      'Thanks as always!',
      '',
      'Chris Schofield',
    ];

    return {
      to: this.eimEmail,
      subject: `European Indie Music – ${this.sanitizeText(
        campaign.artistName
      )} – ${this.sanitizeText(campaign.trackTitle)}`,
      body: bodyLines.join('\n'),
      package: packageDetails,
      attachments,
    };
  }

  async submitToEuropeanIndieMusic(campaign, options = {}) {
    const packageType = this.determineEuropeanIndiePackage(campaign, options);
    const packageDetails = this.getEuropeanIndiePackageDetails(packageType);
    const emailDraft = this.buildEuropeanIndieEmail(campaign, packageDetails, options);

    let emailResult = {
      sent: false,
      messageId: null,
      channel: 'draft',
    };

    if (this.gmail && typeof this.gmail.sendEmail === 'function' && options.autoSend !== false) {
      try {
        const payload = {
          to: emailDraft.to,
          subject: emailDraft.subject,
          body: emailDraft.body,
          campaignId: options.campaignId || campaign.campaignId || null,
          attachments: (options.attachments || []).concat(
            emailDraft.attachments.flatMap(att => att.urls || [])
          ),
        };
        const response = await this.gmail.sendEmail(payload);
        emailResult = {
          sent: true,
          messageId: response?.id || response?.messageId || null,
          channel: 'gmail',
        };
        this.log('success', 'European Indie Music email sent via Gmail API');
      } catch (error) {
        this.log('error', `Failed to send European Indie Music email: ${error.message}`);
      }
    } else {
      this.log('info', 'Gmail integration unavailable – returning email draft for manual sending.');
    }

    return {
      success: emailResult.sent,
      package: packageDetails,
      emailDraft,
      emailResult,
      paymentUrl: this.paymentUrl,
      paymentReference: options.paymentReference || null,
    };
  }
}

module.exports = RadioSubmissionService;
