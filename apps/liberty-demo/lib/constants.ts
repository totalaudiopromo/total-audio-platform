import { Artist, Campaign, Contact, Lead } from '@/lib/types';

export const ARTISTS: Record<string, Artist> = {
  '1': {
    id: '1',
    name: 'KYARA',
    genre: 'Electro Pop',
    image: 'https://ui-avatars.com/api/?name=KYARA&background=EC4899&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '45.2k', followers: '12.4k' },
  },
  '2': {
    id: '2',
    name: 'Senior Dunce',
    genre: 'Dance',
    image:
      'https://ui-avatars.com/api/?name=Senior+Dunce&background=3AA9BE&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '120k', followers: '34.1k' },
  },
  '3': {
    id: '3',
    name: 'Concerta',
    genre: 'Electronic / Techno',
    image:
      'https://ui-avatars.com/api/?name=Concerta&background=111111&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '8.9k', followers: '2.1k' },
  },
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    artistId: '3',
    title: 'Consumption - Radio Campaign',
    status: 'active',
    momentumScore: 85,
    healthScore: 88,
    startDate: '2025-11-03',
    nextTask: 'Final follow-ups with BBC Radio 1 Dance',
    coverage: 3,
    radioHits: 12,
    stats: { pitchesSent: 38, openRate: 71, replyRate: 26 },
    timeline: `gantt
    title Concerta - Consumption Campaign
    dateFormat YYYY-MM-DD
    section Week 1-2
    Launch & Initial Outreach    :done, 2025-11-03, 10d
    section Week 3-4
    Peak Push & Follow-ups       :done, 2025-11-13, 10d
    section Week 5-6
    Final Push & Wrap-up         :active, 2025-11-23, 20d`,
    coverageLog: [
      {
        type: 'Radio',
        outlet: 'BBC Radio 1 Dance',
        date: '2025-11-22',
        highlight: 'Danny Howard show spin',
      },
      {
        type: 'Radio',
        outlet: 'BBC Radio 6 Music',
        date: '2025-11-25',
        highlight: 'Mary Anne Hobbs play',
      },
      {
        type: 'Radio',
        outlet: 'Kiss FM',
        date: '2025-11-28',
        highlight: 'Weekend rotation add',
      },
    ],
    pitchHistory: [
      { date: '2025-11-03', subject: 'Concerta - Consumption (New Single)', opened: true },
      {
        date: '2025-11-08',
        subject: 'Re: Concerta - Consumption premiere opportunity',
        opened: true,
      },
      {
        date: '2025-11-15',
        subject: 'Concerta follow-up - Radio 1 Dance consideration',
        opened: true,
      },
      { date: '2025-11-22', subject: 'Concerta - Additional press materials', opened: true },
      { date: '2025-11-29', subject: 'Concerta - Final week reminder', opened: false },
    ],
    tasks: [
      { id: 't1', text: 'Follow-up with Jaguar (BBC Radio 1 Dance)', completed: false },
      { id: 't2', text: 'Send updated streaming stats to Kiss FM', completed: false },
      { id: 't3', text: 'Confirm BBC 6 Music interview slot', completed: true },
      { id: 't4', text: 'Update Spotify Canvas', completed: true },
    ],
    assets: [
      { name: 'Press Kit', type: 'pdf', url: '#' },
      { name: 'Artist Photo (Hi-Res)', type: 'jpg', url: '#' },
      { name: 'Bio & Quotes', type: 'docx', url: '#' },
      { name: 'Single Artwork', type: 'png', url: '#' },
    ],
    aiSummary:
      'Consumption is gaining strong traction with electronic/dance specialists. Danny Howard spin on BBC Radio 1 Dance has boosted momentum. Kiss FM weekend rotation confirmed. Campaign on track for 3+ playlist adds target.',
  },
  {
    id: 'c2',
    artistId: '1',
    title: 'Bloodshot - Radio + Press Campaign',
    status: 'completed',
    momentumScore: 82,
    healthScore: 91,
    startDate: '2025-10-01',
    nextTask: 'Campaign complete',
    coverage: 4,
    radioHits: 14,
    stats: { pitchesSent: 45, openRate: 68, replyRate: 31 },
    timeline: `gantt
    title KYARA - Bloodshot Campaign
    dateFormat YYYY-MM-DD
    section Week 1
    Launch & BBC Radio 1 Push    :done, 2025-10-01, 7d
    section Week 2
    Commercial Radio Focus       :done, 2025-10-08, 7d
    section Week 3-4
    Follow-ups & Wrap-up         :done, 2025-10-15, 17d`,
    coverageLog: [
      { type: 'Radio', outlet: 'BBC Radio 1', date: '2025-10-12', highlight: 'Future Sounds spin' },
      { type: 'Radio', outlet: 'Kiss FM', date: '2025-10-18', highlight: 'Daytime playlist add' },
      { type: 'Radio', outlet: 'Capital', date: '2025-10-22', highlight: 'Evening rotation' },
      { type: 'Radio', outlet: 'Hits Radio', date: '2025-10-28', highlight: 'Regional play' },
    ],
    pitchHistory: [
      { date: '2025-10-01', subject: 'KYARA - Bloodshot (New Single)', opened: true },
      { date: '2025-10-05', subject: 'Re: KYARA - Bloodshot premiere opportunity', opened: true },
      { date: '2025-10-12', subject: 'KYARA follow-up - Radio 1 consideration', opened: true },
      { date: '2025-10-20', subject: 'KYARA - Commercial radio push', opened: true },
    ],
    tasks: [
      { id: 't5', text: 'Campaign wrap-up report', completed: true },
      { id: 't6', text: 'Archive campaign assets', completed: true },
    ],
    assets: [
      { name: 'Press Kit', type: 'pdf', url: '#' },
      { name: 'Artist Photo (Hi-Res)', type: 'jpg', url: '#' },
    ],
    aiSummary:
      'Bloodshot campaign completed successfully with 4 playlist adds and 31% response rate. Strong commercial radio pickup with Kiss FM and Capital. BBC Radio 1 Future Sounds provided key momentum.',
  },
  {
    id: 'c3',
    artistId: '2',
    title: 'Bestial - Radio Campaign',
    status: 'completed',
    momentumScore: 88,
    healthScore: 94,
    startDate: '2025-09-01',
    nextTask: 'Campaign complete',
    coverage: 5,
    radioHits: 18,
    stats: { pitchesSent: 52, openRate: 72, replyRate: 35 },
    timeline: `gantt
    title Senior Dunce - Bestial Campaign
    dateFormat YYYY-MM-DD
    section Week 1
    Launch & Dance Specialist Push  :done, 2025-09-01, 7d
    section Week 2
    Peak Week - 1Xtra Focus         :done, 2025-09-08, 7d
    section Week 3-4
    Commercial Push & Wrap-up       :done, 2025-09-15, 16d`,
    coverageLog: [
      {
        type: 'Radio',
        outlet: 'BBC Radio 1 Dance',
        date: '2025-09-08',
        highlight: 'Dance Anthems playlist add',
      },
      { type: 'Radio', outlet: '1Xtra', date: '2025-09-12', highlight: 'Hot For playlist' },
      { type: 'Radio', outlet: 'Kiss FM', date: '2025-09-18', highlight: 'Kiss Dance rotation' },
      { type: 'Radio', outlet: 'Capital Dance', date: '2025-09-22', highlight: 'Playlist add' },
      { type: 'Radio', outlet: 'Gaydio', date: '2025-09-25', highlight: 'Heavy rotation' },
    ],
    pitchHistory: [
      { date: '2025-09-01', subject: 'Senior Dunce - Bestial (New Single)', opened: true },
      {
        date: '2025-09-05',
        subject: 'Re: Senior Dunce - BBC Radio 1 Dance opportunity',
        opened: true,
      },
      { date: '2025-09-10', subject: 'Senior Dunce follow-up - 1Xtra push', opened: true },
      { date: '2025-09-18', subject: 'Senior Dunce - Commercial dance focus', opened: true },
    ],
    tasks: [
      { id: 't7', text: 'Campaign wrap-up report', completed: true },
      { id: 't8', text: 'Archive campaign assets', completed: true },
    ],
    assets: [
      { name: 'Press Kit', type: 'pdf', url: '#' },
      { name: 'Artist Photo (Hi-Res)', type: 'jpg', url: '#' },
    ],
    aiSummary:
      'Bestial campaign exceeded targets with 5 playlist adds and 35% response rate. BBC Radio 1 Dance and 1Xtra provided core momentum. Strong commercial pickup across Kiss FM and Capital Dance.',
  },
];

