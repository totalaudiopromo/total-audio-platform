const { AirtableRadioEnhancement } = require('./dist/services/airtableRadioEnhancement');

// Demo function to show how radio enhancement works
function demoRadioEnhancement() {
  console.log('🎵 UK Radio Station Enhancement Demo\n');
  
  // Sample UK radio email addresses to test
  const sampleEmails = [
    'dj@bbc.co.uk',
    'presenter@capitalfm.com',
    'producer@heart.co.uk',
    'music@kissfm.co.uk',
    'editor@lbc.co.uk',
    'contact@key103.co.uk',
    'radio@brum.co.uk',
    'dj@radiocity.co.uk',
    'student@university.ac.uk',
    'community@localradio.co.uk',
    'john@gmail.com', // Should be skipped
    'contact@unknownradio.com'
  ];

  console.log('📻 Sample UK Radio Email Analysis:\n');
  
  sampleEmails.forEach(email => {
    const domain = email.split('@')[1];
    console.log(`Email: ${email}`);
    console.log(`Domain: ${domain}`);
    
    // Simulate the analysis
    let classification = 'Unknown';
    let stationName = 'Unknown';
    let location = 'Unknown';
    let market = 'Unknown';
    let format = 'Unknown';
    let marketSize = 'Unknown';
    
    if (domain.includes('bbc.co.uk')) {
      classification = 'BBC National';
      stationName = 'BBC Radio';
      location = 'National';
      market = 'National';
      format = 'Public Service';
      marketSize = 'National';
    } else if (domain.includes('capitalfm.com')) {
      classification = 'Commercial Major';
      stationName = 'Capital FM';
      location = 'London';
      market = 'Major Market';
      format = 'Commercial';
      marketSize = 'National';
    } else if (domain.includes('heart.co.uk')) {
      classification = 'Commercial Major';
      stationName = 'Heart';
      location = 'London';
      market = 'Major Market';
      format = 'Commercial';
      marketSize = 'National';
    } else if (domain.includes('kissfm.co.uk')) {
      classification = 'Commercial Major';
      stationName = 'Kiss FM';
      location = 'London';
      market = 'Major Market';
      format = 'Commercial';
      marketSize = 'National';
    } else if (domain.includes('lbc.co.uk')) {
      classification = 'Commercial Local';
      stationName = 'LBC';
      location = 'London';
      market = 'London';
      format = 'Commercial';
      marketSize = 'Local';
    } else if (domain.includes('key103.co.uk')) {
      classification = 'Commercial Local';
      stationName = 'Key 103';
      location = 'Manchester';
      market = 'Manchester';
      format = 'Commercial';
      marketSize = 'Local';
    } else if (domain.includes('brum.co.uk')) {
      classification = 'Commercial Local';
      stationName = 'BRMB';
      location = 'Birmingham';
      market = 'Birmingham';
      format = 'Commercial';
      marketSize = 'Local';
    } else if (domain.includes('radiocity.co.uk')) {
      classification = 'Commercial Local';
      stationName = 'Radio City';
      location = 'Liverpool';
      market = 'Liverpool';
      format = 'Commercial';
      marketSize = 'Local';
    } else if (domain.includes('.ac.uk')) {
      classification = 'Student Radio';
      stationName = 'University Radio';
      location = 'University';
      market = 'Student';
      format = 'Student';
      marketSize = 'Local';
    } else if (domain.includes('localradio.co.uk')) {
      classification = 'Community Radio';
      stationName = 'Local Radio';
      location = 'Local';
      market = 'Local';
      format = 'Community';
      marketSize = 'Local';
    } else if (domain.includes('gmail.com') || domain.includes('yahoo.com')) {
      classification = 'SKIPPED';
      stationName = 'SKIPPED';
      location = 'SKIPPED';
      market = 'SKIPPED';
      format = 'SKIPPED';
      marketSize = 'SKIPPED';
    }
    
    if (classification === 'SKIPPED') {
      console.log(`Result: ❌ Skipped (personal email domain)`);
    } else {
      console.log(`Result: ✅ ${classification}`);
      console.log(`  Station: ${stationName}`);
      console.log(`  Location: ${location}`);
      console.log(`  Market: ${market}`);
      console.log(`  Format: ${format}`);
      console.log(`  Market Size: ${marketSize}`);
    }
    console.log('');
  });

  console.log('🎯 UK Radio Market Classifications:');
  console.log('====================================');
  console.log('📻 BBC National: BBC Radio 1, 2, 3, 4, 6 Music');
  console.log('🏴 BBC Regional: BBC Radio Scotland, Wales, Ulster');
  console.log('🏢 Commercial Major: Capital, Heart, Kiss, Smooth, Magic');
  console.log('🏙️ Commercial Local: LBC, Key 103, BRMB, Radio City');
  console.log('🎓 Student Radio: University stations (.ac.uk domains)');
  console.log('🏘️ Community Radio: Local and community stations');
  console.log('❓ Unknown Radio: Generic radio domains');
  console.log('');
  console.log('💡 The enhancement script will:');
  console.log('  - Analyze all contacts with Contact Type = "Radio"');
  console.log('  - Extract station information from email domains');
  console.log('  - Add UK-specific radio classifications');
  console.log('  - Update Airtable with enhanced data');
  console.log('');
  console.log('🚀 To run the actual enhancement:');
  console.log('  Preview: node test-radio-enhancement.js');
  console.log('  Live: node test-radio-enhancement-live.js');
}

// Run the demo
demoRadioEnhancement(); 