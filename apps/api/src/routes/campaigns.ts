import { Router } from 'express';

const router = Router();

// GET /api/campaigns - Get all campaigns
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Campaigns endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/campaigns - Create new campaign
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Create campaign - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
