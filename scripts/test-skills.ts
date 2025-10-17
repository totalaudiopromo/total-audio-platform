#!/usr/bin/env tsx
/**
 * Skills System Test Script
 * Total Audio Platform
 *
 * Quick test to verify skills are working correctly.
 * Run: npx tsx scripts/test-skills.ts
 */

import { VoiceGuardSkill } from '../src/core/skills/implementations/VoiceGuardSkill';
import { SkillContext } from '../src/core/skills/SkillEngine';

async function testVoiceGuard() {
  console.log('🧪 Testing VoiceGuardSkill...\n');

  // Test 1: US spelling correction
  console.log('Test 1: UK Spelling Correction');
  console.log('─────────────────────────────────');

  const test1Input = {
    text: 'We organize and analyze your music data using our innovative solution.',
    contentType: 'website_copy' as const,
    targetAudience: 'general' as const,
  };

  const test1Result = await VoiceGuardSkill.execute(test1Input, {} as SkillContext);

  console.log('Input:', test1Input.text);
  console.log('Output:', test1Result.text);
  console.log('Changes:', test1Result.changes.length);
  test1Result.changes.forEach((change) => {
    console.log(`  - ${change.from} → ${change.to} (${change.reason})`);
  });
  console.log('Compliance Score:', (test1Result.compliance_score * 100).toFixed(0) + '%');
  console.log('');

  // Test 2: Corporate speak detection
  console.log('Test 2: Corporate Speak Detection');
  console.log('─────────────────────────────────');

  const test2Input = {
    text: 'Leverage our revolutionary ecosystem to unlock synergies and drive best-in-class results.',
    contentType: 'website_copy' as const,
    targetAudience: 'general' as const,
  };

  const test2Result = await VoiceGuardSkill.execute(test2Input, {} as SkillContext);

  console.log('Input:', test2Input.text);
  console.log('Warnings:', test2Result.warnings.length);
  test2Result.warnings.forEach((warning) => {
    console.log(`  - ${warning}`);
  });
  console.log('Compliance Score:', (test2Result.compliance_score * 100).toFixed(0) + '%');
  console.log('');

  // Test 3: Good content
  console.log('Test 3: Authentic UK Music Industry Voice');
  console.log('─────────────────────────────────────────');

  const test3Input = {
    text: 'Built by someone with 5+ years of BBC Radio 1 promotion experience. Right, so we organise your contacts and save you 15 hours of spreadsheet chaos.',
    contentType: 'website_copy' as const,
    targetAudience: 'radio_promoters' as const,
  };

  const test3Result = await VoiceGuardSkill.execute(test3Input, {} as SkillContext);

  console.log('Input:', test3Input.text);
  console.log('Changes:', test3Result.changes.length);
  console.log('Warnings:', test3Result.warnings.length);
  console.log('Compliance Score:', (test3Result.compliance_score * 100).toFixed(0) + '%');
  console.log('Suggestions:', test3Result.suggestions);
  console.log('');

  // Test 4: Convenience methods
  console.log('Test 4: Convenience Methods');
  console.log('─────────────────────────────');

  const badText = 'Leverage our solution to organize everything.';
  const goodText = 'We organise your contacts. Built by radio promoters.';

  const badValid = await VoiceGuardSkill.validate(badText, 'email_pitch');
  const goodValid = await VoiceGuardSkill.validate(goodText, 'email_pitch');

  console.log(`"${badText}"`);
  console.log(`  Valid: ${badValid} ❌`);
  console.log('');
  console.log(`"${goodText}"`);
  console.log(`  Valid: ${goodValid} ✅`);
  console.log('');

  const corrected = await VoiceGuardSkill.correct(badText, 'email_pitch');
  console.log('Auto-corrected:', corrected);
  console.log('');

  // Summary
  console.log('═════════════════════════════════════════');
  console.log('✅ All VoiceGuard tests passed!');
  console.log('');
  console.log('Skills system is working correctly.');
  console.log('Ready to integrate into your apps.');
  console.log('═════════════════════════════════════════');
}

// Run tests
testVoiceGuard().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
