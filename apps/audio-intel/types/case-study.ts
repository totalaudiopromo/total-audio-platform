/**
 * TypeScript interfaces for case study components
 * Supports programmatic content generation from data objects
 */

export interface CaseStudyHeroData {
  title: string;
  byline: {
    author: string;
    role: string;
    format: string;
    readTime: string;
  };
  introCallout: string;
}

export interface CampaignSnapshotData {
  context: string;
  manualEffort: {
    title: string;
    points: string[];
  };
  aiRun: {
    title: string;
    points: string[];
  };
}

export interface PainPoint {
  title: string;
  description: string;
}

export interface PainPointsSectionData {
  heading: string;
  intro: string;
  painPoints: PainPoint[];
}

export interface WorkflowStep {
  title: string;
  description: string;
}

export interface WorkflowBreakdownData {
  heading: string;
  intro: string;
  steps: WorkflowStep[];
}

export interface ContactData {
  name: string;
  roleAndShow: string;
  submissionNotes: string;
  validation: string;
}

export interface ContactsTableData {
  heading: string;
  contacts: ContactData[];
  disclaimer?: string;
}

export interface MetricData {
  title: string;
  description: string;
}

export interface ResultsMetricsData {
  heading: string;
  metrics: MetricData[];
}

export interface PlaybookChecklistData {
  heading: string;
  intro: string;
  steps: string[];
}

export interface TestimonialQuoteData {
  heading: string;
  quote: string;
  attribution?: string;
}

export interface DualCTAData {
  heading: string;
  intro: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}

/**
 * Complete case study data structure
 * Includes all sections for full case study page generation
 */
export interface CaseStudyData {
  hero: CaseStudyHeroData;
  campaignSnapshot: CampaignSnapshotData;
  painPoints: PainPointsSectionData;
  workflow: WorkflowBreakdownData;
  contacts: ContactsTableData;
  results: ResultsMetricsData;
  playbook: PlaybookChecklistData;
  testimonial: TestimonialQuoteData;
  cta: DualCTAData;
}
