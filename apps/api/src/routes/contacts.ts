import { Router } from 'express';

const router = Router();

// GET /api/contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Contacts endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contacts - Create new contact
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Create contact - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
