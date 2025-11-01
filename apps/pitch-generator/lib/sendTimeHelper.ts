/**
 * Smart Send Time Suggestions
 * Analyses contact outlet/role and suggests optimal send times
 */

interface SendTimeSuggestion {
  time: string;
  reason: string;
}

export function getSuggestedSendTime(
  outlet: string | null,
  role: string | null
): SendTimeSuggestion | null {
  const outletLower = (outlet || '').toLowerCase();
  const roleLower = (role || '').toLowerCase();

  // BBC Radio stations
  if (outletLower.includes('bbc')) {
    if (outletLower.includes('radio 1')) {
      return {
        time: 'Tuesday or Wednesday morning (9-11am)',
        reason: 'Radio 1 producers check pitches mid-week mornings',
      };
    }
    if (outletLower.includes('radio 6') || outletLower.includes('6 music')) {
      return {
        time: 'Monday or Tuesday morning (10am-12pm)',
        reason: '6 Music team reviews new music start of week',
      };
    }
    if (outletLower.includes('radio 2')) {
      return {
        time: 'Wednesday morning (10-11am)',
        reason: 'Radio 2 producers plan playlists mid-week',
      };
    }
    return {
      time: 'Tuesday morning (10am-12pm)',
      reason: 'BBC producers typically check pitches Tuesday mornings',
    };
  }

  // Commercial radio
  if (
    outletLower.includes('capital') ||
    outletLower.includes('heart') ||
    outletLower.includes('smooth')
  ) {
    return {
      time: 'Monday afternoon (2-4pm)',
      reason: 'Commercial stations plan weekly playlists Monday afternoons',
    };
  }

  // Community/specialist radio
  if (
    outletLower.includes('community') ||
    outletLower.includes('hospital') ||
    roleLower.includes('volunteer')
  ) {
    return {
      time: 'Evening (6-8pm) or weekend',
      reason: 'Community radio volunteers often check emails after work',
    };
  }

  // Amazing Radio / Specialist shows
  if (outletLower.includes('amazing') || roleLower.includes('specialist')) {
    return {
      time: 'Sunday evening or Monday morning',
      reason: 'Specialist presenters plan shows for the week ahead',
    };
  }

  // Music blogs
  if (
    outletLower.includes('blog') ||
    roleLower.includes('blogger') ||
    roleLower.includes('writer')
  ) {
    return {
      time: 'Monday afternoon (1-3pm)',
      reason: 'Music bloggers schedule content for the week on Mondays',
    };
  }

  // Online magazines/publications
  if (
    outletLower.includes('magazine') ||
    outletLower.includes('publication') ||
    roleLower.includes('editor')
  ) {
    return {
      time: 'Tuesday or Wednesday morning (10am-12pm)',
      reason: 'Editorial teams review pitches mid-week mornings',
    };
  }

  // Playlist curators (Spotify, Apple Music, etc.)
  if (
    roleLower.includes('curator') ||
    outletLower.includes('spotify') ||
    outletLower.includes('apple music')
  ) {
    return {
      time: 'Monday morning (9-11am)',
      reason: 'Playlist curators refresh playlists start of week',
    };
  }

  // PR/Marketing contacts
  if (
    roleLower.includes('pr') ||
    roleLower.includes('marketing') ||
    roleLower.includes('publicity')
  ) {
    return {
      time: 'Tuesday or Thursday morning (9-10am)',
      reason: 'PR professionals check new pitches early week mornings',
    };
  }

  // Record labels
  if (
    outletLower.includes('records') ||
    outletLower.includes('label') ||
    roleLower.includes('a&r')
  ) {
    return {
      time: 'Wednesday morning (10am-12pm)',
      reason: 'Label teams review new music mid-week',
    };
  }

  // Podcast hosts
  if (
    outletLower.includes('podcast') ||
    roleLower.includes('podcaster') ||
    roleLower.includes('host')
  ) {
    return {
      time: 'Monday or Friday afternoon',
      reason: 'Podcasters plan episodes at start/end of week',
    };
  }

  // YouTube channels
  if (
    outletLower.includes('youtube') ||
    outletLower.includes('channel') ||
    roleLower.includes('youtuber')
  ) {
    return {
      time: 'Sunday evening or Monday morning',
      reason: 'Content creators plan weekly uploads on weekends/Mondays',
    };
  }

  // Generic fallback
  if (roleLower.includes('producer') || roleLower.includes('presenter')) {
    return {
      time: 'Tuesday morning (10-11am)',
      reason: 'Most media professionals check pitches Tuesday mornings',
    };
  }

  // Default for unknown contacts
  return {
    time: 'Tuesday or Wednesday morning (10am-12pm)',
    reason: 'Mid-week mornings are generally best for music industry pitches',
  };
}
