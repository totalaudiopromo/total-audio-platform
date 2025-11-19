/**
 * Audio Intel Quick Widget
 * Embeddable contact enrichment widget with 3 free enrichments
 *
 * Usage:
 * <script src="https://intel.totalaudiopromo.com/widget.js"></script>
 * <div id="audio-intel-widget" data-api-url="https://intel.totalaudiopromo.com"></div>
 */

(function () {
  'use strict';

  const WIDGET_VERSION = '1.0.0';
  const DEFAULT_API_URL = 'https://intel.totalaudiopromo.com';
  const FREE_ENRICHMENT_LIMIT = 3;

  class AudioIntelWidget {
    constructor(containerId, apiUrl) {
      this.container = document.getElementById(containerId);
      this.apiUrl = apiUrl || DEFAULT_API_URL;
      this.sessionId = this.getOrCreateSessionId();
      this.enrichmentsUsed = this.getEnrichmentsUsed();
      this.enrichmentsLimit = FREE_ENRICHMENT_LIMIT;

      this.init();
    }

    init() {
      if (!this.container) {
        console.error('Audio Intel Widget: Container not found');
        return;
      }

      this.render();
      this.attachEventListeners();
      this.trackWidgetLoad();
    }

    getOrCreateSessionId() {
      try {
        let sessionId = localStorage.getItem('audio_intel_widget_session');
        if (!sessionId) {
          sessionId = 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('audio_intel_widget_session', sessionId);
        }
        return sessionId;
      } catch (e) {
        // Fallback if localStorage is not available (private browsing, etc.)
        return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }
    }

    getEnrichmentsUsed() {
      try {
        const used = localStorage.getItem('audio_intel_widget_enrichments_used');
        return used ? parseInt(used) : 0;
      } catch (e) {
        return 0;
      }
    }

    setEnrichmentsUsed(count) {
      this.enrichmentsUsed = count;
      try {
        localStorage.setItem('audio_intel_widget_enrichments_used', count.toString());
      } catch (e) {
        // Silently fail if localStorage is not available
      }
      this.updateEnrichmentCounter();
    }

    render() {
      const remainingEnrichments = Math.max(0, this.enrichmentsLimit - this.enrichmentsUsed);

      this.container.innerHTML = `
        <div class="audio-intel-widget" style="${this.getWidgetStyles()}">
          <div class="widget-header">
            <h3>🎵 Quick Intel</h3>
            <p>Try Audio Intel - ${remainingEnrichments} free enrichments remaining</p>
          </div>

          <div class="widget-form">
            <input
              type="email"
              id="widget-email"
              placeholder="Enter contact email..."
              style="${this.getInputStyles()}"
            />
            <input
              type="text"
              id="widget-name"
              placeholder="Contact name (optional)"
              style="${this.getInputStyles()}"
            />
            <button
              id="widget-enrich-btn"
              style="${this.getButtonStyles()}"
              ${remainingEnrichments === 0 ? 'disabled' : ''}
            >
              ${remainingEnrichments > 0 ? 'Enrich Contact' : 'Upgrade for More'}
            </button>
          </div>

          <div id="widget-result" class="widget-result" style="display: none; ${this.getResultStyles()}">
            <!-- Results will appear here -->
          </div>

          <div class="widget-footer" style="${this.getFooterStyles()}">
            <p>Powered by <a href="${this.apiUrl}" target="_blank" style="color: #3AA9BE;">Audio Intel</a></p>
          </div>
        </div>
      `;
    }

    attachEventListeners() {
      const enrichBtn = document.getElementById('widget-enrich-btn');
      const emailInput = document.getElementById('widget-email');
      const nameInput = document.getElementById('widget-name');

      if (enrichBtn) {
        enrichBtn.addEventListener('click', () => {
          const email = emailInput?.value.trim();
          const name = nameInput?.value.trim();

          if (!email) {
            this.showError('Please enter an email address');
            return;
          }

          if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
          }

          if (this.enrichmentsUsed >= this.enrichmentsLimit) {
            this.showUpgradePrompt();
            return;
          }

          this.enrichContact(email, name);
        });
      }
    }

    async enrichContact(email, name = '') {
      const enrichBtn = document.getElementById('widget-enrich-btn');
      const resultDiv = document.getElementById('widget-result');

      if (enrichBtn) enrichBtn.disabled = true;
      if (enrichBtn) enrichBtn.textContent = 'Enriching...';

      try {
        const response = await fetch(`${this.apiUrl}/api/enrich-lite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            sessionId: this.sessionId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Enrichment failed');
        }

        this.setEnrichmentsUsed(this.enrichmentsUsed + 1);
        this.showResult(data.enriched);
        this.trackEnrichment(email, 'success');
      } catch (error) {
        console.error('Enrichment error:', error);
        this.showError(error.message || 'Failed to enrich contact');
        this.trackEnrichment(email, 'failed');
      } finally {
        if (enrichBtn) {
          enrichBtn.disabled = this.enrichmentsUsed >= this.enrichmentsLimit;
          enrichBtn.textContent =
            this.enrichmentsUsed >= this.enrichmentsLimit ? 'Upgrade for More' : 'Enrich Contact';
        }
      }
    }

    showResult(enrichedData) {
      const resultDiv = document.getElementById('widget-result');
      if (!resultDiv) return;

      const intelligence = enrichedData.contactIntelligence || 'No intelligence available';
      const confidence = enrichedData.researchConfidence || 'Unknown';

      resultDiv.innerHTML = `
        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <div style="margin-bottom: 10px;">
            <strong>Contact:</strong> ${enrichedData.name || enrichedData.email}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Intelligence:</strong>
            <div style="margin-top: 5px; white-space: pre-wrap;">${intelligence}</div>
          </div>
          <div>
            <strong>Confidence:</strong>
            <span style="display: inline-block; padding: 2px 8px; background: ${this.getConfidenceColor(confidence)}; color: white; border-radius: 4px; font-size: 12px;">
              ${confidence}
            </span>
          </div>
        </div>
        ${this.enrichmentsUsed >= this.enrichmentsLimit ? this.getUpgradeCTA() : ''}
      `;

      resultDiv.style.display = 'block';
    }

    showError(message) {
      const resultDiv = document.getElementById('widget-result');
      if (!resultDiv) return;

      resultDiv.innerHTML = `
        <div style="padding: 15px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
          <strong>Error:</strong> ${message}
        </div>
      `;

      resultDiv.style.display = 'block';
    }

    showUpgradePrompt() {
      const resultDiv = document.getElementById('widget-result');
      if (!resultDiv) return;

      resultDiv.innerHTML = this.getUpgradeCTA();
      resultDiv.style.display = 'block';
    }

    getUpgradeCTA() {
      return `
        <div style="padding: 20px; background: linear-gradient(135deg, #3AA9BE 0%, #2d8a9a 100%); color: white; border-radius: 8px; text-align: center; margin-top: 15px;">
          <h4 style="margin: 0 0 10px 0;">You've used all ${this.enrichmentsLimit} free enrichments!</h4>
          <p style="margin: 0 0 15px 0;">Upgrade to Audio Intel PRO for unlimited enrichments</p>
          <a
            href="${this.apiUrl}/pricing"
            target="_blank"
            style="display: inline-block; padding: 10px 20px; background: white; color: #3AA9BE; text-decoration: none; border-radius: 6px; font-weight: 600;"
          >
            View Pricing →
          </a>
        </div>
      `;
    }

    updateEnrichmentCounter() {
      const headerP = this.container.querySelector('.widget-header p');
      if (headerP) {
        const remaining = Math.max(0, this.enrichmentsLimit - this.enrichmentsUsed);
        headerP.textContent = `Try Audio Intel - ${remaining} free enrichments remaining`;
      }
    }

    trackWidgetLoad() {
      // Track widget load event
      fetch(`${this.apiUrl}/api/widget-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'widget_load',
          sessionId: this.sessionId,
          version: WIDGET_VERSION,
          url: window.location.href,
        }),
      }).catch(() => {
        /* Silent fail */
      });
    }

    trackEnrichment(email, status) {
      fetch(`${this.apiUrl}/api/widget-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'enrichment',
          sessionId: this.sessionId,
          email,
          status,
          enrichmentsUsed: this.enrichmentsUsed,
        }),
      }).catch(() => {
        /* Silent fail */
      });
    }

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    getConfidenceColor(confidence) {
      const c = confidence.toLowerCase();
      if (c === 'high') return '#22c55e';
      if (c === 'medium') return '#f59e0b';
      return '#ef4444';
    }

    // Inline styles
    getWidgetStyles() {
      return `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 400px;
        padding: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `;
    }

    getInputStyles() {
      return `
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
      `;
    }

    getButtonStyles() {
      return `
        width: 100%;
        padding: 12px;
        background: #3AA9BE;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      `;
    }

    getResultStyles() {
      return `
        margin-top: 15px;
      `;
    }

    getFooterStyles() {
      return `
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      `;
    }
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  function initWidget() {
    const widgetContainer = document.getElementById('audio-intel-widget');
    if (widgetContainer) {
      const apiUrl = widgetContainer.getAttribute('data-api-url') || DEFAULT_API_URL;
      new AudioIntelWidget('audio-intel-widget', apiUrl);
    }
  }

  // Expose widget class globally for manual initialization
  window.AudioIntelWidget = AudioIntelWidget;
})();
