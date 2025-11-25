import { Artist, Campaign, Contact, Lead } from '@/lib/types';

export const ARTISTS: Record<string, Artist> = {
  '1': {
    id: '1',
    name: 'KYARA',
    genre: 'Alt-Pop / Electronic',
    image: 'https://ui-avatars.com/api/?name=KYARA&background=8F9BA6&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '45.2k', followers: '12.4k' },
  },
  '2': {
    id: '2',
    name: 'Senior Dunce',
    genre: 'Indie Rock / Lo-Fi',
    image:
      'https://ui-avatars.com/api/?name=Senior+Dunce&background=0E7C45&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '120k', followers: '34.1k' },
  },
  '3': {
    id: '3',
    name: 'Concerta',
    genre: 'Post-Punk',
    image:
      'https://ui-avatars.com/api/?name=Concerta&background=B4372C&color=fff&size=128&bold=true',
    stats: { monthlyListeners: '8.9k', followers: '2.1k' },
  },
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    artistId: '1',
    title: 'Ladybird - Single Campaign',
    status: 'active',
    momentumScore: 88,
    healthScore: 94,
    startDate: '2024-02-01',
    nextTask: 'BBC 6 Music Follow-up',
    coverage: 15,
    radioHits: 8,
    stats: { pitchesSent: 124, openRate: 68, replyRate: 12 },
    timeline: `gantt
    title Campaign Timeline
    dateFormat YYYY-MM-DD
    section Pitching
    Initial Outreach    :done, 2024-02-01, 7d
    Follow-ups          :active, 2024-02-08, 10d
    section Coverage
    Press Window        :2024-02-15, 14d
    Radio Push          :2024-02-20, 21d
    section Social
    Content Rollout     :2024-02-15, 30d`,
    coverageLog: [
      {
        type: 'Press',
        outlet: 'Pitchfork',
        date: '2024-02-18',
        highlight: 'Best New Track feature',
      },
      { type: 'Press', outlet: 'NME', date: '2024-02-20', highlight: 'Track of the Week' },
      {
        type: 'Radio',
        outlet: 'BBC Radio 1',
        date: '2024-02-22',
        highlight: 'Future Sounds playlist add',
      },
      { type: 'Radio', outlet: 'RTE 2XM', date: '2024-02-23', highlight: 'Daytime rotation' },
      {
        type: 'Press',
        outlet: 'The Line of Best Fit',
        date: '2024-02-25',
        highlight: 'Interview feature',
      },
    ],
    pitchHistory: [
      { date: '2024-02-01', subject: 'KYARA - Ladybird (New Single)', opened: true },
      { date: '2024-02-03', subject: 'Re: KYARA - Ladybird premiere opportunity', opened: true },
      { date: '2024-02-08', subject: 'KYARA follow-up - Radio 1 consideration', opened: true },
      { date: '2024-02-12', subject: 'KYARA - Additional press materials', opened: false },
      { date: '2024-02-15', subject: 'KYARA Ladybird - Interview availability', opened: true },
    ],
    tasks: [
      { id: 't1', text: 'BBC 6 Music Follow-up call', completed: false },
      { id: 't2', text: 'Send hi-res photos to Wonderland', completed: false },
      { id: 't3', text: 'Confirm Radio 1 interview slot', completed: true },
      { id: 't4', text: 'Update Spotify Canvas', completed: true },
    ],
    assets: [
      { name: 'Press Kit', type: 'pdf', url: '#' },
      { name: 'Artist Photo (Hi-Res)', type: 'jpg', url: '#' },
      { name: 'Bio & Quotes', type: 'docx', url: '#' },
      { name: 'Album Artwork', type: 'png', url: '#' },
    ],
    aiSummary:
      'Last week saw a spike in coverage from Pitchfork and NME, with radio rotations improving in Ireland. Momentum dipped midweek but has stabilised following the BBC Radio 1 Future Sounds playlist add. Social engagement is trending upward with strong Spotify save rates.',
  },
  {
    id: 'c2',
    artistId: '2',
    title: 'UK Tour & EP Launch',
    status: 'risk',
    momentumScore: 45,
    healthScore: 58,
    startDate: '2024-01-15',
    nextTask: 'Venue coordination Leeds',
    coverage: 28,
    radioHits: 42,
    stats: { pitchesSent: 85, openRate: 42, replyRate: 5 },
  },
  {
    id: 'c3',
    artistId: '3',
    title: 'Debut EP Intro',
    status: 'scheduled',
    momentumScore: 15,
    healthScore: 100,
    startDate: '2024-04-10',
    nextTask: 'Press Release Approval',
    coverage: 0,
    radioHits: 0,
    stats: { pitchesSent: 0, openRate: 0, replyRate: 0 },
  },
];

