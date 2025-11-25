import type {
  TrackerCampaignDetail,
  CoverageSummary,
  WarmSpin,
  TypeformSubmission,
  MondayTimeline,
  MondayAllocation,
  PitchEvent,
  DriveAsset,
} from './types';

export interface OpsHubKpi {
  label: string;
  value: string;
  hint?: string;
}

export interface OpsHubPhase {
  id: string;
  label: string;
  status: 'not-started' | 'active' | 'complete';
  startDate?: string;
  endDate?: string;
}

export interface OpsHubEvent {
  id: string;
  type: 'press' | 'radio' | 'pitch' | 'intake' | 'task';
  occurredAt: string;
  title: string;
  source: string; // e.g. 'CoverageBook', 'WARM', 'Pitch Engine', 'Typeform', 'Monday'
  detail?: string;
}

export interface OpsHubData {
  campaignId: string;
  campaignName: string;
  artistName: string;
  kpis: OpsHubKpi[];
  phases: OpsHubPhase[];
  events: OpsHubEvent[];
  missingIntakeFields: string[];
  mondayTasksSummary?: {
    total: number;
    open: number;
    atRisk: number;
  };
  coverageSummaryLabel?: string;
  warmSummaryLabel?: string;
  assetStatusLabel?: string;
}

/**
 * Build the Ops Hub view model from raw data sources
 */
