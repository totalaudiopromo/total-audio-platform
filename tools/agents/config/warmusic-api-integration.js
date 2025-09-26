// Warmusic API Integration for Liberty Radio Agent
// Real API implementation based on OpenAPI documentation

class WarmusicAPI {
  constructor() {
    this.baseUrl = 'https://public-api.warmmusic.net/api/v1';
    this.email = 'promo@totalaudiopromo.com';
    this.password = process.env.WARMUSIC_PASSWORD; // Store securely
    this.token = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    if (this.token && this.tokenExpiry > Date.now()) {
      return this.token; // Token still valid
    }

    const response = await fetch(`${this.baseUrl}/auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    });

    this.token = await response.text();
    this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000); // 23 hours (buffer)
    return this.token;
  }

  async getPlaysForCampaign(artistName, songName, fromDate, untilDate) {
    const token = await this.authenticate();
    
    const params = new URLSearchParams({
      artistName: artistName,
      ...(songName && { songName }), // Optional - can monitor all artist plays
      fromDate: fromDate, // YYYYMMDD format
      untilDate: untilDate, // YYYYMMDD format
      countryCode: 'GB', // UK focus for Liberty
      pageSize: '100'
    });

    const response = await fetch(`${this.baseUrl}/plays?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.json();
  }

  async getUKRadioStations() {
    const token = await this.authenticate();
    
    const params = new URLSearchParams({
      countryCode: 'GB',
      isMonitored: 'true', // Only monitored stations
      pageSize: '500'
    });

    const response = await fetch(`${this.baseUrl}/radio-stations?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.json();
  }

  async getPlaysByStation(radioStationId, fromDate, untilDate) {
    const token = await this.authenticate();
    
    const params = new URLSearchParams({
      radioStationId: radioStationId,
      fromDate: fromDate,
      untilDate: untilDate,
      pageSize: '100'
    });

    const response = await fetch(`${this.baseUrl}/plays?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.json();
  }

  async generateCampaignReport(artistName, fromDate, untilDate) {
    const token = await this.authenticate();
    
    const params = new URLSearchParams({
      artistName: artistName,
      fromDate: fromDate,
      untilDate: untilDate,
      countryCode: 'GB'
    });

    const response = await fetch(`${this.baseUrl}/reports/csv?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.blob(); // CSV file for client reports
  }

  // Liberty-specific monitoring methods
  async checkDailyPlays(activeCampaigns) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const results = [];

    for (const campaign of activeCampaigns) {
      const plays = await this.getPlaysForCampaign(
        campaign.artistName,
        campaign.trackName,
        today,
        today
      );

      if (plays.currentPagesEntities.length > 0) {
        results.push({
          campaignId: campaign.id,
          artist: campaign.artistName,
          track: campaign.trackName,
          newPlays: plays.currentPagesEntities,
          playCount: plays.currentPagesEntities.length
        });
      }
    }

    return results;
  }

  async getStationDetails(stationName) {
    const stations = await this.getUKRadioStations();
    return stations.currentPagesEntities.find(
      station => station.name.toLowerCase().includes(stationName.toLowerCase())
    );
  }
}

module.exports = WarmusicAPI;