export const CONTACTS: Contact[] = [
  {
    id: 'ct1',
    name: 'Danny Howard',
    outlet: 'BBC Radio 1 Dance',
    type: 'Radio',
    credibilityScore: 98,
    emailStatus: 'valid',
    lastContact: '2 days ago',
  },
  {
    id: 'ct2',
    name: 'Jaguar',
    outlet: 'BBC Radio 1',
    type: 'Radio',
    credibilityScore: 96,
    emailStatus: 'valid',
    lastContact: '3 days ago',
  },
  {
    id: 'ct3',
    name: 'Mary Anne Hobbs',
    outlet: 'BBC Radio 6 Music',
    type: 'Radio',
    credibilityScore: 95,
    emailStatus: 'valid',
    lastContact: '1 week ago',
  },
  {
    id: 'ct4',
    name: 'Playlist Team',
    outlet: 'Kiss FM',
    type: 'Radio',
    credibilityScore: 92,
    emailStatus: 'valid',
    lastContact: '4 days ago',
  },
  {
    id: 'ct5',
    name: 'Music Team',
    outlet: 'Capital Dance',
    type: 'Radio',
    credibilityScore: 90,
    emailStatus: 'valid',
    lastContact: '1 week ago',
  },
  {
    id: 'ct6',
    name: 'Programme Director',
    outlet: '1Xtra',
    type: 'Radio',
    credibilityScore: 94,
    emailStatus: 'valid',
    lastContact: '2 weeks ago',
  },
  {
    id: 'ct7',
    name: 'Music Desk',
    outlet: 'Gaydio',
    type: 'Radio',
    credibilityScore: 88,
    emailStatus: 'valid',
    lastContact: '5 days ago',
  },
  {
    id: 'ct8',
    name: 'Editorial Team',
    outlet: 'DJ Mag',
    type: 'Press',
    credibilityScore: 91,
    emailStatus: 'valid',
    lastContact: '1 week ago',
  },
  {
    id: 'ct9',
    name: 'Reviews Editor',
    outlet: 'Mixmag',
    type: 'Press',
    credibilityScore: 93,
    emailStatus: 'valid',
    lastContact: '10 days ago',
  },
  {
    id: 'ct10',
    name: 'Curator',
    outlet: 'mint (Spotify)',
    type: 'Playlist',
    credibilityScore: 97,
    emailStatus: 'valid',
    lastContact: 'Yesterday',
  },
];

