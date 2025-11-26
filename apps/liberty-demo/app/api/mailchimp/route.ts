import { NextRequest, NextResponse } from 'next/server';

// Mailchimp API types
export interface MailchimpCampaign {
  id: string;
  title: string;
  subject: string;
  status: 'save' | 'paused' | 'schedule' | 'sending' | 'sent';
  sendTime?: string;
  openRate: number;
  clickRate: number;
  recipientCount: number;
  listId: string;
}

export interface MailchimpList {
  id: string;
  name: string;
  memberCount: number;
  openRate: number;
  clickRate: number;
}

export interface MailchimpMember {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
  fullName?: string;
  tags: string[];
  lastActivity?: string;
}

function getMailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey) {
    throw new Error('MAILCHIMP_API_KEY not configured');
  }

  // Extract data center from API key (format: key-dc)
  const dc = apiKey.split('-')[1];
  if (!dc) {
    throw new Error('Invalid Mailchimp API key format');
  }

  return {
    baseUrl: 'https://' + dc + '.api.mailchimp.com/3.0',
    headers: {
      Authorization: 'Basic ' + Buffer.from('anystring:' + apiKey).toString('base64'),
      'Content-Type': 'application/json',
    },
  };
}

// GET /api/mailchimp?type=campaigns|lists|members&listId=xxx
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'campaigns';
  const listId = searchParams.get('listId');
  const count = searchParams.get('count') || '20';

  try {
    const { baseUrl, headers } = getMailchimpConfig();

    if (type === 'campaigns') {
      const res = await fetch(
        baseUrl + '/campaigns?count=' + count + '&sort_field=send_time&sort_dir=DESC',
        { headers }
      );

      if (!res.ok) {
        throw new Error('Mailchimp API error: ' + res.status);
      }

      const data = await res.json();
      const campaigns: MailchimpCampaign[] = (data.campaigns || []).map((c: any) => ({
        id: c.id,
        title: c.settings?.title || 'Untitled',
        subject: c.settings?.subject_line || '',
        status: c.status,
        sendTime: c.send_time,
        openRate: (c.report_summary?.open_rate || 0) * 100,
        clickRate: (c.report_summary?.click_rate || 0) * 100,
        recipientCount: c.recipients?.recipient_count || 0,
        listId: c.recipients?.list_id || '',
      }));

      return NextResponse.json(campaigns);
    }

    if (type === 'lists') {
      const res = await fetch(baseUrl + '/lists?count=' + count, { headers });

      if (!res.ok) {
        throw new Error('Mailchimp API error: ' + res.status);
      }

      const data = await res.json();
      const lists: MailchimpList[] = (data.lists || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        memberCount: l.stats?.member_count || 0,
        openRate: (l.stats?.open_rate || 0) * 100,
        clickRate: (l.stats?.click_rate || 0) * 100,
      }));

      return NextResponse.json(lists);
    }

    if (type === 'members' && listId) {
      const res = await fetch(baseUrl + '/lists/' + listId + '/members?count=' + count, {
        headers,
      });

      if (!res.ok) {
        throw new Error('Mailchimp API error: ' + res.status);
      }

      const data = await res.json();
      const members: MailchimpMember[] = (data.members || []).map((m: any) => ({
        id: m.id,
        email: m.email_address,
        status: m.status,
        fullName: m.full_name || m.merge_fields?.FNAME + ' ' + m.merge_fields?.LNAME || '',
        tags: (m.tags || []).map((t: any) => t.name),
        lastActivity: m.last_activity,
      }));

      return NextResponse.json(members);
    }

    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  } catch (error) {
    console.error('[Mailchimp API]', error);
    return NextResponse.json({ error: 'Failed to fetch Mailchimp data' }, { status: 500 });
  }
}

// POST /api/mailchimp - Add subscriber to list
export async function POST(request: NextRequest) {
  try {
    const { baseUrl, headers } = getMailchimpConfig();
    const body = await request.json();
    const { listId, email, firstName, lastName, tags } = body;

    if (!listId || !email) {
      return NextResponse.json({ error: 'listId and email are required' }, { status: 400 });
    }

    const subscriberData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
      tags: tags || [],
    };

    const res = await fetch(baseUrl + '/lists/' + listId + '/members', {
      method: 'POST',
      headers,
      body: JSON.stringify(subscriberData),
    });

    if (!res.ok) {
      const error = await res.json();
      if (error.title === 'Member Exists') {
        return NextResponse.json({ success: true, status: 'already_subscribed' });
      }
      throw new Error('Mailchimp error: ' + error.detail);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, memberId: data.id });
  } catch (error) {
    console.error('[Mailchimp API]', error);
    return NextResponse.json({ error: 'Failed to add subscriber' }, { status: 500 });
  }
}
