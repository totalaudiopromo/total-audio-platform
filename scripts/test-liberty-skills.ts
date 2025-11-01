#!/usr/bin/env ts-node
/**
 * Test Liberty Radio Promo Skills
 *
 * Tests StationMatcherSkill and EmailPersonalisationSkill with real campaign data.
 * Uses Senior Dunce "Bestial" campaign as test case.
 */

import Anthropic from '@anthropic-ai/sdk';
import { StationMatcherSkill } from '../src/core/skills/implementations/StationMatcherSkill';
import { EmailPersonalisationSkill } from '../src/core/skills/implementations/EmailPersonalisationSkill';
import { SkillContext } from '../src/core/skills/schema';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const context: SkillContext = {
  orgId: 'liberty-music-pr',
  userId: 'chris-schofield',
  tools: {
    llm: anthropic,
  },
  permissions: ['read', 'write', 'execute'],
};

async function testStationMatcher() {
  console.log('\n🎯 TEST 1: Station Matcher Skill');
  console.log('='.repeat(60));

  const input = {
    track_info: {
      artist: 'Senior Dunce',
      title: 'Bestial',
      genre: 'electronic/experimental',
      vibe: 'dark, industrial, UK electronic influence',
      tempo: 'mid-tempo',
      influences: 'British electronic, experimental',
      streams: 5000,
    },
    artist_profile: {
      previous_plays: ['Amazing Dance', 'Sheffield Live!', 'European Indie Music Network'],
      social_proof: 'Featured on 3 stations, UK electronic focus',
      career_stage: 'emerging' as const,
    },
    max_stations: 10,
    priority_level: 'high' as const,
  };

  const startTime = Date.now();

  try {
    const result = await StationMatcherSkill.execute(input, context);
    const duration = Date.now() - startTime;

    console.log(
      `\n✅ Matched ${result.station_recommendations.length} stations in ${duration}ms\n`
    );

    console.log('📊 Confidence Scores:');
    console.log(`  Overall: ${(result.confidence_scores.overall * 100).toFixed(0)}%`);
    console.log(`  Genre Accuracy: ${(result.confidence_scores.genre_accuracy * 100).toFixed(0)}%`);
    console.log(
      `  Career Stage Match: ${(result.confidence_scores.career_stage_match * 100).toFixed(0)}%`
    );

    console.log('\n🎵 Genre Fit Analysis:');
    console.log(`  Primary: ${result.genre_fit_analysis.primary_genre}`);
    console.log(`  Secondary: ${result.genre_fit_analysis.secondary_genres.join(', ')}`);
    console.log(`  Station Categories: ${result.genre_fit_analysis.station_categories.join(', ')}`);

    console.log('\n🎯 Top 5 Station Recommendations:\n');
    result.station_recommendations.slice(0, 5).forEach((station, index) => {
      console.log(`${index + 1}. ${station.station_name} (${station.station_type})`);
      console.log(
        `   Priority: ${station.priority} | Genre Fit: ${(station.genre_fit * 100).toFixed(0)}% | Success: ${station.success_likelihood}`
      );
      console.log(`   Reasoning: ${station.reasoning}`);
      if (station.specific_shows.length > 0) {
        console.log(`   Shows: ${station.specific_shows.join(', ')}`);
      }
      console.log('');
    });

    console.log('💡 Campaign Strategy:');
    console.log(`  ${result.campaign_strategy}\n`);

    // Test convenience methods
    console.log('🔧 Testing Convenience Methods:\n');

    const highPriority = await StationMatcherSkill.getHighPriorityStations(input, context);
    console.log(`  High priority stations: ${highPriority.length}`);

    const topThree = await StationMatcherSkill.getTopStations(input, context, 3);
    console.log(`  Top 3 stations: ${topThree.map(s => s.station_name).join(', ')}`);

    const onlineStations = await StationMatcherSkill.getStationsByType(input, context, 'Online');
    console.log(`  Online stations: ${onlineStations.length}`);

    const reach = await StationMatcherSkill.estimateCampaignReach(input, context);
    console.log(`  Estimated plays: ${reach.estimated_plays}/${reach.total_stations} stations`);
    console.log(`  Estimated reach: ${reach.estimated_reach}`);

    return result;
  } catch (error: any) {
    console.error('❌ Station Matcher Test Failed:', error.message);
    throw error;
  }
}

