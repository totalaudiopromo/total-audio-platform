#!/usr/bin/env node

/**
 * Client Reporting Dashboard
 *
 * Professional reports for clients
 * Shows ROI and performance metrics
 * Includes play confirmations and coverage
 * Exports to PDF for client presentations
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class ClientDashboard {
  constructor(port = 3002) {
    this.port = port;
    this.server = null;
    this.reports = new Map();
    this.campaigns = new Map();

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'client-dashboard.json');
    this.loadData();
  }

  /**
   * Start the client dashboard
   */
  async start() {
    console.log('📊 Starting Client Reporting Dashboard...');

    // Create HTTP server
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    // Start server
    this.server.listen(this.port, () => {
      console.log(`📊 Client Dashboard running at http://localhost:${this.port}`);
      console.log('🎵 Generate professional reports for clients...');
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
    } else if (url === '/api/campaigns') {
      this.serveCampaigns(res);
    } else if (url === '/api/reports') {
      this.serveReports(res);
    } else if (url === '/api/generate-report') {
      this.handleGenerateReport(req, res);
    } else if (url.startsWith('/api/report/')) {
      const reportId = url.split('/')[3];
      this.serveReport(reportId, res);
    } else if (url.startsWith('/api/export/')) {
      const reportId = url.split('/')[3];
      this.exportReport(reportId, res);
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
    <title>Liberty Radio Promo - Client Dashboard</title>
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
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-value {
            font-weight: bold;
            color: #3b82f6;
        }
        .btn {
            background: #3b82f6;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
        }
        .btn:hover {
            background: #2563eb;
        }
        .btn-secondary {
            background: #6b7280;
        }
        .btn-secondary:hover {
            background: #4b5563;
        }
        .report-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        .report-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-completed {
            background: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-generating {
            background: #dbeafe;
            color: #1e40af;
        }
        .campaign-selector {
            margin-bottom: 20px;
        }
        .campaign-selector select {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Liberty Radio Promo - Client Dashboard</h1>
            <p>Professional reports and performance analytics</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📈 Campaign Overview</h3>
                <div id="campaign-overview">
                    <div class="loading">Loading campaign data...</div>
                </div>
            </div>
            
            <div class="card">
                <h3>🎵 Performance Metrics</h3>
                <div id="performance-metrics">
                    <div class="loading">Loading performance data...</div>
                </div>
            </div>
            
            <div class="card">
                <h3>💰 ROI Analysis</h3>
                <div id="roi-analysis">
                    <div class="loading">Loading ROI data...</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>📋 Generate New Report</h3>
            <div class="campaign-selector">
                <select id="campaign-selector">
                    <option value="">Select a campaign...</option>
                </select>
            </div>
            <button class="btn" onclick="generateReport()">Generate Report</button>
            <button class="btn btn-secondary" onclick="refreshData()">Refresh Data</button>
        </div>
        
        <div class="card">
            <h3>📄 Recent Reports</h3>
            <div id="recent-reports">
                <div class="loading">Loading reports...</div>
            </div>
        </div>
    </div>

    <script>
        let campaigns = [];
        let reports = [];
        
        function refreshData() {
            Promise.all([
                fetch('/api/campaigns').then(r => r.json()),
                fetch('/api/reports').then(r => r.json())
            ]).then(([campaignsData, reportsData]) => {
                campaigns = campaignsData;
                reports = reportsData;
                updateUI();
            }).catch(error => {
                console.error('Error refreshing data:', error);
            });
        }
        
        function updateUI() {
            updateCampaignOverview();
            updatePerformanceMetrics();
            updateROIAnalysis();
            updateCampaignSelector();
            updateRecentReports();
        }
        
        function updateCampaignOverview() {
            const container = document.getElementById('campaign-overview');
            const totalCampaigns = campaigns.length;
            const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
            const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
            
            container.innerHTML = \`
                <div class="metric">
                    <span>Total Campaigns</span>
                    <span class="metric-value">\${totalCampaigns}</span>
                </div>
                <div class="metric">
                    <span>Active Campaigns</span>
                    <span class="metric-value">\${activeCampaigns}</span>
                </div>
                <div class="metric">
                    <span>Completed Campaigns</span>
                    <span class="metric-value">\${completedCampaigns}</span>
                </div>
            \`;
        }
        
        function updatePerformanceMetrics() {
            const container = document.getElementById('performance-metrics');
            const totalPlays = campaigns.reduce((sum, c) => sum + (c.totalPlays || 0), 0);
            const totalContacts = campaigns.reduce((sum, c) => sum + (c.totalContacts || 0), 0);
            const successRate = totalContacts > 0 ? (totalPlays / totalContacts * 100).toFixed(1) : 0;
            
            container.innerHTML = \`
                <div class="metric">
                    <span>Total Plays</span>
                    <span class="metric-value">\${totalPlays}</span>
                </div>
                <div class="metric">
                    <span>Total Contacts</span>
                    <span class="metric-value">\${totalContacts}</span>
                </div>
                <div class="metric">
                    <span>Success Rate</span>
                    <span class="metric-value">\${successRate}%</span>
                </div>
            \`;
        }
        
        function updateROIAnalysis() {
            const container = document.getElementById('roi-analysis');
            const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
            const totalValue = campaigns.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);
            const roi = totalBudget > 0 ? ((totalValue - totalBudget) / totalBudget * 100).toFixed(1) : 0;
            
            container.innerHTML = \`
                <div class="metric">
                    <span>Total Budget</span>
                    <span class="metric-value">£\${totalBudget.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Estimated Value</span>
                    <span class="metric-value">£\${totalValue.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>ROI</span>
                    <span class="metric-value">\${roi}%</span>
                </div>
            \`;
        }
        
        function updateCampaignSelector() {
            const selector = document.getElementById('campaign-selector');
            selector.innerHTML = '<option value="">Select a campaign...</option>' +
                campaigns.map(campaign => \`
                    <option value="\${campaign.campaignId}">\${campaign.artistName} - \${campaign.trackTitle}</option>
                \`).join('');
        }
        
        function updateRecentReports() {
            const container = document.getElementById('recent-reports');
            if (reports.length === 0) {
                container.innerHTML = '<p>No reports generated yet.</p>';
                return;
            }
            
            const html = reports.slice(0, 10).map(report => \`
                <div class="report-item">
                    <div>
                        <strong>\${report.campaignName}</strong><br>
                        <small>Generated: \${new Date(report.generatedAt).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <span class="report-status status-\${report.status}">\${report.status}</span>
                        <button class="btn btn-secondary" onclick="viewReport('\${report.id}')">View</button>
                        <button class="btn" onclick="exportReport('\${report.id}')">Export</button>
                    </div>
                </div>
            \`).join('');
            
            container.innerHTML = html;
        }
        
        function generateReport() {
            const campaignId = document.getElementById('campaign-selector').value;
            if (!campaignId) {
                alert('Please select a campaign');
                return;
            }
            
            const campaign = campaigns.find(c => c.campaignId === campaignId);
            if (!campaign) {
                alert('Campaign not found');
                return;
            }
            
            fetch('/api/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaignId })
            }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Report generation started!');
                    refreshData();
                } else {
                    alert('Failed to generate report: ' + data.error);
                }
            }).catch(error => {
                console.error('Error generating report:', error);
                alert('Error generating report');
            });
        }
        
        function viewReport(reportId) {
            window.open(\`/api/report/\${reportId}\`, '_blank');
        }
        
        function exportReport(reportId) {
            window.open(\`/api/export/\${reportId}\`, '_blank');
        }
        
        // Initial load
        refreshData();
        
        // Auto-refresh every 30 seconds
        setInterval(refreshData, 30000);
    </script>
</body>
</html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  serveCampaigns(res) {
    // Mock campaign data - in real implementation, this would come from your database
    const campaigns = [
      {
        campaignId: 'campaign-1',
        artistName: 'Test Artist',
        trackTitle: 'Test Track',
        status: 'active',
        totalPlays: 15,
        totalContacts: 50,
        budget: 500,
        estimatedValue: 750,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      },
      {
        campaignId: 'campaign-2',
        artistName: 'Another Artist',
        trackTitle: 'Another Track',
        status: 'completed',
        totalPlays: 8,
        totalContacts: 30,
        budget: 300,
        estimatedValue: 400,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
      },
    ];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(campaigns));
  }

  serveReports(res) {
    const reports = Array.from(this.reports.values());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reports));
  }

  handleGenerateReport(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const report = this.generateReport(data.campaignId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reportId: report.id }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  }

  generateReport(campaignId) {
    console.log(`📊 Generating report for campaign: ${campaignId}`);

    const report = {
      id: `report-${campaignId}-${Date.now()}`,
      campaignId: campaignId,
      campaignName: `Campaign ${campaignId}`,
      status: 'completed',
      generatedAt: Date.now(),
      content: this.generateReportContent(campaignId),
    };

    this.reports.set(report.id, report);
    this.saveData();

    console.log(`✅ Report generated: ${report.id}`);

    return report;
  }

  generateReportContent(campaignId) {
    // Mock report content - in real implementation, this would generate actual data
    return {
      executiveSummary: {
        campaignName: `Campaign ${campaignId}`,
        duration: '30 days',
        totalPlays: 15,
        totalContacts: 50,
        successRate: '30%',
        roi: '50%',
      },
      performanceMetrics: {
        totalPlays: 15,
        totalContacts: 50,
        responseRate: '25%',
        playRate: '30%',
        averagePlaysPerContact: 0.3,
      },
      stationBreakdown: [
        { station: 'BBC Radio 1', plays: 5, contacts: 10, successRate: '50%' },
        { station: 'Capital FM', plays: 3, contacts: 8, successRate: '37.5%' },
        { station: 'Kiss FM', plays: 2, contacts: 6, successRate: '33.3%' },
        { station: 'Radio X', plays: 5, contacts: 26, successRate: '19.2%' },
      ],
      timeline: [
        { date: '2025-01-01', event: 'Campaign Launch', status: 'completed' },
        { date: '2025-01-05', event: 'First Response', status: 'completed' },
        { date: '2025-01-10', event: 'First Play', status: 'completed' },
        { date: '2025-01-15', event: 'Mid-Campaign Review', status: 'completed' },
        { date: '2025-01-25', event: 'Peak Activity', status: 'completed' },
        { date: '2025-01-31', event: 'Campaign End', status: 'completed' },
      ],
      recommendations: [
        'Focus on BBC Radio 1 and Capital FM for future campaigns',
        'Improve targeting for Radio X contacts',
        'Consider longer follow-up sequences for better response rates',
        'Implement more personalized pitches for higher success rates',
      ],
    };
  }

  serveReport(reportId, res) {
    const report = this.reports.get(reportId);
    if (!report) {
      res.writeHead(404);
      res.end('Report not found');
      return;
    }

    const html = this.generateReportHTML(report);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  generateReportHTML(report) {
    const content = report.content;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campaign Report - ${report.campaignName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #fff;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .header h1 {
            margin: 0;
            color: #000;
        }
        .header p {
            margin: 10px 0 0 0;
            color: #6b7280;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #000;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
        }
        .metric-label {
            color: #6b7280;
            margin-top: 5px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .table th {
            background: #f8f9fa;
            font-weight: bold;
        }
        .timeline {
            margin: 20px 0;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .timeline-date {
            font-weight: bold;
            margin-right: 20px;
            min-width: 100px;
        }
        .timeline-event {
            flex: 1;
        }
        .timeline-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-completed {
            background: #d1fae5;
            color: #065f46;
        }
        .recommendations {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        .recommendations ul {
            margin: 0;
            padding-left: 20px;
        }
        .recommendations li {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Campaign Report</h1>
        <p>${report.campaignName} - Generated ${new Date(report.generatedAt).toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${content.executiveSummary.totalPlays}</div>
                <div class="metric-label">Total Plays</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${content.executiveSummary.totalContacts}</div>
                <div class="metric-label">Total Contacts</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${content.executiveSummary.successRate}</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${content.executiveSummary.roi}</div>
                <div class="metric-label">ROI</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Station Performance</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Station</th>
                    <th>Plays</th>
                    <th>Contacts</th>
                    <th>Success Rate</th>
                </tr>
            </thead>
            <tbody>
                ${content.stationBreakdown
                  .map(
                    station => `
                    <tr>
                        <td>${station.station}</td>
                        <td>${station.plays}</td>
                        <td>${station.contacts}</td>
                        <td>${station.successRate}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Campaign Timeline</h2>
        <div class="timeline">
            ${content.timeline
              .map(
                item => `
                <div class="timeline-item">
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-event">${item.event}</div>
                    <div class="timeline-status status-${item.status}">${item.status}</div>
                </div>
            `
              )
              .join('')}
        </div>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        <div class="recommendations">
            <ul>
                ${content.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>
    `;
  }

  exportReport(reportId, res) {
    const report = this.reports.get(reportId);
    if (!report) {
      res.writeHead(404);
      res.end('Report not found');
      return;
    }

    // In real implementation, this would generate a PDF
    const html = this.generateReportHTML(report);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.reports = new Map(data.reports || []);
        this.campaigns = new Map(data.campaigns || []);
        console.log(`📚 Loaded client dashboard data: ${this.reports.size} reports`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load client dashboard data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        reports: Array.from(this.reports.entries()),
        campaigns: Array.from(this.campaigns.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save client dashboard data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: 'healthy',
      totalReports: this.reports.size,
      totalCampaigns: this.campaigns.size,
      lastChecked: new Date().toISOString(),
    };
  }
}

// Start dashboard if run directly
if (require.main === module) {
  const dashboard = new ClientDashboard();
  dashboard.start().catch(console.error);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down client dashboard...');
    if (dashboard.server) {
      dashboard.server.close();
    }
    process.exit(0);
  });
}

module.exports = ClientDashboard;
