/**
 * BBC Radio 1 Case Study Data
 * Extracted content from the original case study for reference
 * Use this as a template for creating new case studies
 */

import type { CaseStudyData } from '@/types/case-study';

export const bbcRadio1CaseStudyData: CaseStudyData = {
  hero: {
    title: 'BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes',
    byline: {
      author: 'Chris Schofield',
      role: 'Radio promoter',
      format: 'Case study format',
      readTime: '10 min read',
    },
    introCallout:
      'This is the exact BBC Radio 1 campaign that finally pushed me to build Audio Intel. I timed the manual research at 18 hours across a weekend. The same work now takes under 2 minutes with enrichment and validation baked in. Here is the full breakdown, including the contacts we enriched and the process you can follow.',
  },

  campaignSnapshot: {
    context:
      "The artist: Brighton electronic producer sadact with a release aimed squarely at BBC Radio 1's specialist shows. The goal: secure first plays on new music slots and weekend dance programming. Below are the numbers that mattered.",
    manualEffort: {
      title: 'Manual Effort (Before Audio Intel)',
      points: [
        '18 hours spent across two days digging through BBC sites, LinkedIn, and social feeds',
        '12 potential contacts identified, 4 bounced when tested',
        'Submission rules scattered across outdated blog posts and archived forum threads',
        'No consistent way to prove the work to the artist beyond a messy spreadsheet',
      ],
    },
    aiRun: {
      title: 'Audio Intel Run (After Build)',
      points: [
        '1 minute 48 seconds processing time for the same seed list',
        '5 primary contacts enriched with coverage focus and submission preferences',
        '90 percent accuracy threshold hit on email validation and show assignment',
        'Client-ready PDF and CSV export generated automatically',
      ],
    },
  },

  painPoints: {
    heading: 'Where Manual Research Fell Apart',
    intro:
      'BBC Radio 1 is ruthless about pitching hygiene. Every show has its own producer flow, upload link, and timing window. Here are the problems that killed the first attempt.',
    painPoints: [
      {
        title: 'Fragmented submission rules',
        description:
          'Core guidelines live on BBC Introducing, specialist shows rely on private email intros, and some still use the old uploader. Tracking what was current took half the time on its own.',
      },
      {
        title: 'Rotating producer teams',
        description:
          'Contact details on public pages lag behind the real team. Two of the emails I found belonged to producers who had moved to Spotify editorial months earlier.',
      },
      {
        title: 'No validation safety net',
        description:
          'Sending test emails on Friday night led to 500 errors and spam trap warnings, which is the fastest way to damage a campaign before it starts.',
      },
      {
        title: 'Zero evidence for clients',
        description:
          'I could not prove the difference between the four hours spent researching specialist shows versus the ten minutes on playlist curators. It all looked the same in a spreadsheet.',
      },
    ],
  },

  workflow: {
    heading: 'How the Audio Intel Workflow Rebuilt the Campaign',
    intro:
      'The enrichment run started with the original contact list: names, guessed emails, half-complete notes. Audio Intel did the heavy lifting.',
    steps: [
      {
        title: 'Upload anything',
        description:
          'I dragged the original CSV, a Notion export, and two screenshots into the uploader. The parser picked out email patterns, social handles, and job titles without extra prep.',
      },
      {
        title: 'Enrichment and cross-checking',
        description:
          'The platform crawled BBC programme pages, talent social feeds, Reddit show threads, and press mentions. It matched proof points like recent track premiers and mixed them back into the contact profile.',
      },
      {
        title: 'Validation and risk scoring',
        description:
          'Each address went through SMTP testing, disposable domain detection, and role-based analysis. Anything below the 90 percent confidence threshold was flagged instead of silently exported.',
      },
      {
        title: 'Report outputs',
        description:
          'The enriched contact set was exported to CSV for my own Mailchimp segment, and a PDF summary highlighted submission rules plus recommended follow up windows for the artist.',
      },
    ],
  },

  contacts: {
    heading: 'Sample BBC Radio 1 Contacts After Enrichment',
    contacts: [
      {
        name: 'Jack Saunders',
        roleAndShow: 'Future Sounds (New Music Show)',
        submissionNotes:
          'Weeknight new music specialist. Prefers Dropbox links with one-line positioning and streaming stats.',
        validation: 'Validated, 96 percent confidence',
      },
      {
        name: 'Charlie Hedges',
        roleAndShow: "Radio 1's Dance Anthems",
        submissionNotes:
          'Weekend dance programming. Send by Thursday with club support and tempo notes.',
        validation: 'Validated, 94 percent confidence',
      },
      {
        name: 'Danny Howard',
        roleAndShow: 'Radio 1 Dance',
        submissionNotes:
          'Dance music specialist. Provide evidence of DJ support and festival bookings.',
        validation: 'Validated, 95 percent confidence',
      },
      {
        name: 'Sarah Story',
        roleAndShow: 'Radio 1 Dance',
        submissionNotes:
          'Dance programming specialist. Requests WAV files via preferred platforms with mix notes.',
        validation: 'Validated, 93 percent confidence',
      },
      {
        name: 'Arielle Free',
        roleAndShow: 'Radio 1 Dance Morning Show',
        submissionNotes:
          'Morning dance slots. Include streaming data and social proof with submissions.',
        validation: 'Validated, 92 percent confidence',
      },
    ],
    disclaimer:
      'Wrong intel does not count toward monthly allotments. Anything that fails validation gets kicked back for review automatically.',
  },

  results: {
    heading: 'What Changed After Switching to Enrichment',
    metrics: [
      {
        title: '15 Hours Saved',
        description:
          'Manual research dropped from 18 hours to 2 minutes of processing time plus a quick review. That margin paid for a second campaign the same week.',
      },
      {
        title: 'Higher Reply Rate',
        description:
          'Personalised outreach referencing show segments and recent plays produced a 32 percent reply rate, up from 9 percent on the previous attempt.',
      },
      {
        title: 'Client Confidence',
        description:
          'The export showed submission windows, accuracy scores, and proof of work. The artist signed off on a six month retainer immediately after the campaign.',
      },
    ],
  },

  playbook: {
    heading: 'Use This Playbook for Your Next BBC Radio 1 Pitch',
    intro:
      'If you already have a BBC Radio 1 contact list in any shape or form, the fastest route is to run it through the same workflow. Here is the exact checklist I give clients.',
    steps: [
      'Gather every scrap of contact data you have: inbox history, Airtable exports, Discord DMs, anything.',
      'Upload to Audio Intel and tag the campaign as BBC Radio 1 so the enrichment engine scopes the right sources.',
      'Review the risk scores, remove anything below 85 percent confidence, and request manual review inside the app if needed.',
      'Export the CSV for your mailer, and send the PDF summary to the artist or label to prove the prep work.',
      'Track replies inside your CRM and feed them back into Audio Intel for live activity dashboards.',
    ],
  },

  testimonial: {
    heading: 'What Other Promoters Say',
    quote:
      'I have been promoting to UK radio for eight years. Audio Intel is the first tool that actually respects how BBC Radio 1 works. The enriched intel alone is worth the subscription.',
    attribution: 'Pulled from internal beta feedback, January 2025.',
  },

  cta: {
    heading: 'Ready to Stop Guessing BBC Radio 1 Contacts?',
    intro:
      'Audio Intel was built by people who actually pitch BBC Radio 1 every month. Drop your messy spreadsheet, and we will return validated contacts, submission rules, and follow up reminders so you spend time on the music rather than the admin.',
    primaryButton: {
      text: 'Drop Your Chaos Here',
      href: '/pricing?plan=professional&billing=monthly',
    },
    secondaryButton: {
      text: 'Try the Live Demo',
      href: '/demo',
    },
  },
};
