import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
// import { authenticateToken } from './middleware/auth';

import mcpIntegrationRoutes from './routes/mcp-integrations';
import mailchimpRoutes from './routes/mailchimp';
import claudeRoutes from './routes/claude';
import gmailRoutes from './routes/gmail';
import authRoutes from './routes/auth';
import airtableAuditRoutes from './routes/airtable-audit';
import airtableDuplicateRemovalRoutes from './routes/airtable-duplicate-removal';
import agentsRoutes from './routes/agents';
import freeSEOToolsRoutes from './routes/free-seo-tools';
import hybridSEORoutes from './routes/hybrid-seo';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3002;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Add GZIP compression for all responses
// app.use(compression());
app.use(helmet());
app.use(cors());
// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable routes for MVP functionality
app.use('/api/auth', authRoutes);
app.use('/api/integrations', mcpIntegrationRoutes);
app.use('/api/mailchimp', mailchimpRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/airtable-audit', airtableAuditRoutes);
app.use('/api/airtable-duplicate-removal', airtableDuplicateRemovalRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/free-seo-tools', freeSEOToolsRoutes);
app.use('/api/hybrid-seo', hybridSEORoutes);

app.get('/api/health', (req, res) => {
  console.log('Health endpoint hit');
  try {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Health endpoint error:', err);
    res.status(500).json({ error: 'Health endpoint failed' });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

// Add error handler back
app.use(errorHandler);

io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-campaign', campaignId => {
    socket.join(`campaign-${campaignId}`);
    logger.info(`Socket ${socket.id} joined campaign ${campaignId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

export { io };

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    service: 'total-audio-promo-backend',
    timestamp: new Date().toISOString(),
  });
  console.log(`Server running on port ${PORT}`);
});