export const CONTACTS: Contact[] = [
  {
    id: 'ct1',
    name: 'Sarah Jenkins',
    outlet: 'BBC Radio 1',
    type: 'Radio',
    credibilityScore: 98,
    emailStatus: 'valid',
    lastContact: '2 days ago',
  },
  {
    id: 'ct2',
    name: 'Dan Hegarty',
    outlet: 'RTE 2XM',
    type: 'Radio',
    credibilityScore: 91,
    emailStatus: 'valid',
    lastContact: '1 week ago',
  },
  {
    id: 'ct3',
    name: 'Nicola McAllister',
    outlet: 'Kaltblut',
    type: 'Press',
    credibilityScore: 92,
    emailStatus: 'valid',
    lastContact: '3 days ago',
  },
  {
    id: 'ct4',
    name: 'Editorial Team',
    outlet: 'Dummy Mag',
    type: 'Press',
    credibilityScore: 89,
    emailStatus: 'valid',
    lastContact: '5 days ago',
  },
  {
    id: 'ct5',
    name: 'Curator',
    outlet: 'Fresh Finds',
    type: 'Playlist',
    credibilityScore: 95,
    emailStatus: 'valid',
    lastContact: 'Yesterday',
  },
  {
    id: 'ct6',
    name: 'Staff',
    outlet: 'Wonderland',
    type: 'Press',
    credibilityScore: 88,
    emailStatus: 'valid',
    lastContact: '2 weeks ago',
  },
  {
    id: 'ct7',
    name: 'Editor',
    outlet: 'Earmilk',
    type: 'Press',
    credibilityScore: 75,
    emailStatus: 'risky',
    lastContact: '1 month ago',
  },
  {
    id: 'ct8',
    name: 'Team',
    outlet: 'Holler',
    type: 'Press',
    credibilityScore: 82,
    emailStatus: 'valid',
    lastContact: '3 weeks ago',
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
    campaignIds: ['c1'],
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
      { name: 'Triple J', status: 'Added' },
      { name: 'Amazing Radio', status: 'Support' },
    ],
    playlists: [
      { name: 'Fresh Finds', platform: 'Spotify', status: 'Added' },
      { name: 'Our Generation', platform: 'Spotify', status: 'Added' },
      { name: 'New Music Friday UK', platform: 'Spotify', status: 'Pending' },
    ],
  },
  'senior-dunce': {
    slug: 'senior-dunce',
    artistId: '2',
    campaignIds: ['c2'],
    label: 'Rough Trade Records',
    visibility: {
      showMomentum: true,
      showCoverage: true,
      showRadio: false,
      showTasks: false,
      showAiSummary: true,
    },
    radioStations: [
      { name: 'BBC Radio 1', status: 'Support' },
      { name: 'BBC 6 Music', status: 'Rotation' },
    ],
    playlists: [{ name: 'Rock Rotation', platform: 'Spotify', status: 'Added' }],
  },
  concerta: {
    slug: 'concerta',
    artistId: '3',
    campaignIds: ['c3'],
    label: 'Self-Released',
    visibility: {
      showMomentum: true,
      showCoverage: false,
      showRadio: false,
      showTasks: true,
      showAiSummary: false,
    },
  },
};

