/**
 * Example usage of case study components
 * This demonstrates how to use the reusable templates with data objects
 */

import type { CaseStudyData } from '@/types/case-study';
import {
  CaseStudyHero,
  CampaignSnapshot,
  PainPointsSection,
  WorkflowBreakdown,
  ContactsTable,
  ResultsMetrics,
  PlaybookChecklist,
  TestimonialQuote,
  DualCTA,
} from './index';

// Example data structure for a new case study
const exampleCaseStudyData: CaseStudyData = {
  hero: {
    title: 'Spotify Editorial Contact Enrichment: From 12 Hours to 90 Seconds',
    byline: {
      author: 'Chris Schofield',
      role: 'Radio promoter',
      format: 'Case study format',
      readTime: '8 min read',
    },
    introCallout:
      'This Spotify editorial campaign demonstrates how Audio Intel transforms playlist contact research from days of manual work into minutes of automated intelligence.',
  },
  campaignSnapshot: {
    context:
      'The artist: UK indie rock band aiming for Spotify editorial playlists. The goal: secure New Music Friday and genre-specific playlist additions.',
    manualEffort: {
      title: 'Manual Effort (Before Audio Intel)',
      points: [
        '12 hours researching Spotify editorial contacts across LinkedIn and industry forums',
        '8 potential contacts identified, 3 bounced or were outdated',
        'No clear submission guidelines for different playlist types',
        "Couldn't prove research quality to the artist",
      ],
    },
    aiRun: {
      title: 'Audio Intel Run (After Build)',
      points: [
        '90 seconds processing time for complete editorial contact list',
        '12 verified editorial contacts with playlist focus areas',
        '95% accuracy on email validation and playlist assignments',
        'Client-ready export with submission preferences',
      ],
    },
  },
  painPoints: {
    heading: 'Why Manual Spotify Research Failed',
    intro:
      "Spotify editorial contacts are notoriously difficult to find and verify. Here's what made the manual approach unsustainable.",
    painPoints: [
      {
        title: 'Fragmented contact sources',
        description:
          'Editorial contacts scattered across LinkedIn profiles, conference speaker lists, and outdated blog posts from 2019.',
      },
      {
        title: 'Rotating editorial teams',
        description:
          "Playlist curators move between roles frequently. Half the contacts found were people who'd left Spotify months earlier.",
      },
      {
        title: 'No submission validation',
        description:
          'Testing emails Friday afternoon led to bounce backs and damaged sender reputation before the campaign even started.',
      },
    ],
  },
  workflow: {
    heading: 'How Audio Intel Rebuilt the Spotify Contact List',
    intro:
      'Starting with artist names and guessed email patterns, Audio Intel did the heavy lifting in under two minutes.',
    steps: [
      {
        title: 'Upload messy data',
        description:
          'Dragged in a mix of CSV exports, LinkedIn screenshots, and old email threads. Parser extracted contact patterns automatically.',
      },
      {
        title: 'AI enrichment',
        description:
          'Platform crawled Spotify for Artists docs, Music Ally articles, conference speaker lists, and cross-referenced social profiles.',
      },
      {
        title: 'Validation and scoring',
        description:
          'Each contact went through SMTP testing and disposable domain checks. Sub-90% confidence contacts flagged for review.',
      },
      {
        title: 'Export with context',
        description:
          'CSV for Mailchimp plus PDF report showing playlist focus areas and recommended pitch timing.',
      },
    ],
  },
  contacts: {
    heading: 'Sample Spotify Editorial Contacts After Enrichment',
    contacts: [
      {
        name: 'Example Contact 1',
        roleAndShow: 'Editorial Lead - Rock Playlists',
        submissionNotes:
          'Focus on New Music Friday UK and Rock This submissions. Prefers streaming data and live performance evidence.',
        validation: 'Validated, 97% confidence',
      },
      {
        name: 'Example Contact 2',
        roleAndShow: 'Curator - Indie Playlists',
        submissionNotes:
          'Handles Fresh Finds and indie discovery. Send by Tuesday with DSP growth metrics.',
        validation: 'Validated, 94% confidence',
      },
    ],
    disclaimer:
      "Invalid contacts don't count toward monthly limits. Failed validations automatically trigger review.",
  },
  results: {
    heading: 'Campaign Results After Using Audio Intel',
    metrics: [
      {
        title: '11 Hours Saved',
        description:
          'Research time dropped from 12 hours to 90 seconds of processing plus quick review.',
      },
      {
        title: '3x Better Response Rate',
        description:
          'Personalised pitches with playlist context achieved 24% reply rate vs 8% on previous campaigns.',
      },
      {
        title: 'Artist Confidence',
        description:
          'Professional export with validation scores proved research quality. Artist signed for ongoing campaigns.',
      },
    ],
  },
  playbook: {
    heading: 'Your Spotify Editorial Playbook',
    intro: 'If you have any Spotify editorial contact data, run it through this exact workflow.',
    steps: [
      'Gather all contact fragments: inbox history, LinkedIn profiles, conference notes',
      'Upload to Audio Intel and tag as Spotify Editorial for targeted enrichment',
      'Review confidence scores, remove sub-85% contacts, request manual review if needed',
      'Export CSV for your email platform and PDF summary for artist approval',
      'Track campaign responses and feed back into Audio Intel for performance dashboards',
    ],
  },
  testimonial: {
    heading: 'What Promoters Are Saying',
    quote:
      'Audio Intel is the first tool that actually understands how Spotify editorial pitching works. The enriched intel alone justifies the subscription.',
    attribution: 'Beta user feedback, January 2025',
  },
  cta: {
    heading: 'Ready to Stop Guessing Spotify Contacts?',
    intro:
      'Audio Intel was built by promoters who pitch Spotify every week. Upload your messy contact data and get back validated contacts with submission context.',
    primaryButton: {
      text: 'Start Enriching Contacts',
      href: '/pricing?plan=professional&billing=monthly',
    },
    secondaryButton: {
      text: 'Try the Live Demo',
      href: '/demo',
    },
  },
};

// Example component usage
export function ExampleCaseStudyPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <CaseStudyHero data={exampleCaseStudyData.hero} />

      <div className="space-y-12">
        <CampaignSnapshot data={exampleCaseStudyData.campaignSnapshot} />
        <PainPointsSection data={exampleCaseStudyData.painPoints} />
        <WorkflowBreakdown data={exampleCaseStudyData.workflow} />
        <ContactsTable data={exampleCaseStudyData.contacts} />
        <ResultsMetrics data={exampleCaseStudyData.results} />
        <PlaybookChecklist data={exampleCaseStudyData.playbook} />
        <TestimonialQuote data={exampleCaseStudyData.testimonial} />
        <DualCTA data={exampleCaseStudyData.cta} />
      </div>
    </article>
  );
}
