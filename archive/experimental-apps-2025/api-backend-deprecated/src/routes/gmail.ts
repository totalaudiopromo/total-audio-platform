import express from 'express';
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { GmailService } from '../integrations/gmail';

const router = express.Router();
const prisma = new PrismaClient();

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/api/gmail/callback`
);

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
];

// 1. Initiate OAuth flow
router.get('/auth', authenticateToken, async (req: any, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: req.user.id, // Pass user ID in state
    });

    res.json({ authUrl });
  } catch (error) {
    logger.error('Gmail auth URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// 2. OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state as string;

    if (!code || !userId) {
      res.status(400).json({ error: 'Missing authorization code or user ID' });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code as string);

    // Save integration to database
    await prisma.integration.upsert({
      where: {
        userId_type: {
          userId,
          type: 'GMAIL',
        },
      },
      update: {
        config: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        },
        status: 'CONNECTED',
        lastSyncAt: new Date(),
      },
      create: {
        userId,
        type: 'GMAIL',
        config: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        },
        status: 'CONNECTED',
        lastSyncAt: new Date(),
      },
    });

    logger.info(`Gmail integration connected for user: ${userId}`);

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/integrations?success=gmail`);
  } catch (error) {
    logger.error('Gmail OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/integrations?error=gmail`);
  }
});

// 3. Get Gmail integration status
router.get('/status', authenticateToken, async (req: any, res) => {
  try {
    const integration = await prisma.integration.findUnique({
      where: {
        userId_type: {
          userId: req.user.id,
          type: 'GMAIL',
        },
      },
    });

    res.json({
      connected: integration?.status === 'CONNECTED',
      lastSyncAt: integration?.lastSyncAt,
    });
  } catch (error) {
    logger.error('Gmail status check error:', error);
    res.status(500).json({ error: 'Failed to check Gmail status' });
  }
});

// 4. Disconnect Gmail integration
router.delete('/disconnect', authenticateToken, async (req: any, res) => {
  try {
    await prisma.integration.update({
      where: {
        userId_type: {
          userId: req.user.id,
          type: 'GMAIL',
        },
      },
      data: {
        status: 'DISCONNECTED',
        lastSyncAt: new Date(),
      },
    });

    logger.info(`Gmail integration disconnected for user: ${req.user.id}`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Gmail disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect Gmail' });
  }
});

// 5. Track replies for a campaign
router.post('/track-replies/:campaignId', authenticateToken, async (req: any, res) => {
  try {
    const { campaignId } = req.params;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: req.user.id,
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const gmailService = await GmailService.getIntegrationForUser(req.user.id);
    if (!gmailService) {
      res.status(400).json({ error: 'Gmail integration not connected' });
      return;
    }

    await gmailService.trackReplies(campaignId);

    res.json({ success: true, message: 'Reply tracking started' });
  } catch (error) {
    logger.error('Gmail track replies error:', error);
    res.status(500).json({ error: 'Failed to track replies' });
  }
});

// 6. Send email via Gmail
router.post('/send', authenticateToken, async (req: any, res) => {
  try {
    const { to, subject, content, campaignId } = req.body;

    if (!to || !subject || !content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const gmailService = await GmailService.getIntegrationForUser(req.user.id);
    if (!gmailService) {
      res.status(400).json({ error: 'Gmail integration not connected' });
      return;
    }

    await gmailService.sendEmail(to, subject, content);

    // Log the email interaction if campaignId is provided
    if (campaignId) {
      const contact = await prisma.contact.findUnique({
        where: { email: to },
      });

      if (contact) {
        await prisma.interaction.create({
          data: {
            campaignId,
            contactId: contact.id,
            type: 'EMAIL_SENT',
            details: {
              subject,
              timestamp: new Date(),
            },
          },
        });
      }
    }

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    logger.error('Gmail send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// 7. Get recent emails with replies
router.get('/recent-replies', authenticateToken, async (req: any, res) => {
  try {
    const gmailService = await GmailService.getIntegrationForUser(req.user.id);
    if (!gmailService) {
      res.status(400).json({ error: 'Gmail integration not connected' });
      return;
    }

    // Get recent replies with default parameters
    const replies = await gmailService.getRecentReplies(
      '',
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ); // Last 7 days
    res.json({ replies });
  } catch (error) {
    logger.error('Gmail recent replies error:', error);
    res.status(500).json({ error: 'Failed to get recent replies' });
  }
});

// 8. Set up Gmail push notifications
router.post('/watch', authenticateToken, async (req: any, res) => {
  try {
    const gmailService = await GmailService.getIntegrationForUser(req.user.id);
    if (!gmailService) {
      res.status(400).json({ error: 'Gmail integration not connected' });
      return;
    }

    await gmailService.watchEmailChanges(req.body.campaignId || 'default');
    res.json({ success: true, message: 'Push notifications enabled' });
  } catch (error) {
    logger.error('Gmail watch error:', error);
    res.status(500).json({ error: 'Failed to setup push notifications' });
  }
});

// 9. Get Gmail analytics for a campaign
router.get('/analytics/:campaignId', authenticateToken, async (req: any, res) => {
  try {
    const { campaignId } = req.params;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: req.user.id,
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const gmailService = await GmailService.getIntegrationForUser(req.user.id);
    if (!gmailService) {
      res.status(400).json({ error: 'Gmail integration not connected' });
      return;
    }

    // Get campaign analytics from database instead
    const campaignAnalytics = await prisma.emailCampaignAnalytics.findMany({
      where: {
        emailCampaign: {
          campaignId: campaignId,
        },
      },
      include: {
        emailCampaign: true,
      },
    });

    res.json({ analytics: campaignAnalytics });
  } catch (error) {
    logger.error('Gmail analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
