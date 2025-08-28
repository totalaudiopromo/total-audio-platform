import { Router } from 'express';

const router = Router();

// GET /api/agencies - Get all agencies
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Agencies endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 