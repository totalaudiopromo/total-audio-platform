import { Router, Request, Response } from 'express';
import { AirtableDuplicateRemoval } from '../services/airtableDuplicateRemoval';
import { logger } from '../utils/logger';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// POST /api/airtable-duplicate-removal/dry-run
router.post('/dry-run', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    logger.info(`🔍 User ${req.user.email} started duplicate removal dry run`);

    const removalService = AirtableDuplicateRemoval.getRemovalServiceForUser(req.user.id);
    const result = await removalService.removeDuplicates(true); // true = dry run

    return res.json({
      success: true,
      message: 'Dry run completed successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error during duplicate removal dry run:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to perform duplicate removal dry run',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/airtable-duplicate-removal/remove
router.post('/remove', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    logger.info(`🗑️ User ${req.user.email} started live duplicate removal`);

    const removalService = AirtableDuplicateRemoval.getRemovalServiceForUser(req.user.id);
    const result = await removalService.removeDuplicates(false); // false = live removal

    return res.json({
      success: true,
      message: 'Duplicate removal completed successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error during duplicate removal:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove duplicates',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/airtable-duplicate-removal/status
router.get('/status', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const removalService = AirtableDuplicateRemoval.getRemovalServiceForUser(req.user.id);
    const result = await removalService.removeDuplicates(true); // dry run to get status

    return res.json({
      success: true,
      data: {
        totalDuplicates: result.totalDuplicates,
        recordsToDelete: result.recordsToDelete,
        hasDuplicates: result.totalDuplicates > 0,
      },
    });
  } catch (error) {
    logger.error('Error checking duplicate status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check duplicate status',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
