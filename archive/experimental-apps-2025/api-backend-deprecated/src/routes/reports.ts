import { Router } from 'express';

const router = Router();

// GET /api/reports - Get all reports
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Reports endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
