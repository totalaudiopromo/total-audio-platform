import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { action, product, platform, contentType, topic, weeks } = await req.json();

    console.log(`🤖 SaaS Marketing Agent: ${action} for ${product || 'all products'}`);

    const agentPath = path.join(process.cwd(), '../../tools/agents/chris-saas-marketing-agent.js');
    let command = '';

    switch (action) {
      case 'generate_blog':
        const keywords = topic?.keywords || [];
        command = `node "${agentPath}" blog ${product || 'audio-intel'} "${topic?.title || 'contact enrichment'}" ${keywords.join(' ')}`;
        break;

      case 'generate_social':
        command = `node "${agentPath}" social ${product || 'audio-intel'} ${platform || 'linkedin'} ${contentType || 'update'}`;
        break;

      case 'generate_calendar':
        command = `node "${agentPath}" calendar ${product || 'audio-intel'} ${weeks || 4}`;
        break;

      case 'health_check':
        command = `node "${agentPath}" health`;
        break;

      case 'get_metrics':
        command = `node "${agentPath}" metrics`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, { 
      timeout: 30000,
      cwd: path.dirname(agentPath)
    });

    if (stderr) {
      console.warn('SaaS Marketing Agent warning:', stderr);
    }

    // Filter out log lines and find the JSON output
    const lines = stdout.split('\n');
    const jsonLines = lines.filter(line => 
      !line.includes('[SAAS-MARKETING]') && 
      (line.trim().startsWith('{') || line.trim().startsWith('['))
    );
    
    if (jsonLines.length === 0) {
      throw new Error('No valid JSON output from agent');
    }

    // Take the first complete JSON object
    const jsonString = jsonLines[0];
    const result = JSON.parse(jsonString);
    
    // If this is social content, automatically schedule it
    if (action === 'generate_social' && result.text) {
      await scheduleToSocialMedia(result);
    }

    console.log(`✅ SaaS Marketing Agent completed: ${action}`);

    return NextResponse.json({
      success: true,
      action,
      product,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SaaS Marketing Agent error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Auto-schedule social content to your existing social media system
async function scheduleToSocialMedia(content: any) {
  try {
    console.log(`📅 Auto-scheduling ${content.platform} content...`);

    // This integrates with your existing social media scheduling
    const scheduleData = {
      platform: content.platform,
      content: content.text,
      hashtags: content.hashtags?.join(' ') || '',
      scheduledFor: getNextOptimalTime(content.platform),
      source: 'SaaS Marketing Agent',
      product: content.product || 'audio-intel',
      status: 'scheduled'
    };

    // Call your existing social media API endpoint
    const response = await fetch('/api/social-media/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData)
    });

    if (response.ok) {
      console.log(`✅ Content scheduled for ${content.platform}`);
    } else {
      console.warn(`⚠️ Failed to schedule content: ${response.statusText}`);
    }

  } catch (error) {
    console.warn('Failed to auto-schedule content:', error);
  }
}

// Calculate next optimal posting time based on platform
function getNextOptimalTime(platform: string) {
  const now = new Date();
  const optimalHours = {
    linkedin: [8, 9, 10], // 8-10 AM
    twitter: [12, 13, 14, 15], // 12-3 PM
    instagram: [11, 12, 13] // 11 AM - 1 PM
  };

  const hours = optimalHours[platform as keyof typeof optimalHours] || [12, 13];
  const randomHour = hours[Math.floor(Math.random() * hours.length)];
  
  const scheduledTime = new Date();
  scheduledTime.setHours(randomHour, 0, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  return scheduledTime.toISOString();
}

export async function GET() {
  try {
    // Return available actions and products
    return NextResponse.json({
      available_actions: [
        'generate_blog',
        'generate_social', 
        'generate_calendar',
        'health_check',
        'get_metrics'
      ],
      available_products: [
        'audio-intel',
        'playlist-pulse', 
        'command-centre',
        'voice-echo'
      ],
      social_platforms: [
        'linkedin',
        'twitter',
        'instagram'
      ],
      content_types: [
        'update',
        'story',
        'thread'
      ],
      agent_status: 'operational',
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get agent info',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}