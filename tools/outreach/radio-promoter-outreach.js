#!/usr/bin/env node

/**
 * Radio Promoter Automated Outreach System
 *
 * Automated email outreach to radio promoters for Audio Intel
 * No demos needed - fully self-serve with automated follow-ups
 */

const fs = require('fs').promises;
const path = require('path');

class RadioPromoterOutreach {
  constructor() {
    this.name = 'RadioPromoterOutreach';
    this.stats = {
      sent: 0,
      opened: 0,
      clicked: 0,
      signups: 0
    };
  }

  /**
   * Email templates for the outreach sequence
   */
  getEmailTemplates() {
    return {
      // Day 0: Initial outreach
      initial: {
        subject: "Save 15+ hours/week on contact research",
        body: `Hi {{firstName}},

I help radio promoters like you save massive amounts of time on contact research.

Most promoters waste 15+ hours per week manually researching:
- Station contacts & submission guidelines
- Genre focus & artist types
- Coverage areas & audience reach
- Best pitch angles for each contact

Audio Intel automates all of this. Upload your contact list, get detailed intelligence on every contact in minutes.

**Try it free**: intel.totalaudiopromo.com

No credit card. No demos. Just instant access.

See if it works for you in 5 minutes.

Best,
Chris
Total Audio Promo

P.S. FREE email validator included - verify your lists before you send.`
      },

      // Day 3: Follow-up (if no response)
      followUp1: {
        subject: "Re: Save 15+ hours/week on contact research",
        body: `Hi {{firstName}},

Quick follow-up - not sure if you saw my message about automating contact research.

The reality: Manual contact research is killing your productivity.

What if you could:
- Upload a CSV of contacts
- Get AI-powered intelligence on each one
- Know exactly how to pitch them
- All in under 5 minutes

That's Audio Intel.

**Free trial**: intel.totalaudiopromo.com

No strings attached. Cancel anytime.

Worth 5 minutes?

Chris`
      },

      // Day 7: Final follow-up
      followUp2: {
        subject: "Last note about Audio Intel",
        body: `{{firstName}},

Last message from me!

If you're happy spending hours on manual contact research, ignore this.

But if you'd rather spend that time on actual promotion work, give Audio Intel a shot.

**Free access**: intel.totalaudiopromo.com

Takes 2 minutes to try. Could save you 15+ hours per week.

Your call.

Chris

P.S. If this isn't relevant, reply "not interested" and I won't bother you again.`
      },

      // Nurture sequence (for people who clicked but didn't sign up)
      nurture: {
        subject: "How {{companyName}} saves 20 hours/week",
        body: `Hi {{firstName}},

Saw you checked out Audio Intel. Here's how it works in practice:

**Before Audio Intel**:
1. Google each contact name
2. Find their station/platform
3. Research submission guidelines
4. Check genre focus
5. Note best pitch angles
6. Repeat 100+ times per campaign

Time: 10-15 minutes per contact
Total: 15-20 hours for 100 contacts

**With Audio Intel**:
1. Upload CSV
2. Wait 5 minutes
3. Download enriched data

Time: 5 minutes total
Savings: 15-20 hours per campaign

**Try it**: intel.totalaudiopromo.com

Questions? Just reply to this email.

Chris`
      }
    };
  }

