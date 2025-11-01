const { google } = require('googleapis');

class GmailIntegration {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
      'http://localhost:3000/oauth2callback'
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  // Get authorization URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.compose',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  // Set credentials from auth code
  async setCredentials(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Search emails with Liberty Music PR
  async searchLibertyEmails() {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'from:joe@libertymusic.co.uk OR to:joe@libertymusic.co.uk',
      });

      return response.data.messages || [];
    } catch (error) {
      console.error('Error searching emails:', error);
      return [];
    }
  }

  // Get email details
  async getEmailDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });

      return this.parseEmail(response.data);
    } catch (error) {
      console.error('Error getting email:', error);
      return null;
    }
  }

  // Parse email data
  parseEmail(message) {
    const headers = message.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    // Get body text
    let body = '';
    if (message.payload.body.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString();
    } else if (message.payload.parts) {
      const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
      if (textPart?.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }

    return {
      id: message.id,
      subject,
      from,
      date,
      body: body.substring(0, 1000), // Limit body length
    };
  }
}

module.exports = GmailIntegration;
