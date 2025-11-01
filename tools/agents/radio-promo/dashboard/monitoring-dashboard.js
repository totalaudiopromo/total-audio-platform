#!/usr/bin/env node

/**
 * Real-time Monitoring Dashboard
 *
 * Simple web dashboard to view play monitoring status
 * Shows live play alerts and analytics
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const AnalyticsAgent = require('../agents/analytics-agent');

class MonitoringDashboard {
  constructor(port = 3001) {
    this.port = port;
    this.analyticsAgent = new AnalyticsAgent();
    this.server = null;
    this.clients = new Set(); // WebSocket clients for real-time updates
  }

  async start() {
    console.log('🚀 Starting Real-time Monitoring Dashboard...');

    // Initialize analytics agent
    await this.analyticsAgent.initialize();

    // Create HTTP server
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    // Start server
    this.server.listen(this.port, () => {
      console.log(`📊 Dashboard running at http://localhost:${this.port}`);
      console.log('🎵 Monitoring play alerts in real-time...');
    });

    // Add alert callback for real-time updates
    this.analyticsAgent.monitor.addAlertCallback((config, newPlays) => {
      this.broadcastAlert(config, newPlays);
    });
  }

  handleRequest(req, res) {
    const url = req.url;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (url === '/') {
      this.serveDashboard(res);
    } else if (url === '/api/status') {
      this.serveStatus(res);
    } else if (url === '/api/analytics') {
      this.serveAnalytics(res);
    } else if (url === '/api/campaigns') {
      this.serveCampaigns(res);
    } else if (url === '/api/plays') {
      this.servePlays(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }

  serveDashboard(res) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liberty Radio Promo - Real-time Monitoring</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: #000;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.8;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card h3 {
            margin: 0 0 15px 0;
            color: #000;
        }
        .status {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .status-healthy { background: #22c55e; }
        .status-warning { background: #f59e0b; }
        .status-error { background: #ef4444; }
        .play-alert {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        .play-alert h4 {
            margin: 0 0 10px 0;
            color: #92400e;
        }
        .play-alert p {
            margin: 5px 0;
            color: #92400e;
        }
        .station-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .station-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .station-list li:last-child {
            border-bottom: none;
        }
        .refresh-btn {
            background: #3b82f6;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }
        .refresh-btn:hover {
            background: #2563eb;
        }
        .auto-refresh {
            margin-left: 10px;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Liberty Radio Promo - Real-time Monitoring</h1>
            <p>Live play alerts and campaign analytics</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 System Status</h3>
                <div id="system-status">
                    <div class="status">
                        <div class="status-indicator status-healthy"></div>
                        <span>Loading...</span>
                    </div>
                </div>
                <button class="refresh-btn" onclick="refreshData()">Refresh</button>
                <span class="auto-refresh">Auto-refresh: 30s</span>
            </div>
            
            <div class="card">
                <h3>🎯 Active Campaigns</h3>
                <div id="campaigns">
                    <p>Loading campaigns...</p>
                </div>
            </div>
            
            <div class="card">
                <h3>🎉 Recent Plays</h3>
                <div id="recent-plays">
                    <p>No recent plays detected</p>
                </div>
            </div>
            
            <div class="card">
                <h3>📈 Analytics</h3>
                <div id="analytics">
                    <p>Loading analytics...</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>🚨 Live Play Alerts</h3>
            <div id="play-alerts">
                <p>No alerts yet. Monitoring for new plays...</p>
            </div>
        </div>
    </div>

    <script>
        let refreshInterval;
        
        function refreshData() {
            Promise.all([
                fetch('/api/status').then(r => r.json()),
                fetch('/api/campaigns').then(r => r.json()),
                fetch('/api/plays').then(r => r.json()),
                fetch('/api/analytics').then(r => r.json())
            ]).then(([status, campaigns, plays, analytics]) => {
                updateSystemStatus(status);
                updateCampaigns(campaigns);
                updateRecentPlays(plays);
                updateAnalytics(analytics);
            }).catch(error => {
                console.error('Error refreshing data:', error);
            });
        }
        
        function updateSystemStatus(status) {
            const container = document.getElementById('system-status');
            const indicator = status.monitoring?.monitoring ? 'status-healthy' : 'status-error';
            const text = status.monitoring?.monitoring ? 'Monitoring Active' : 'Monitoring Inactive';
            
            container.innerHTML = \`
                <div class="status">
                    <div class="status-indicator \${indicator}"></div>
                    <span>\${text}</span>
                </div>
                <div class="status">
                    <div class="status-indicator \${status.warmApi === 'healthy' ? 'status-healthy' : 'status-error'}"></div>
                    <span>WARM API: \${status.warmApi}</span>
                </div>
                <div class="status">
                    <div class="status-indicator status-healthy"></div>
                    <span>Active Campaigns: \${status.monitoring?.activeCampaigns || 0}</span>
                </div>
            \`;
        }
        
        function updateCampaigns(campaigns) {
            const container = document.getElementById('campaigns');
            if (campaigns.length === 0) {
                container.innerHTML = '<p>No active campaigns</p>';
                return;
            }
            
            const html = campaigns.map(campaign => \`
                <div class="status">
                    <div class="status-indicator \${campaign.monitoring ? 'status-healthy' : 'status-error'}"></div>
                    <span>\${campaign.artistName} - \${campaign.totalPlays} plays</span>
                </div>
            \`).join('');
            
            container.innerHTML = html;
        }
        
        function updateRecentPlays(plays) {
            const container = document.getElementById('recent-plays');
            if (plays.length === 0) {
                container.innerHTML = '<p>No recent plays detected</p>';
                return;
            }
            
            const html = plays.map(play => \`
                <div class="status">
                    <div class="status-indicator status-healthy"></div>
                    <span>\${play.station} - \${play.artistName}</span>
                </div>
            \`).join('');
            
            container.innerHTML = html;
        }
        
        function updateAnalytics(analytics) {
            const container = document.getElementById('analytics');
            container.innerHTML = \`
                <div class="status">
                    <div class="status-indicator status-healthy"></div>
                    <span>Total Plays: \${analytics.totalPlays}</span>
                </div>
                <div class="status">
                    <div class="status-indicator status-healthy"></div>
                    <span>Total Campaigns: \${analytics.totalCampaigns}</span>
                </div>
                <div class="status">
                    <div class="status-indicator status-healthy"></div>
                    <span>Avg Plays/Campaign: \${analytics.averagePlaysPerCampaign.toFixed(1)}</span>
                </div>
            \`;
        }
        
        function addPlayAlert(config, newPlays) {
            const container = document.getElementById('play-alerts');
            const alertHtml = \`
                <div class="play-alert">
                    <h4>🎉 New Plays for \${config.artistName}!</h4>
                    <p><strong>\${newPlays.length}</strong> new plays detected</p>
                    <p>Total plays: \${config.totalPlays}</p>
                    <ul class="station-list">
                        \${newPlays.map(play => \`
                            <li>\${play.radioStationName || play.stationName || 'Unknown Station'} - \${play.time || 'Unknown Time'}</li>
                        \`).join('')}
                    </ul>
                    <p><small>Alert time: \${new Date().toLocaleString()}</small></p>
                </div>
            \`;
            
            container.insertAdjacentHTML('afterbegin', alertHtml);
        }
        
        // Start auto-refresh
        refreshInterval = setInterval(refreshData, 30000);
        
        // Initial load
        refreshData();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        });
    </script>
</body>
</html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  serveStatus(res) {
    const status = this.analyticsAgent.getMonitoringStatus();
    const health = this.analyticsAgent.healthCheck();

    Promise.resolve(health).then(healthData => {
      const response = {
        ...status,
        warmApi: healthData.monitoring?.warmApi || 'unknown',
        lastChecked: new Date().toISOString(),
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
    });
  }

  serveAnalytics(res) {
    const analytics = this.analyticsAgent.getOverallAnalytics();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics, null, 2));
  }

  serveCampaigns(res) {
    const campaigns = Array.from(this.analyticsAgent.campaigns.values());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(campaigns, null, 2));
  }

  servePlays(res) {
    const allPlays = this.analyticsAgent.analytics.playTimeline.slice(-10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(allPlays, null, 2));
  }

  broadcastAlert(config, newPlays) {
    // In a real implementation, this would use WebSockets
    // For now, we'll just log the alert
    console.log(`🎉 NEW PLAYS ALERT: ${config.artistName} - ${newPlays.length} plays!`);
  }

  async stop() {
    if (this.server) {
      this.server.close();
      console.log('🛑 Dashboard stopped');
    }

    await this.analyticsAgent.shutdown();
  }
}

// Start dashboard if run directly
if (require.main === module) {
  const dashboard = new MonitoringDashboard();
  dashboard.start().catch(console.error);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down dashboard...');
    await dashboard.stop();
    process.exit(0);
  });
}

module.exports = MonitoringDashboard;