export const AI_LEADS: Lead[] = [
  {
    id: 'l1',
    artistName: 'Velvet Shakes',
    fitScore: 94,
    reasoning:
      "Strong overlap with KYARA's listener base in Manchester. High engagement on recent synth-pop tracks.",
    similarArtists: ['KYARA', 'Pale Waves'],
    suggestedAngle: 'Focus on the "Northern Electronic" scene synergy.',
  },
  {
    id: 'l2',
    artistName: 'Echo Driver',
    fitScore: 88,
    reasoning: 'Ideally suited for Senior Dunce support slot. Rising metric on Spotify Viral 50.',
    similarArtists: ['Senior Dunce', 'Sam Fender'],
    suggestedAngle: 'Pitch as main tour support for Q1 2025.',
  },
  {
    id: 'l3',
    artistName: 'Neon Plaza',
    fitScore: 76,
    reasoning:
      'Good stylistic match for Concerta but smaller reach. Potential for co-headline shows in London.',
    similarArtists: ['Concerta', 'Dry Cleaning'],
    suggestedAngle: 'Suggest a joint showcase at The Windmill.',
  },
];

export const SAMPLE_MERMAID_GANTT = `
gantt
    title Campaign Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d
    
    section Pre-Save
    Social Tease       :active,    des1, 2024-02-01, 7d
    Mailing List Blast :           des2, after des1, 3d
    
    section Release
    Spotify Pitch      :crit,      done, 2024-01-20, 2024-02-01
    Radio Service      :active,    2024-02-05, 14d
    
    section Live
    London Show        :           2024-03-01, 1d
    Manchester Show    :           2024-03-03, 1d
`;

export const SAMPLE_MERMAID_FLOW = `graph TD
    A[New Contact Added] -->|Credibility > 80| B[Add to Tier 1]
    A -->|Credibility 50-80| C[Add to Tier 2]
    B --> D{Festival Season?}
    D -->|Yes| E[Send Festival Pitch Template]
    D -->|No| F[Send Standard Intro]
    C --> F
    E --> G[Schedule Follow-up in 7 days]
    F --> G`;

export const ARTIST_PORTALS: Record<string, import('./types').ArtistPortalConfig> = {
  kyara: {
    slug: 'kyara',
    artistId: '1',
    campaignIds: ['c2'],
    label: 'Independent',
    visibility: {
      showMomentum: true,
      showCoverage: true,
      showRadio: true,
      showTasks: true,
      showAiSummary: true,
    },
    radioStations: [
      { name: 'BBC Radio 1', status: 'Rotation' },
      { name: 'BBC 6 Music', status: 'Support' },
      { name: 'RTE 2XM', status: 'Rotation' },
      { name: 'Amazing Radio', status: 'Support' },
    ],
    playlists: [
      { name: 'Fresh Finds', platform: 'Spotify', status: 'Added' },
      { name: 'Our Generation', platform: 'Spotify', status: 'Added' },
      { name: 'New Music Friday UK', platform: 'Spotify', status: 'Added' },
    ],
  },
  'senior-dunce': {
    slug: 'senior-dunce',
    artistId: '2',
    campaignIds: ['c3'],
    label: 'Independent',
    visibility: {
      showMomentum: true,
      showCoverage: true,
      showRadio: true,
      showTasks: false,
      showAiSummary: true,
    },
    radioStations: [
      { name: 'BBC 6 Music', status: 'Rotation' },
      { name: 'Amazing Radio', status: 'Support' },
      { name: 'RTE 2FM', status: 'Added' },
    ],
    playlists: [{ name: 'Indie Rock', platform: 'Spotify', status: 'Added' }],
  },
  concerta: {
    slug: 'concerta',
    artistId: '3',
    campaignIds: ['c1'],
    label: 'Self-Released',
    visibility: {
      showMomentum: true,
      showCoverage: true,
      showRadio: true,
      showTasks: true,
      showAiSummary: true,
    },
    radioStations: [
      { name: 'BBC 6 Music', status: 'Support' },
      { name: 'Amazing Radio', status: 'Rotation' },
      { name: 'Absolute Radio', status: 'Added' },
    ],
    playlists: [
      { name: 'Post-Punk Now', platform: 'Spotify', status: 'Added' },
      { name: 'New Noise', platform: 'Spotify', status: 'Pending' },
    ],
  },
};

