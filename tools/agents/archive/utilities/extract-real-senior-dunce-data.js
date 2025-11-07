#!/usr/bin/env node

/**
 * Extract Real Senior Dunce Campaign Data from Multiple Sources
 *
 * This script will:
 * 1. Search Typeform responses for actual release date
 * 2. Search Gmail for campaign thread to determine 4- or 6-week campaign
 * 3. Find transcript in Google Drive "Senior Dunce bestial" folder
 * 4. Calculate correct campaign timeline
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function extractRealSeniorDunceData() {
  console.log('🔍 Extracting Real Senior Dunce Campaign Data from Multiple Sources...\n');

  const agent = new RadioPromoAgent();

  try {
    await agent.initialize();

    const campaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      sources: {},
    };

    console.log('📋 Step 1: Searching Typeform for Release Date...');

    // Search Typeform responses for Senior Dunce
    const typeform = agent.typeformApi;
    const forms = await typeform.getRecentForms();

    let releaseDateFound = false;
    let typeformData = null;

    for (const form of forms) {
      try {
        const responses = await typeform.getFormResponses(form.id, 100);

        for (const response of responses) {
          const responseText = JSON.stringify(response).toLowerCase();

          if (responseText.includes('senior dunce')) {
            console.log(`✅ Found Senior Dunce in form: ${form.title}`);
            console.log(`   Response Token: ${response.token}`);

            // Try to get detailed response data
            try {
              const detailedResponse = await typeform.getResponse(form.id, response.token);

              if (detailedResponse && detailedResponse.answers) {
                typeformData = {
                  formTitle: form.title,
                  formId: form.id,
                  responseToken: response.token,
                  submittedAt: detailedResponse.submitted_at,
                  answers: {},
                };

                // Extract all answers
                detailedResponse.answers.forEach(answer => {
                  if (answer.field && answer.field.title) {
                    const fieldTitle = answer.field.title;
                    const answerValue = typeform.extractAnswerValue(answer);
                    typeformData.answers[fieldTitle] = answerValue;

                    // Look for release date
                    if (fieldTitle.toLowerCase().includes('release') && answerValue) {
                      campaignData.releaseDate = answerValue;
                      releaseDateFound = true;
                      console.log(`   📅 Release Date Found: ${answerValue}`);
                    }

                    // Log important fields
                    if (
                      fieldTitle.toLowerCase().includes('date') ||
                      fieldTitle.toLowerCase().includes('release') ||
                      fieldTitle.toLowerCase().includes('genre') ||
                      fieldTitle.toLowerCase().includes('campaign') ||
                      fieldTitle.toLowerCase().includes('duration')
                    ) {
                      console.log(`     ${fieldTitle}: ${answerValue}`);
                    }
                  }
                });

                campaignData.sources.typeform = typeformData;
                break;
              }
            } catch (error) {
              console.log(`   ⚠️  Could not get detailed response: ${error.message}`);
            }
          }
        }

        if (releaseDateFound) break;
      } catch (error) {
        console.log(`   ⚠️  Error searching form ${form.title}: ${error.message}`);
      }
    }

    if (!releaseDateFound) {
      console.log('❌ Release date not found in Typeform responses');
      console.log('💡 Using placeholder date - will need manual correction');
      campaignData.releaseDate = '2025-10-15'; // Placeholder
    }

    console.log('\n📧 Step 2: Searching Gmail for Campaign Thread...');

    // Search Gmail for Senior Dunce campaign thread
    try {
      const gmail = agent.gmail;

      // Search for emails related to Senior Dunce
      const searchQueries = [
        'Senior Dunce',
        'Senior Dunce Bestial',
        'Senior Dunce campaign',
        'Senior Dunce release',
        'subject:Senior Dunce',
      ];

      let campaignEmails = [];

      for (const query of searchQueries) {
        try {
          console.log(`   Searching Gmail for: "${query}"`);
          const emails = await gmail.searchEmails(query, 20);

          if (emails && emails.length > 0) {
            console.log(`   ✅ Found ${emails.length} emails for "${query}"`);
            campaignEmails = campaignEmails.concat(emails);
          }
        } catch (error) {
          console.log(`   ⚠️  Gmail search failed for "${query}": ${error.message}`);
        }
      }

      // Remove duplicates and analyze emails
      const uniqueEmails = campaignEmails.filter(
        (email, index, self) => index === self.findIndex(e => e.id === email.id)
      );

      console.log(`\n   📊 Found ${uniqueEmails.length} unique campaign emails`);

      // Look for campaign duration indicators
      let campaignDuration = null;
      let campaignStartDate = null;

      for (const email of uniqueEmails) {
        try {
          const emailContent = await gmail.getEmailContent(email.id);
          const content = emailContent.body.toLowerCase();

          // Look for campaign duration indicators
          if (content.includes('6-week') || content.includes('6 week')) {
            campaignDuration = '6-week';
            console.log(`   🎯 Found 6-week campaign duration in email: ${email.subject}`);
          } else if (content.includes('4-week') || content.includes('4 week')) {
            campaignDuration = '4-week';
            console.log(`   🎯 Found 4-week campaign duration in email: ${email.subject}`);
          }

          // Look for campaign start date
          if (content.includes('campaign starts') || content.includes('campaign begins')) {
            console.log(`   📅 Found campaign start reference in email: ${email.subject}`);
          }
        } catch (error) {
          console.log(`   ⚠️  Could not read email content: ${error.message}`);
        }
      }

      campaignData.campaignDuration = campaignDuration || '4-week'; // Default to 4-week
      campaignData.sources.gmail = {
        emailsFound: uniqueEmails.length,
        campaignDuration: campaignDuration,
        sampleEmails: uniqueEmails.slice(0, 3).map(email => ({
          id: email.id,
          subject: email.subject,
          date: email.date,
        })),
      };

      console.log(`   📊 Campaign Duration: ${campaignData.campaignDuration}`);
    } catch (error) {
      console.log(`❌ Gmail search failed: ${error.message}`);
      campaignData.campaignDuration = '4-week'; // Default fallback
    }

    console.log('\n📁 Step 3: Searching Google Drive for Transcript...');

    // Search Google Drive for Senior Dunce folder and transcript
    try {
      const drive = agent.drive;

      // Search for Senior Dunce folder
      const folderQuery =
        'name contains "Senior Dunce bestial" and mimeType="application/vnd.google-apps.folder"';
      const folders = await drive.searchFiles(folderQuery);

      if (folders && folders.length > 0) {
        console.log(`✅ Found ${folders.length} Senior Dunce folders`);

        for (const folder of folders) {
          console.log(`   📁 Folder: ${folder.name} (ID: ${folder.id})`);

          // Search for transcript files in this folder
          const transcriptQuery = `parents in "${folder.id}" and (name contains "transcript" or name contains "meeting" or name contains ".txt")`;
          const transcriptFiles = await drive.searchFiles(transcriptQuery);

          if (transcriptFiles && transcriptFiles.length > 0) {
            console.log(`   📄 Found ${transcriptFiles.length} transcript files`);

            for (const file of transcriptFiles) {
              console.log(`     📄 ${file.name} (ID: ${file.id})`);

              // Try to read transcript content
              try {
                const transcriptContent = await drive.getFileContent(file.id);
                console.log(
                  `     ✅ Transcript content loaded (${transcriptContent.length} characters)`
                );

                // Look for campaign details in transcript
                const content = transcriptContent.toLowerCase();
                if (content.includes('6-week') || content.includes('6 week')) {
                  campaignData.campaignDuration = '6-week';
                  console.log(`     🎯 Found 6-week campaign in transcript!`);
                } else if (content.includes('4-week') || content.includes('4 week')) {
                  campaignData.campaignDuration = '4-week';
                  console.log(`     🎯 Found 4-week campaign in transcript!`);
                }

                if (content.includes('release date') || content.includes('release on')) {
                  console.log(`     📅 Found release date reference in transcript`);
                }

                campaignData.sources.transcript = {
                  fileName: file.name,
                  fileId: file.id,
                  folderName: folder.name,
                  folderId: folder.id,
                  contentLength: transcriptContent.length,
                };
              } catch (error) {
                console.log(`     ⚠️  Could not read transcript: ${error.message}`);
              }
            }
          } else {
            console.log(`   📄 No transcript files found in this folder`);
          }
        }
      } else {
        console.log('❌ No Senior Dunce folders found in Google Drive');
      }
    } catch (error) {
      console.log(`❌ Google Drive search failed: ${error.message}`);
    }

    console.log('\n📅 Step 4: Calculating Campaign Timeline...');

    // Calculate campaign timeline based on real data
    const releaseDate = new Date(campaignData.releaseDate);
    const campaignDuration = campaignData.campaignDuration === '6-week' ? 42 : 28;

    const campaignStartDate = new Date(releaseDate);
    campaignStartDate.setDate(releaseDate.getDate() - campaignDuration);

    campaignData.timeline = {
      releaseDate: campaignData.releaseDate,
      campaignDuration: campaignData.campaignDuration,
      campaignStartDate: campaignStartDate.toISOString().split('T')[0],
      campaignEndDate: releaseDate.toISOString().split('T')[0],
      durationDays: campaignDuration,
    };

    console.log('✅ Campaign Timeline Calculated:');
    console.log(`   📅 Release Date: ${campaignData.timeline.releaseDate}`);
    console.log(`   📅 Campaign Start: ${campaignData.timeline.campaignStartDate}`);
    console.log(`   📅 Campaign End: ${campaignData.timeline.campaignEndDate}`);
    console.log(
      `   ⏱️  Duration: ${campaignData.timeline.campaignDuration} (${campaignData.timeline.durationDays} days)`
    );

    console.log('\n🎉 Real Data Extraction Complete!');
    console.log('');
    console.log('📊 Summary of Extracted Data:');
    console.log(`   Artist: ${campaignData.artistName}`);
    console.log(`   Track: ${campaignData.trackName}`);
    console.log(
      `   Release Date: ${campaignData.releaseDate} (from ${
        campaignData.sources.typeform ? 'Typeform' : 'placeholder'
      })`
    );
    console.log(
      `   Campaign Duration: ${campaignData.campaignDuration} (from ${
        campaignData.sources.gmail ? 'Gmail/Transcript' : 'default'
      })`
    );
    console.log(`   Campaign Start: ${campaignData.timeline.campaignStartDate}`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('1. Use this real data to update Monday.com campaign timeline');
    console.log('2. Create accurate calendar events');
    console.log('3. Set up proper campaign milestones');

    return campaignData;
  } catch (error) {
    console.error('❌ Real data extraction failed:', error.message);
    return null;
  } finally {
    await agent.shutdown();
  }
}

// Run the extraction
extractRealSeniorDunceData().then(data => {
  if (data) {
    console.log('\n🎉 Real Senior Dunce data extraction completed successfully!');
    console.log('Use this data to create accurate campaign timelines.');
  } else {
    console.log('\n❌ Real data extraction failed.');
  }
});
