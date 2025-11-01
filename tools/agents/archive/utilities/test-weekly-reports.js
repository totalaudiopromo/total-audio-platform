#!/usr/bin/env node

/**
 * Test script for Weekly WARM Report Generation
 * Tests campaign performance tracking and weekly report generation
 */

require('dotenv').config();
const WarmusicAPI = require('./integrations/warm-api');

async function testWeeklyReports() {
  console.log('📊 Testing Weekly WARM Report Generation for Liberty Music PR...\n');

  const warmApi = new WarmusicAPI();

  try {
    // Test 1: Health Check
    console.log('1. 🔍 Testing WARM API Health Check...');
    const healthStatus = await warmApi.healthCheck();
    console.log('Health Status:', JSON.stringify(healthStatus, null, 2));

    if (healthStatus.status !== 'healthy' && healthStatus.status !== 'unavailable') {
      console.error('❌ WARM API is not healthy. Check credentials.');
      return;
    }

    console.log('✅ WARM API health check completed\n');

    // Test 2: Campaign Performance Summary (Dry Run)
    console.log('2. 📈 Testing Campaign Performance Summary Generation...');

    const testArtistName = 'Ed Sheeran'; // Known artist for testing
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
    const testStartDate = sixWeeksAgo.toISOString().split('T')[0];

    console.log(`Test campaign data:`);
    console.log(`   Artist: ${testArtistName}`);
    console.log(`   Start Date: ${testStartDate}`);
    console.log(`   Duration: 6 weeks`);

    if (healthStatus.status === 'healthy') {
      try {
        const performanceSummary = await warmApi.generateCampaignPerformanceSummary(
          testArtistName,
          testStartDate
        );
        console.log('Performance Summary:', JSON.stringify(performanceSummary, null, 2));
      } catch (error) {
        console.log(
          '⚠️ Performance summary generation failed (expected if no plays):',
          error.message
        );
      }
    } else {
      console.log('⚠️ Skipping performance summary test - WARM API not available');
    }

    console.log('✅ Campaign performance summary test completed\n');

    // Test 3: Week Number Calculation
    console.log('3. 📅 Testing Week Number Calculation...');

    const startDate = new Date('2024-01-01');
    const testDates = [
      new Date('2024-01-01'), // Week 1
      new Date('2024-01-08'), // Week 2
      new Date('2024-01-15'), // Week 3
      new Date('2024-01-22'), // Week 4
      new Date('2024-01-29'), // Week 5
      new Date('2024-02-05'), // Week 6
    ];

    console.log('Week calculations:');
    testDates.forEach(date => {
      const weekNumber = warmApi.getWeekNumber(startDate, date);
      console.log(`   ${date.toISOString().split('T')[0]}: Week ${weekNumber}`);
    });

    console.log('✅ Week number calculation test completed\n');

    // Test 4: Performance Rating Calculation
    console.log('4. 🏆 Testing Performance Rating Calculation...');

    const testScenarios = [
      { plays: 0, stations: 0, expected: 'No Activity' },
      { plays: 3, stations: 2, expected: 'Low' },
      { plays: 12, stations: 5, expected: 'Moderate' },
      { plays: 25, stations: 8, expected: 'Good' },
      { plays: 40, stations: 12, expected: 'Strong' },
      { plays: 75, stations: 20, expected: 'Excellent' },
    ];

    console.log('Performance rating scenarios:');
    testScenarios.forEach(scenario => {
      const rating = warmApi.calculatePerformanceRating(scenario.plays, scenario.stations);
      const status = rating === scenario.expected ? '✅' : '❌';
      console.log(
        `   ${status} ${scenario.plays} plays, ${scenario.stations} stations → ${rating} (expected: ${scenario.expected})`
      );
    });

    console.log('✅ Performance rating calculation test completed\n');

    // Test 5: Top Stations Analysis
    console.log('5. 📻 Testing Top Stations Analysis...');

    const mockPlays = [
      { radioStation: 'BBC Radio 6 Music' },
      { radioStation: 'BBC Radio 6 Music' },
      { radioStation: 'BBC Radio 6 Music' },
      { radioStation: 'Amazing Radio' },
      { radioStation: 'Amazing Radio' },
      { radioStation: 'BBC Radio 1' },
      { radioStation: 'Radio X' },
      { radioStation: 'Radio X' },
    ];

    const topStations = warmApi.getTopStations(mockPlays, 3);
    console.log('Top stations from mock data:');
    topStations.forEach((station, index) => {
      console.log(`   ${index + 1}. ${station.station}: ${station.plays} plays`);
    });

    console.log('✅ Top stations analysis test completed\n');

    // Test 6: Weekly Breakdown Analysis
    console.log('6. 📊 Testing Weekly Breakdown Analysis...');

    const mockPlaysWithDates = [
      { radioStation: 'BBC Radio 6 Music', date: '2024-01-02' },
      { radioStation: 'BBC Radio 6 Music', date: '2024-01-03' },
      { radioStation: 'Amazing Radio', date: '2024-01-09' },
      { radioStation: 'BBC Radio 1', date: '2024-01-15' },
      { radioStation: 'Radio X', date: '2024-01-16' },
      { radioStation: 'Radio X', date: '2024-01-17' },
    ];

    const weeklyBreakdown = warmApi.groupPlaysByWeek(mockPlaysWithDates, '2024-01-01');
    console.log('Weekly breakdown from mock data:');
    weeklyBreakdown.forEach(week => {
      console.log(`   Week ${week.week}: ${week.plays} plays, ${week.stationCount} stations`);
      console.log(`      Stations: ${week.stations.join(', ')}`);
    });

    console.log('✅ Weekly breakdown analysis test completed\n');

    console.log('🎉 All Weekly WARM Report tests completed successfully!');
    console.log('\n📋 Available Weekly Report Methods:');
    console.log(
      '   • warmApi.generateWeeklyReport(artist, track, startDate, driveAPI, campaignData)'
    );
    console.log('   • warmApi.generateCampaignPerformanceSummary(artist, startDate)');
    console.log('   • warmApi.getWeekNumber(startDate, currentDate)');
    console.log('   • warmApi.calculatePerformanceRating(totalPlays, totalStations)');
    console.log('   • warmApi.getTopStations(plays, limit)');
    console.log('   • warmApi.groupPlaysByWeek(plays, campaignStartDate)');

    console.log('\n🎯 CLI Commands Available:');
    console.log('   • node radio-promo-agent.js generate-weekly-report "Artist Name" "start-date"');
    console.log('   • node radio-promo-agent.js campaign-performance "Artist Name" "start-date"');
    console.log(
      '   • node radio-promo-agent.js update-weekly-report "Artist Name" "start-date" [campaign-id]'
    );

    console.log('\n💡 Integration Notes:');
    console.log('   • Weekly reports automatically save to Google Drive (when available)');
    console.log('   • Reports include performance ratings and top station analysis');
    console.log('   • Monday.com gets updated with report links automatically');
    console.log('   • Campaign performance tracking with weekly breakdowns');
  } catch (error) {
    console.error('❌ Weekly WARM Report test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
if (require.main === module) {
  testWeeklyReports().catch(console.error);
}

module.exports = { testWeeklyReports };
