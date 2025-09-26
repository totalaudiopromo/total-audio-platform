// Auto-trigger system for Liberty Radio Agent
// Watches Google Drive for new recordings and auto-processes them

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class AutoTriggerSystem {
  constructor() {
    this.watchFolder = '/Users/chrisschofield/Google Drive/Meet Recordings/';
    this.agentPath = path.join(__dirname, 'radio-promo-agent.js');
    this.processedFiles = new Set(); // Avoid reprocessing
  }

  startWatching() {
    console.log('🎵 Liberty Auto-Trigger System Started');
    console.log(`📁 Watching: ${this.watchFolder}`);
    
    // Create watcher for Google Drive recordings
    const watcher = chokidar.watch(this.watchFolder, {
      ignored: /^\./, 
      persistent: true,
      ignoreInitial: true // Don't process existing files
    });

    // New file detected
    watcher.on('add', (filePath) => {
      this.handleNewRecording(filePath);
    });

    // File changed (recording still uploading)
    watcher.on('change', (filePath) => {
      this.handleUpdatedRecording(filePath);
    });

    console.log('✅ Auto-trigger system running...');
  }

  async handleNewRecording(filePath) {
    const fileName = path.basename(filePath);
    
    // Check if this looks like a Liberty recording
    if (this.isLibertyRecording(fileName)) {
      console.log(`🎤 New Liberty recording detected: ${fileName}`);
      
      // Wait for file to fully upload (Google Drive can be slow)
      setTimeout(() => {
        this.processRecording(filePath);
      }, 180000); // 3 minutes wait
    }
  }

  async handleUpdatedRecording(filePath) {
    // Handle files that are still uploading
    const fileName = path.basename(filePath);
    
    if (this.isLibertyRecording(fileName) && !this.processedFiles.has(filePath)) {
      console.log(`📝 Recording updated: ${fileName} (waiting for completion...)`);
    }
  }

  isLibertyRecording(fileName) {
    const keywords = [
      'liberty',
      'radio',
      'promotion', 
      'artist',
      'campaign',
      'music pr'
    ];
    
    const lowerFileName = fileName.toLowerCase();
    return keywords.some(keyword => lowerFileName.includes(keyword));
  }

  async processRecording(filePath) {
    if (this.processedFiles.has(filePath)) {
      console.log('📋 File already processed, skipping...');
      return;
    }

    try {
      console.log(`🔄 Processing recording: ${path.basename(filePath)}`);
      
      // Check file exists and is complete
      if (!fs.existsSync(filePath)) {
        console.log('❌ File not found, skipping...');
        return;
      }

      // Run the Liberty agent with the recording
      const command = `node "${this.agentPath}" --process-recording "${filePath}"`;
      console.log(`🚀 Executing: ${command}`);
      
      const output = execSync(command, { encoding: 'utf-8' });
      console.log('✅ Agent output:', output);
      
      // Mark as processed
      this.processedFiles.add(filePath);
      
      console.log(`🎉 Successfully processed: ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`❌ Error processing recording: ${error.message}`);
    }
  }

  // Alternative: Monitor calendar for completed meetings
  async startCalendarMonitoring() {
    console.log('📅 Starting calendar monitoring...');
    
    // Check every 10 minutes for recently completed meetings
    setInterval(async () => {
      await this.checkRecentMeetings();
    }, 10 * 60 * 1000);
  }

  async checkRecentMeetings() {
    // This would integrate with Google Calendar API
    // Check for meetings that ended in last 15 minutes
    // Look for recordings associated with those meetings
    console.log('📅 Checking for completed meetings...');
  }
}

// Start the auto-trigger system
if (require.main === module) {
  const autoTrigger = new AutoTriggerSystem();
  autoTrigger.startWatching();
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n🛑 Auto-trigger system stopped');
    process.exit(0);
  });
}

module.exports = AutoTriggerSystem;
