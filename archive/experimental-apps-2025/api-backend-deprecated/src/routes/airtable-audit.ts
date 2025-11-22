import express, { Response } from 'express';
import { AirtableAuditService } from '../services/airtableAudit';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
    agencyId?: string | null;
  };
}

const router = express.Router();

// Run full data audit
router.post('/audit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
      });
    }

    const auditService = await AirtableAuditService.getAuditServiceForUser(userId);

    if (!auditService) {
      return res.status(404).json({
        error: 'Airtable integration not found or not connected',
      });
    }

    logger.info(`Starting Airtable audit for user ${userId}`);

    const auditResult = await auditService.performFullAudit();

    return res.json({
      success: true,
      data: auditResult,
    });
  } catch (error) {
    logger.error('Airtable audit error:', error);
    return res.status(500).json({
      error: 'Failed to perform Airtable audit',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get audit summary only
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
      });
    }

    const auditService = await AirtableAuditService.getAuditServiceForUser(userId);

    if (!auditService) {
      return res.status(404).json({
        error: 'Airtable integration not found or not connected',
      });
    }

    const auditResult = await auditService.performFullAudit();

    return res.json({
      success: true,
      data: {
        summary: auditResult.summary,
        recommendations: auditResult.recommendations,
      },
    });
  } catch (error) {
    logger.error('Airtable audit summary error:', error);
    return res.status(500).json({
      error: 'Failed to get audit summary',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get specific audit section
router.get('/section/:section', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const section = req.params.section;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
      });
    }

    const auditService = await AirtableAuditService.getAuditServiceForUser(userId);

    if (!auditService) {
      return res.status(404).json({
        error: 'Airtable integration not found or not connected',
      });
    }

    const auditResult = await auditService.performFullAudit();

    let sectionData: any = {};

    switch (section) {
      case 'duplicates':
        sectionData = {
          duplicates: auditResult.duplicates,
          count: auditResult.summary.duplicateCount,
        };
        break;
      case 'incomplete':
        sectionData = {
          incomplete: auditResult.incomplete,
          count: auditResult.summary.incompleteCount,
        };
        break;
      case 'inconsistencies':
        sectionData = {
          inconsistencies: auditResult.inconsistencies,
          count: auditResult.summary.inconsistentCount,
        };
        break;
      case 'fields':
        sectionData = {
          fieldAnalysis: auditResult.fieldAnalysis,
        };
        break;
      default:
        return res.status(400).json({
          error: 'Invalid section. Valid sections: duplicates, incomplete, inconsistencies, fields',
        });
    }

    return res.json({
      success: true,
      data: sectionData,
    });
  } catch (error) {
    logger.error('Airtable audit section error:', error);
    return res.status(500).json({
      error: 'Failed to get audit section',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