export const MOCK_PITCH_EVENTS: import('./types').PitchEvent[] = [
  // Concerta - Consumption (c1, active Nov 2025)
  {
    id: 'p1',
    campaignId: 'c1',
    contactId: 'ct1',
    subject: 'Concerta - Consumption (New Single)',
    sentAt: '2025-11-03T10:00:00Z',
    openedAt: '2025-11-03T14:30:00Z',
    repliedAt: '2025-11-04T09:15:00Z',
    status: 'replied',
  },
  {
    id: 'p2',
    campaignId: 'c1',
    contactId: 'ct3',
    subject: 'Concerta - Mary Anne Hobbs premiere opportunity',
    sentAt: '2025-11-08T11:00:00Z',
    openedAt: '2025-11-08T15:20:00Z',
    status: 'opened',
  },
  {
    id: 'p3',
    campaignId: 'c1',
    contactId: 'ct4',
    subject: 'Concerta follow-up - Kiss FM Dance rotation',
    sentAt: '2025-11-15T09:30:00Z',
    openedAt: '2025-11-15T16:45:00Z',
    repliedAt: '2025-11-16T10:00:00Z',
    status: 'replied',
  },
  // KYARA - Bloodshot (c2, completed Oct 2025)
  {
    id: 'p4',
    campaignId: 'c2',
    contactId: 'ct2',
    subject: 'KYARA - Bloodshot (New Single)',
    sentAt: '2025-10-01T10:00:00Z',
    openedAt: '2025-10-01T12:30:00Z',
    repliedAt: '2025-10-02T09:00:00Z',
    status: 'replied',
  },
  {
    id: 'p5',
    campaignId: 'c2',
    contactId: 'ct4',
    subject: 'KYARA - Kiss FM consideration',
    sentAt: '2025-10-05T11:00:00Z',
    openedAt: '2025-10-05T14:00:00Z',
    repliedAt: '2025-10-06T10:30:00Z',
    status: 'replied',
  },
  {
    id: 'p6',
    campaignId: 'c2',
    contactId: 'ct5',
    subject: 'KYARA - Capital Dance playlist push',
    sentAt: '2025-10-12T10:00:00Z',
    openedAt: '2025-10-12T11:30:00Z',
    status: 'opened',
  },
  // Senior Dunce - Bestial (c3, completed Sep 2025)
  {
    id: 'p7',
    campaignId: 'c3',
    contactId: 'ct1',
    subject: 'Senior Dunce - Bestial (Dance Single)',
    sentAt: '2025-09-01T09:00:00Z',
    openedAt: '2025-09-01T10:45:00Z',
    repliedAt: '2025-09-02T09:00:00Z',
    status: 'replied',
  },
  {
    id: 'p8',
    campaignId: 'c3',
    contactId: 'ct6',
    subject: 'Senior Dunce - 1Xtra Hot For consideration',
    sentAt: '2025-09-05T10:00:00Z',
    openedAt: '2025-09-05T14:00:00Z',
    repliedAt: '2025-09-06T11:00:00Z',
    status: 'replied',
  },
  {
    id: 'p9',
    campaignId: 'c3',
    contactId: 'ct7',
    subject: 'Senior Dunce - Gaydio rotation request',
    sentAt: '2025-09-10T11:00:00Z',
    openedAt: '2025-09-10T16:30:00Z',
    repliedAt: '2025-09-11T09:45:00Z',
    status: 'replied',
  },
];

// WARM Radio Intelligence Mock Data
export const WARM_AGENCY_SUMMARY: import('./types').WarmAgencySummary[] = [
  {
    artistId: '3',
    artistName: 'Concerta',
    trackName: 'Consumption',
    totalSpins: 47,
    uniqueStations: 12,
    topTerritories: ['UK', 'IE', 'DE'],
    lastSpinAt: '2025-11-26T14:30:00Z',
  },
  {
    artistId: '1',
    artistName: 'KYARA',
    trackName: 'Bloodshot',
    totalSpins: 89,
    uniqueStations: 18,
    topTerritories: ['UK', 'IE', 'US'],
    lastSpinAt: '2025-10-15T09:15:00Z',
  },
  {
    artistId: '2',
    artistName: 'Senior Dunce',
    trackName: 'Bestial',
    totalSpins: 64,
    uniqueStations: 14,
    topTerritories: ['UK', 'IE'],
    lastSpinAt: '2025-09-28T16:45:00Z',
  },
];

