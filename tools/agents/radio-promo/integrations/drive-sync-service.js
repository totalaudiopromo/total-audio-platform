const path = require('path');
const os = require('os');
const fs = require('fs');
const fetch = require('node-fetch');
const mime = require('mime-types');

class DriveSyncService {
  constructor({ driveHelper, rootFolderId, log } = {}) {
    this.driveHelper = driveHelper;
    this.rootFolderId = rootFolderId;
    this.logFn = typeof log === 'function' ? log : null;
  }

  log(level, message, meta) {
    if (this.logFn) {
      try {
        this.logFn(level, message, meta);
        return;
      } catch (error) {
        // fall back to console
      }
    }
    const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
    const prefix = prefixMap[level] || 'ℹ️';
    if (meta !== undefined) {
      console.log(prefix, message, meta);
    } else {
      console.log(prefix, message);
    }
  }

  sanitizeName(value) {
    return (value || 'Untitled').replace(/[<>:"/\\|?*]+/g, '-').trim();
  }

  buildCampaignFolderName(campaign) {
    const artist = this.sanitizeName(campaign.artistName);
    const track = this.sanitizeName(campaign.trackTitle);
    return `${artist} - ${track}`;
  }

  async ensureCampaignFolders(campaign) {
    if (!this.driveHelper || !this.rootFolderId) return null;

    const campaignFolderName = this.buildCampaignFolderName(campaign);
    const campaignFolderId = await this.driveHelper.ensureFolder(
      this.rootFolderId,
      campaignFolderName
    );

    const audioFolderId = await this.driveHelper.ensureFolder(campaignFolderId, 'MP3-WAV');
    const artworkFolderId = await this.driveHelper.ensureFolder(campaignFolderId, 'Artwork');
    const pressImagesFolderId = await this.driveHelper.ensureFolder(
      campaignFolderId,
      'Press Images'
    );
    const pressReleaseFolderId = await this.driveHelper.ensureFolder(
      campaignFolderId,
      'Press Release'
    );

    return {
      campaignFolderId,
      audioFolderId,
      artworkFolderId,
      pressImagesFolderId,
      pressReleaseFolderId,
    };
  }

  normalizeAssetUrl(originalUrl) {
    if (!originalUrl) return null;
    try {
      const url = new URL(originalUrl);
      const host = url.hostname.toLowerCase();

      if (host.includes('dropbox.com')) {
        if (!url.searchParams.get('dl')) {
          url.searchParams.set('dl', '1');
        }
        return url.toString();
      }

      if (host.includes('drive.google.com')) {
        const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)\//);
        if (fileMatch && fileMatch[1]) {
          return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
        }
        if (url.pathname.includes('/uc')) {
          url.searchParams.set('export', url.searchParams.get('export') || 'download');
          return url.toString();
        }
        this.log(
          'warn',
          `Google Drive folder link cannot be downloaded automatically: ${originalUrl}`
        );
        return originalUrl;
      }

      return originalUrl;
    } catch (error) {
      return originalUrl;
    }
  }

  async downloadRemoteAsset(url) {
    if (!url) return null;
    const normalized = this.normalizeAssetUrl(url);

    try {
      const response = await fetch(normalized, { redirect: 'follow' });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const buffer = await response.buffer();

      if (contentType.includes('text/html')) {
        const snippet = buffer.slice(0, 2048).toString('utf8');
        if (/<!doctype html>|<html/i.test(snippet)) {
          throw new Error('Asset appears to require authentication');
        }
      }

      let filename = null;
      try {
        const disposition = response.headers.get('content-disposition');
        if (disposition) {
          const match = disposition.match(/filename\*=UTF-8''([^;]+)/);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1]);
          }
        }
        if (!filename) {
          const parsed = new URL(normalized);
          filename = path.basename(parsed.pathname);
        }
      } catch (error) {
        filename = 'asset';
      }

      const mimeType = contentType || mime.lookup(filename) || 'application/octet-stream';
      if (!path.extname(filename)) {
        const ext = mime.extension(mimeType);
        if (ext) filename = `${filename}.${ext}`;
      }

