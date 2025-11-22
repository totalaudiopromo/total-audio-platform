import { Router } from 'express';
// import { FirecrawlService } from '../integrations/firecrawl';
import { PerplexityService } from '../integrations/perplexity';
import { AuraService } from '../integrations/aura';
// // import { PlaywrightService } from '../integrations/playwright';
// import { OpenRouterService } from '../integrations/openrouter';
import { DataForSEOService } from '../integrations/dataforseo';

const router = Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'MCP integrations are working!' });
});

// Initialize MCP services
// const firecrawlService = new FirecrawlService(process.env.FIRECRAWL_API_KEY || '');
const perplexityService = new PerplexityService(process.env.PERPLEXITY_API_KEY || '');
const auraService = new AuraService(process.env.AURA_API_KEY || '');
// const playwrightService = new PlaywrightService();
// const openRouterService = new OpenRouterService(process.env.OPENROUTER_API_KEY || '');
const dataForSEOService = new DataForSEOService(
  process.env.DATAFORSEO_USERNAME || '',
  process.env.DATAFORSEO_PASSWORD || ''
);

// Firecrawl - Web scraping for contact discovery (temporarily disabled)
// router.post('/firecrawl/scrape-contacts', async (req, res) => {
//   try {
//     const { websiteUrl } = req.body;
//
//     if (!websiteUrl) {
//       return res.status(400).json({ error: 'Website URL is required' });
//     }

//     const result = await firecrawlService.scrapeJournalistContacts(websiteUrl);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       contacts: result.contacts,
//       count: result.contacts.length
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// Perplexity - AI-powered research
router.post('/perplexity/find-journalists', async (req, res) => {
  try {
    const { industry, location } = req.body;

    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    const result = await perplexityService.findJournalists(industry, location);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      journalists: result.journalists,
      count: result.journalists.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/perplexity/research-industry', async (req, res) => {
  try {
    const { industry } = req.body;

    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    const result = await perplexityService.researchIndustry(industry);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/perplexity/find-contact-lists', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await perplexityService.findContactLists(query);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      lists: result.lists,
      count: result.lists.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Aura - AI-powered pitch writing
router.post('/aura/generate-pitch', async (req, res) => {
  try {
    const { client, industry, news, targetOutlets, journalistInfo } = req.body;

    if (!client || !industry || !news || !targetOutlets) {
      return res.status(400).json({
        error: 'Client, industry, news, and target outlets are required',
      });
    }

    const result = await auraService.generatePitch({
      client,
      industry,
      news,
      targetOutlets,
      journalistInfo,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      pitch: result.pitch,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/aura/generate-press-release', async (req, res) => {
  try {
    const { client, news, industry } = req.body;

    if (!client || !news || !industry) {
      return res.status(400).json({
        error: 'Client, news, and industry are required',
      });
    }

    const result = await auraService.generatePressRelease(client, news, industry);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      pressRelease: result.pressRelease,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/aura/suggest-campaigns', async (req, res) => {
  try {
    const { client, industry, recentNews } = req.body;

    if (!client || !industry || !recentNews) {
      return res.status(400).json({
        error: 'Client, industry, and recent news are required',
      });
    }

    const result = await auraService.suggestCampaigns(client, industry, recentNews);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      suggestions: result.suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/aura/optimize-subject-line', async (req, res) => {
  try {
    const { pitch, journalistInfo } = req.body;

    if (!pitch) {
      return res.status(400).json({ error: 'Pitch is required' });
    }

    const result = await auraService.optimizeSubjectLine(pitch, journalistInfo);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      subjectLines: result.subjectLines,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Playwright - Web automation and testing (temporarily disabled)
// router.post('/playwright/screenshot', async (req, res) => {
//   try {
//     const { url, options } = req.body;
//
//     if (!url) {
//       return res.status(400).json({ error: 'URL is required' });
//     }

//     const result = await playwrightService.takeScreenshot(url, options);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       screenshot: result.screenshot
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// router.post('/playwright/scrape-website', async (req, res) => {
//   try {
//     const { url, options } = req.body;
//
//     if (!url) {
//       return res.status(400).json({ error: 'URL is required' });
//     }

//     const result = await playwrightService.scrapeWebsite(url, options);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       data: result.data
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// router.post('/playwright/fill-form', async (req, res) => {
//   try {
//     const { url, formData } = req.body;
//
//     if (!url || !formData) {
//       return res.status(400).json({ error: 'URL and form data are required' });
//     }

//     const result = await playwrightService.fillForm(url, formData);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       result: result.result
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// Open Router - AI model access (temporarily disabled)
// router.get('/openrouter/models', async (req, res) => {
//   try {
//     const result = await openRouterService.getAvailableModels();
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       models: result.models
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// router.post('/openrouter/chat', async (req, res) => {
//   try {
//     const { model, messages, options } = req.body;
//
//     if (!model || !messages) {
//       return res.status(400).json({ error: 'Model and messages are required' });
//     }

//     const result = await openRouterService.chatCompletion({
//       model,
//       messages,
//       ...options
//     });
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       data: result.data
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// router.post('/openrouter/generate-press-release', async (req, res) => {
//   try {
//     const { client, news, industry } = req.body;
//
//     if (!client || !news || !industry) {
//       return res.status(400).json({
//         error: 'Client, news, and industry are required'
//       });
//     }

//     const result = await openRouterService.generatePressRelease(client, news, industry);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       pressRelease: result.pressRelease
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// router.post('/openrouter/generate-pitch-email', async (req, res) => {
//   try {
//     const { journalist, outlet, story, client } = req.body;
//
//     if (!journalist || !outlet || !story || !client) {
//       return res.status(400).json({
//         error: 'Journalist, outlet, story, and client are required'
//       });
//     }

//     const result = await openRouterService.generatePitchEmail(journalist, outlet, story, client);
//
//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json({
//       success: true,
//       pitch: result.pitch,
//       subjectLine: result.subjectLine
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// Data for SEO - SEO analysis and research
router.post('/dataforseo/analyze-domain', async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const result = await dataForSEOService.analyzeDomain(domain);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      analysis: result.analysis,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/dataforseo/research-keywords', async (req, res) => {
  try {
    const { seedKeyword, location } = req.body;

    if (!seedKeyword) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }

    const result = await dataForSEOService.researchKeywords(seedKeyword, location);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      keywords: result.keywords,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/dataforseo/analyze-competitors', async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const result = await dataForSEOService.analyzeCompetitors(domain);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      competitors: result.competitors,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/dataforseo/get-serp-results', async (req, res) => {
  try {
    const { keyword, location } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const result = await dataForSEOService.getSERPResults(keyword, location);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      results: result.results,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/dataforseo/generate-seo-report', async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const result = await dataForSEOService.generateSEOReport(domain);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({
      success: true,
      report: result.report,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