// CoverageBook Mock Data
export const COVERAGEBOOK_SUMMARIES: Record<string, import('./types').CoverageSummary> = {
  c1: {
    campaignId: 'c1',
    totalMentions: 124,
    estimatedViews: 850000,
    avgDomainAuthority: 45,
    weekOverWeekChange: 12,
    topOutlets: [
      { name: 'NME', domainAuthority: 70, country: 'UK' },
      { name: 'Pitchfork', domainAuthority: 80, country: 'US' },
      { name: 'The Guardian', domainAuthority: 75, country: 'UK' },
    ],
  },
  c2: {
    campaignId: 'c2',
    totalMentions: 98,
    estimatedViews: 620000,
    avgDomainAuthority: 38,
    weekOverWeekChange: -5,
    topOutlets: [
      { name: 'BBC Radio 1', domainAuthority: 85, country: 'UK' },
      { name: 'RTÉ 2FM', domainAuthority: 65, country: 'IE' },
      { name: 'The Irish Times', domainAuthority: 70, country: 'IE' },
    ],
  },
};

// Warm spins mock data - c1=Concerta (Nov 2025), c2=KYARA (Oct 2025), c3=Senior Dunce (Sep 2025)
export const WARM_SPINS_BY_CAMPAIGN: Record<string, import('./types').WarmSpin[]> = {
  c1: [
    {
      id: 'ws1',
      campaignId: 'c1',
      station: 'BBC Radio 1 Dance',
      country: 'UK',
      city: 'London',
      spinTime: '2025-11-22T14:30:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws2',
      campaignId: 'c1',
      station: 'BBC Radio 6 Music',
      country: 'UK',
      city: 'London',
      spinTime: '2025-11-25T10:15:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws3',
      campaignId: 'c1',
      station: 'Kiss FM',
      country: 'UK',
      city: 'London',
      spinTime: '2025-11-28T18:45:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws4',
      campaignId: 'c1',
      station: 'WDR 1LIVE',
      country: 'DE',
      city: 'Cologne',
      spinTime: '2025-11-20T12:00:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws5',
      campaignId: 'c1',
      station: 'RTE 2FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2025-11-18T16:30:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws6',
      campaignId: 'c1',
      station: 'Capital Dance',
      country: 'UK',
      city: 'London',
      spinTime: '2025-11-26T08:20:00Z',
      rotationLevel: 'light',
    },
  ],
  c2: [
    {
      id: 'ws7',
      campaignId: 'c2',
      station: 'BBC Radio 1',
      country: 'UK',
      city: 'London',
      spinTime: '2025-10-12T09:15:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws8',
      campaignId: 'c2',
      station: 'Kiss FM',
      country: 'UK',
      city: 'London',
      spinTime: '2025-10-18T15:30:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws9',
      campaignId: 'c2',
      station: 'Capital',
      country: 'UK',
      city: 'London',
      spinTime: '2025-10-22T20:00:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws10',
      campaignId: 'c2',
      station: 'Hits Radio',
      country: 'UK',
      city: 'Manchester',
      spinTime: '2025-10-28T11:45:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws11',
      campaignId: 'c2',
      station: 'KCRW',
      country: 'US',
      city: 'Los Angeles',
      spinTime: '2025-10-15T19:30:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws12',
      campaignId: 'c2',
      station: 'RTE 2FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2025-10-14T13:00:00Z',
      rotationLevel: 'medium',
    },
  ],
  c3: [
    {
      id: 'ws13',
      campaignId: 'c3',
      station: 'BBC Radio 1 Dance',
      country: 'UK',
      city: 'London',
      spinTime: '2025-09-08T14:00:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws14',
      campaignId: 'c3',
      station: '1Xtra',
      country: 'UK',
      city: 'London',
      spinTime: '2025-09-12T10:30:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws15',
      campaignId: 'c3',
      station: 'Kiss FM',
      country: 'UK',
      city: 'London',
      spinTime: '2025-09-18T16:15:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws16',
      campaignId: 'c3',
      station: 'Capital Dance',
      country: 'UK',
      city: 'London',
      spinTime: '2025-09-22T12:00:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws17',
      campaignId: 'c3',
      station: 'Gaydio',
      country: 'UK',
      city: 'Manchester',
      spinTime: '2025-09-25T18:00:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws18',
      campaignId: 'c3',
      station: 'RTE 2FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2025-09-20T09:30:00Z',
      rotationLevel: 'medium',
    },
  ],
};

