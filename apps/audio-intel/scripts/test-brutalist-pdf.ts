/**
 * Test script to generate a brutalist PDF export
 * Run with: tsx scripts/test-brutalist-pdf.ts
 */

import { generateBrutalistPDF, calculateMetrics } from '../lib/generate-brutalist-pdf';
import type { BrutalistPDFContact } from '../lib/pdf-brutalist-template';
import * as fs from 'fs';
import * as path from 'path';

// Sample contacts matching the format expected by the brutalist PDF
const sampleContacts: BrutalistPDFContact[] = [
  {
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1 - UK National Broadcaster',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 - UK national broadcaster. Presenter of "Jack Saunders New Music" show. Genres: Alternative, Indie, Rock, Electronic. Key tastemaker for breaking new artists in the UK. Best contact time: Weekday mornings for submissions.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Clara Amfo',
    email: 'clara.amfo@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 mid-morning show presenter. Genres: Pop, R&B, Hip-Hop, UK artists. Champion of diverse new music. Focus on emerging UK talent.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Huw Stephens',
    email: 'huw.stephens@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 presenter specialising in new music discovery. Known for supporting emerging artists across all genres. Best contact: Evening shows.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Spotify Editorial Team',
    email: 'editorial@spotify.com',
    platform: 'Spotify',
    role: 'Playlist Curators',
    company: 'Spotify',
    researchConfidence: 'Medium',
    contactIntelligence:
      'Spotify editorial team managing major playlists including New Music Friday UK. Controls major playlists. Submit via Spotify for Artists platform. London office handles UK submissions.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Mary Anne Hobbs',
    email: 'maryanne.hobbs@bbc.co.uk',
    platform: 'BBC 6 Music',
    role: 'Presenter',
    company: 'BBC 6 Music',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC 6 Music presenter specialising in electronic and experimental music. Highly influential tastemaker. Known for breaking new electronic artists.',
    lastResearched: new Date().toISOString(),
  },
];

async function testBrutalistPDF() {
  console.log('🎨 Generating brutalist PDF export...\n');

  try {
    // Calculate metrics
    const metrics = calculateMetrics(sampleContacts);

    console.log('📊 Metrics calculated:');
    console.log(`   Total Contacts: ${metrics.total}`);
    console.log(`   High Confidence: ${metrics.high}`);
    console.log(`   Medium Confidence: ${metrics.medium}`);
    console.log(`   Low Confidence: ${metrics.low}`);
    console.log(`   Top Platforms: ${metrics.platforms.length}\n`);

    // Generate PDF
    console.log('🖨️  Generating PDF with Playwright...');
    const pdfBuffer = await generateBrutalistPDF(
      sampleContacts,
      metrics,
      'audio-intel-brutalist-test.pdf',
      {
        companyName: 'Audio Intel',
        primaryColor: '#06b6d4', // cyan-500
      }
    );

    // Save to file
    const outputPath = path.join(process.cwd(), 'audio-intel-brutalist-test.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ PDF generated successfully!`);
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`📦 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB\n`);

    console.log('✨ Brutalist PDF test complete!');
    console.log('   Open the PDF to see the new brutalist design with:');
    console.log('   - Bold black borders (4px)');
    console.log('   - Offset shadows on cards');
    console.log('   - Professional typography');
    console.log('   - Summary metrics');
    console.log('   - Individual contact cards');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      if (error.message.includes('Playwright browser not available')) {
        console.error('\n💡 Solution: Run: npx playwright install chromium');
      }
    }
    process.exit(1);
  }
}

// Run the test
testBrutalistPDF();
