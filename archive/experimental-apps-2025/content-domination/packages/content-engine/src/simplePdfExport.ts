// 🎯 Enhanced PDF Export for Audio Intel
// Works in browser without complex dependencies
// Styled to match the Audio Intel brand with cards, shadows, and proper colour scheme

export interface SimpleContact {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  location?: string;
  enrichmentScore: number;
  confidence: string;
  validation: any;
  contactIntelligence?: string;
  researchConfidence?: string;
  lastResearched?: string;
  platform?: string;
}

export function downloadSimplePDF(
  contacts: SimpleContact[],
  filename: string = 'audio-intel-contacts.pdf'
) {
  try {
    // Create a professional HTML document with Audio Intel branding
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Audio Intel - Contact Intelligence Report</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              background: #f8fafc;
              color: #1e293b;
              line-height: 1.6;
              padding: 20px;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              overflow: hidden;
            }
            
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .logo { 
              font-size: 32px; 
              font-weight: 900; 
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .subtitle {
              font-size: 18px;
              font-weight: 500;
              opacity: 0.95;
              margin-bottom: 16px;
            }
            
            .timestamp { 
              font-size: 14px; 
              opacity: 0.8;
              background: rgba(255,255,255,0.1);
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              backdrop-filter: blur(10px);
            }
            
            .summary { 
              background: white;
              padding: 30px;
              margin: 30px;
              border-radius: 16px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              border: 1px solid #e2e8f0;
            }
            
            .summary h3 { 
              margin-bottom: 20px; 
              color: #1e293b;
              font-size: 24px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }
            
            .summary-item {
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            
            .summary-number {
              font-size: 28px;
              font-weight: 800;
              color: #3b82f6;
              margin-bottom: 8px;
            }
            
            .summary-label {
              font-size: 14px;
              color: #64748b;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .contacts-section {
              padding: 0 30px 30px;
            }
            
            .contacts-grid {
              display: grid;
              gap: 20px;
            }
            
            .contact { 
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 24px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              transition: all 0.2s ease;
              position: relative;
              overflow: hidden;
            }
            
            .contact::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            }
            
            .contact:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            .contact h4 { 
              margin-bottom: 16px; 
              color: #1e293b;
              font-size: 18px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .contact-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
              margin-bottom: 20px;
            }
            
            .contact-field {
              background: #f8fafc;
              padding: 12px 16px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .contact-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .contact-value {
              font-size: 14px;
              color: #1e293b;
              font-weight: 500;
            }
            
            .metrics-row {
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
              align-items: center;
            }
            
            .score { 
              display: inline-flex;
              align-items: center;
              padding: 8px 16px; 
              border-radius: 20px; 
              color: white; 
              font-weight: 700;
              font-size: 14px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .score-high { background: linear-gradient(135deg, #10b981, #059669); }
            .score-medium { background: linear-gradient(135deg, #f59e0b, #d97706); }
            .score-low { background: linear-gradient(135deg, #ef4444, #dc2626); }
            
            .confidence { 
              display: inline-flex;
              align-items: center;
              padding: 8px 16px; 
              border-radius: 20px; 
              color: white; 
              font-weight: 700;
              font-size: 14px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .confidence-high { background: linear-gradient(135deg, #10b981, #059669); }
            .confidence-medium { background: linear-gradient(135deg, #f59e0b, #d97706); }
            .confidence-low { background: linear-gradient(135deg, #ef4444, #dc2626); }
            
            .validation-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .validation-valid {
              background: #dcfce7;
              color: #166534;
              border: 1px solid #bbf7d0;
            }
            
            .validation-invalid {
              background: #fee2e2;
              color: #991b1b;
              border: 1px solid #fecaca;
            }
            
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              color: #64748b; 
              font-size: 14px;
              padding: 30px;
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
            }
            
            .footer-logo {
              font-size: 20px;
              font-weight: 800;
              color: #3b82f6;
              margin-bottom: 8px;
            }
            
            .footer-url {
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
            }
            
            @media print {
              body { background: white; padding: 0; }
              .container { box-shadow: none; border-radius: 0; }
              .contact:hover { transform: none; }
              .header { background: #3b82f6 !important; -webkit-print-color-adjust: exact; }
              .score, .confidence { -webkit-print-color-adjust: exact; }
            }
            
            @media (max-width: 768px) {
              body { padding: 10px; }
              .container { margin: 0; border-radius: 8px; }
              .header { padding: 30px 20px; }
              .summary { margin: 20px; padding: 20px; }
              .contacts-section { padding: 0 20px 20px; }
              .contact-grid { grid-template-columns: 1fr; }
              .metrics-row { flex-direction: column; align-items: flex-start; gap: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎵 AUDIO INTEL</div>
              <div class="subtitle">Contact Intelligence Report</div>
              <div class="timestamp">Generated: ${new Date().toLocaleString('en-GB')}</div>
            </div>
            
            <div class="summary">
              <h3>📊 Intelligence Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-number">${contacts.length}</div>
                  <div class="summary-label">Total Contacts</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${contacts.filter(c => c.validation?.isValid).length}</div>
                  <div class="summary-label">Valid Emails</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${contacts.filter(c => c.confidence === 'High').length}</div>
                  <div class="summary-label">High Confidence</div>
                </div>
                <div class="summary-item">
                  <div class="summary-number">${Math.round(contacts.reduce((sum, c) => sum + c.enrichmentScore, 0) / contacts.length)}</div>
                  <div class="summary-label">Avg Score</div>
                </div>
              </div>
            </div>
            
            <div class="contacts-section">
              <div class="contacts-grid">
                ${contacts
                  .map(
                    contact => `
                  <div class="contact">
                    <h4>📧 ${contact.email}</h4>
                    
                    <div class="contact-grid">
                      <div class="contact-field">
                        <div class="contact-label">Name</div>
                        <div class="contact-value">${contact.name || 'Unknown'}</div>
                      </div>
                      <div class="contact-field">
                        <div class="contact-label">Company</div>
                        <div class="contact-value">${contact.company || 'Unknown'}</div>
                      </div>
                      <div class="contact-field">
                        <div class="contact-label">Role</div>
                        <div class="contact-value">${contact.role || 'Unknown'}</div>
                      </div>
                      <div class="contact-field">
                        <div class="contact-label">Location</div>
                        <div class="contact-value">${contact.location || 'Unknown'}</div>
                      </div>
                    </div>
                    
                    ${
                      contact.contactIntelligence
                        ? `
                      <div class="contact-field" style="grid-column: 1 / -1;">
                        <div class="contact-label">Intelligence</div>
                        <div class="contact-value">${contact.contactIntelligence}</div>
                      </div>
                    `
                        : ''
                    }
                    
                    <div class="metrics-row">
                      <span class="score ${contact.enrichmentScore >= 80 ? 'score-high' : contact.enrichmentScore >= 60 ? 'score-medium' : 'score-low'}">
                        ${contact.enrichmentScore}/100
                      </span>
                      <span class="confidence ${contact.confidence === 'High' ? 'confidence-high' : contact.confidence === 'Medium' ? 'confidence-medium' : 'confidence-low'}">
                        ${contact.confidence} Confidence
                      </span>
                      <span class="validation-badge ${contact.validation?.isValid ? 'validation-valid' : 'validation-invalid'}">
                        ${contact.validation?.isValid ? '✅ Valid Email' : '❌ Invalid Email'}
                      </span>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">🎵 AUDIO INTEL</div>
              <p>Contact Intelligence for Music Industry Professionals</p>
              <p><a href="https://intel.totalaudiopromo.com" class="footer-url">intel.totalaudiopromo.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
}

// Alternative: Export as CSV for better compatibility
export function downloadCSV(
  contacts: SimpleContact[],
  filename: string = 'audio-intel-contacts.csv'
) {
  try {
    const headers = [
      'Email',
      'Name',
      'Company',
      'Role',
      'Location',
      'Enrichment Score',
      'Confidence',
      'Valid Email',
    ];
    const rows = contacts.map(contact => [
      contact.email,
      contact.name || '',
      contact.company || '',
      contact.role || '',
      contact.location || '',
      contact.enrichmentScore,
      contact.confidence,
      contact.validation?.isValid ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
}
