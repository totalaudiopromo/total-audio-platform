import { Router } from 'express';
import { MailchimpService } from '../integrations/mailchimp';

const router = Router();

// GET /api/mailchimp/campaigns - List campaigns (basic info)
router.get('/campaigns', async (req, res) => {
  try {
    // Debug: Print the API key to see if it's loaded
    console.log('MAILCHIMP_API_KEY:', process.env.MAILCHIMP_API_KEY);
    
    const config = {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || '',
      listId: process.env.MAILCHIMP_AUDIENCE_ID || '',
    };
    
    console.log('Config:', { 
      apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : 'EMPTY',
      serverPrefix: config.serverPrefix,
      listId: config.listId 
    });
    
    const mailchimpService = new MailchimpService(config);
    
    // Fetch campaigns from Mailchimp
    const campaigns = await mailchimpService['mailchimp'].get('/campaigns?count=20');
    // Return only basic info for now
    const result = (campaigns.campaigns || []).map((c: any) => ({
      id: c.id,
      title: c.settings?.title || c.settings?.subject_line || '',
      status: c.status,
      send_time: c.send_time,
      emails_sent: c.emails_sent,
    }));
    res.json({ campaigns: result });
  } catch (error) {
    console.error('Mailchimp campaigns endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns', details: error instanceof Error ? error.stack : error });
  }
});

// GET /api/mailchimp/campaigns/:id/analytics - Get analytics for a campaign
router.get('/campaigns/:id/analytics', async (req, res) => {
  try {
    const config = {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || '',
      listId: process.env.MAILCHIMP_AUDIENCE_ID || '',
    };
    const mailchimpService = new MailchimpService(config);
    
    const analytics = await mailchimpService.getCampaignAnalytics(req.params.id);
    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign analytics', details: error instanceof Error ? error.message : error });
  }
});

export default router; 