import { Router, Response, NextFunction } from 'express';
import { CuratorDiscoveryService } from '../services/curatorDiscovery';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Use the same AuthRequest interface as in auth middleware
interface AuthRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    agencyId?: string | null;
  };
}

const router = Router();
const curatorService = new CuratorDiscoveryService(
  process.env.PERPLEXITY_API_KEY || '',
  process.env.FIRECRAWL_API_KEY || ''
);

// Discover curators by genre and platform
router.post('/discover', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { genre, platforms = ['spotify', 'instagram', 'reddit', 'blog'] } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    const allCurators = [];

    // Discover curators from each platform
    for (const platform of platforms) {
      let platformCurators = [];

      switch (platform) {
        case 'spotify':
          platformCurators = await curatorService.discoverSpotifyCurators(genre);
          break;
        case 'instagram':
          platformCurators = await curatorService.discoverInstagramCurators(genre);
          break;
        case 'reddit':
          platformCurators = await curatorService.discoverRedditCurators(genre);
          break;
        case 'blog':
          platformCurators = await curatorService.discoverBlogCurators(genre);
          break;
        default:
          logger.warn(`Unknown platform: ${platform}`);
          continue;
      }

      allCurators.push(...platformCurators);
      logger.info(`Discovered ${platformCurators.length} ${platform} curators for ${genre}`);
    }

    // Save to database
    await curatorService.saveCuratorsToDatabase(allCurators, userId);

    res.json({
      success: true,
      curators: allCurators,
      total: allCurators.length,
      platforms: platforms,
      genre: genre,
    });
  } catch (error) {
    logger.error('Curator discovery error:', error);
    res.status(500).json({ error: 'Failed to discover curators' });
  }
});

// Get discovered curators for a user
router.get('/my-curators', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { genre, platform, limit = 50, offset = 0 } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const whereClause: any = {
      tags: { has: 'curator' },
    };

    if (genre) whereClause.genre = genre;
    if (platform) whereClause.tags = { has: platform };

    const curators = await prisma.contact.findMany({
      where: whereClause,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { lastContactedAt: 'desc' },
    });

    res.json({
      success: true,
      curators,
      total: curators.length,
    });
  } catch (error) {
    logger.error('Get curators error:', error);
    res.status(500).json({ error: 'Failed to get curators' });
  }
});

// Get curator statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const stats = await prisma.contact.groupBy({
      by: ['genre', 'role'],
      where: {
        tags: { has: 'curator' },
      },
      _count: {
        id: true,
      },
    });

    const platformStats = await prisma.contact.groupBy({
      by: ['tags'],
      where: {
        tags: { has: 'curator' },
      },
      _count: {
        id: true,
      },
    });

    res.json({
      success: true,
      stats: {
        byGenre: stats,
        byPlatform: platformStats,
        total: await prisma.contact.count({
          where: { tags: { has: 'curator' } },
        }),
      },
    });
  } catch (error) {
    logger.error('Curator stats error:', error);
    res.status(500).json({ error: 'Failed to get curator statistics' });
  }
});

// Update curator contact information
router.put('/:curatorId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { curatorId } = req.params;
    const { email, phone, notes, status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updatedCurator = await prisma.contact.update({
      where: { id: curatorId },
      data: {
        email: email || undefined,
        phone: phone || undefined,
        status: status || undefined,
        lastContactedAt: new Date(),
      },
    });

    res.json({
      success: true,
      curator: updatedCurator,
    });
  } catch (error) {
    logger.error('Update curator error:', error);
    res.status(500).json({ error: 'Failed to update curator' });
  }
});

export default router;