async function testEmailPersonalisation(stationRecommendations: any[]) {
  console.log('\n\n📧 TEST 2: Email Personalisation Skill');
  console.log('='.repeat(60));

  // Use top station from matcher result
  const topStation = stationRecommendations[0];

  const input = {
    station_info: {
      name: topStation.station_name,
      type: topStation.station_type,
      known_shows: topStation.specific_shows || [],
      submission_type: topStation.contact_type,
    },
    track_info: {
      artist: 'Senior Dunce',
      title: 'Bestial',
      genre: 'electronic/experimental',
      vibe: 'dark, industrial, UK electronic influence',
      link: 'https://soundcloud.com/seniordunce/bestial',
    },
    campaign_angle: 'UK electronic influence with British engineer collaboration',
    social_proof: [
      'Amazing Dance playlist',
      'Sheffield Live! support',
      'European Indie Music Network feature',
    ],
    liberty_voice: true,
  };

  const startTime = Date.now();

  try {
    const result = await EmailPersonalisationSkill.execute(input, context);
    const duration = Date.now() - startTime;

    console.log(`\n✅ Generated personalised email in ${duration}ms\n`);

    console.log('📊 Personalisation Score:');
    console.log(
      `  ${(result.personalisation_score * 100).toFixed(0)}% (${result.estimated_response_rate} response likelihood)\n`
    );

    console.log('📧 Generated Email:\n');
    console.log('─'.repeat(60));
    console.log(`Subject: ${result.email_draft.subject}`);
    console.log('─'.repeat(60));
    console.log(result.email_draft.body);
    console.log('─'.repeat(60));
    console.log(result.email_draft.signature);
    console.log('─'.repeat(60));

    console.log('\n🎯 Personalisation Details:');
    console.log(`  Elements Used: ${result.personalisation_details.elements_used.join(', ')}`);
    console.log(`  Station Knowledge: ${result.personalisation_details.station_knowledge}`);
    console.log(`  Presenter Targeting: ${result.personalisation_details.presenter_targeting}`);
    console.log(`  Reasoning: ${result.personalisation_details.reasoning}`);

    if (result.alternative_approaches.length > 0) {
      console.log('\n💡 Alternative Approaches:');
      result.alternative_approaches.forEach(alt => {
        console.log(`  • ${alt.angle}`);
        console.log(`    ${alt.reasoning}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    // Test batch generation
    console.log('\n\n🔧 Testing Batch Email Generation:\n');

    const batchStations = stationRecommendations.slice(0, 3).map(s => ({
      name: s.station_name,
      type: s.station_type,
      known_shows: s.specific_shows || [],
      submission_type: s.contact_type,
    }));

    const batchStartTime = Date.now();
    const batchEmails = await EmailPersonalisationSkill.generateBatchEmails(
      batchStations,
      input.track_info,
      input.campaign_angle,
      input.social_proof,
      context
    );
    const batchDuration = Date.now() - batchStartTime;

    console.log(`  Generated ${batchEmails.length} emails in ${batchDuration}ms\n`);
    batchEmails.forEach((email, index) => {
      console.log(
        `  ${index + 1}. ${email.station} (${(email.email.personalisation_score * 100).toFixed(0)}% personalised)`
      );
      console.log(`     Subject: ${email.email.email_draft.subject}`);
    });

    // Calculate time savings
    console.log('\n\n💰 Time & Cost Savings:\n');
    const savings = EmailPersonalisationSkill.calculateTimeSavings(10);
    console.log(`  Manual drafting (10 emails): ${savings.manual_time_minutes} minutes`);
    console.log(`  AI generation (10 emails): ${savings.ai_time_seconds} seconds`);
    console.log(`  Time saved: ${savings.time_saved_minutes.toFixed(0)} minutes`);
    console.log(`  Cost per email: $${savings.cost_per_email.toFixed(4)}`);
    console.log(`  Total cost (10 emails): $${(savings.cost_per_email * 10).toFixed(4)}`);

    return result;
  } catch (error: any) {
    console.error('❌ Email Personalisation Test Failed:', error.message);
    throw error;
  }
}

async function testVoiceGuardIntegration() {
  console.log('\n\n🛡️  TEST 3: Email Personalisation + Voice Guard Integration');
  console.log('='.repeat(60));

  const input = {
    station_info: {
      name: 'BBC Radio 6 Music',
      type: 'National' as const,
      known_shows: ['Tom Ravenscroft late night'],
      submission_type: 'Direct Email',
    },
    track_info: {
      artist: 'Senior Dunce',
      title: 'Bestial',
      genre: 'electronic/experimental',
      link: 'https://soundcloud.com/seniordunce/bestial',
    },
    campaign_angle: 'UK electronic influence with British engineer collaboration',
    social_proof: ['Amazing Dance support', 'Sheffield Live! play'],
    liberty_voice: true,
  };

  const startTime = Date.now();

  try {
    const result = await EmailPersonalisationSkill.generateWithVoiceGuard(input, context);
    const duration = Date.now() - startTime;

    console.log(`\n✅ Generated & validated email in ${duration}ms\n`);

    console.log('📊 Voice Compliance:');
    console.log(
      `  Score: ${(result.voice_compliance * 100).toFixed(0)}% (${result.voice_corrections} corrections made)\n`
    );

    console.log('📧 Voice-Validated Email:\n');
    console.log('─'.repeat(60));
    console.log(`Subject: ${result.email.email_draft.subject}`);
    console.log('─'.repeat(60));
    console.log(result.email.email_draft.body);
    console.log('─'.repeat(60));

    return result;
  } catch (error: any) {
    console.error('❌ Voice Guard Integration Test Failed:', error.message);
    throw error;
  }
}

async function runAllTests() {
  console.log('\n╔' + '═'.repeat(58) + '╗');
  console.log('║  LIBERTY RADIO PROMO SKILLS - TEST SUITE                ║');
  console.log('║  Senior Dunce "Bestial" Campaign Test                   ║');
  console.log('╚' + '═'.repeat(58) + '╝');

  try {
    // Test 1: Station Matcher
    const matcherResult = await testStationMatcher();

    // Test 2: Email Personalisation
    await testEmailPersonalisation(matcherResult.station_recommendations);

    // Test 3: Voice Guard Integration
    await testVoiceGuardIntegration();

    console.log('\n\n╔' + '═'.repeat(58) + '╗');
    console.log('║  ✅ ALL TESTS PASSED                                     ║');
    console.log('╚' + '═'.repeat(58) + '╝\n');

    console.log('🚀 Liberty Radio Promo Skills are ready for production!\n');
    console.log('Next steps:');
    console.log('  1. Integrate into LibertyRadioPromoAgent');
    console.log('  2. Add to orchestrator workflow');
    console.log('  3. Test with real campaign data');
    console.log('  4. Deploy to production\n');
  } catch (error: any) {
    console.error('\n\n❌ TEST SUITE FAILED\n');
    console.error(error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testStationMatcher, testEmailPersonalisation, testVoiceGuardIntegration };
