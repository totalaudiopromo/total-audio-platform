import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Anthropic API key not configured' });
  }

  const { prompt, model: modelOverride } = req.body || {};
  const MODEL = modelOverride || process.env.ANTHROPIC_MODEL;
  if (!MODEL) {
    return res
      .status(500)
      .json({ error: 'Model not configured. Pass model in request or set ANTHROPIC_MODEL.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      // Surface clearer error for restricted Claude Code credentials
      const message = data?.error?.message || data?.message || 'Anthropic API request failed';
      return res.status(response.status).json({ error: message });
    }
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