  /**
   * Generate personalized email content
   */
  personalize(template, contact) {
    let content = {
      subject: template.subject,
      body: template.body
    };

    // Replace placeholders
    const replacements = {
      '{{firstName}}': contact.firstName || contact.name?.split(' ')[0] || 'there',
      '{{lastName}}': contact.lastName || contact.name?.split(' ').slice(1).join(' ') || '',
      '{{companyName}}': contact.company || 'your company',
      '{{email}}': contact.email
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      content.subject = content.subject.replace(new RegExp(placeholder, 'g'), value);
      content.body = content.body.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }

  /**
   * Create outreach campaign configuration
   */
  async createCampaign(contactList, options = {}) {
    const campaign = {
      id: Date.now().toString(),
      name: options.name || 'Radio Promoter Outreach',
      status: 'draft',
      contacts: contactList,
      sequence: [
        { day: 0, template: 'initial', sent: false },
        { day: 3, template: 'followUp1', sent: false, condition: 'no_response' },
        { day: 7, template: 'followUp2', sent: false, condition: 'no_response' }
      ],
      stats: {
        total: contactList.length,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        signups: 0
      },
      createdAt: new Date().toISOString()
    };

    // Save campaign
    const campaignPath = path.join(__dirname, 'campaigns', `${campaign.id}.json`);
    await fs.mkdir(path.dirname(campaignPath), { recursive: true });
    await fs.writeFile(campaignPath, JSON.stringify(campaign, null, 2));

    console.log(`Campaign created: ${campaign.id}`);
    console.log(`Total contacts: ${campaign.contacts.length}`);

    return campaign;
  }

  /**
   * Load contact list from CSV
   */
  async loadContactsFromCSV(csvPath) {
    // This would use a CSV parser in production
    // For now, return sample structure
    return [
      {
        name: 'John Smith',
        firstName: 'John',
        email: 'john@radiostation.com',
        company: 'Radio Station XYZ',
        role: 'Music Director'
      }
    ];
  }

  /**
   * Generate email preview
   */
  async previewEmail(contact, templateName) {
    const templates = this.getEmailTemplates();
    const template = templates[templateName];

    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const personalized = this.personalize(template, contact);

    console.log('\n--- EMAIL PREVIEW ---');
    console.log(`To: ${contact.email}`);
    console.log(`Subject: ${personalized.subject}`);
    console.log('\nBody:');
    console.log(personalized.body);
    console.log('\n--- END PREVIEW ---\n');

    return personalized;
  }

  /**
   * Export campaign for use with Mailchimp/ConvertKit
   */
  async exportForMailchimp(campaignId) {
    const campaignPath = path.join(__dirname, 'campaigns', `${campaignId}.json`);
    const campaign = JSON.parse(await fs.readFile(campaignPath, 'utf8'));

    const mailchimpExport = {
      list_name: campaign.name,
      contacts: campaign.contacts.map(c => ({
        email_address: c.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: c.firstName || '',
          LNAME: c.lastName || '',
          COMPANY: c.company || ''
        }
      })),
      campaigns: campaign.sequence.map(seq => {
        const templates = this.getEmailTemplates();
        const template = templates[seq.template];
        return {
          name: `${campaign.name} - Day ${seq.day}`,
          subject: template.subject,
          content: template.body,
          send_time: seq.day
        };
      })
    };

    const exportPath = path.join(__dirname, 'exports', `mailchimp-${campaignId}.json`);
    await fs.mkdir(path.dirname(exportPath), { recursive: true });
    await fs.writeFile(exportPath, JSON.stringify(mailchimpExport, null, 2));

    console.log(`Mailchimp export saved to: ${exportPath}`);
    return exportPath;
  }
}

// CLI
if (require.main === module) {
  const outreach = new RadioPromoterOutreach();
  const command = process.argv[2];

  (async () => {
    switch (command) {
      case 'preview':
        const sampleContact = {
          name: 'Sarah Johnson',
          firstName: 'Sarah',
          email: 'sarah@radiopromo.com',
          company: 'Indie Radio Network'
        };
        await outreach.previewEmail(sampleContact, 'initial');
        await outreach.previewEmail(sampleContact, 'followUp1');
        break;

      case 'create':
        const contacts = await outreach.loadContactsFromCSV('./contacts.csv');
        const campaign = await outreach.createCampaign(contacts, {
          name: 'Radio Promoter Outreach Q4 2025'
        });
        console.log('Campaign ready! Next steps:');
        console.log('1. Review email templates');
        console.log('2. Export to Mailchimp or use built-in sender');
        console.log('3. Monitor results');
        break;

      default:
        console.log(`
Radio Promoter Outreach System

Commands:
  preview           Preview email templates
  create            Create new outreach campaign
  export <id>       Export campaign to Mailchimp

Examples:
  node radio-promoter-outreach.js preview
  node radio-promoter-outreach.js create
        `);
    }
  })().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = RadioPromoterOutreach;
