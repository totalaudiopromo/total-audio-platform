import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug logs (inside the handler)
  console.log('CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY?.slice(0, 8));
  console.log('Request body:', req.body);

  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'Claude API key not set' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229', // or another Claude model
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}