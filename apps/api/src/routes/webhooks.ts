import { Router } from 'express';

const router = Router();

// POST /api/webhooks - Handle webhooks
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Webhooks endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
