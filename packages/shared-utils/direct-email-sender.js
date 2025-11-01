// Direct Email Sending via Gmail API (Alternative to Mailchimp)
// For high-volume sending without Mailchimp costs

const { google } = require('googleapis');
const gmail = google.gmail('v1');

class DirectEmailSender {
  constructor() {
    this.auth = this.getGmailAuth();
    this.dailyLimit = 100; // Gmail API limit
    this.sendQueue = [];
  }

  async sendCampaignEmails(selectedContacts, campaignData, assets) {
    // Batch emails across multiple days to respect Gmail limits
    const batches = this.createEmailBatches(selectedContacts, this.dailyLimit);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const sendDate = new Date();
      sendDate.setDate(sendDate.getDate() + i); // Spread over multiple days

      await this.scheduleBatch(batch, campaignData, assets, sendDate);
    }
  }

  createEmailBatches(contacts, batchSize) {
    const batches = [];
    for (let i = 0; i < contacts.length; i += batchSize) {
      batches.push(contacts.slice(i, i + batchSize));
    }
    return batches;
  }

  async scheduleBatch(contacts, campaignData, assets, sendDate) {
    for (const contact of contacts) {
      const personalizedEmail = await this.generatePersonalizedEmail(contact, campaignData, assets);

      // Queue for sending
      this.sendQueue.push({
        to: contact['Email'],
        subject: personalizedEmail.subject,
        html: personalizedEmail.html,
        scheduledDate: sendDate,
      });
    }

    // Process queue immediately if sending today
    if (sendDate.toDateString() === new Date().toDateString()) {
      await this.processSendQueue();
    }
  }

  async generatePersonalizedEmail(contact, campaignData, assets) {
    const template = `
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2>Hi ${contact['First Name']},</h2>
        
        <p>Hope you're well! I wanted to share a fantastic new ${campaignData.genre} track that would be perfect for ${contact['Station Name']}.</p>
        
        <h3>${campaignData.artistName} - "${campaignData.trackName}"</h3>
        
        <p>${campaignData.artistBio}</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Download & Listen:</h4>
          <p><strong>🎵 Listen Now:</strong> <a href="${campaignData.soundcloudUrl}" target="_blank">SoundCloud</a></p>
          <p><strong>📥 Download MP3/WAV:</strong> <a href="${assets.mp3WavDownload}" target="_blank">Audio Files</a></p>
          <p><strong>📄 Press Release:</strong> <a href="${assets.pressReleaseDownload}" target="_blank">Press Materials</a></p>
          <p><strong>🖼️ Promo Photos:</strong> <a href="${assets.promoPhotosDownload}" target="_blank">Photos & Artwork</a></p>
        </div>
        
        <p>Release date: ${campaignData.releaseDate}</p>
        
        <p>Would love to hear your thoughts - always appreciate your support for new music!</p>
        
        <p>Best regards,<br>
        Chris Schofield<br>
        Liberty Music PR<br>
        chris@libertymusic.pr</p>
      </div>
    </body>
    </html>
    `;

    return {
      subject: `New ${campaignData.genre} from ${campaignData.artistName} - "${campaignData.trackName}"`,
      html: template,
    };
  }

  async processSendQueue() {
    const today = new Date().toDateString();
    const todaysEmails = this.sendQueue.filter(
      email => email.scheduledDate.toDateString() === today
    );

    for (const email of todaysEmails) {
      try {
        await this.sendEmail(email);
        await this.sleep(1000); // 1 second delay between emails

        // Remove from queue after sending
        this.sendQueue = this.sendQueue.filter(e => e !== email);
      } catch (error) {
        console.error(`Error sending email to ${email.to}:`, error);
      }
    }
  }

  async sendEmail(emailData) {
    const message = [
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailData.html,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return gmail.users.messages.send({
      auth: this.auth,
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = DirectEmailSender;
