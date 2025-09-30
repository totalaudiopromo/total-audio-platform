#!/usr/bin/env node

/**
 * Liberty Training Data Processor
 *
 * Processes Liberty Google Chat Takeout data to train the agent on:
 * - Campaign workflows
 * - Station communication patterns
 * - Client management processes
 * - Team coordination
 */

const fs = require('fs').promises;
const path = require('path');

const LIBERTY_TAKEOUT_PATH = '/Users/chrisschofield/workspace/active/liberty-music-pr/Liberty_Training_Data/Takeout/Google Chat';

class LibertyTrainingProcessor {
  constructor() {
    this.trainingData = {
      spaces: [],
      messages: [],
      patterns: {
        campaignWorkflows: [],
        stationCommunications: [],
        clientInteractions: [],
        teamProcesses: []
      },
      metadata: {
        processedAt: new Date().toISOString(),
        totalMessages: 0,
        totalSpaces: 0,
        dateRange: { earliest: null, latest: null }
      }
    };
  }

  async processLibertyTakeout() {
    console.log('📁 Processing Liberty Google Chat Takeout data...');

    try {
      // Check if Takeout path exists
      await fs.access(LIBERTY_TAKEOUT_PATH);

      // Find all Group spaces
      const groupsPath = path.join(LIBERTY_TAKEOUT_PATH, 'Groups');
      const spaces = await fs.readdir(groupsPath);

      console.log(`📊 Found ${spaces.length} Liberty Chat spaces`);

      for (const space of spaces) {
        if (space.startsWith('Space ')) {
          await this.processSpace(path.join(groupsPath, space), space);
        }
      }

      // Generate training insights
      this.generateInsights();

      // Save processed training data
      await this.saveTrainingData();

      console.log('\n✅ Liberty training data processed successfully!');
      console.log(`📊 Total Messages: ${this.trainingData.metadata.totalMessages}`);
      console.log(`📊 Total Spaces: ${this.trainingData.metadata.totalSpaces}`);

      return this.trainingData;

    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error('❌ Liberty Takeout data not found at:', LIBERTY_TAKEOUT_PATH);
        console.error('💡 Export Google Chat data from Liberty workspace first');
      } else {
        console.error('❌ Error processing Liberty training data:', error);
      }
      throw error;
    }
  }

  async processSpace(spacePath, spaceId) {
    try {
      const files = await fs.readdir(spacePath);

      // Look for messages.json
      const messagesFile = files.find(f => f.toLowerCase().includes('messages') && f.endsWith('.json'));

      if (messagesFile) {
        const messagesPath = path.join(spacePath, messagesFile);
        const messagesData = await fs.readFile(messagesPath, 'utf-8');
        const parsedData = JSON.parse(messagesData);

        // Handle {"messages": [...]} format from Takeout
        const messages = parsedData.messages || parsedData;

        const spaceData = {
          id: spaceId,
          path: spacePath,
          messageCount: messages.length,
          messages: messages
        };

        this.trainingData.spaces.push(spaceData);
        this.trainingData.messages.push(...messages);
        this.trainingData.metadata.totalSpaces++;
        this.trainingData.metadata.totalMessages += messages.length;

        // Extract patterns from messages
        this.extractPatterns(messages, spaceId);

        console.log(`  ✓ Processed ${spaceId}: ${messages.length} messages`);
      }

    } catch (error) {
      console.error(`  ⚠️ Error processing ${spaceId}:`, error.message);
    }
  }

  extractPatterns(messages, spaceId) {
    // Detect campaign-related messages
    const campaignKeywords = ['campaign', 'release', 'track', 'artist', 'promotion', 'pitch'];
    const stationKeywords = ['station', 'radio', 'bbc', 'play', 'playlist', 'airplay'];
    const clientKeywords = ['client', 'artist meeting', 'feedback', 'approval', 'budget'];
    const teamKeywords = ['meeting', 'deadline', 'update', 'status', 'action item'];

    for (const msg of messages) {
      const text = (msg.text || '').toLowerCase();
      const creator = msg.creator?.name || 'Unknown';
      const timestamp = msg.created_date;

      // Campaign workflows
      if (campaignKeywords.some(kw => text.includes(kw))) {
        this.trainingData.patterns.campaignWorkflows.push({
          space: spaceId,
          creator,
          timestamp,
          snippet: text.substring(0, 200),
          type: 'campaign'
        });
      }

      // Station communications
      if (stationKeywords.some(kw => text.includes(kw))) {
        this.trainingData.patterns.stationCommunications.push({
          space: spaceId,
          creator,
          timestamp,
          snippet: text.substring(0, 200),
          type: 'station'
        });
      }

      // Client interactions
      if (clientKeywords.some(kw => text.includes(kw))) {
        this.trainingData.patterns.clientInteractions.push({
          space: spaceId,
          creator,
          timestamp,
          snippet: text.substring(0, 200),
          type: 'client'
        });
      }

      // Team processes
      if (teamKeywords.some(kw => text.includes(kw))) {
        this.trainingData.patterns.teamProcesses.push({
          space: spaceId,
          creator,
          timestamp,
          snippet: text.substring(0, 200),
          type: 'team'
        });
      }

      // Track date range
      if (timestamp) {
        if (!this.trainingData.metadata.dateRange.earliest ||
            timestamp < this.trainingData.metadata.dateRange.earliest) {
          this.trainingData.metadata.dateRange.earliest = timestamp;
        }
        if (!this.trainingData.metadata.dateRange.latest ||
            timestamp > this.trainingData.metadata.dateRange.latest) {
          this.trainingData.metadata.dateRange.latest = timestamp;
        }
      }
    }
  }

  generateInsights() {
    console.log('\n📈 Generating Liberty workflow insights...');

    const insights = {
      campaignWorkflows: this.analyzePatterns(this.trainingData.patterns.campaignWorkflows),
      stationCommunications: this.analyzePatterns(this.trainingData.patterns.stationCommunications),
      clientInteractions: this.analyzePatterns(this.trainingData.patterns.clientInteractions),
      teamProcesses: this.analyzePatterns(this.trainingData.patterns.teamProcesses)
    };

    this.trainingData.insights = insights;

    console.log(`  ✓ Campaign workflows: ${insights.campaignWorkflows.totalPatterns} patterns`);
    console.log(`  ✓ Station communications: ${insights.stationCommunications.totalPatterns} patterns`);
    console.log(`  ✓ Client interactions: ${insights.clientInteractions.totalPatterns} patterns`);
    console.log(`  ✓ Team processes: ${insights.teamProcesses.totalPatterns} patterns`);
  }

  analyzePatterns(patterns) {
    return {
      totalPatterns: patterns.length,
      topContributors: this.getTopContributors(patterns),
      commonThemes: this.extractCommonThemes(patterns),
      timeline: this.getTimelineDistribution(patterns)
    };
  }

  getTopContributors(patterns) {
    const contributors = {};
    patterns.forEach(p => {
      contributors[p.creator] = (contributors[p.creator] || 0) + 1;
    });
    return Object.entries(contributors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  extractCommonThemes(patterns) {
    // Simple keyword frequency analysis
    const words = {};
    patterns.forEach(p => {
      const text = p.snippet.toLowerCase();
      const tokens = text.split(/\s+/).filter(w => w.length > 4);
      tokens.forEach(word => {
        words[word] = (words[word] || 0) + 1;
      });
    });
    return Object.entries(words)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }

  getTimelineDistribution(patterns) {
    const byMonth = {};
    patterns.forEach(p => {
      if (p.timestamp) {
        const month = p.timestamp.substring(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });
    return byMonth;
  }

  async saveTrainingData() {
    const outputPath = path.join(__dirname, '..', 'data', 'liberty-training-data.json');

    // Ensure data directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Save full training data
    await fs.writeFile(outputPath, JSON.stringify(this.trainingData, null, 2));

    // Save insights summary
    const summaryPath = path.join(__dirname, '..', 'data', 'liberty-training-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify({
      metadata: this.trainingData.metadata,
      insights: this.trainingData.insights
    }, null, 2));

    console.log(`\n💾 Training data saved to: ${outputPath}`);
    console.log(`💾 Summary saved to: ${summaryPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const processor = new LibertyTrainingProcessor();
  processor.processLibertyTakeout()
    .then(() => {
      console.log('\n✅ Liberty training data processing complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Processing failed:', error);
      process.exit(1);
    });
}

module.exports = LibertyTrainingProcessor;