import { Router } from 'express';
import { ClaudeService } from '../integrations/claude';

const router = Router();

// POST /api/claude - Send a message to Claude
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const config = {
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || '',
    };

    if (!config.apiKey) {
      res.status(500).json({ error: 'Claude API key not configured' });
      return;
    }

    const claudeService = new ClaudeService(config);
    const response = await claudeService.generateResponse(prompt);

    res.json({ content: response });
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
