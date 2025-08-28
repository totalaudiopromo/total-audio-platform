import { Router } from 'express';

const router = Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Users endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: `User ${id} - coming soon` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 