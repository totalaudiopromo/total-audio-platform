/**
 * Watchlist Engine
 */

import * as watchlistStore from './watchlistStore.js';

export const {
  createWatchlist,
  listWatchlistsForUser,
  addToWatchlist,
  removeFromWatchlist,
  listWatchlistMembers,
} = watchlistStore;

// TODO: Future alert hooks
// - generateWatchlistAlerts(): Check for score jumps, momentum spikes, scene shifts
// - alertOnScoreJump(watchlistId, threshold): Alert when scores jump
// - alertOnMomentumSpike(watchlistId, threshold): Alert when momentum spikes
// - alertOnDealCreated(watchlistId): Alert when deals are created for watched artists
