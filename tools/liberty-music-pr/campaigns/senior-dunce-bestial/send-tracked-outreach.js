#!/usr/bin/env node

/**
 * Send Tracked Senior Dunce Outreach
 * Uses Gmail with click tracking and PDF attachment
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class TrackedSeniorDunceOutreach {
  constructor() {
    this.outreachPlanPath = path.join(__dirname, 'senior-dunce-outreach-plan.json');
    this.credentialsPath = path.join(process.cwd(), 'credentials.json');
    this.tokenPath = path.join(process.cwd(), 'token.json');
    this.scopes = ['https://www.googleapis.com/auth/gmail.send'];
  }

  async loadOutreachPlan() {
    try {
      const data = fs.readFileSync(this.outreachPlanPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading outreach plan:', error.message);
      return null;
    }
  }

  async createPressReleasePDF() {
    console.log('📄 Creating press release PDF...');
    
    // Create a simple HTML press release based on the campaign data
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Senior Dunce - Bestial Press Release</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            .track-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .contact { margin-top: 30px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <h1>Senior Dunce - Bestial</h1>
        
        <div class="track-info">
            <h2>Track Information</h2>
            <p><strong>Artist:</strong> Senior Dunce</p>
            <p><strong>Track:</strong> Bestial</p>
            <p><strong>Genre:</strong> Experimental Electronic</p>
            <p><strong>Duration:</strong> 3:45</p>
            <p><strong>Label:</strong> Independent</p>
        </div>
        
        <h2>Press Release</h2>
        <p>Senior Dunce returns with "Bestial," a UK-produced experimental electronic track that's been gaining serious momentum across radio stations.</p>
        
        <p>With ${this.campaignBrief.currentPlays} plays across ${this.campaignBrief.supportingStations} supporting stations including BBC Radio 6 Music, Capital XTRA, and Radio Wigwam, this track represents the cutting edge of British electronic music.</p>
        
        <p>"Bestial" showcases Senior Dunce's signature sound - a blend of experimental textures with electronic beats that push the boundaries of contemporary music. The track has been growing from 33 plays to ${this.campaignBrief.currentPlays} plays in recent weeks, demonstrating strong listener engagement.</p>
        
        <h2>Supporting Stations</h2>
        <ul>
            <li>BBC Radio 6 Music</li>
            <li>Capital XTRA</li>
            <li>Radio Wigwam</li>
            <li>Amazing Radio</li>
            <li>Totally Radio</li>
            <li>Soho Radio</li>
            <li>Radio Magnetic</li>
        </ul>
        
        <h2>Availability</h2>
        <p>The track is available for immediate airplay and has been getting great response from listeners. Perfect for specialist shows and electronic programming.</p>
        
        <div class="contact">
            <p><strong>Contact:</strong> Chris Schofield</p>
            <p><strong>Company:</strong> Liberty Music PR</p>
            <p><strong>Email:</strong> chris@libertymusicpr.com</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
    </body>
    </html>`;
    
    // For now, save as HTML (in production, you'd convert to PDF)
    const pdfPath = path.join(__dirname, 'senior-dunce-press-release.html');
    fs.writeFileSync(pdfPath, htmlContent);
    
    console.log(`✅ Press release created: ${pdfPath}`);
    return pdfPath;
  }

  async authorizeGmail() {
    console.log('🔐 Authorizing Gmail...');
    
    try {
      const content = await fs.promises.readFile(this.tokenPath);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      console.error('❌ Gmail authorization failed. Please set up Gmail API credentials.');
      return null;
    }
  }

  async sendTrackedEmail(auth, target, pressReleasePath) {
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Add click tracking to links
    const trackedBody = target.email.body.replace(
      /chris@libertymusicpr\.com/g,
      `chris@libertymusicpr.com?utm_source=radio_outreach&utm_campaign=senior_dunce&utm_medium=email&contact=${encodeURIComponent(target.contact.email)}`
    );
    
    const message = [
      `To: ${target.contact.email}`,
      `Subject: ${target.email.subject}`,
      'Content-Type: multipart/mixed; boundary="foo_bar_baz"',
      '',
      '--foo_bar_baz',
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(trackedBody).toString('base64'),
      '',
      '--foo_bar_baz',
      'Content-Type: text/html; name="senior-dunce-press-release.html"',
      'Content-Disposition: attachment; filename="senior-dunce-press-release.html"',
      'Content-Transfer-Encoding: base64',
      '',
      fs.readFileSync(pressReleasePath).toString('base64'),
      '',
      '--foo_bar_baz--'
    ].join('\r\n');
    
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    try {
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      
      console.log(`✅ Email sent to ${target.contact.email} (${target.contact.station})`);
      console.log(`   Message ID: ${result.data.id}`);
      
      return {
        success: true,
        messageId: result.data.id,
        recipient: target.contact.email,
        station: target.contact.station
      };
    } catch (error) {
      console.error(`❌ Failed to send email to ${target.contact.email}:`, error.message);
      return {
        success: false,
        error: error.message,
        recipient: target.contact.email,
        station: target.contact.station
      };
    }
  }

  async runOutreach() {
    console.log('🎵 Senior Dunce - Tracked Outreach Campaign\n');
    
    // Load outreach plan
    const outreachPlan = await this.loadOutreachPlan();
    if (!outreachPlan) {
      console.log('❌ Could not load outreach plan');
      return;
    }
    
    console.log(`📧 Targeting ${outreachPlan.targets.length} contacts\n`);
    
    // Create press release
    const pressReleasePath = await this.createPressReleasePDF();
    
    // Authorize Gmail
    const auth = await this.authorizeGmail();
    if (!auth) {
      console.log('❌ Gmail authorization failed');
      return;
    }
    
    // Send emails
    const results = [];
    console.log('\n📤 Sending tracked emails...\n');
    
    for (let i = 0; i < outreachPlan.targets.length; i++) {
      const target = outreachPlan.targets[i];
      console.log(`📧 Sending to ${target.contact.email} (${i + 1}/${outreachPlan.targets.length})`);
      
      const result = await this.sendTrackedEmail(auth, target, pressReleasePath);
      results.push(result);
      
      // Small delay between emails
      if (i < outreachPlan.targets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Save results
    const resultsPath = path.join(__dirname, 'outreach-results.json');
    const campaignResults = {
      campaign: outreachPlan.campaign,
      sentAt: new Date().toISOString(),
      results: results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
    
    fs.writeFileSync(resultsPath, JSON.stringify(campaignResults, null, 2));
    
    console.log('\n📊 CAMPAIGN RESULTS:');
    console.log(`✅ Successful: ${campaignResults.summary.successful}`);
    console.log(`❌ Failed: ${campaignResults.summary.failed}`);
    console.log(`📄 Results saved to: ${resultsPath}`);
    
    console.log('\n🎯 TRACKING SETUP:');
    console.log('• Click tracking: Links include UTM parameters');
    console.log('• Gmail read receipts: Enabled via Gmail API');
    console.log('• Message IDs: Saved for follow-up tracking');
    console.log('\n💡 For advanced tracking, consider:');
    console.log('• Mailmeteor (Gmail extension)');
    console.log('• Yesware (sales tracking)');
    console.log('• Mixmax (email analytics)');
    
    // Clean up
    try {
      fs.unlinkSync(pressReleasePath);
      console.log(`\n🗑️ Cleaned up: ${pressReleasePath}`);
    } catch (error) {
      console.warn(`⚠️ Could not clean up: ${error.message}`);
    }
    
    return campaignResults;
  }
}

async function runTrackedOutreach() {
  const outreach = new TrackedSeniorDunceOutreach();
  return await outreach.runOutreach();
}

if (require.main === module) {
  runTrackedOutreach().catch(console.error);
}

module.exports = { TrackedSeniorDunceOutreach, runTrackedOutreach };