export function buildOpsHubData(args: {
  campaign: TrackerCampaignDetail;
  coverageSummary?: CoverageSummary | null;
  warmSpins?: WarmSpin[] | null;
  typeformSubmissions?: TypeformSubmission[] | null;
  mondayTimelines?: MondayTimeline[] | null;
  mondayAllocations?: MondayAllocation[] | null;
  pitchEvents?: PitchEvent[] | null;
  assets?: DriveAsset[] | null;
}): OpsHubData {
  const {
    campaign,
    coverageSummary,
    warmSpins,
    typeformSubmissions,
    mondayTimelines,
    pitchEvents,
    assets,
  } = args;

  // Build KPIs
  const kpis: OpsHubKpi[] = [
    {
      label: 'Momentum',
      value: campaign.momentum.toString(),
      hint: 'Campaign momentum score (0-100)',
    },
    {
      label: 'Coverage',
      value: coverageSummary ? `${coverageSummary.totalMentions} mentions` : 'No data',
      hint: coverageSummary
        ? `${coverageSummary.estimatedViews.toLocaleString()} estimated views`
        : undefined,
    },
    {
      label: 'Radio',
      value: warmSpins ? `${warmSpins.length} spins` : 'No data',
      hint:
        warmSpins && warmSpins.length > 0
          ? `${new Set(warmSpins.map(s => s.station)).size} stations`
          : undefined,
    },
    {
      label: 'Pitch Performance',
      value: `${campaign.openRate}% / ${campaign.replyRate}%`,
      hint: `${campaign.openRate}% open rate, ${campaign.replyRate}% reply rate`,
    },
  ];

  // Build phases (simple timeline-based phases)
  const phases: OpsHubPhase[] = [
    {
      id: 'intake',
      label: 'Intake & Assets',
      status: assets && assets.length > 0 ? 'complete' : 'active',
    },
    {
      id: 'pitching',
      label: 'Pitching',
      status: pitchEvents && pitchEvents.length > 0 ? 'active' : 'not-started',
    },
    {
      id: 'coverage',
      label: 'Coverage & Amplification',
      status: coverageSummary && coverageSummary.totalMentions > 0 ? 'active' : 'not-started',
    },
    {
      id: 'reporting',
      label: 'Reporting & Wrap-up',
      status: campaign.status === 'complete' ? 'complete' : 'not-started',
    },
  ];

  // Build events timeline
  const events: OpsHubEvent[] = [];

  // Add coverage events
  if (campaign.coverageLog) {
    campaign.coverageLog.forEach(coverage => {
      events.push({
        id: coverage.id,
        type: 'press',
        occurredAt: coverage.date,
        title: coverage.outlet,
        source: 'CoverageBook',
        detail: coverage.highlight,
      });
    });
  }

  // Add WARM spins
  if (warmSpins) {
    warmSpins.slice(0, 10).forEach(spin => {
      events.push({
        id: spin.id,
        type: 'radio',
        occurredAt: spin.spinTime,
        title: `${spin.station} (${spin.country})`,
        source: 'WARM',
        detail: `${spin.rotationLevel} rotation in ${spin.city}`,
      });
    });
  }

  // Add pitch events (recent replies or opens)
  if (pitchEvents) {
    pitchEvents
      .filter(p => p.status === 'replied' || p.status === 'opened')
      .slice(0, 10)
      .forEach(pitch => {
        events.push({
          id: pitch.id,
          type: 'pitch',
          occurredAt: pitch.repliedAt || pitch.openedAt || pitch.sentAt,
          title: pitch.subject,
          source: 'Pitch Engine',
          detail: pitch.status === 'replied' ? 'Reply received' : 'Email opened',
        });
      });
  }

  // Add intake submissions with incomplete data
  if (typeformSubmissions) {
    typeformSubmissions
      .filter(sub => sub.completeness < 80)
      .slice(0, 5)
      .forEach(sub => {
        events.push({
          id: sub.id,
          type: 'intake',
          occurredAt: sub.submittedAt,
          title: `${sub.artistName} submission incomplete`,
          source: 'Typeform',
          detail: `${sub.completeness}% complete, missing ${sub.missingFields.length} fields`,
        });
      });
  }

  // Add high-priority Monday tasks
  if (mondayTimelines) {
    mondayTimelines
      .filter(t => t.status === 'at-risk' || t.status === 'behind')
      .slice(0, 5)
      .forEach(timeline => {
        events.push({
          id: timeline.id,
          type: 'task',
          occurredAt: timeline.startDate,
          title: timeline.title,
          source: 'Monday.com',
          detail: `Status: ${timeline.status}`,
        });
      });
  }

  // Sort events by date descending (most recent first)
  events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  // Extract missing intake fields
  const missingIntakeFields: string[] = [];
  if (typeformSubmissions) {
    typeformSubmissions.forEach(sub => {
      if (sub.completeness < 80) {
        sub.missingFields.forEach(field => {
          if (!missingIntakeFields.includes(field)) {
            missingIntakeFields.push(field);
          }
        });
      }
    });
  }

  // Build Monday tasks summary
  let mondayTasksSummary: OpsHubData['mondayTasksSummary'] = undefined;
  if (mondayTimelines) {
    const total = mondayTimelines.length;
    const atRisk = mondayTimelines.filter(
      t => t.status === 'at-risk' || t.status === 'behind'
    ).length;
    const open = mondayTimelines.filter(
      t => t.status === 'on-track' || t.status === 'at-risk'
    ).length;

    mondayTasksSummary = { total, open, atRisk };
  }

  // Build coverage summary label
  let coverageSummaryLabel: string | undefined;
  if (coverageSummary) {
    const changeIndicator =
      coverageSummary.weekOverWeekChange > 0
        ? `+${coverageSummary.weekOverWeekChange}%`
        : `${coverageSummary.weekOverWeekChange}%`;
    coverageSummaryLabel = `${coverageSummary.totalMentions} mentions, ${coverageSummary.estimatedViews.toLocaleString()} views (${changeIndicator} WoW)`;
  }

  // Build WARM summary label
  let warmSummaryLabel: string | undefined;
  if (warmSpins && warmSpins.length > 0) {
    const uniqueStations = new Set(warmSpins.map(s => s.station)).size;
    const territories = new Set(warmSpins.map(s => s.country));
    warmSummaryLabel = `${warmSpins.length} spins across ${uniqueStations} stations in ${territories.size} territories`;
  }

  // Build asset status label
  let assetStatusLabel: string | undefined;
  if (assets) {
    const pressReleases = assets.filter(a => a.folder === 'Press Releases').length;
    const artwork = assets.filter(a => a.folder === 'Artwork').length;
    const photos = assets.filter(a => a.folder === 'Photos').length;
    assetStatusLabel = `${assets.length} total (${pressReleases} press, ${artwork} artwork, ${photos} photos)`;
  }

  return {
    campaignId: campaign.id,
    campaignName: campaign.campaignName,
    artistName: campaign.artistName,
    kpis,
    phases,
    events,
    missingIntakeFields,
    mondayTasksSummary,
    coverageSummaryLabel,
    warmSummaryLabel,
    assetStatusLabel,
  };
}
