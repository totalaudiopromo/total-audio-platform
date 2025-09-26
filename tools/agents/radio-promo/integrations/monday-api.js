#!/usr/bin/env node

/**
 * Monday.com API Integration for Liberty Music PR
 * 
 * CRITICAL: Only operates on https://liberty-music.monday.com/boards/2443582331
 * This is a shared workspace - extreme caution required
 */

const fetch = require('node-fetch');

class MondayApiIntegration {
  constructor() {
    this.apiKey = process.env.MONDAY_API_KEY;
    this.baseUrl = 'https://api.monday.com/v2';
    this.protectedBoardId = '2443582331'; // Liberty Music PR board
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;
    
    // Google Drive integration (will be set by agent)
    this.driveAPI = null;
    this.campaignsFolderId = process.env.LIBERTY_CAMPAIGNS_FOLDER_ID || 'YOUR_CAMPAIGNS_FOLDER_ID';
    
    if (!this.apiKey) {
      throw new Error('MONDAY_API_KEY environment variable is required');
    }
  }

  /**
   * Rate-limited API call to Monday.com
   */
  async callMondayAPI(query, variables = {}) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      this.lastApiCall = Date.now();
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'API-Version': '2023-10'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`Monday.com API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`Monday.com API errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data;
    } catch (error) {
      console.error('Monday.com API call failed:', error);
      throw error;
    }
  }

  /**
   * Create new campaign item in Liberty board
   * CRITICAL: Only works on the protected Liberty board
   */
  async createCampaignItem(campaignData) {
    const query = `
      mutation createItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item(
          board_id: $boardId,
          item_name: $itemName,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `;

    // Use actual column IDs from the board structure
    const variables = {
      boardId: this.protectedBoardId, // CRITICAL: Only Liberty board
      itemName: `${campaignData.artistName} - ${campaignData.trackName}`,
      columnValues: JSON.stringify({
        // Map to actual column IDs from the board
        status8: { label: "Liberty" }, // Source column - set to Liberty
        date4: { date: campaignData.releaseDate }, // Release Date column
        status: { label: "Working on it" }, // Status column
        link: campaignData.reportLink || "" // Report Link column
      })
    };

    try {
      const result = await this.callMondayAPI(query, variables);
      console.log(`✅ Campaign created in Liberty board: ${result.create_item.id}`);
      return result.create_item;
    } catch (error) {
      console.error('Failed to create campaign item:', error);
      throw error;
    }
  }

  /**
   * Create or find a group for a campaign
   */
  async createOrFindCampaignGroup(campaignTitle) {
    try {
      // First, try to find existing group
      const boardStructure = await this.getLibertyBoardStructure();
      const existingGroup = boardStructure.groups.find(group => 
        group.title.toLowerCase().includes(campaignTitle.toLowerCase()) ||
        campaignTitle.toLowerCase().includes(group.title.toLowerCase())
      );
      
      if (existingGroup) {
        console.log(`✅ Found existing group: ${existingGroup.title}`);
        return existingGroup.id;
      }
      
      // Create new group if not found
      const createGroupQuery = `
        mutation createGroup($boardId: ID!, $groupName: String!) {
          create_group(
            board_id: $boardId,
            group_name: $groupName
          ) {
            id
            title
          }
        }
      `;
      
      const result = await this.callMondayAPI(createGroupQuery, {
        boardId: this.protectedBoardId,
        groupName: campaignTitle
      });
      
      console.log(`✅ Created new group: ${result.create_group.title}`);
      return result.create_group.id;
      
    } catch (error) {
      console.error('Failed to create/find campaign group:', error);
      // Return null to use default group
      return null;
    }
  }

  /**
   * Get board structure for Liberty board
   */
  async getLibertyBoardStructure() {
    const query = `
      query getBoard($boardId: ID!) {
        boards(ids: [$boardId]) {
          id
          name
          columns {
            id
            title
            type
            settings_str
          }
          groups {
            id
            title
            color
          }
        }
      }
    `;

    const variables = {
      boardId: this.protectedBoardId
    };

    try {
      const result = await this.callMondayAPI(query, variables);
      return result.boards[0];
    } catch (error) {
      console.error('Failed to get Liberty board structure:', error);
      throw error;
    }
  }

  /**
   * Update campaign progress
   */
  async updateCampaignProgress(itemId, updates) {
    const query = `
      mutation changeColumnValue($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(
          board_id: $boardId,
          item_id: $itemId,
          column_id: $columnId,
          value: $value
        ) {
          id
        }
      }
    `;

    try {
      for (const [columnId, value] of Object.entries(updates)) {
        const variables = {
          boardId: this.protectedBoardId,
          itemId: itemId,
          columnId: columnId,
          value: JSON.stringify(value)
        };

        await this.callMondayAPI(query, variables);
        console.log(`✅ Updated column ${columnId} for item ${itemId}`);
      }
    } catch (error) {
      console.error('Failed to update campaign progress:', error);
      throw error;
    }
  }

  /**
   * Add subitem for campaign tasks
   */
  async addCampaignTask(parentItemId, taskData) {
    const query = `
      mutation createSubitem($parentItemId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_subitem(
          parent_item_id: $parentItemId,
          item_name: $itemName,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `;

    // Map status to valid indices for the subitem's Status column
    const statusIndex = (() => {
      const normalized = (taskData.status || '').toLowerCase();
      if (normalized.includes('done')) return 1;
      if (normalized.includes('stuck')) return 2;
      return 0; // Default to "Working on it"
    })();

    const variables = {
      parentItemId: parentItemId,
      itemName: taskData.name,
      columnValues: JSON.stringify({
        status: { index: statusIndex },
        date: taskData.deadline,
        text: taskData.description || ""
      })
    };

    try {
      const result = await this.callMondayAPI(query, variables);
      console.log(`✅ Task added: ${result.create_subitem.name}`);
      return result.create_subitem;
    } catch (error) {
      console.error('Failed to add campaign task:', error);
      throw error;
    }
  }

  /**
   * Get campaign items from Liberty board with group information
   */
  async getCampaignItems() {
    const query = `
      query getBoardItems($boardId: ID!) {
        boards(ids: [$boardId]) {
          groups {
            id
            title
            items_page {
              items {
                id
                name
                column_values {
                  id
                  text
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      boardId: this.protectedBoardId
    };

    try {
      const result = await this.callMondayAPI(query, variables);
      const groups = result.boards[0].groups;
      
      // Flatten all items from all groups and add group info
      const allItems = [];
      groups.forEach(group => {
        group.items_page.items.forEach(item => {
          allItems.push({
            ...item,
            groupId: group.id,
            groupTitle: group.title
          });
        });
      });
      
      return allItems;
    } catch (error) {
      console.error('Failed to get campaign items:', error);
      throw error;
    }
  }

  /**
   * Enhanced Liberty campaign creation with Google Drive integration
   */
  async createLibertyCampaign(campaignData, warmAPI) {
    const campaignTitle = `${campaignData.artistName} - ${campaignData.trackName}`;
    
    // Calculate timeline dates
    const releaseDate = new Date(campaignData.releaseDate);
    const campaignStartDate = new Date(releaseDate);
    campaignStartDate.setDate(releaseDate.getDate() - (campaignData.campaignType === '6-week' ? 42 : 28));
    
    // Create Monday.com item with timeline and proper group
    const query = `
      mutation createItem($boardId: ID!, $itemName: String!, $columnValues: JSON!, $groupId: String) {
        create_item(
          board_id: $boardId,
          item_name: $itemName,
          column_values: $columnValues,
          group_id: $groupId
        ) {
          id
          name
        }
      }
    `;

    // Create or find the group for this campaign
    const groupId = await this.createOrFindCampaignGroup(campaignTitle);
    
    const variables = {
      boardId: this.protectedBoardId,
      itemName: campaignTitle,
      groupId: groupId, // Add the group ID
      columnValues: JSON.stringify({
        status: { label: "Working on it" }, // Status column - "Working on it"
        timeline: {
          from: campaignStartDate.toISOString().split('T')[0],
          to: releaseDate.toISOString().split('T')[0]
        },
        status8: { label: "Liberty" }, // Source column - set to Liberty
        date4: { date: campaignData.releaseDate }, // Release Date column
        link: "" // Report Link column - will be updated later
      })
    };

    try {
      const result = await this.callMondayAPI(query, variables);
      const itemId = result.create_item.id;
      
      console.log(`✅ Liberty campaign created: ${campaignTitle} (ID: ${itemId})`);
      
      // Create Google Drive folder and get link
      let driveFolder = null;
      if (this.driveAPI) {
        driveFolder = await this.createCampaignDriveFolder(campaignData);
        
        // Add file column with Drive folder link
        await this.updateCampaignProgress(itemId, {
          files: {
            url: driveFolder.url,
            text: "Campaign Assets Folder"
          }
        });
      }
      
      return {
        id: itemId,
        driveFolder: driveFolder,
        campaignTitle: campaignTitle,
        startDate: campaignStartDate,
        releaseDate: releaseDate
      };
    } catch (error) {
      console.error('Failed to create Liberty campaign:', error);
      throw error;
    }
  }

  /**
   * Create Google Drive folder structure for campaign
   */
  async createCampaignDriveFolder(campaignData) {
    if (!this.driveAPI) {
      console.warn('⚠️ Google Drive API not available - skipping folder creation');
      return null;
    }

    const folderName = `${campaignData.artistName} - ${campaignData.trackName}`;
    
    try {
      // Create main campaign folder
      const mainFolder = await this.driveAPI.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [this.campaignsFolderId]
        }
      });

      // Create Weekly Reports subfolder
      const reportsFolder = await this.driveAPI.files.create({
        requestBody: {
          name: 'Weekly WARM Reports',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [mainFolder.data.id]
        }
      });

      // Set sharing permissions
      await this.driveAPI.permissions.create({
        fileId: mainFolder.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      console.log(`✅ Google Drive folders created for ${folderName}`);
      
      return {
        id: mainFolder.data.id,
        url: `https://drive.google.com/drive/folders/${mainFolder.data.id}`,
        reportsFolder: reportsFolder.data.id
      };
    } catch (error) {
      console.error('Failed to create Google Drive folders:', error);
      throw error;
    }
  }

  /**
   * Update campaign with WARM API play data
   */
  async updateCampaignWithWarmData(campaignId, warmData, driveReportUrl = null) {
    const playCount = warmData.totalNumberOfEntities || warmData.totalPlays || 0;
    const stations = warmData.currentPagesEntities?.map(play => play.radioStationName) || 
                   warmData.plays?.map(play => play.radioStation || play.station) || [];
    const uniqueStations = [...new Set(stations.filter(s => s))];

    // Use the link column to store play data since we don't have a dedicated play count column
    let updates = {
      link: {
        url: `https://warmmusic.net/reports?plays=${playCount}&stations=${uniqueStations.length}`,
        text: `${playCount} plays across ${uniqueStations.length} stations`
      }
    };
    
    // If we have a weekly report, add it to files column
    if (driveReportUrl) {
      updates.files = {
        url: driveReportUrl,
        text: "Weekly WARM Report"
      };
    }

    try {
      await this.updateCampaignProgress(campaignId, updates);

      // Update status to "Working on it" when we detect plays
      if (playCount > 0) {
        await this.updateCampaignProgress(campaignId, {
          status: { index: 1 } // "Working on it"
        });
      }

      console.log(`✅ Updated campaign ${campaignId}: ${playCount} plays, ${uniqueStations.length} stations`);
      
      return {
        campaignId,
        playCount,
        stationCount: uniqueStations.length,
        stations: uniqueStations,
        statusUpdated: playCount > 0
      };
    } catch (error) {
      console.error('Failed to update campaign with WARM data:', error);
      throw error;
    }
  }

  /**
   * Set Google Drive API reference
   */
  setDriveAPI(driveAPI) {
    this.driveAPI = driveAPI;
    console.log('✅ Google Drive API connected to Monday.com integration');
  }

  /**
   * Validate board access (safety check)
   */
  async validateBoardAccess() {
    try {
      const board = await this.getLibertyBoardStructure();
      if (board.id !== this.protectedBoardId) {
        throw new Error('CRITICAL ERROR: Board ID mismatch - access denied');
      }
      console.log(`✅ Access validated for Liberty board: ${board.name}`);
      return true;
    } catch (error) {
      console.error('Board access validation failed:', error);
      throw error;
    }
  }
}

module.exports = MondayApiIntegration;

