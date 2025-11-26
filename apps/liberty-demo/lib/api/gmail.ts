/**
 * Gmail API client for Liberty Demo
 * Fetches email threads from the connected Liberty Gmail account
 */

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

const ENABLE_LIVE_API = process.env.NEXT_PUBLIC_ENABLE_LIVE_API === 'true';

// Mock data for development
const mockThreads: GmailThread[] = [
  {
    id: 'mock-1',
    subject: 'Weekly Releases - Nov 25',
    from: 'Sam Jones <samjones@libertymusicpr.com>',
    to: 'team@libertymusicpr.com',
    snippet: 'Hi everyone, Could you please send over your releases for the week. All the best...',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: true,
    labels: ['INBOX', 'UNREAD', 'IMPORTANT'],
  },
  {
    id: 'mock-2',
    subject: 'Re: BBC Radio 6 Music - Follow Up',
    from: 'Tom Robinson <tom@bbc.co.uk>',
    to: 'chrisschofield@libertymusicpr.com',
    snippet:
      "Thanks for sending this over. I've added it to the playlist consideration for next week...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
    labels: ['INBOX', 'IMPORTANT'],
  },
  {
    id: 'mock-3',
    subject: 'Campaign Update: Artist Name',
    from: 'Kara Evans-Bright <kara@libertymusicpr.com>',
    to: 'chrisschofield@libertymusicpr.com',
    snippet: "Quick update on the campaign - we've secured 3 new playlist adds this week...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unread: false,
    labels: ['INBOX'],
  },
  {
    id: 'mock-4',
    subject: 'New Artist Inquiry',
    from: 'hello@independentartist.com',
    to: 'info@libertymusicpr.com',
    snippet: "Hi, I'm reaching out about radio promotion services for my upcoming release...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unread: true,
    labels: ['INBOX', 'UNREAD'],
  },
];

/**
 * Fetch recent email threads
 */
export async function fetchGmailThreads(
  query?: string,
  maxResults: number = 5
): Promise<GmailThread[]> {
  if (!ENABLE_LIVE_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockThreads.slice(0, maxResults);
  }

  try {
    const params = new URLSearchParams({
      type: 'threads',
      maxResults: maxResults.toString(),
    });
    if (query) params.set('query', query);

    const response = await fetch('/api/gmail?' + params.toString());
    if (!response.ok) {
      throw new Error('Gmail API error: ' + response.status);
    }
    return response.json();
  } catch (error) {
    console.error('[Gmail] Failed to fetch threads:', error);
    // Fallback to mocks on error
    return mockThreads.slice(0, maxResults);
  }
}

/**
 * Fetch messages in a thread
 */
export async function fetchGmailMessages(threadId: string): Promise<GmailMessage[]> {
  if (!ENABLE_LIVE_API) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  }

  try {
    const params = new URLSearchParams({
      type: 'messages',
      threadId,
    });

    const response = await fetch('/api/gmail?' + params.toString());
    if (!response.ok) {
      throw new Error('Gmail API error: ' + response.status);
    }
    return response.json();
  } catch (error) {
    console.error('[Gmail] Failed to fetch messages:', error);
    return [];
  }
}

/**
 * Parse sender name from email address
 */
export function parseSenderName(from: string): { name: string; email: string } {
  const match = from.match(/^(.+?)\s*<(.+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: from, email: from };
}

/**
 * Format relative time for email dates
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return diffMins + 'm ago';
  if (diffHours < 24) return diffHours + 'h ago';
  if (diffDays < 7) return diffDays + 'd ago';

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
