const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Demo function to show how domain analysis works
function demoDomainAnalysis() {
  console.log('🎵 Email Domain Analysis Demo\n');
  
  // Sample email addresses to test
  const sampleEmails = [
    'playlist@spotify.com',
    'editor@pitchfork.com',
    'dj@kcrw.com',
    'ar@universal.com',
    'booking@coachella.com',
    'john@gmail.com', // Should be skipped
    'contact@musicblog.com',
    'info@recordingstudio.com',
    'sync@licensing.com',
    'tech@musicplatform.com'
  ];

  console.log('📧 Sample Email Analysis:\n');
  
  sampleEmails.forEach(email => {
    const domain = email.split('@')[1];
    console.log(`Email: ${email}`);
    console.log(`Domain: ${domain}`);
    
    // Simulate the analysis logic
    let companyName = '';
    let companyType = '';
    let confidence = 0;
    let reasoning = '';
    
    // Check against patterns (simplified version)
    if (domain.includes('spotify')) {
      companyName = 'Spotify';
      companyType = 'Playlist Curator';
      confidence = 0.95;
      reasoning = 'Matched Spotify pattern';
    } else if (domain.includes('pitchfork')) {
      companyName = 'Pitchfork';
      companyType = 'Music Journalist';
      confidence = 0.95;
      reasoning = 'Matched Pitchfork pattern';
    } else if (domain.includes('kcrw')) {
      companyName = 'KCRW';
      companyType = 'Radio DJ';
      confidence = 0.95;
      reasoning = 'Matched KCRW pattern';
    } else if (domain.includes('universal')) {
      companyName = 'Universal Music Group';
      companyType = 'A&R';
      confidence = 0.95;
      reasoning = 'Matched Universal pattern';
    } else if (domain.includes('coachella')) {
      companyName = 'Coachella';
      companyType = 'Festival Organizer';
      confidence = 0.95;
      reasoning = 'Matched Coachella pattern';
    } else if (domain.includes('gmail') || domain.includes('yahoo') || domain.includes('hotmail')) {
      companyName = 'Personal Email';
      companyType = 'Skipped';
      confidence = 0;
      reasoning = 'Personal email domain - skipped';
    } else if (domain.includes('blog')) {
      companyName = 'Music Blog';
      companyType = 'Music Journalist';
      confidence = 0.7;
      reasoning = 'Contains blog keyword';
    } else if (domain.includes('studio')) {
      companyName = 'Recording Studio';
      companyType = 'Producer';
      confidence = 0.8;
      reasoning = 'Contains studio keyword';
    } else if (domain.includes('licensing')) {
      companyName = 'Music Licensing';
      companyType = 'Sync Agent';
      confidence = 0.8;
      reasoning = 'Contains licensing keyword';
    } else if (domain.includes('platform')) {
      companyName = 'Music Technology';
      companyType = 'Tech Platform';
      confidence = 0.7;
      reasoning = 'Contains platform keyword';
    } else {
      companyName = 'Unknown Company';
      companyType = 'Unknown';
      confidence = 0.3;
      reasoning = 'No specific pattern matched';
    }
    
    if (confidence > 0) {
      console.log(`✅ Company: ${companyName}`);
      console.log(`   Type: ${companyType}`);
      console.log(`   Confidence: ${Math.round(confidence * 100)}%`);
      console.log(`   Reason: ${reasoning}`);
    } else {
      console.log(`⏭️  Skipped: ${reasoning}`);
    }
    console.log('');
  });
  
  console.log('🎯 Music Industry Categories Recognized:');
  console.log('- 🎵 Streaming Platforms (Spotify, Apple Music, etc.)');
  console.log('- 📻 Radio Stations (KCRW, KEXP, NPR, etc.)');
  console.log('- 📰 Music Media (Pitchfork, Rolling Stone, etc.)');
  console.log('- 🏢 Record Labels (Universal, Sony, Warner, etc.)');
  console.log('- 🎪 Venues & Festivals (Coachella, Lollapalooza, etc.)');
  console.log('- 🎼 Music Services (Management, Booking, Studios, etc.)');
  console.log('- 🔧 Music Technology (Platforms, Software, etc.)');
  console.log('\n💡 Run the actual analysis with: node test-domain-analysis.js');
}

// Run the demo
demoDomainAnalysis(); 