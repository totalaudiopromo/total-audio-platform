import express from 'express';
import { FreeSEOToolsService } from '../integrations/free-seo-tools';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const freeSEOService = new FreeSEOToolsService();

// Middleware to handle validation errors
const handleValidationErrors = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  return next();
};

// Get Google Trends data for a keyword
router.get('/trends/:keyword', async (req: express.Request, res: express.Response) => {
  try {
    const { keyword } = req.params;
    const { timeframe = 'today 12-m' } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required',
      });
    }

    const result = await freeSEOService.getTrendsData(keyword, timeframe as string);

    if (result.success) {
      return res.json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get Search Console data for a domain
router.get(
  '/search-console/:domain',
  [
    body('startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
    body('endDate').isISO8601().withMessage('End date must be a valid ISO date'),
    handleValidationErrors,
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const { domain } = req.params;
      const { startDate, endDate } = req.body as { startDate: string; endDate: string };

      if (!domain) {
        return res.status(400).json({
          success: false,
          error: 'Domain parameter is required',
        });
      }

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
        });
      }
      const result = await freeSEOService.getSearchConsoleData(domain, startDate, endDate);

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
);

// Research keywords for a seed keyword
router.get('/keywords/:seedKeyword', async (req: express.Request, res: express.Response) => {
  try {
    const { seedKeyword } = req.params;

    if (!seedKeyword) {
      return res.status(400).json({
        success: false,
        error: 'Seed keyword parameter is required',
      });
    }

    const result = await freeSEOService.researchKeywords(seedKeyword);

    if (result.success) {
      return res.json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Analyze competitors for a domain
router.get('/competitors/:domain', async (req: express.Request, res: express.Response) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain parameter is required',
      });
    }

    const result = await freeSEOService.analyzeCompetitors(domain);

    if (result.success) {
      return res.json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Analyze domain SEO
router.get('/analyze/:domain', async (req: express.Request, res: express.Response) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain parameter is required',
      });
    }

    const result = await freeSEOService.analyzeDomain(domain);

    if (result.success) {
      return res.json({
        success: true,
        analysis: result.analysis,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Generate comprehensive SEO report
router.get('/report/:domain', async (req: express.Request, res: express.Response) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain parameter is required',
      });
    }

    const result = await freeSEOService.generateSEOReport(domain);

    if (result.success) {
      return res.json({
        success: true,
        report: result.report,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get related queries for a keyword
router.get('/related-queries/:keyword', async (req: express.Request, res: express.Response) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required',
      });
    }

    // This is a simplified endpoint that uses the private method
    // In a real implementation, you might want to make this method public
    const relatedQueries = await (freeSEOService as any).getRelatedQueries(keyword);

    return res.json({
      success: true,
      data: {
        keyword,
        relatedQueries,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get geographic interest for a keyword
router.get('/geographic-interest/:keyword', async (req: express.Request, res: express.Response) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required',
      });
    }

    const geographicInterest = await (freeSEOService as any).getGeographicInterest(keyword);

    return res.json({
      success: true,
      data: {
        keyword,
        geographicInterest,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get questions for a keyword
router.get('/questions/:keyword', async (req: express.Request, res: express.Response) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required',
      });
    }

    const questions = await (freeSEOService as any).getGoogleSuggestQuestions(keyword);

    return res.json({
      success: true,
      data: {
        keyword,
        questions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get long-tail variations for a keyword
router.get('/long-tail/:keyword', async (req: express.Request, res: express.Response) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required',
      });
    }

    const longTailVariations = await (freeSEOService as any).getLongTailVariations(keyword);

    return res.json({
      success: true,
      data: {
        keyword,
        longTailVariations,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Health check endpoint
router.get('/health', (req: express.Request, res: express.Response) => {
  return res.json({
    success: true,
    message: 'Free SEO Tools service is running',
    timestamp: new Date().toISOString(),
    features: [
      'Google Trends Integration',
      'Google Search Console Integration',
      'Keyword Research',
      'Competitor Analysis',
      'Domain SEO Analysis',
      'Comprehensive SEO Reports',
    ],
  });
});

export default router;