export const MOCK_PITCH_EVENTS: import('./types').PitchEvent[] = [
  {
    id: 'p1',
    campaignId: 'c1',
    contactId: 'ct1',
    subject: 'KYARA - Ladybird (New Single)',
    sentAt: '2024-02-01T10:00:00Z',
    openedAt: '2024-02-01T14:30:00Z',
    repliedAt: '2024-02-02T09:15:00Z',
    status: 'replied',
  },
  {
    id: 'p2',
    campaignId: 'c1',
    contactId: 'ct2',
    subject: 'Re: KYARA - Ladybird premiere opportunity',
    sentAt: '2024-02-03T11:00:00Z',
    openedAt: '2024-02-03T15:20:00Z',
    status: 'opened',
  },
  {
    id: 'p3',
    campaignId: 'c1',
    contactId: 'ct3',
    subject: 'KYARA follow-up - Radio 1 consideration',
    sentAt: '2024-02-08T09:30:00Z',
    openedAt: '2024-02-08T16:45:00Z',
    repliedAt: '2024-02-09T10:00:00Z',
    status: 'replied',
  },
  {
    id: 'p4',
    campaignId: 'c1',
    contactId: 'ct4',
    subject: 'KYARA - Additional press materials',
    sentAt: '2024-02-12T10:00:00Z',
    status: 'sent',
  },
  {
    id: 'p5',
    campaignId: 'c1',
    contactId: 'ct5',
    subject: 'KYARA Ladybird - Interview availability',
    sentAt: '2024-02-15T11:00:00Z',
    openedAt: '2024-02-15T14:00:00Z',
    status: 'opened',
  },
  {
    id: 'p6',
    campaignId: 'c2',
    contactId: 'ct6',
    subject: 'Senior Dunce - UK Tour Announcement',
    sentAt: '2024-01-20T10:00:00Z',
    openedAt: '2024-01-20T11:30:00Z',
    status: 'opened',
  },
  {
    id: 'p7',
    campaignId: 'c2',
    contactId: 'ct7',
    subject: 'Senior Dunce - EP Launch Coverage',
    sentAt: '2024-01-25T09:00:00Z',
    status: 'bounced',
  },
];