      return { buffer, filename, mimeType };
    } catch (error) {
      this.log('warn', `Failed to download asset ${url}: ${error.message}`);
      return null;
    }
  }

  async uploadAsset(parentId, url, nameHint) {
    const download = await this.downloadRemoteAsset(url);
    if (!download) return null;

    const safeName = this.sanitizeName(nameHint || download.filename || 'asset');

    try {
      const existing = await this.driveHelper.findFiles(parentId, safeName);
      const match = existing.find(file => file.name === safeName);
      if (match) {
        this.log('info', `Reusing existing Drive asset: ${safeName}`);
        return match;
      }
    } catch (error) {
      this.log('warn', `Drive asset lookup failed: ${error.message}`);
    }

    const uploaded = await this.driveHelper.uploadFile(
      parentId,
      safeName,
      download.mimeType,
      download.buffer
    );

    return uploaded;
  }

  async downloadToTemp(fileId, filenameHint = 'asset') {
    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${this.sanitizeName(filenameHint)}`);
    await this.driveHelper.downloadFile(fileId, tempPath);
    return tempPath;
  }

  async prepareAssets(campaign) {
    if (!this.driveHelper || !this.rootFolderId) {
      return null;
    }

    const folders = await this.ensureCampaignFolders(campaign);
    if (!folders) return null;

    const driveAssets = {
      audio: [],
      artwork: [],
      press: [],
      other: [],
      campaignFolderId: folders.campaignFolderId,
    };

    const uploadTasks = [];
    const pushUpload = (type, promise) => {
      uploadTasks.push(
        promise
          .then(file => {
            if (file) driveAssets[type].push(file);
          })
          .catch(error => this.log('warn', `Drive upload failed: ${error.message}`))
      );
    };

    const data = campaign.original?.data || {};

    const audioLinks = (campaign.downloadLinks || [])
      .concat(data.mp3Link ? [data.mp3Link] : [])
      .concat(data.wavLink ? [data.wavLink] : [])
      .filter(Boolean);

    audioLinks.forEach((link, index) => {
      pushUpload(
        'audio',
        this.uploadAsset(
          folders.audioFolderId,
          link,
          `${campaign.trackTitle || 'Track'}-${index + 1}`
        )
      );
    });

    if (data.pressPhoto) {
      pushUpload(
        'press',
        this.uploadAsset(
          folders.pressFolderId,
          data.pressPhoto,
          `${campaign.artistName || 'Artist'}-press`
        )
      );
    }
    if (data.coverArt) {
      pushUpload(
        'artwork',
        this.uploadAsset(
          folders.artworkFolderId,
          data.coverArt,
          `${campaign.trackTitle || 'Track'}-artwork`
        )
      );
    }

    (campaign.otherLinks || []).forEach((link, index) => {
      pushUpload('other', this.uploadAsset(folders.otherFolderId, link, `link-${index + 1}`));
    });

    await Promise.all(uploadTasks);

    const localAssets = {
      track: null,
      additionalTracks: [],
      pressPhoto: null,
      artwork: null,
      cleanup: [],
    };

    const downloadFirstFile = async (files, label) => {
      if (!files || files.length === 0) return null;
      const file = files[0];
      try {
        const tempPath = await this.downloadToTemp(file.id, file.name || label);
        localAssets.cleanup.push(tempPath);
        return tempPath;
      } catch (error) {
        this.log('warn', `Failed to download Drive file ${file.name || file.id}: ${error.message}`);
        return null;
      }
    };

    localAssets.track = await downloadFirstFile(driveAssets.audio, 'track');
    if (driveAssets.audio.length > 1) {
      const extraDownloads = await Promise.all(
        driveAssets.audio.slice(1).map(async file => {
          try {
            const tempPath = await this.downloadToTemp(file.id, file.name || 'track');
            localAssets.cleanup.push(tempPath);
            return tempPath;
          } catch (error) {
            this.log(
              'warn',
              `Failed to download additional track ${file.name || file.id}: ${error.message}`
            );
            return null;
          }
        })
      );
      localAssets.additionalTracks = extraDownloads.filter(Boolean);
    }

    localAssets.pressPhoto = await downloadFirstFile(driveAssets.press, 'press-photo');
    localAssets.artwork = await downloadFirstFile(driveAssets.artwork, 'artwork');

    return {
      drive: driveAssets,
      local: localAssets,
    };
  }
}

module.exports = DriveSyncService;
