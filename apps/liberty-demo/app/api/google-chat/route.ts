import { NextRequest, NextResponse } from 'next/server';

// Google Chat types
export interface ChatMessage {
  text?: string;
  cards?: ChatCard[];
  cardsV2?: ChatCardV2[];
}

export interface ChatCard {
  header?: {
    title: string;
    subtitle?: string;
    imageUrl?: string;
  };
  sections?: ChatSection[];
}

export interface ChatCardV2 {
  cardId: string;
  card: {
    header?: {
      title: string;
      subtitle?: string;
      imageUrl?: string;
    };
    sections?: ChatSectionV2[];
  };
}

export interface ChatSection {
  header?: string;
  widgets?: ChatWidget[];
}

export interface ChatSectionV2 {
  header?: string;
  widgets?: ChatWidgetV2[];
}

export interface ChatWidget {
  textParagraph?: { text: string };
  keyValue?: { topLabel: string; content: string; bottomLabel?: string };
  buttons?: { textButton: { text: string; onClick: { openLink: { url: string } } } }[];
}

export interface ChatWidgetV2 {
  decoratedText?: { topLabel?: string; text: string; bottomLabel?: string };
  textParagraph?: { text: string };
  buttonList?: { buttons: { text: string; onClick: { openLink: { url: string } } }[] };
}

// POST /api/google-chat - Send message to a space via webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl, message, card } = body;

    // Use provided webhook URL or fall back to environment variable
    // Hardcoded fallback due to env parsing issues with & character
    const HARDCODED_WEBHOOK =
      'https://chat.googleapis.com/v1/spaces/AAQAmmp_xdE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zNfKWOTWVTC22HEmTHu-RgXxavhjPissifW_oEjm3Ok';
    const envUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;
    const targetUrl = webhookUrl || (envUrl && envUrl.length > 10 ? envUrl : HARDCODED_WEBHOOK);

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Webhook URL required (provide webhookUrl or set GOOGLE_CHAT_WEBHOOK_URL)' },
        { status: 400 }
      );
    }

    let payload: ChatMessage;

    if (card) {
      // Send a rich card message
      payload = {
        cardsV2: [
          {
            cardId: 'liberty-notification-' + Date.now(),
            card: {
              header: card.header
                ? {
                    title: card.header.title,
                    subtitle: card.header.subtitle,
                    imageUrl: card.header.imageUrl,
                  }
                : undefined,
              sections: card.sections?.map((section: any) => ({
                header: section.header,
                widgets: section.items?.map((item: any) => {
                  if (item.type === 'text') {
                    return { textParagraph: { text: item.content } };
                  }
                  if (item.type === 'keyValue') {
                    return {
                      decoratedText: {
                        topLabel: item.label,
                        text: item.value,
                        bottomLabel: item.subtext,
                      },
                    };
                  }
                  if (item.type === 'button') {
                    return {
                      buttonList: {
                        buttons: [
                          {
                            text: item.label,
                            onClick: { openLink: { url: item.url } },
                          },
                        ],
                      },
                    };
                  }
                  return { textParagraph: { text: String(item.content || item) } };
                }),
              })),
            },
          },
        ],
      };
    } else {
      // Send a simple text message
      payload = { text: message || 'Hello from Liberty Console!' };
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Google Chat error: ' + res.status + ' - ' + errorText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Google Chat API]', error);
    return NextResponse.json({ error: 'Failed to send Google Chat message' }, { status: 500 });
  }
}

// Helper endpoint to send common notification types
// GET /api/google-chat/notify?type=campaign_update&campaignId=xxx
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  // Return available notification templates
  return NextResponse.json({
    availableTypes: [
      {
        type: 'campaign_update',
        description: 'Notify about campaign status changes',
        requiredParams: ['campaignId', 'status', 'message'],
      },
      {
        type: 'new_submission',
        description: 'Notify about new Typeform submissions',
        requiredParams: ['artistName', 'formType'],
      },
      {
        type: 'coverage_alert',
        description: 'Alert about new press/radio coverage',
        requiredParams: ['artistName', 'outlet', 'type'],
      },
      {
        type: 'task_reminder',
        description: 'Remind about upcoming tasks',
        requiredParams: ['taskTitle', 'dueDate', 'assignee'],
      },
    ],
    usage: 'POST to this endpoint with {webhookUrl?, message?, card?}',
  });
}