export const AUTOMATION_WORKFLOWS: import('./types').AutomationWorkflow[] = [
  {
    id: 'aw1',
    name: 'New Coverage → Google Chat + CRM Update',
    description:
      'When new coverage is found in WARM, notify the team and update CRM contact heat score.',
    status: 'active',
    lastRun: '10m ago',
    runCount: 247,
    nodes: [
      {
        id: 'T1',
        type: 'trigger',
        kind: 'coverage_found',
        label: 'New Coverage Found',
        description: 'Triggered when WARM detects new press or radio coverage',
        status: 'active',
        stats: { executions: 247, successRate: 100, lastExecuted: '10m ago' },
      },
      {
        id: 'F1',
        type: 'filter',
        kind: 'geo_filter',
        label: 'Geo: UK & Ireland',
        description: 'Only process coverage from UK and Ireland outlets',
        status: 'active',
        stats: { executions: 247, successRate: 98 },
      },
      {
        id: 'A1',
        type: 'action',
        kind: 'google_chat_message',
        label: 'Send Google Chat Message',
        description: 'Notify #coverage-alerts channel',
        status: 'success',
        stats: { executions: 180, successRate: 100 },
      },
      {
        id: 'A2',
        type: 'action',
        kind: 'update_crm_contact',
        label: 'Update CRM Contact',
        description: 'Increment heat score and add coverage tag',
        status: 'success',
        stats: { executions: 180, successRate: 100 },
      },
    ],
    edges: [
      { from: 'T1', to: 'F1', animated: true },
      { from: 'F1', to: 'A1', conditionLabel: 'UK/IE', animated: true },
      { from: 'F1', to: 'A2', conditionLabel: 'UK/IE', animated: true },
    ],
  },
  {
    id: 'aw2',
    name: 'Typeform Intake → Monday Task + Chat Alert',
    description:
      'When a new artist submits the intake form with completeness < 80, create Monday.com task and notify team via Google Chat.',
    status: 'active',
    lastRun: '2h ago',
    runCount: 89,
    nodes: [
      {
        id: 'T1',
        type: 'trigger',
        kind: 'typeform_submitted',
        label: 'Typeform Submitted',
        description: 'New artist intake form completed',
        status: 'idle',
        stats: { executions: 89, successRate: 100, lastExecuted: '2h ago' },
      },
      {
        id: 'F1',
        type: 'filter',
        kind: 'heat_score_threshold',
        label: 'Completeness < 80',
        description: 'Filter submissions needing follow-up',
        status: 'idle',
        stats: { executions: 89, successRate: 100 },
      },
      {
        id: 'A1',
        type: 'action',
        kind: 'create_task',
        label: 'Create Monday Task',
        description: 'Add follow-up task to Monday.com with missing fields',
        status: 'idle',
        stats: { executions: 45, successRate: 100 },
      },
      {
        id: 'A2',
        type: 'action',
        kind: 'google_chat_message',
        label: 'Alert Liberty A&R',
        description: 'Send notification to #artist-intake channel',
        status: 'idle',
        stats: { executions: 45, successRate: 100 },
      },
      {
        id: 'A3',
        type: 'action',
        kind: 'create_crm_contact',
        label: 'Create CRM Contact',
        description: 'Add artist to Liberty CRM for tracking',
        status: 'idle',
        stats: { executions: 45, successRate: 100 },
      },
    ],
    edges: [
      { from: 'T1', to: 'F1', animated: true },
      { from: 'F1', to: 'A1', conditionLabel: 'Needs follow-up', animated: true },
      { from: 'A1', to: 'A2', animated: true },
      { from: 'A2', to: 'A3', animated: true },
    ],
  },
  {
    id: 'aw3',
    name: 'High Heat Score → Notify A&R',
    description:
      "When an artist's heat score exceeds 80, notify A&R team and create a review task.",
    status: 'active',
    lastRun: '1d ago',
    runCount: 34,
    nodes: [
      {
        id: 'T1',
        type: 'trigger',
        kind: 'heat_score_threshold',
        label: 'Heat Score > 80',
        description: 'Artist crosses high-value threshold',
        status: 'idle',
        stats: { executions: 34, successRate: 100, lastExecuted: '1d ago' },
      },
      {
        id: 'A1',
        type: 'action',
        kind: 'google_chat_message',
        label: 'Notify A&R Team',
        description: 'Send alert to #a-and-r channel',
        status: 'idle',
        stats: { executions: 34, successRate: 100 },
      },
      {
        id: 'A2',
        type: 'action',
        kind: 'create_task',
        label: 'Create Review Task',
        description: 'Add Monday.com task for artist evaluation',
        status: 'idle',
        stats: { executions: 34, successRate: 100 },
      },
    ],
    edges: [
      { from: 'T1', to: 'A1', animated: true },
      { from: 'T1', to: 'A2', animated: true },
    ],
  },
  {
    id: 'aw4',
    name: 'Pitch Opened → Update CRM + Notify',
    description:
      'When a pitch is opened by a high-value contact, update their CRM heat score and notify the team.',
    status: 'active',
    lastRun: '3h ago',
    runCount: 156,
    nodes: [
      {
        id: 'T1',
        type: 'trigger',
        kind: 'pitch_opened',
        label: 'Pitch Opened',
        description: 'Triggered when recipient opens pitch email',
        status: 'active',
        stats: { executions: 156, successRate: 100, lastExecuted: '3h ago' },
      },
      {
        id: 'F1',
        type: 'filter',
        kind: 'heat_score_threshold',
        label: 'Contact Heat > 70',
        description: 'Only process high-value contacts',
        status: 'active',
        stats: { executions: 156, successRate: 100 },
      },
      {
        id: 'A1',
        type: 'action',
        kind: 'update_crm_contact',
        label: 'Update CRM Heat Score',
        description: 'Increment contact heat score by 5 points',
        status: 'success',
        stats: { executions: 42, successRate: 100 },
      },
      {
        id: 'A2',
        type: 'action',
        kind: 'google_chat_message',
        label: 'Notify Team',
        description: 'Send alert to #pitch-tracking channel',
        status: 'success',
        stats: { executions: 42, successRate: 100 },
      },
    ],
    edges: [
      { from: 'T1', to: 'F1', animated: true },
      { from: 'F1', to: 'A1', conditionLabel: 'Heat > 70', animated: true },
      { from: 'F1', to: 'A2', conditionLabel: 'Heat > 70', animated: true },
    ],
  },
];

