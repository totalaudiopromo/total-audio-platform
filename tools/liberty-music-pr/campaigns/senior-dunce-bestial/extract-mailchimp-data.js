#!/usr/bin/env node

/**
 * Extract Senior Dunce Campaign Data from Mailchimp
 * Gets everything we need for direct email outreach
 */

const https = require('https');

class MailchimpExtractor {
  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY; // b0f629921e6d1f85c4549c63dee5b9b2-us13
    this.datacenter = 'us13';
    this.baseUrl = `https://${this.datacenter}.api.mailchimp.com/3.0`;
  }

  async makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const auth = Buffer.from(`anystring:${this.apiKey}`).toString('base64');
      
      const options = {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      };
      
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      }).on('error', reject);
    });
  }

  async getCampaigns() {
    console.log('📧 Fetching ALL Mailchimp campaigns...');
    try {
      let allCampaigns = [];
      let offset = 0;
      const count = 100;
      
      while (true) {
        const response = await this.makeRequest(`/campaigns?count=${count}&offset=${offset}&sort_field=send_time&sort_dir=DESC`);
        const campaigns = response.campaigns || [];
        
        if (campaigns.length === 0) break;
        
        allCampaigns = allCampaigns.concat(campaigns);
        offset += count;
        
        console.log(`   Fetched ${campaigns.length} campaigns (total: ${allCampaigns.length})`);
        
        // Break if we got fewer than requested (end of data)
        if (campaigns.length < count) break;
      }
      
      console.log(`✅ Total campaigns fetched: ${allCampaigns.length}`);
      return allCampaigns;
    } catch (error) {
      console.error('❌ Error fetching campaigns:', error.message);
      return [];
    }
  }

  async getCampaignContent(campaignId) {
    console.log(`📄 Fetching content for campaign ${campaignId}...`);
    try {
      const response = await this.makeRequest(`/campaigns/${campaignId}/content`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching campaign content:`, error.message);
      return null;
    }
  }

  async getCampaignRecipients(campaignId) {
    console.log(`👥 Fetching recipients for campaign ${campaignId}...`);
    try {
      const response = await this.makeRequest(`/campaigns/${campaignId}/feedback`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching recipients:`, error.message);
      return null;
    }
  }

  async findSeniorDunceCampaign() {
    const campaigns = await this.getCampaigns();
    
    // Look for Senior Dunce campaigns
    const seniorDunceCampaigns = campaigns.filter(campaign => 
      campaign.settings && 
      campaign.settings.subject_line && 
      campaign.settings.subject_line.toLowerCase().includes('senior dunce')
    );
    
    if (seniorDunceCampaigns.length > 0) {
      console.log(`✅ Found ${seniorDunceCampaigns.length} Senior Dunce campaign(s)`);
      return seniorDunceCampaigns[0]; // Get the most recent
    }
    
    // If no exact match, look for recent campaigns
    console.log('🔍 No exact Senior Dunce campaign found, checking recent campaigns...');
    const recentCampaigns = campaigns.slice(0, 5);
    
    console.log('\n📋 Recent campaigns:');
    recentCampaigns.forEach((campaign, i) => {
      console.log(`   ${i+1}. ${campaign.settings.subject_line} (${campaign.send_time})`);
      console.log(`      ID: ${campaign.id}`);
      console.log(`      Status: ${campaign.status}`);
      console.log(`      Recipients: ${campaign.emails_sent}`);
      console.log('');
    });
    
    return recentCampaigns[0]; // Return most recent for now
  }

  async extractAllCampaignData() {
    console.log('🎵 Extracting ALL Mailchimp campaign data...\n');
    
    const campaigns = await this.getCampaigns();
    if (campaigns.length === 0) {
      console.log('❌ No campaigns found');
      return null;
    }
    
    console.log(`📊 Found ${campaigns.length} total campaigns\n`);
    
    const allCampaignData = [];
    let processed = 0;
    
    for (const campaign of campaigns) {
      console.log(`📧 Processing: ${campaign.settings.subject_line}`);
      console.log(`   📅 Sent: ${campaign.send_time}`);
      console.log(`   👥 Recipients: ${campaign.emails_sent}`);
      console.log(`   📊 Opens: ${campaign.report_summary?.unique_opens || 0}%`);
      console.log(`   🖱️ Clicks: ${campaign.report_summary?.unique_clicks || 0}%`);
      
      // Get campaign content
      const content = await this.getCampaignContent(campaign.id);
      
      const campaignData = {
        id: campaign.id,
        subject: campaign.settings.subject_line,
        sentDate: campaign.send_time,
        status: campaign.status,
        recipients: campaign.emails_sent,
        openRate: campaign.report_summary?.unique_opens || 0,
        clickRate: campaign.report_summary?.unique_clicks || 0,
        htmlContent: content?.html || '',
        plainTextContent: content?.plain_text || '',
        settings: campaign.settings,
        reportSummary: campaign.report_summary
      };
      
      allCampaignData.push(campaignData);
      processed++;
      
      console.log(`   ✅ Processed (${processed}/${campaigns.length})\n`);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return allCampaignData;
  }

  async runExtraction() {
    try {
      const allData = await this.extractAllCampaignData();
      
      if (allData && allData.length > 0) {
        console.log('\n✅ ALL CAMPAIGN DATA EXTRACTED:');
        console.log(`📊 Total campaigns: ${allData.length}`);
        
        // Calculate totals
        const totalRecipients = allData.reduce((sum, campaign) => sum + campaign.recipients, 0);
        const avgOpenRate = allData.reduce((sum, campaign) => sum + campaign.openRate, 0) / allData.length;
        const avgClickRate = allData.reduce((sum, campaign) => sum + campaign.clickRate, 0) / allData.length;
        
        console.log(`👥 Total recipients: ${totalRecipients}`);
        console.log(`📊 Average open rate: ${avgOpenRate.toFixed(1)}%`);
        console.log(`🖱️ Average click rate: ${avgClickRate.toFixed(1)}%`);
        
        // Show Senior Dunce campaigns specifically
        const seniorDunceCampaigns = allData.filter(campaign => 
          campaign.subject.toLowerCase().includes('senior dunce') || 
          campaign.subject.toLowerCase().includes('senor dunce')
        );
        
        if (seniorDunceCampaigns.length > 0) {
          console.log(`\n🎵 SENIOR DUNCE CAMPAIGNS: ${seniorDunceCampaigns.length}`);
          seniorDunceCampaigns.forEach((campaign, i) => {
            console.log(`   ${i+1}. ${campaign.subject}`);
            console.log(`      📅 ${campaign.sentDate}`);
            console.log(`      👥 ${campaign.recipients} recipients`);
            console.log(`      📊 ${campaign.openRate}% opens, ${campaign.clickRate}% clicks`);
          });
        }
        
        // Save all data
        const fs = require('fs');
        const path = require('path');
        
        const outputPath = path.join(__dirname, 'all-mailchimp-campaigns.json');
        fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
        
        console.log(`\n💾 ALL data saved to: ${outputPath}`);
        console.log('\n🎯 Complete Mailchimp data ready for analysis!');
      }
      
      return allData;
    } catch (error) {
      console.error('❌ Extraction failed:', error.message);
      return null;
    }
  }
}

// Run extraction
async function extractMailchimpData() {
  const extractor = new MailchimpExtractor();
  return await extractor.runExtraction();
}

if (require.main === module) {
  extractMailchimpData().catch(console.error);
}

module.exports = { MailchimpExtractor, extractMailchimpData };