// WARM Radio Intelligence Mock Data
export const WARM_AGENCY_SUMMARY: import('./types').WarmAgencySummary[] = [
  {
    artistId: '1',
    artistName: 'KYARA',
    trackName: 'Ladybird',
    totalSpins: 47,
    uniqueStations: 12,
    topTerritories: ['UK', 'IE', 'DE'],
    lastSpinAt: '2024-02-20T14:30:00Z',
  },
  {
    artistId: '2',
    artistName: 'Senior Dunce',
    trackName: 'Echoes in the Hall',
    totalSpins: 32,
    uniqueStations: 8,
    topTerritories: ['UK', 'IE'],
    lastSpinAt: '2024-02-19T09:15:00Z',
  },
  {
    artistId: '3',
    artistName: 'The Wandering Hearts',
    trackName: 'Wild Silence',
    totalSpins: 28,
    uniqueStations: 9,
    topTerritories: ['UK', 'US', 'AU'],
    lastSpinAt: '2024-02-18T16:45:00Z',
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

// Warm spins mock data
export const WARM_SPINS_BY_CAMPAIGN: Record<string, import('./types').WarmSpin[]> = {
  c1: [
    {
      id: 'ws1',
      campaignId: 'c1',
      station: 'BBC Radio 1',
      country: 'UK',
      city: 'London',
      spinTime: '2024-02-20T14:30:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws2',
      campaignId: 'c1',
      station: 'RTE 2FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2024-02-20T10:15:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws3',
      campaignId: 'c1',
      station: 'Radio X',
      country: 'UK',
      city: 'Manchester',
      spinTime: '2024-02-19T18:45:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws4',
      campaignId: 'c1',
      station: 'BBC Radio 6 Music',
      country: 'UK',
      city: 'London',
      spinTime: '2024-02-19T12:00:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws5',
      campaignId: 'c1',
      station: 'Today FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2024-02-18T16:30:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws6',
      campaignId: 'c1',
      station: 'Absolute Radio',
      country: 'UK',
      city: 'Birmingham',
      spinTime: '2024-02-18T08:20:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws7',
      campaignId: 'c1',
      station: 'KEXP',
      country: 'US',
      city: 'Seattle',
      spinTime: '2024-02-17T22:15:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws8',
      campaignId: 'c1',
      station: 'BBC Radio Scotland',
      country: 'UK',
      city: 'Glasgow',
      spinTime: '2024-02-17T14:00:00Z',
      rotationLevel: 'medium',
    },
  ],
  c2: [
    {
      id: 'ws9',
      campaignId: 'c2',
      station: 'BBC Radio 1',
      country: 'UK',
      city: 'London',
      spinTime: '2024-02-19T09:15:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws10',
      campaignId: 'c2',
      station: 'RTE 2FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2024-02-18T15:30:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws11',
      campaignId: 'c2',
      station: 'Radio X',
      country: 'UK',
      city: 'London',
      spinTime: '2024-02-17T20:00:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws12',
      campaignId: 'c2',
      station: 'BBC Radio 6 Music',
      country: 'UK',
      city: 'London',
      spinTime: '2024-02-16T11:45:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws13',
      campaignId: 'c2',
      station: 'Amazing Radio',
      country: 'UK',
      city: 'Manchester',
      spinTime: '2024-02-15T19:30:00Z',
      rotationLevel: 'heavy',
    },
    {
      id: 'ws14',
      campaignId: 'c2',
      station: 'Today FM',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2024-02-14T13:00:00Z',
      rotationLevel: 'light',
    },
    {
      id: 'ws15',
      campaignId: 'c2',
      station: 'BBC Radio Wales',
      country: 'UK',
      city: 'Cardiff',
      spinTime: '2024-02-13T16:15:00Z',
      rotationLevel: 'medium',
    },
    {
      id: 'ws16',
      campaignId: 'c2',
      station: 'Newstalk',
      country: 'IE',
      city: 'Dublin',
      spinTime: '2024-02-12T10:30:00Z',
      rotationLevel: 'light',
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
    title: 'KYARA - Ladybird Campaign',
    startDate: '2024-02-01',
    endDate: '2024-03-15',
    status: 'on-track',
  },
  {
    id: 'mt2',
    title: 'Senior Dunce - UK Tour & EP Launch',
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    status: 'at-risk',
  },
  {
    id: 'mt3',
    title: 'Concerta - Debut EP Intro',
    startDate: '2024-04-10',
    endDate: '2024-06-20',
    status: 'on-track',
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
    id: 'tf_kyara_001',
    artistName: 'KYARA',
    submittedAt: '2024-02-01T09:32:00Z',
    completeness: 92,
    missingFields: [],
  },
  {
    id: 'tf_senior_001',
    artistName: 'Senior Dunce',
    submittedAt: '2024-02-03T14:10:00Z',
    completeness: 76,
    missingFields: ['TikTok handle', 'Press photos'],
  },
  {
    id: 'tf_concerta_001',
    artistName: 'Concerta',
    submittedAt: '2024-02-05T11:47:00Z',
    completeness: 61,
    missingFields: ['EPK link', 'Spotify for Artists URL', 'Social assets'],
  },
  {
    id: 'tf_velvet_001',
    artistName: 'Velvet Shakes',
    submittedAt: '2024-02-08T16:22:00Z',
    completeness: 88,
    missingFields: ['Tour dates'],
  },
  {
    id: 'tf_echo_001',
    artistName: 'Echo Driver',
    submittedAt: '2024-02-10T10:15:00Z',
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
