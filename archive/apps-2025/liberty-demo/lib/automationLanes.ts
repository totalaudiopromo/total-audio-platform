import { AutomationNodeKind } from './types';

export type AutomationLaneType = 'radio' | 'press' | 'editorial' | 'spotify' | 'general';

export interface AutomationLane {
  type: AutomationLaneType;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const AUTOMATION_LANES: AutomationLane[] = [
  {
    type: 'radio',
    label: 'Radio',
    color: '#22C55E', // tap-radio
    bgColor: '#22C55E10',
    borderColor: '#22C55E40',
  },
  {
    type: 'press',
    label: 'Press',
    color: '#EC4899', // tap-press
    bgColor: '#EC489910',
    borderColor: '#EC489940',
  },
  {
    type: 'editorial',
    label: 'Editorial',
    color: '#F59E0B', // tap-pitch
    bgColor: '#F59E0B10',
    borderColor: '#F59E0B40',
  },
  {
    type: 'spotify',
    label: 'Spotify',
    color: '#A855F7', // tap-playlist
    bgColor: '#A855F710',
    borderColor: '#A855F740',
  },
  {
    type: 'general',
    label: 'General',
    color: '#737373', // tap-muted
    bgColor: '#F7F6F210',
    borderColor: '#D9D7D240',
  },
];

/**
 * Determines which lane a node belongs to based on its kind
 */
export function getNodeLane(kind: AutomationNodeKind): AutomationLaneType {
  // Radio-related
  if (kind === 'radio_spin_logged') {
    return 'radio';
  }

  // Press-related
  if (
    kind === 'coverage_found' ||
    kind === 'pitch_opened' ||
    kind === 'pitch_replied' ||
    kind === 'pitch_failed'
  ) {
    return 'press';
  }

  // Editorial-related (emails, pitches, content)
  if (kind === 'email_opened' || kind === 'typeform_submitted') {
    return 'editorial';
  }

  // Spotify/Playlist-related (future expansion)
  // Currently no Spotify-specific nodes, but structure is ready

  // General/Operational (everything else)
  return 'general';
}

/**
 * Gets the lane configuration for a given lane type
 */
export function getLaneConfig(type: AutomationLaneType): AutomationLane {
  return AUTOMATION_LANES.find(l => l.type === type) || AUTOMATION_LANES[4]; // Default to general
}
