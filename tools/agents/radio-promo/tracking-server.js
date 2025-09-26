#!/usr/bin/env node

/**
 * Simple Email Tracking Server
 * 
 * Handles tracking pixel and link requests
 * Can be deployed to any hosting service (Vercel, Netlify, etc.)
 */

const express = require('express');
const EmailTracking = require('./integrations/email-tracking');

const app = express();
const emailTracking = new EmailTracking();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for tracking requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Track email opens
app.get('/track/open/:pixelId', async (req, res) => {
  try {
    const { pixelId } = req.params;
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;
    
    const result = await emailTracking.processOpenTracking(pixelId, userAgent, ip);
    
    if (result.success) {
      // Return 1x1 transparent pixel
      const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.send(pixel);
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    console.error('❌ Open tracking error:', error.message);
    res.status(500).send('Internal server error');
  }
});

// Track email clicks
app.get('/track/click/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;
    
    const result = await emailTracking.processClickTracking(linkId, userAgent, ip);
    
    if (result.success) {
      // Redirect to original URL
      res.redirect(302, result.redirectUrl);
    } else {
      res.status(404).send('Link not found');
    }
  } catch (error) {
    console.error('❌ Click tracking error:', error.message);
    res.status(500).send('Internal server error');
  }
});

// Get campaign statistics
app.get('/api/stats/:campaignId', (req, res) => {
  try {
    const { campaignId } = req.params;
    const stats = emailTracking.getCampaignStats(campaignId);
    res.json(stats);
  } catch (error) {
    console.error('❌ Stats error:', error.message);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get contact engagement
app.get('/api/engagement/:contactId', (req, res) => {
  try {
    const { contactId } = req.params;
    const engagement = emailTracking.getContactEngagement(contactId);
    res.json(engagement);
  } catch (error) {
    console.error('❌ Engagement error:', error.message);
    res.status(500).json({ error: 'Failed to get engagement' });
  }
});

// Export tracking data
app.get('/api/export/:campaignId?', (req, res) => {
  try {
    const { campaignId } = req.params;
    const csv = emailTracking.exportToCSV(campaignId);
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="tracking-${campaignId || 'all'}-${Date.now()}.csv"`
    });
    
    res.send(csv);
  } catch (error) {
    console.error('❌ Export error:', error.message);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Get all tracking data
app.get('/api/data', (req, res) => {
  try {
    const data = emailTracking.getAllTrackingData();
    res.json(data);
  } catch (error) {
    console.error('❌ Data error:', error.message);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📧 Email tracking server running on port ${PORT}`);
  console.log(`🔗 Tracking URL: http://localhost:${PORT}/track/`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats/`);
});

module.exports = app;
