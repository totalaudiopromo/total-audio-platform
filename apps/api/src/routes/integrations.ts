import { Router } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

// GET /api/integrations - Get all integrations
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Integrations endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/integrations - Create new integration
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Create integration - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AIRTABLE OAUTH
// GET /api/integrations/airtable/connect - Start Airtable OAuth
router.get('/airtable/connect', async (req, res) => {
  // Construct the Airtable OAuth URL
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI || '';
  const scopes = 'data.records:read data.records:write'; // adjust scopes as needed
  const state = typeof req.query.state === 'string' ? req.query.state : '';

  const oauthUrl = `https://airtable.com/oauth2/v1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;
  return res.redirect(oauthUrl);
});

// GET /api/integrations/airtable/callback - Handle Airtable OAuth callback
router.get('/airtable/callback', async (req, res) => {
  const code = req.query.code as string;
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI || '';

  if (!code) {
    return res.status(400).json({ error: 'Missing code in callback' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post('https://airtable.com/oauth2/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;
    // TODO: Get userId from session/auth (for now, just return tokens for testing)
    // In production, associate tokens with the authenticated user in the Integration table
    // await prisma.integration.upsert({ ... });
    return res.json({ access_token, refresh_token, expires_in, state });
  } catch (error) {
    let details = 'Unknown error';
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      details = (error.response as any).data;
    } else if (error instanceof Error) {
      details = error.message;
    }
    return res.status(500).json({ error: 'Failed to exchange code for token', details });
  }
});

// GOOGLE SHEETS OAUTH
// GET /api/integrations/google/connect - Start Google Sheets OAuth
router.get('/google/connect', async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'openid',
    'email',
    'profile',
  ];
  const state = typeof req.query.state === 'string' ? req.query.state : '';

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
  return res.redirect(oauthUrl);
});

// GET /api/integrations/google/callback - Handle Google Sheets OAuth callback
router.get('/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';

  if (!code) {
    return res.status(400).json({ error: 'Missing code in callback' });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in, id_token, scope, token_type } = tokenRes.data;
    // TODO: Get userId from session/auth (for now, just return tokens for testing)
    // In production, associate tokens with the authenticated user in the Integration table
    // await prisma.integration.upsert({ ... });
    return res.json({
      access_token,
      refresh_token,
      expires_in,
      id_token,
      scope,
      token_type,
      state,
    });
  } catch (error) {
    let details = 'Unknown error';
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      details = (error.response as any).data;
    } else if (error instanceof Error) {
      details = error.message;
    }
    return res.status(500).json({ error: 'Failed to exchange code for token', details });
  }
});

export default router;