// Monday.com Mock Data
export const MONDAY_TIMELINES: import('./types').MondayTimeline[] = [
  {
    id: 'mt1',
    title: 'Concerta - Consumption Campaign',
    startDate: '2025-11-03',
    endDate: '2025-12-13',
    status: 'on-track',
  },
  {
    id: 'mt2',
    title: 'KYARA - Bloodshot Campaign',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'completed',
  },
  {
    id: 'mt3',
    title: 'Senior Dunce - Bestial Campaign',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: 'completed',
  },
];

export const MONDAY_ALLOCATIONS: import('./types').MondayAllocation[] = [
  {
    staffName: 'Sarah Mitchell',
    role: 'Campaign Manager',
    activeCampaigns: ['c1', 'c3'],
    workloadScore: 78,
  },
  {
    staffName: 'James Cooper',
    role: 'Outreach Lead',
    activeCampaigns: ['c1', 'c2'],
    workloadScore: 92,
  },
  {
    staffName: 'Emma Davies',
    role: 'PR Coordinator',
    activeCampaigns: ['c2'],
    workloadScore: 45,
  },
  {
    staffName: 'Tom Richardson',
    role: 'Radio Plugger',
    activeCampaigns: ['c1', 'c2', 'c3'],
    workloadScore: 85,
  },
  {
    staffName: 'Lucy Martinez',
    role: 'Social Media Manager',
    activeCampaigns: ['c3'],
    workloadScore: 38,
  },
  {
    staffName: 'Oliver Bennett',
    role: 'A&R Associate',
    activeCampaigns: [],
    workloadScore: 12,
  },
];

// Typeform Intake Mock Data
export const TYPEFORM_SUBMISSIONS: import('./types').TypeformSubmission[] = [
  {
    id: 'tf_senior_001',
    artistName: 'Senior Dunce',
    submittedAt: '2025-08-15T09:32:00Z',
    completeness: 95,
    missingFields: [],
  },
  {
    id: 'tf_kyara_001',
    artistName: 'KYARA',
    submittedAt: '2025-09-12T14:10:00Z',
    completeness: 92,
    missingFields: ['TikTok handle'],
  },
  {
    id: 'tf_concerta_001',
    artistName: 'Concerta',
    submittedAt: '2025-10-20T11:47:00Z',
    completeness: 88,
    missingFields: ['Press photos'],
  },
  {
    id: 'tf_nova_001',
    artistName: 'Nova Pulse',
    submittedAt: '2025-11-28T16:22:00Z',
    completeness: 72,
    missingFields: ['EPK link', 'Bio'],
  },
  {
    id: 'tf_crystal_001',
    artistName: 'Crystal Syntax',
    submittedAt: '2025-12-01T10:15:00Z',
    completeness: 54,
    missingFields: ['Bio', 'Press photos', 'Streaming links', 'Manager contact'],
  },
];

