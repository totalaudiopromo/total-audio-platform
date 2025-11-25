export interface PressProfile {
  id: string;
  artist: string;
  title: string;
  headline: string;
  shortSummary: string;
  longSummary: string[];
  keyAngles: string[];
  suggestedPullQuotes: string[];
  suggestedOutlets: string[];
  tags: string[];
}

export const PRESS_PROFILES: Record<string, PressProfile> = {
  concertaConsumption: {
    id: 'concertaConsumption',
    artist: 'Concerta',
    title: 'Consumption',
    headline: 'Concerta Returns with "Consumption" — A Post-Punk Meditation on Modern Excess',
    shortSummary:
      'Manchester post-punk outfit Concerta delivers a searing critique of consumer culture through angular guitars and propulsive rhythms. "Consumption" marks their bold return ahead of their debut EP, positioning the band at the forefront of the UK\'s thriving post-punk revival.',
    longSummary: [
      'Concerta\'s "Consumption" emerges as a powerful statement from Manchester\'s resurgent post-punk scene. The track combines driving basslines with incisive lyricism, exploring themes of modern consumption culture through a lens of raw, unfiltered energy.',
      "The band's DIY ethos shines through in every aspect of the release, from the self-produced recording to the self-directed visual aesthetic. This independence positions Concerta alongside contemporaries like Dry Cleaning and Squid, while maintaining their own distinct voice.",
      "The press release emphasises the band's connection to the Manchester music community, highlighting their regular appearances at venues like The Windmill and their growing reputation among tastemaker outlets. The track serves as the lead single for their forthcoming debut EP, scheduled for release in early 2025.",
      'With support already building from BBC 6 Music and key independent radio stations, "Consumption" represents a significant moment for the band. The track\'s combination of accessible hooks and challenging subject matter makes it an ideal entry point for both new listeners and established post-punk fans.',
    ],
    keyAngles: [
      'Manchester post-punk revival — positioning alongside Dry Cleaning, Squid, and Black Country, New Road',
      'DIY independence — self-produced and self-released, emphasising artistic autonomy',
      'Social commentary — "Consumption" critiques modern consumer culture with sharp lyricism',
      'Debut EP lead single — establishes narrative arc for forthcoming full release',
      'Tastemaker support — early BBC 6 Music and independent radio backing',
    ],
    suggestedPullQuotes: [
      '"Consumption" is a searing critique of modern excess, delivered with the urgency of classic post-punk.',
      "Concerta positions themselves at the forefront of Manchester's thriving post-punk scene.",
      "The band's DIY approach and sharp social commentary make them essential listening for 2025.",
      'A powerful return that proves post-punk is far from exhausted as a creative force.',
    ],
    suggestedOutlets: [
      'The Quietus',
      'NME',
      'The Line of Best Fit',
      'Dork',
      'DIY Magazine',
      'BBC 6 Music',
      'Radio X',
      'Amazing Radio',
      'The Guardian (Music)',
      'Clash Magazine',
    ],
    tags: ['post-punk', 'manchester', 'diy', 'social-commentary', 'debut-ep', 'bbc-6-music'],
  },

  kyaraHarmony: {
    id: 'kyaraHarmony',
    artist: 'KYARA',
    title: 'Ladybird',
    headline: 'KYARA\'s "Ladybird" Blends Alt-Pop Sophistication with Electronic Innovation',
    shortSummary:
      'Rising alt-pop artist KYARA delivers "Ladybird", a shimmering blend of electronic textures and introspective lyricism. The track showcases her evolution as both a songwriter and producer, positioning her as one of the UK\'s most exciting new voices in alternative pop.',
    longSummary: [
      'KYARA\'s "Ladybird" represents a significant step forward for the Manchester-based artist, combining her signature electronic production with increasingly sophisticated songwriting. The track\'s blend of synth-pop aesthetics and alt-pop sensibilities has already garnered attention from key tastemaker outlets.',
      "The press release highlights KYARA's growing reputation within the UK's independent music scene, with early support from BBC Radio 1, BBC 6 Music, and key Spotify playlists. Her ability to balance accessibility with artistic integrity has made her a favourite among both mainstream and alternative press.",
      'The track serves as the lead single from her forthcoming project, building on the momentum of her previous releases. KYARA\'s evolution as both a performer and producer is evident throughout "Ladybird", which showcases her ability to craft memorable hooks without sacrificing depth.',
      "With a sound that draws comparisons to artists like Pale Waves, CHVRCHES, and The 1975, KYARA is positioned to break through to a wider audience while maintaining her credibility within the independent music community. The track's success on streaming platforms and radio support suggests strong commercial potential.",
    ],
    keyAngles: [
      'Alt-pop evolution — positions KYARA alongside Pale Waves, CHVRCHES, and The 1975',
      'BBC Radio 1 support — early playlist adds and radio rotation demonstrate mainstream potential',
      'Streaming success — strong performance on Spotify playlists including Fresh Finds and New Music Friday UK',
      "Producer-songwriter — emphasises KYARA's dual role as both creator and performer",
      'Manchester scene — connects to thriving Northern electronic and alt-pop community',
    ],
    suggestedPullQuotes: [
      '"Ladybird" showcases KYARA\'s evolution into one of the UK\'s most exciting alt-pop voices.',
      'The track balances electronic innovation with pop accessibility, creating something truly special.',
      'KYARA proves that independent artists can achieve mainstream success without compromising their artistic vision.',
      'A shimmering blend of synth-pop that positions KYARA for breakthrough success.',
    ],
    suggestedOutlets: [
      'NME',
      'The Line of Best Fit',
      'Dork',
      'Clash Magazine',
      'BBC Radio 1',
      'BBC 6 Music',
      'Radio X',
      'Wonderland Magazine',
      'Notion Magazine',
      'The Guardian (Music)',
    ],
    tags: [
      'alt-pop',
      'electronic',
      'manchester',
      'bbc-radio-1',
      'streaming-success',
      'independent',
    ],
  },

  seniorDunceRebirth: {
    id: 'seniorDunceRebirth',
    artist: 'Senior Dunce',
    title: 'UK Tour & EP Launch',
    headline:
      "Senior Dunce Announce UK Tour and Forthcoming EP — Indie Rock's Most Promising New Voice",
    shortSummary:
      "Indie rock outfit Senior Dunce announce their biggest UK tour to date alongside news of their forthcoming EP. The band's blend of lo-fi aesthetics and anthemic songwriting has earned them a dedicated following and support from Rough Trade Records, positioning them as one of the UK's most exciting new bands.",
    longSummary: [
      "Senior Dunce's announcement of their UK tour and forthcoming EP represents a significant moment for the band, who have been building momentum through a series of well-received singles. Their blend of lo-fi indie rock and anthemic songwriting has earned them comparisons to artists like Sam Fender, The Snuts, and The Lathums.",
      "The press release emphasises the band's connection to the thriving UK indie rock scene, with particular focus on their Northern roots and DIY beginnings. Their partnership with Rough Trade Records demonstrates the label's confidence in the band's commercial potential while maintaining their independent spirit.",
      "The tour announcement includes dates at some of the UK's most prestigious independent venues, reflecting the band's growing reputation and dedicated fanbase. The combination of new music and live performances creates a compelling narrative for press coverage, positioning the tour as a must-see event for indie rock fans.",
      'With radio support already building from BBC Radio 1 and BBC 6 Music, Senior Dunce are positioned to break through to a wider audience. The EP release and tour announcement create multiple angles for press coverage, from album reviews to tour previews and live session opportunities.',
    ],
    keyAngles: [
      'Rough Trade Records partnership — major label backing for independent band',
      'UK tour announcement — dates at prestigious venues create multiple press opportunities',
      'Indie rock revival — positions alongside Sam Fender, The Snuts, and The Lathums',
      'Northern roots — emphasises connection to thriving UK indie scene',
      'EP release — new music provides review and feature opportunities',
    ],
    suggestedPullQuotes: [
      'Senior Dunce prove that indie rock is alive and well in the UK, with anthemic songwriting and undeniable energy.',
      "The band's partnership with Rough Trade Records signals their arrival as one of the UK's most promising new acts.",
      'A tour announcement that positions Senior Dunce as essential viewing for indie rock fans across the UK.',
      "The forthcoming EP promises to be one of the year's most exciting releases in UK indie rock.",
    ],
    suggestedOutlets: [
      'NME',
      'The Line of Best Fit',
      'Dork',
      'DIY Magazine',
      'BBC Radio 1',
      'BBC 6 Music',
      'Radio X',
      'Clash Magazine',
      'Gigwise',
      'The Guardian (Music)',
    ],
    tags: ['indie-rock', 'uk-tour', 'rough-trade', 'northern', 'ep-release', 'bbc-radio-1'],
  },
};

// Map asset IDs to press profile IDs
export const ASSET_TO_PRESS_PROFILE: Record<string, string> = {
  asset_pressrelease_concerta_001: 'concertaConsumption',
  asset_pressrelease_kyara_001: 'kyaraHarmony',
  asset_pressrelease_senior_001: 'seniorDunceRebirth',
};
