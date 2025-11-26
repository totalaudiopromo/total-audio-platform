import { NextRequest, NextResponse } from 'next/server';

// Gmail API types for Liberty dashboard
export interface GmailThread {
  id: string;
  subject: string;
  from: string;
  to: string;
  snippet: string;
  date: string;
  unread: boolean;
  labels: string[];
}

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  body: string;
  date: string;
  attachments?: { name: string; mimeType: string; size: number }[];
}

const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1';

async function getGmailClient() {
  const accessToken = process.env.GMAIL_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('GMAIL_ACCESS_TOKEN not configured');
  }
  return accessToken;
}

// GET /api/gmail?type=threads|messages&query=xxx&threadId=xxx
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'threads';
  const query = searchParams.get('query') || '';
  const threadId = searchParams.get('threadId');
  const maxResults = searchParams.get('maxResults') || '20';

  try {
    const token = await getGmailClient();

    if (type === 'threads') {
      const searchQuery = query || 'in:inbox';
      const url =
        GMAIL_API_URL +
        '/users/me/threads?q=' +
        encodeURIComponent(searchQuery) +
        '&maxResults=' +
        maxResults;
      const res = await fetch(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!res.ok) {
        throw new Error('Gmail API error: ' + res.status);
      }

      const data = await res.json();
      const threads: GmailThread[] = await Promise.all(
        (data.threads || []).map(async (t: any) => {
          const threadUrl =
            GMAIL_API_URL +
            '/users/me/threads/' +
            t.id +
            '?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date';
          const threadRes = await fetch(threadUrl, {
            headers: { Authorization: 'Bearer ' + token },
          });
          const threadData = await threadRes.json();
          const firstMsg = threadData.messages?.[0];
          const headers = firstMsg?.payload?.headers || [];

          const getHeader = (name: string) =>
            headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

          return {
            id: t.id,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            to: getHeader('To'),
            snippet: t.snippet || '',
            date: getHeader('Date'),
            unread: firstMsg?.labelIds?.includes('UNREAD') || false,
            labels: firstMsg?.labelIds || [],
          };
        })
      );

      return NextResponse.json(threads);
    }

    if (type === 'messages' && threadId) {
      const url = GMAIL_API_URL + '/users/me/threads/' + threadId + '?format=full';
      const res = await fetch(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!res.ok) {
        throw new Error('Gmail API error: ' + res.status);
      }

      const data = await res.json();
      const messages: GmailMessage[] = (data.messages || []).map((m: any) => {
        const headers = m.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        let body = '';
        if (m.payload?.body?.data) {
          body = Buffer.from(m.payload.body.data, 'base64').toString('utf-8');
        } else if (m.payload?.parts) {
          const textPart = m.payload.parts.find(
            (p: any) => p.mimeType === 'text/plain' || p.mimeType === 'text/html'
          );
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
          }
        }

        const attachments = (m.payload?.parts || [])
          .filter((p: any) => p.filename && p.body?.attachmentId)
          .map((p: any) => ({
            name: p.filename,
            mimeType: p.mimeType,
            size: p.body?.size || 0,
          }));

        return {
          id: m.id,
          threadId: m.threadId,
          subject: getHeader('Subject'),
          from: getHeader('From'),
          to: getHeader('To'),
          body,
          date: getHeader('Date'),
          attachments: attachments.length > 0 ? attachments : undefined,
        };
      });

      return NextResponse.json(messages);
    }

    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  } catch (error) {
    console.error('[Gmail API]', error);
    return NextResponse.json({ error: 'Failed to fetch Gmail data' }, { status: 500 });
  }
}

// POST /api/gmail - Send email
export async function POST(request: NextRequest) {
  try {
    const token = await getGmailClient();
    const body = await request.json();
    const { to, subject, message, cc, bcc } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'to, subject, and message are required' }, { status: 400 });
    }

    const emailLines = [
      'To: ' + to,
      cc ? 'Cc: ' + cc : '',
      bcc ? 'Bcc: ' + bcc : '',
      'Subject: ' + subject,
      'Content-Type: text/html; charset=utf-8',
      '',
      message,
    ].filter(Boolean);

    const email = emailLines.join('\r\n');
    const encodedEmail = Buffer.from(email).toString('base64url');

    const res = await fetch(GMAIL_API_URL + '/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedEmail }),
    });

    if (!res.ok) {
      throw new Error('Gmail send error: ' + res.status);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('[Gmail API]', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
