const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[DRIVE] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[DRIVE] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[DRIVE] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [DRIVE] ${msg}`, ...args)
};

/**
 * Google Drive API Integration for Liberty Music PR
 *
 * Uses Google OAuth2 to access Google Drive
 * Searches for campaign folders and transcript files
 */
class GoogleDriveApiIntegration {
  constructor() {
    // Your Liberty Music PR OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;

    // Check for OAuth tokens
    const tokenPath = path.join(__dirname, '../gmail-token.json'); // Using same token as Gmail
    this.hasValidTokens = fs.existsSync(tokenPath);

    // Initialize authentication
    if (this.hasValidTokens) {
      try {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        this.oauth2Client.setCredentials(tokens);
        logger.success('OAuth tokens loaded successfully');
      } catch (error) {
        logger.warn('Failed to load OAuth tokens');
        this.hasValidTokens = false;
      }
    } else {
      logger.warn('No OAuth tokens found - activating Drive Demo Mode');
      logger.info('Run: node radio-promo-agent.js setup-gmail-auth');
      logger.info('🎭 Drive Demo Mode Activated - No OAuth required');
    }
  }

  /**
   * Rate-limited API call to Google Drive
   */
  async callDriveAPI(method, ...args) {
    if (!this.hasValidTokens) {
      throw new Error('Drive API requires OAuth tokens. Run setup-gmail-auth first.');
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      this.lastApiCall = Date.now();
      return await method.apply(this.drive, args);
    } catch (error) {
      console.error('Drive API call failed:', error);
      throw error;
    }
  }

  /**
   * Search for files in Google Drive
   */
  async searchFiles(query, maxResults = 100) {
    try {
      logger.info(`Searching Drive for: "${query}"`);
      
      const response = await this.callDriveAPI(
        this.drive.files.list,
        {
          q: query,
          pageSize: maxResults,
          fields: 'files(id,name,mimeType,parents,createdTime,modifiedTime)',
          orderBy: 'modifiedTime desc'
        }
      );

      const files = response.data.files || [];
      logger.info(`Found ${files.length} files matching query`);
      return files;
    } catch (error) {
      logger.error('Drive search failed:', error.message);
      throw error;
    }
  }

  /**
   * Get file content
   */
  async getFileContent(fileId) {
    try {
      logger.info(`Getting content for file: ${fileId}`);
      
      const response = await this.callDriveAPI(
        this.drive.files.get,
        {
          fileId: fileId,
          alt: 'media'
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get file content:', error.message);
      throw error;
    }
  }

  /**
   * Create a folder
   */
  async createFolder(name, parentId = null) {
    try {
      logger.info(`Creating folder: ${name}`);
      
      const folderMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentId) {
        folderMetadata.parents = [parentId];
      }

      const response = await this.callDriveAPI(
        this.drive.files.create,
        {
          resource: folderMetadata,
          fields: 'id,name'
        }
      );

      logger.success(`Created folder: ${response.data.name} (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      logger.error('Failed to create folder:', error.message);
      throw error;
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(fileName, fileContent, mimeType = 'text/plain', parentId = null) {
    try {
      logger.info(`Uploading file: ${fileName}`);
      
      const fileMetadata = {
        name: fileName
      };

      if (parentId) {
        fileMetadata.parents = [parentId];
      }

      const media = {
        mimeType: mimeType,
        body: fileContent
      };

      const response = await this.callDriveAPI(
        this.drive.files.create,
        {
          resource: fileMetadata,
          media: media,
          fields: 'id,name'
        }
      );

      logger.success(`Uploaded file: ${response.data.name} (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      logger.error('Failed to upload file:', error.message);
      throw error;
    }
  }

  /**
   * Search for campaign folders
   */
  async searchCampaignFolders(artistName, trackName) {
    try {
      const queries = [
        `name contains "${artistName}" and mimeType="application/vnd.google-apps.folder"`,
        `name contains "${artistName} ${trackName}" and mimeType="application/vnd.google-apps.folder"`,
        `name contains "${artistName} ${trackName.toLowerCase()}" and mimeType="application/vnd.google-apps.folder"`
      ];

      const allFolders = [];
      
      for (const query of queries) {
        try {
          const folders = await this.searchFiles(query);
          allFolders.push(...folders);
        } catch (error) {
          logger.warn(`Search query failed: ${query}`);
        }
      }

      // Remove duplicates
      const uniqueFolders = allFolders.filter((folder, index, self) => 
        index === self.findIndex(f => f.id === folder.id)
      );

      logger.info(`Found ${uniqueFolders.length} campaign folders for ${artistName}`);
      return uniqueFolders;
    } catch (error) {
      logger.error('Failed to search campaign folders:', error.message);
      throw error;
    }
  }

  /**
   * Search for transcript files in a folder
   */
  async searchTranscriptFiles(folderId) {
    try {
      const queries = [
        `parents in "${folderId}" and (name contains "transcript" or name contains "meeting" or name contains ".txt")`,
        `parents in "${folderId}" and mimeType contains "text"`
      ];

      const allFiles = [];
      
      for (const query of queries) {
        try {
          const files = await this.searchFiles(query);
          allFiles.push(...files);
        } catch (error) {
          logger.warn(`Search query failed: ${query}`);
        }
      }

      // Remove duplicates
      const uniqueFiles = allFiles.filter((file, index, self) => 
        index === self.findIndex(f => f.id === file.id)
      );

      logger.info(`Found ${uniqueFiles.length} transcript files in folder ${folderId}`);
      return uniqueFiles;
    } catch (error) {
      logger.error('Failed to search transcript files:', error.message);
      throw error;
    }
  }
}

module.exports = GoogleDriveApiIntegration;


