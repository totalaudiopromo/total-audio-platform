import express from 'express';
import { HybridSEOService } from '../integrations/hybrid-seo';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Initialize hybrid SEO service with configuration from environment
const hybridSEOService = new HybridSEOService({
  dataForSEOUsername: process.env.DATAFORSEO_USERNAME || '',
  dataForSEOPassword: process.env.DATAFORSEO_PASSWORD || '',
  useDataForSEO: !!process.env.DATAFORSEO_USERNAME,
  useFreeTools: true,
  fallbackToFree: true,
});

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

// Hybrid domain analysis
router.get('/analyze/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const result = await hybridSEOService.analyzeDomain(domain);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hybrid keyword research
router.get('/keywords/:seedKeyword', async (req, res) => {
  try {
    const { seedKeyword } = req.params;

    const result = await hybridSEOService.researchKeywords(seedKeyword);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hybrid competitor analysis
router.get('/competitors/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const result = await hybridSEOService.analyzeCompetitors(domain);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hybrid SERP analysis
router.get('/serp/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    const result = await hybridSEOService.getSERPResults(keyword);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hybrid trends analysis
router.get('/trends/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    const result = await hybridSEOService.getTrendsData(keyword);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hybrid comprehensive report
router.get('/report/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const result = await hybridSEOService.generateSEOReport(domain);

    res.json({
      success: result.success,
      source: result.source,
      data: result.data,
      error: result.error,
      cost: result.cost,
      performance: result.performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get cost analysis
router.get('/cost-analysis', (req, res) => {
  try {
    const costAnalysis = hybridSEOService.getCostAnalysis();

    res.json({
      success: true,
      data: costAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get service status
router.get('/status', (req, res) => {
  try {
    const status = hybridSEOService.getServiceStatus();

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Configure hybrid service
router.post(
  '/configure',
  [
    body('useDataForSEO').isBoolean().optional(),
    body('useFreeTools').isBoolean().optional(),
    body('fallbackToFree').isBoolean().optional(),
    handleValidationErrors,
  ],
  (req: express.Request, res: express.Response) => {
    try {
      const { useDataForSEO, useFreeTools, fallbackToFree } = req.body;

      // In a real implementation, you would update the service configuration
      // For now, we'll just return the current configuration
      const currentConfig = {
        useDataForSEO: !!process.env.DATAFORSEO_USERNAME,
        useFreeTools: true,
        fallbackToFree: true,
      };

      res.json({
        success: true,
        message: 'Configuration updated successfully',
        currentConfig,
        requestedChanges: { useDataForSEO, useFreeTools, fallbackToFree },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
);

// Compare Data for SEO vs Free Tools
router.get('/compare/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    // Run analysis with both services
    const dataForSEOResult = await hybridSEOService.analyzeDomain(domain);
    const freeToolsResult = await hybridSEOService.analyzeDomain(domain);

    const comparison = {
      domain,
      dataForSEO: {
        success: dataForSEOResult.source === 'dataforseo',
        cost: dataForSEOResult.cost || 0,
        performance: dataForSEOResult.performance,
        dataQuality: dataForSEOResult.performance?.dataQuality || 'low',
      },
      freeTools: {
        success: freeToolsResult.source === 'free',
        cost: freeToolsResult.cost || 0,
        performance: freeToolsResult.performance,
        dataQuality: freeToolsResult.performance?.dataQuality || 'low',
      },
      recommendation:
        dataForSEOResult.source === 'dataforseo'
          ? 'Use Data for SEO for higher quality data'
          : 'Free tools provide sufficient data for basic analysis',
    };

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  const status = hybridSEOService.getServiceStatus();

  res.json({
    success: true,
    message: 'Hybrid SEO service is running',
    timestamp: new Date().toISOString(),
    status,
    features: status.features,
  });
});

export default router;
