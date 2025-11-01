#!/usr/bin/env node
/**
 * Liberty Drive Sync - Color-coded folder structure matching Gmail
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyDriveSync {
  constructor() {
    // Use existing OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    // Load existing tokens
    const tokenPath = path.join(__dirname, '../radio-promo/gmail-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(tokens);
      console.log('✅ OAuth tokens loaded');
    } else {
      throw new Error('❌ Gmail tokens not found');
    }

    // Folder structure with colors matching Gmail
    // Google Drive colors: https://developers.google.com/drive/api/guides/folder
    this.folders = [
      {
        name: 'Liberty Music PR',
        color: null,
        subfolders: [
          { name: 'Active Campaigns', color: '#42d692' }, // Green
          { name: 'Station Feedback & Assets', color: '#ffc8af' }, // Orange
          { name: 'Needs Action', color: '#a0c3ff' }, // Blue
          { name: 'Completed', color: '#fdedc1' }, // Yellow
          { name: 'Archive', color: '#f7c0bb' }, // Red
          { name: 'Internal Team', color: '#c9daf8' }, // Light blue
        ],
      },
      {
        name: 'Personal Tools',
        color: '#b694e8', // Purple
        subfolders: [
          { name: 'Otter AI Transcripts', color: null },
          { name: 'Gemini Transcripts', color: null },
        ],
      },
      {
        name: 'Marketing Archive',
        color: '#e2e2e2', // Grey
        subfolders: [],
      },
    ];
  }

  /**
   * Find folder by name
   */
  async findFolder(name, parentId = null) {
    try {
      let query = `mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`;
      if (parentId) {
        query += ` and '${parentId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name)',
        spaces: 'drive',
      });

      return response.data.files && response.data.files.length > 0 ? response.data.files[0] : null;
    } catch (error) {
      console.error(`Failed to find folder "${name}":`, error.message);
      return null;
    }
  }

  /**
   * Create folder with color
   */
  async createFolder(name, parentId = null, color = null) {
    try {
      const metadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentId) {
        metadata.parents = [parentId];
      }

      if (color) {
        metadata.folderColorRgb = color;
      }

      const response = await this.drive.files.create({
        requestBody: metadata,
        fields: 'id, name, folderColorRgb',
      });

      console.log(`✅ Created folder: ${name}${color ? ` (${color})` : ''}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to create folder "${name}":`, error.message);
      return null;
    }
  }

  /**
   * Update folder color
   */
  async updateFolderColor(folderId, color) {
    try {
      await this.drive.files.update({
        fileId: folderId,
        requestBody: {
          folderColorRgb: color,
        },
      });

      console.log(`✅ Updated folder color: ${color}`);
      return true;
    } catch (error) {
      console.error(`Failed to update folder color:`, error.message);
      return false;
    }
  }

  /**
   * Setup all folders
   */
  async setup() {
    console.log('📁 Setting up Liberty Drive structure...\n');

    try {
      for (const folderConfig of this.folders) {
        // Create or find parent folder
        let parentFolder = await this.findFolder(folderConfig.name);

        if (!parentFolder) {
          parentFolder = await this.createFolder(folderConfig.name, null, folderConfig.color);
          if (!parentFolder) continue;
        } else {
          console.log(`ℹ️  Found existing folder: ${folderConfig.name}`);

          // Update color if specified
          if (folderConfig.color) {
            await this.updateFolderColor(parentFolder.id, folderConfig.color);
          }
        }

        // Create subfolders
        if (folderConfig.subfolders && folderConfig.subfolders.length > 0) {
          for (const subfolder of folderConfig.subfolders) {
            let existingSubfolder = await this.findFolder(subfolder.name, parentFolder.id);

            if (!existingSubfolder) {
              await this.createFolder(subfolder.name, parentFolder.id, subfolder.color);
            } else {
              console.log(`ℹ️  Found existing subfolder: ${subfolder.name}`);

              // Update color if specified
              if (subfolder.color) {
                await this.updateFolderColor(existingSubfolder.id, subfolder.color);
              }
            }
          }
        }

        console.log('');
      }

      console.log('🎉 Drive structure complete!');
      console.log('\n📁 Folder structure:');
      console.log('  🟢 Liberty Music PR/Active Campaigns');
      console.log('  🟠 Liberty Music PR/Station Feedback & Assets');
      console.log('  🔵 Liberty Music PR/Needs Action');
      console.log('  🟡 Liberty Music PR/Completed');
      console.log('  🔴 Liberty Music PR/Archive');
      console.log('  🟣 Personal Tools');
      console.log('  ⚫ Marketing Archive');
      console.log('\n💡 Colors match your Gmail label system!');
    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  /**
   * List current folder structure
   */
  async list() {
    console.log('📋 Current Drive structure:\n');

    try {
      for (const folderConfig of this.folders) {
        const folder = await this.findFolder(folderConfig.name);

        if (folder) {
          console.log(`📁 ${folderConfig.name} (${folder.id})`);

          // List subfolders
          if (folderConfig.subfolders) {
            for (const subfolder of folderConfig.subfolders) {
              const sub = await this.findFolder(subfolder.name, folder.id);
              if (sub) {
                console.log(`  └── ${subfolder.name} (${sub.id})`);
              } else {
                console.log(`  └── ${subfolder.name} [MISSING]`);
              }
            }
          }
        } else {
          console.log(`📁 ${folderConfig.name} [NOT FOUND]`);
        }

        console.log('');
      }
    } catch (error) {
      console.error('❌ Failed to list folders:', error);
    }
  }

  /**
   * Test Drive access
   */
  async test() {
    console.log('🧪 Testing Drive access...');

    try {
      const response = await this.drive.files.list({
        pageSize: 1,
        fields: 'files(id, name)',
      });

      console.log('✅ Drive access OK');
      return true;
    } catch (error) {
      console.error('❌ Drive access failed:', error.message);
      return false;
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const sync = new LibertyDriveSync();

  try {
    switch (command) {
      case 'setup':
        await sync.setup();
        break;

      case 'list':
        await sync.list();
        break;

      case 'test':
        await sync.test();
        break;

      default:
        console.log('📁 Liberty Drive Sync');
        console.log('');
        console.log('Commands:');
        console.log('  setup - Create folder structure with colors');
        console.log('  list  - Show current folder structure');
        console.log('  test  - Test Drive access');
        console.log('');
        console.log('Example: node liberty-drive-sync.js setup');
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = LibertyDriveSync;
