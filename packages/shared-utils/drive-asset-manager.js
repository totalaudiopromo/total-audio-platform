// Google Drive Asset Management for Liberty Radio Campaigns
// Creates organized folders with campaign assets from TypeForm data

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class DriveAssetManager {
  constructor() {
    this.drive = google.drive({ version: 'v3', auth: this.getAuth() });
    this.baseFolderId = process.env.LIBERTY_CAMPAIGNS_FOLDER_ID; // Your main campaigns folder
  }

  getAuth() {
    // Use service account or OAuth2 credentials
    return new google.auth.GoogleAuth({
      keyFile: 'path/to/service-account.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  async createCampaignFolder(artistName, trackName, typeformData) {
    const folderName = `${artistName} - ${trackName}`;

    try {
      // Create main campaign folder
      const mainFolder = await this.createFolder(folderName, this.baseFolderId);

      // Create subfolders
      const mp3WavFolder = await this.createFolder('MP3-WAV', mainFolder.id);
      const assetsFolder = await this.createFolder('Assets', assetsFolder.id);

      // Create assets subfolders
      const pressReleaseFolder = await this.createFolder('Press Release', assetsFolder.id);
      const promoPhotosFolder = await this.createFolder('Promo Photos', assetsFolder.id);
      const artworkFolder = await this.createFolder('Artwork', assetsFolder.id);

      // Download and organize files from TypeForm
      await this.processTypeformAssets(typeformData, {
        mp3WavFolder: mp3WavFolder.id,
        pressReleaseFolder: pressReleaseFolder.id,
        promoPhotosFolder: promoPhotosFolder.id,
        artworkFolder: artworkFolder.id,
      });

      return {
        mainFolderId: mainFolder.id,
        folderUrl: `https://drive.google.com/drive/folders/${mainFolder.id}`,
        structure: {
          mp3Wav: mp3WavFolder.id,
          pressRelease: pressReleaseFolder.id,
          promoPhotos: promoPhotosFolder.id,
          artwork: artworkFolder.id,
        },
      };
    } catch (error) {
      console.error('Error creating campaign folder:', error);
      throw error;
    }
  }

  async createFolder(name, parentId) {
    const response = await this.drive.files.create({
      requestBody: {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
    });
    return response.data;
  }

  async processTypeformAssets(typeformData, folderIds) {
    // Extract file URLs from TypeForm submission
    const assets = this.extractAssetsFromTypeform(typeformData);

    // Download and upload audio files
    if (assets.audioFiles) {
      for (const audioFile of assets.audioFiles) {
        await this.downloadAndUpload(audioFile.url, audioFile.filename, folderIds.mp3Wav);
      }
    }

    // Download and upload press materials
    if (assets.pressRelease) {
      await this.downloadAndUpload(
        assets.pressRelease.url,
        'press-release.pdf',
        folderIds.pressRelease
      );
    }

    // Download and upload photos
    if (assets.promoPhotos) {
      for (const photo of assets.promoPhotos) {
        await this.downloadAndUpload(photo.url, photo.filename, folderIds.promoPhotos);
      }
    }

    // Download and upload artwork
    if (assets.artwork) {
      for (const artwork of assets.artwork) {
        await this.downloadAndUpload(artwork.url, artwork.filename, folderIds.artwork);
      }
    }

    // Create download links document for Mailchimp
    await this.createDownloadLinksDoc(folderIds, typeformData.soundcloudUrl);
  }

  extractAssetsFromTypeform(typeformData) {
    return {
      audioFiles:
        typeformData.answers.find(
          a => a.field.type === 'file_upload' && a.field.title.toLowerCase().includes('audio')
        )?.file_urls || [],
      pressRelease: typeformData.answers.find(
        a => a.field.type === 'file_upload' && a.field.title.toLowerCase().includes('press')
      )?.file_url,
      promoPhotos:
        typeformData.answers.find(
          a => a.field.type === 'file_upload' && a.field.title.toLowerCase().includes('photo')
        )?.file_urls || [],
      artwork:
        typeformData.answers.find(
          a => a.field.type === 'file_upload' && a.field.title.toLowerCase().includes('artwork')
        )?.file_urls || [],
      soundcloudUrl: typeformData.answers.find(a =>
        a.field.title.toLowerCase().includes('soundcloud')
      )?.url,
    };
  }

  async downloadAndUpload(fileUrl, filename, folderId) {
    try {
      // Download file from TypeForm URL
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();

      // Upload to Google Drive
      const driveResponse = await this.drive.files.create({
        requestBody: {
          name: filename,
          parents: [folderId],
        },
        media: {
          mimeType: response.headers.get('content-type'),
          body: buffer,
        },
      });

      // Make file publicly accessible for radio stations
      await this.drive.permissions.create({
        fileId: driveResponse.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return driveResponse.data;
    } catch (error) {
      console.error(`Error uploading ${filename}:`, error);
    }
  }

  async createDownloadLinksDoc(folderIds, soundcloudUrl) {
    // Create a document with all download links for Mailchimp template
    const linksDoc = {
      mp3WavDownload: `https://drive.google.com/drive/folders/${folderIds.mp3Wav}`,
      pressReleaseDownload: `https://drive.google.com/drive/folders/${folderIds.pressRelease}`,
      promoPhotosDownload: `https://drive.google.com/drive/folders/${folderIds.promoPhotos}`,
      artworkDownload: `https://drive.google.com/drive/folders/${folderIds.artwork}`,
      soundcloudListen: soundcloudUrl,
    };

    return linksDoc;
  }
}

module.exports = DriveAssetManager;