// Google Drive Assets Mock Data
export const DRIVE_ASSETS: import('./types').DriveAsset[] = [
  // Press Releases folder
  {
    id: 'asset_pressrelease_concerta_001',
    name: 'Concerta - Consumption - Press release - Liberty Music PR.pdf',
    type: 'pdf',
    sizeKB: 245,
    updatedAt: '2025-11-22T00:00:00Z',
    url: '/mnt/data/Concerta - Consumption - Press release - Liberty Music PR.pdf',
    folder: 'Press Releases',
    campaignId: 'c3',
    artistId: '3',
  },
  {
    id: 'asset_pressrelease_kyara_001',
    name: 'KYARA - Ladybird - Official Press Release.pdf',
    type: 'pdf',
    sizeKB: 198,
    updatedAt: '2024-02-01T10:30:00Z',
    url: '/assets/press/kyara-ladybird.pdf',
    folder: 'Press Releases',
    campaignId: 'c1',
    artistId: '1',
  },
  {
    id: 'asset_pressrelease_senior_001',
    name: 'Senior Dunce - UK Tour Announcement - Press Release.docx',
    type: 'other',
    sizeKB: 156,
    updatedAt: '2024-01-20T14:15:00Z',
    url: '/assets/press/senior-dunce-tour.docx',
    folder: 'Press Releases',
    campaignId: 'c2',
    artistId: '2',
  },

  // Artwork folder
  {
    id: 'asset_artwork_kyara_001',
    name: 'KYARA - Ladybird - Single Artwork (3000x3000).png',
    type: 'png',
    sizeKB: 2840,
    updatedAt: '2024-01-25T09:00:00Z',
    url: '/assets/artwork/kyara-ladybird-artwork.png',
    folder: 'Artwork',
    campaignId: 'c1',
  },
  {
    id: 'asset_artwork_senior_001',
    name: 'Senior Dunce - EP Cover Art.jpg',
    type: 'jpg',
    sizeKB: 1920,
    updatedAt: '2024-01-10T16:30:00Z',
    url: '/assets/artwork/senior-dunce-ep.jpg',
    folder: 'Artwork',
    campaignId: 'c2',
  },
  {
    id: 'asset_artwork_concerta_001',
    name: 'Concerta - Consumption - Single Cover.png',
    type: 'png',
    sizeKB: 2560,
    updatedAt: '2025-11-20T11:00:00Z',
    url: '/assets/artwork/concerta-consumption.png',
    folder: 'Artwork',
    campaignId: 'c3',
  },

  // Photos folder
  {
    id: 'asset_photos_kyara_001',
    name: 'KYARA - Press Photos 2024 (Hi-Res).zip',
    type: 'other',
    sizeKB: 18500,
    updatedAt: '2024-01-28T13:45:00Z',
    url: '/assets/photos/kyara-press-photos.zip',
    folder: 'Photos',
    campaignId: 'c1',
  },
  {
    id: 'asset_photos_kyara_002',
    name: 'KYARA - Live at O2 Academy - Photo Pack.jpg',
    type: 'jpg',
    sizeKB: 3200,
    updatedAt: '2024-02-05T10:20:00Z',
    url: '/assets/photos/kyara-live-o2.jpg',
    folder: 'Photos',
    campaignId: 'c1',
  },
  {
    id: 'asset_photos_senior_001',
    name: 'Senior Dunce - Band Promo Shots 2024.jpg',
    type: 'jpg',
    sizeKB: 2950,
    updatedAt: '2024-01-15T15:00:00Z',
    url: '/assets/photos/senior-dunce-promo.jpg',
    folder: 'Photos',
    campaignId: 'c2',
  },

  // Campaign Reports folder
  {
    id: 'asset_report_kyara_001',
    name: 'KYARA - Ladybird Campaign Report - Week 4.pdf',
    type: 'pdf',
    sizeKB: 892,
    updatedAt: '2024-02-28T17:00:00Z',
    url: '/assets/reports/kyara-week4.pdf',
    folder: 'Campaign Reports',
    campaignId: 'c1',
  },
  {
    id: 'asset_report_senior_001',
    name: 'Senior Dunce - Mid-Campaign Review.pdf',
    type: 'pdf',
    sizeKB: 1024,
    updatedAt: '2024-02-15T12:30:00Z',
    url: '/assets/reports/senior-dunce-mid-campaign.pdf',
    folder: 'Campaign Reports',
    campaignId: 'c2',
  },
  {
    id: 'asset_report_monthly_001',
    name: 'Liberty Music PR - Monthly Overview - February 2024.pdf',
    type: 'pdf',
    sizeKB: 1456,
    updatedAt: '2024-03-01T09:00:00Z',
    url: '/assets/reports/liberty-february-overview.pdf',
    folder: 'Campaign Reports',
  },

  // Audio Assets folder
  {
    id: 'asset_audio_kyara_001',
    name: 'KYARA - Ladybird (Radio Edit).wav',
    type: 'other',
    sizeKB: 45000,
    updatedAt: '2024-01-30T11:00:00Z',
    url: '/assets/audio/kyara-ladybird-radio.wav',
    folder: 'Audio Assets',
    campaignId: 'c1',
  },
  {
    id: 'asset_audio_senior_001',
    name: 'Senior Dunce - Echoes in the Hall (Mastered).wav',
    type: 'other',
    sizeKB: 52000,
    updatedAt: '2024-01-18T14:30:00Z',
    url: '/assets/audio/senior-dunce-echoes.wav',
    folder: 'Audio Assets',
    campaignId: 'c2',
  },
  {
    id: 'asset_audio_concerta_001',
    name: 'Concerta - Consumption (Final Mix).wav',
    type: 'other',
    sizeKB: 48500,
    updatedAt: '2025-11-21T16:00:00Z',
    url: '/assets/audio/concerta-consumption.wav',
    folder: 'Audio Assets',
    campaignId: 'c3',
  },

  // Additional file types for testing
  {
    id: 'asset_docx_kyara_001',
    name: 'KYARA - Bio & Quotes (Press Kit).docx',
    type: 'other',
    sizeKB: 128,
    updatedAt: '2024-02-01T09:00:00Z',
    url: '/assets/press/kyara-bio-quotes.docx',
    folder: 'Press Releases',
    campaignId: 'c1',
  },
  {
    id: 'asset_mp3_concerta_001',
    name: 'Concerta - Consumption (Radio Edit).mp3',
    type: 'other',
    sizeKB: 4200,
    updatedAt: '2025-11-21T14:00:00Z',
    url: '/assets/audio/concerta-consumption-radio.mp3',
    folder: 'Audio Assets',
    campaignId: 'c3',
  },
];
