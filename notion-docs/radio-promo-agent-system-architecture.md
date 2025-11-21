---
title: ' RADIO PROMO AGENT - SYSTEM ARCHITECTURE'
notion_url: https://www.notion.so/RADIO-PROMO-AGENT-SYSTEM-ARCHITECTURE-2620a35b21ed819cbffef018e480bcb5
exported_at: 2025-09-26T14:33:14.119Z
---

#  RADIO PROMO AGENT - SYSTEM ARCHITECTURE

_Automated radio promotion workflow for Liberty Music PR integration with Total Audio ecosystem_

---

## Executive Summary

**Vision**: Transform Chris's manual radio promotion workflow into a fully automated system that handles 80% of repetitive tasks while providing real-time client dashboards and campaign tracking.

**Current Workflow Pain Points**:

- Manual press release creation in Mailchimp (2-3 hours)

- Individual radio station uploads (Amazing Radio, Wigwam Radio)

- £10 European Indie Music Network manual purchasing

- Weekly client email updates requiring manual data collection

- [Warmusic.net](http://warmusic.net/) tracking requires constant manual checking

**Automated Solution**:

- Typeform submission → Instant campaign creation

- AI-generated press releases

- Automated radio station submissions where possible

- Real-time client dashboard with campaign metrics

- Automated weekly reporting

---

## System Architecture Overview

### Two-Portal Strategy

### **PR Agency Portal (Chris's Dashboard)**

- Campaign management and oversight

- Client onboarding and setup

- Revenue tracking and business metrics

- System configuration and customisation

- Bulk campaign operations

### **Client Portal (Artist Dashboard)**

- Real-time campaign status updates

- Email metrics (opens, clicks, replies)

- Radio play tracking (when available)

- Weekly automated reports

- Campaign timeline and milestones

---

## API Research Results

###  **Limited API Access**

- [**Warmusic.net**](http://warmusic.net/): No public API (uses ACRCloud internally)

- **Amazing Radio**: Manual upload only through [amazingtunes.com](http://amazingtunes.com/)

- **European Indie Music Network**: Email-based submission only

- **Wigwam Radio**: No public API identified

###  **Available Integrations**

- **Mailchimp API**: Full campaign automation

- **Typeform Webhooks**: Instant form submission capture

- **SendGrid/Email APIs**: Client communication automation

- **Apify**: Web scraping for radio station automation

- **Stripe API**: Payment processing for £10 packages

---

## Apify Integration Strategy

**What Is Apify**: Web scraping and browser automation platform (€49/month)

**Use Cases for Radio Promo**:

1. **Amazing Radio Automation**: Browser automation for track uploads

1. [**Warmusic.net**](http://warmusic.net/)** Scraping**: Automated play tracking data collection

1. **Radio Station Discovery**: Scraping contact databases

1. **European Network Integration**: Automated email submissions

**Benefits**:

- Turns manual tasks into API-like automation

- Scheduled execution (weekly/daily runs)

- Error handling and retry logic

- Data extraction and normalisation

---

## Core System Components

### 1. **Campaign Automation Engine**

**Trigger**: Typeform webhook from artist submission

**Automated Workflow**:

```javascript
Artist Submits Form → Webhook → Database Entry → Automation Triggers:

 Instant (0-2 mins):
- Artist data captured and validated
- Campaign ID generated
- Client portal access created

 5 Minutes:
- AI press release generated from artist data
- Mailchimp campaign created with personalised content
- Radio station list filtered by genre/preferences

 15 Minutes:
- Email campaign scheduled and sent
- Client receives campaign launch notification
- PR agency dashboard updated with new campaign

 30 Minutes:
- European Indie Music Network £10 package automated purchase
- Amazing Radio upload queued (manual review required)
- Warmusic.net tracking setup initiated

 Weekly:
- Automated play tracking data collection
- Client progress reports generated and sent
- Campaign performance analytics updated
```

### 2. **Real-Time Client Dashboard**

**Core Metrics Display**:

- Campaign timeline with milestone tracking

- Email metrics: sent, delivered, opened, clicked, replied

- Radio station contact count and response rates

- Play tracking data (when available)

- Weekly progress summaries

**Features**:

- Mobile-responsive design

- Real-time updates via WebSocket connections

- Downloadable reports and analytics

- Direct messaging with PR agency

- Campaign modification requests

### 3. **PR Agency Command Centre**

**Multi-Client Management**:

- Overview dashboard with all active campaigns

- Revenue tracking and client billing

- Campaign performance benchmarking

- System health monitoring

- Bulk operations and batch processing

**Business Intelligence**:

- Success rate analytics by genre/artist type

- Radio station response rate tracking

- Revenue forecasting and growth metrics

- Client retention and satisfaction scores

---

## Technical Implementation Plan

### **Phase 1: Foundation (Weeks 1-2)**

- Database schema design for campaigns, artists, radio stations

- Typeform webhook integration and data validation

- Basic PR agency and client portal authentication

- Mailchimp API integration for campaign creation

### **Phase 2: Automation Core (Weeks 3-4)**

- AI press release generation system

- Email campaign automation and tracking

- Real-time dashboard with basic metrics

- Payment processing for European Network packages

### **Phase 3: Advanced Integration (Weeks 5-6)**

- Apify scraping scripts for Amazing Radio and [Warmusic.net](http://warmusic.net/)

- Advanced client dashboard with full metrics

- Automated reporting system

- Mobile optimisation and performance tuning

### **Phase 4: Scale & Optimise (Weeks 7-8)**

- Multi-client portal management

- Advanced analytics and business intelligence

- System monitoring and error handling

- Beta testing with pilot clients

---

## Revenue Model Integration

### **Pricing Tiers**:

- **Basic**: £50/campaign (automated workflow + basic reporting)

- **Professional**: £75/campaign (includes real-time dashboard + advanced tracking)

- **Premium**: £100/campaign (white-label client portal + custom branding)

### **Cost Structure**:

- Apify: €49/month for automation

- Server costs: ~£30/month

- Email/SMS APIs: ~£20/month

- Total operational cost: ~£100/month

- Break-even: 2-3 campaigns monthly

---

## Success Metrics

### **Efficiency Gains**:

- Time saved per campaign: 80% (from 4 hours to 45 minutes)

- Client capacity increase: 3-4x current volume

- Response time improvement: instant vs 24-48 hours

### **Client Experience**:

- Real-time visibility into campaign progress

- Professional dashboard and reporting

- Automated communication and updates

- Higher perceived value and engagement

### **Business Growth**:

- Monthly recurring revenue potential

- Scalable service delivery model

- Premium pricing for automation value

- Market differentiation vs manual competitors

---

## Next Steps

### **Immediate Actions (This Week)**:

1. Map current press release templates and email sequences

1. Document exact radio station submission requirements

1. Test Typeform webhook integration with basic database

1. Research Apify capabilities for Amazing Radio automation

### **Development Priority (Next 2 Weeks)**:

1. Build core database schema and API endpoints

1. Create basic two-portal authentication system

1. Implement Mailchimp campaign automation

1. Develop AI press release generation

### **Beta Launch Target (4-6 Weeks)**:

- 3-5 pilot campaigns with existing clients

- Basic client dashboard functionality

- Automated email tracking and reporting

- Manual fallbacks for complex requirements

---

**This system represents the perfect bridge between your current Liberty Music PR operations and the Total Audio ecosystem vision - proving automation value while building the foundation for the complete music promotion platform.**

_Updated: September 2025 | Next Review: Weekly during development phase_
