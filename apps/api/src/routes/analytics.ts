import { Router } from 'express';

const router = Router();

// GET /api/analytics - Get analytics data
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Analytics endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 