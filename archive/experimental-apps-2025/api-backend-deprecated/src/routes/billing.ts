import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Get subscription status
router.get('/subscription', authenticateToken, async (req: any, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    res.json({
      subscription: subscription
        ? {
            tier: subscription.tier,
            status: subscription.status,
            monthlyPrice: subscription.monthlyPrice,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    logger.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req: any, res) => {
  try {
    const { tier, setupFee } = req.body;

    // This would integrate with Stripe
    // For now, return a mock session
    res.json({
      sessionId: 'mock_session_id',
      url: `${process.env.FRONTEND_URL}/billing/success?session_id=mock_session_id`,
    });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Handle webhook
router.post('/webhook', async (req, res) => {
  try {
    // Handle Stripe webhook events
    const { type, data } = req.body;

    switch (type) {
      case 'checkout.session.completed':
        // Update subscription status
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
